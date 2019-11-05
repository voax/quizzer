const router = require('express').Router();
const mongoose = require('mongoose');
const Room = mongoose.model('Room');
const Team = mongoose.model('Team');

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
    const { language } = req.body;

    if (req.session.roomID) {
      await Room.updateOne({ _id: req.session.roomID, ended: false }, { ended: true });
    }

    req.session.role = QM;
    req.session.language = language;

    const newlyCreatedRoom = new Room({ code: generateRoomCode(), host: req.sessionID, language });
    await newlyCreatedRoom.save();
    req.session.roomID = newlyCreatedRoom._id;

    req.session.save(() => res.json({ roomCode: newlyCreatedRoom.code, language }));
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
  const { round, questionNo, currentQuestion, questionClosed, teams, questionCompleted } = req.room;
  const { category, question } = currentQuestion || {};

  switch (req.session.role) {
    case QM:
      return res.json({ round, questionNo, questionClosed, currentQuestion, teams });
    case TEAM:
      const team = teams.find(team => team.sessionID === req.sessionID);

      if (!team) {
        return res.status(404).json({ message: 'Your team does not belong to this room.' });
      }

      return res.json({
        round,
        questionNo,
        questionClosed,
        category,
        question,
        teamID: team._id,
      });
    case SCOREBOARD:
      const teamList = teams.map(({ name, roundPoints, roundScore, guessCorrect, guess }) => ({
        name,
        roundPoints,
        roundScore,
        guessCorrect,
        guess,
      }));
      return res.json({
        round,
        questionNo,
        questionClosed,
        currentQuestion,
        teams: teamList,
        questionCompleted,
      });
    default:
      return res.status(404).json({ message: 'Incorrect request.' });
  }
});

router.patch(
  '/:roomCode',
  ...isQMAndHost,
  catchErrors(async (req, res) => {
    const { questionCompleted, roomClosed, questionClosed, applications } = req.body;

    if (questionCompleted) {
      await req.room.nextQuestion();
    }

    if (roomClosed !== undefined) {
      if (req.room.teams.length < 2 || req.room.teams.length > 6) {
        return res.status(400).json({ message: 'Invalid amount of teams selected.' });
      }
      req.room.roomClosed = roomClosed;
    }

    if (questionClosed !== undefined) {
      req.room.questionClosed = questionClosed;
      req.room.pingTeams('QUESTION_CLOSED');
      req.room.pingScoreboards('SCOREBOARD_REFRESH');
    }

    if (applications) {
      req.room.pingApplications('APPLICATION_REJECTED');
      req.room.applications = [];
    }

    await req.room.save();

    res.json({
      roomClosed: req.room.roomClosed,
      roundStarted: req.room.roundStarted,
      questionNo: req.room.questionNo,
      currentQuestion: req.room.currentQuestion,
      questionClosed: req.room.questionClosed,
      applications: req.room.applications,
    });
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
    const name = req.body.name.trim();
    const { roomClosed, teams, applications } = req.room;

    if (roomClosed) {
      return res.status(404).json({ message: 'This room is closed.' });
    }

    if (!name || name.length > 12) {
      return res.status(404).json({ message: 'Invalid team name.' });
    }

    if (
      teams.some(team => team.name.toLowerCase() === name.toLowerCase()) ||
      applications.some(team => team.name.toLowerCase() === name.toLowerCase())
    ) {
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

    applicationDocument.ping('APPLICATION_REJECTED');

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

    applicationDocument.ping('APPLICATION_ACCEPTED');
    req.room.pingScoreboards('SCOREBOARD_REFRESH');

    res.json({ message: 'Team has been approved.' });
  })
);

router.patch(
  '/:roomCode/teams/:teamID',
  catchErrors(async (req, res) => {
    const team = req.room.teams.find(team => team._id.equals(req.params.teamID));

    if (!team) {
      return res.status(404).json({ message: 'This team does not exist!' });
    }

    switch (req.session.role) {
      case QM:
        team.guessCorrect = req.body.guessCorrect;

        await Team.findByIdAndUpdate(team._id, { guessCorrect: req.body.guessCorrect });
        await req.room.save();

        return res.json({ teams: req.room.teams });
      case TEAM:
        if (req.room.questionClosed) {
          return res.status(400).json({ message: 'Question is closed.' });
        }

        if (req.sessionID !== team.sessionID) {
          return res.status(404).json({ message: 'This is not your team!' });
        }

        team.guess = req.body.guess.trim();
        await req.room.save();

        await Team.findByIdAndUpdate(team._id, { guess: req.body.guess });

        req.room.pingHost('GUESS_SUBMITTED');
        req.room.pingScoreboards('SCOREBOARD_REFRESH');

        return res.json({ message: 'Guess submitted!' });
      default:
        return res.status(400).json({ message: 'You are not allowed to perform this action.' });
    }
  })
);

router.post(
  '/:roomCode/scoreboards',
  hasNotJoinedOrHosted,
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

    const { roundStarted, round, questionNo } = await req.room.startRound(categories);

    res.json({ roundStarted, round, questionNo });
  })
);
//#endregion

//#region question
router.put(
  '/:roomCode/question',
  ...isQMAndHost,
  catchErrors(async (req, res) => {
    const { question } = req.body;

    const { questionClosed, questionNo } = await req.room.startQuestion(question);

    res.json({ questionClosed, questionNo });
  })
);
//#endregion

module.exports = router;
