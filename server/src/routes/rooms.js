const router = require('express').Router();
const mongoose = require('mongoose');
const Room = mongoose.model('Room');
const Team = mongoose.model('Team');

const sockets = require('../wss-clients');
const catchErrors = require('../middleware/catch-errors');
const { SCOREBOARD, TEAM, QM } = require('./roles');
const { generateRoomCode } = require('../rooms/code');
const { hasNotJoinedOrHosted } = require('../middleware/socket');
const { isQMAndHost } = require('../middleware/role');

//#region rooms
router.post(
  '/',
  hasNotJoinedOrHosted,
  catchErrors(async (req, res) => {
    if (req.session.roomID) {
      await Room.updateOne({ _id: req.session.roomID, ended: false }, { ended: true });
    }
    req.session.role = QM;

    const code = generateRoomCode();
    const newlyCreatedRoom = new Room({ code, host: req.sessionID });
    await newlyCreatedRoom.save();
    req.session.roomID = newlyCreatedRoom._id;

    req.session.save(() => res.json({ roomCode: code }));
  })
);

router.use(
  '/:roomCode',
  catchErrors(async (req, res, next) => {
    req.room = await Room.findOne({ code: req.params.roomCode, ended: false });

    if (!req.room) {
      return res.status(404).json({ message: 'Invalid room code.' });
    }

    next();
  })
);

router.get('/:roomCode', (req, res) => {
  const { round, questionNo, currentQuestion, questionClosed, teams } = req.room;
  const { category, question } = currentQuestion;

  switch (req.session.role) {
    case QM:
      return res.json({ round, questionNo, questionClosed, category, question, teams });
    case TEAM:
      return res.json({ round, questionNo, questionClosed, category, question });
    case SCOREBOARD:
      const teamList = teams.map(({ name, roundPoints, roundScore, guessCorrect }) => ({
        name,
        roundPoints,
        roundScore,
        guessCorrect,
      }));
      return res.json({ round, questionNo, questionClosed, category, question, teams: teamList });
    default:
      return res.status(404).json({ message: 'Incorrect request.' });
  }
});

router.patch(
  '/:roomCode',
  ...isQMAndHost,
  catchErrors(async (req, res) => {
    await Room.findByIdAndUpdate(req.room._id, req.body);

    res.json(JSON.stringify(req.room));
  })
);

router.delete(
  '/:roomCode',
  ...isQMAndHost,
  catchErrors(async (req, res) => {
    req.room.ended = true;
    await req.room.save();
    res.json({ message: 'Room has been ended.' });
  })
);
//#endregion

//#region applications
router.get('/:roomCode/applications', ...isQMAndHost, (req, res) => {
  const applications = req.room.applications.map(({ _id, name }) => ({ id: _id, name }));
  res.json(JSON.stringify(applications));
});

router.post(
  '/:roomCode/applications',
  hasNotJoinedOrHosted,
  catchErrors(async (req, res) => {
    const { name } = req.body;
    const { roomClosed, teams, applications } = req.room;

    if (roomClosed) {
      return res.status(404).json({ message: 'This room is closed.' });
    }

    if (!name) {
      return res.status(404).json({ message: 'Invalid team name.' });
    }

    if (teams.some(team => team.name === name) || applications.some(team => team.name === name)) {
      return res.status(404).json({ message: 'Team name is already in use.' });
    }

    req.session.role = TEAM;
    req.session.name = name;
    req.session.roomID = req.room._id;

    const newApplication = new Team({ sessionID: req.sessionID, name });
    await newApplication.save();

    req.room.applications.push(newApplication);
    await req.room.save();

    req.session.save(() => res.json({ message: 'Team application received.' }));
  })
);

router.delete(
  '/:roomCode/applications/:applicationID',
  ...isQMAndHost,
  catchErrors(async (req, res) => {
    const applicationDocument = req.room.applications.id(req.params.applicationID);

    if (!applicationDocument) {
      return res.status(404).json({ message: 'Application not found.' });
    }

    applicationDocument.remove();
    await req.room.save();

    sockets.get(applicationDocument.sessionID).send('APPLICATION_REJECTED');
    res.json({ message: 'Application has been rejected.' });
  })
);
//#endregion

//#region teams
router.post(
  '/:roomCode/teams',
  ...isQMAndHost,
  catchErrors(async (req, res) => {
    if (req.room.teams.length >= 6) {
      return res.status(400).json({ message: 'Maximum number of teams reached.' });
    }

    const applicationDocument = req.room.applications.id(req.body.applicationID);

    if (!applicationDocument) {
      return res.status(404).json({ message: 'Application not found.' });
    }

    const team = await Team.findById(req.body.applicationID);

    req.room.teams.push(team);
    applicationDocument.remove();
    await req.room.save();

    sockets.get(applicationDocument.sessionID).send('APPLICATION_ACCEPTED');
    res.json({ message: 'Team has been approved.' });
  })
);

router.patch(
  '/:roomCode/teams/:teamID',
  catchErrors(async (req, res) => {
    switch (req.session.role) {
      case QM:
        // TODO: Implement Quizz Master guessCorrect toggle
        return res.send('Quizz Master!');
      case TEAM:
        const team = req.room.teams.find(team => team.sessionID === req.sessionID);

        if (req.params.teamID !== team.sessionID) {
          return res.status(400).json({ message: 'This is not your team!' });
        }

        const teamDocument = await Team.findById(team._id);

        team.guess = req.body.guess;
        await req.room.save();

        teamDocument.guess = req.body.guess;
        await teamDocument.save();

        sockets.get(req.room.host).send('GUESS_SUBMITTED');
        return res.json({ message: 'Guess submitted!' });
      default:
        return res.status(400).json({ message: 'You are not allowed to perform this action.' });
    }
  })
);

router.post(
  '/:roomCode/scoreboards',
  catchErrors(async (req, res) => {
    req.session.role = SCOREBOARD;
    req.session.roomID = req.room._id;

    req.room.scoreboards.push(req.sessionID);
    await req.room.save();

    req.session.save(() => res.json({ message: 'You have been registered.' }));
  })
);
//#endregion

//#region categories
router.put(
  '/:roomCode/categories',
  ...isQMAndHost,
  catchErrors(async (req, res) => {
    const { categories } = req.body;

    if (req.room.roundStarted) {
      return res.status(400).json({ message: 'Round has already been started.' });
    }

    if (categories.length !== 3) {
      return res.status(400).json({ message: 'Invalid amount of categories selected.' });
    }

    req.room.roundStarted = true;
    req.room.categories = categories;
    req.room.questionNo = 1;
    await req.room.save();

    for (const team of req.room.teams) {
      const socket = sockets.get(team.sessionID);
      if (socket) {
        socket.send('CATEGORIES_SELECTED');
      }
    }

    res.json({ message: 'Categories have been selected.' });
  })
);
//#endregion

//#region question
router.put(
  '/:roomCode/question',
  ...isQMAndHost,
  catchErrors(async (req, res) => {
    const { question } = req.body;

    if (!req.room.questionClosed) {
      return res.status(400).json({ message: 'Question is already ongoing.' });
    }

    if (req.room.askedQuestions.includes(question._id)) {
      return res.status(400).json({ message: 'The selected question has already been asked.' });
    }

    req.room.questionClosed = false;
    req.room.currentQuestion = question;
    req.room.askedQuestions.push(question._id);
    await req.room.save();

    for (const team of req.room.teams) {
      const socket = sockets.get(team.sessionID);
      if (socket) {
        socket.send('QUESTION_SELECTED');
      }
    }

    res.json({ message: 'Question has been selected.' });
  })
);
//#endregion

module.exports = router;
