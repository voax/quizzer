const router = require('express').Router();
const mongoose = require('mongoose');
const Room = mongoose.model('Room');
const Team = mongoose.model('Team');

const catchErrors = require('../middleware/catch-errors');
const { SCOREBOARD, TEAM, QM } = require('./roles');
const { generateRoomCode } = require('../rooms/code');

const verifyQuizzMaster = (req, res, next) => {
  if (req.sessionID !== req.room.host) {
    return res.status(400).json({ message: 'You are not allowed to perform this action.' });
  }

  next();
};

//#region rooms
router.post(
  '/',
  catchErrors(async (req, res) => {
    if (req.session.roomID) {
      await Room.updateOne({ _id: req.session.roomID, ended: false }, { ended: true });
    }
    req.session.role = QM;

    const code = generateRoomCode();
    const newlyCreatedRoom = new Room({ code, host: req.sessionID });
    await newlyCreatedRoom.save();
    req.session.roomID = newlyCreatedRoom._id;

    req.session.save(() => {
      res.json({ roomCode: code });
    });
  })
);

router.use(
  '/:roomID',
  catchErrors(async (req, res, next) => {
    req.room = await Room.findOne({ code: req.params.roomID, ended: false });

    if (!req.room) {
      return res.status(404).json({ message: 'Invalid room code.' });
    }

    next();
  })
);

router.get('/:roomID', (req, res) => {
  // if client hasn't a session yet, a session will be created with the scoreboard role.
  // @TODO
  res.send('Not implemented yet!');
});

router.patch('/:roomID', verifyQuizzMaster, (req, res) => {
  // @TODO
  res.send('Not implemented yet!');
});

router.delete('/:roomID', (req, res) => {
  // @TODO
  res.send('Not implemented yet!');
});
//#endregion

//#region applications
router.post(
  '/:roomID/applications',
  catchErrors(async (req, res) => {
    const { name } = req.body;
    const { teams, applications } = req.room;

    if (!name) {
      return res.status(404).json({ message: 'Invalid team name.' });
    }

    if (teams.some(team => team.name === name) || applications.some(team => team.name === name)) {
      return res.status(404).json({ message: 'Team name is already in use.' });
    }

    req.session.role = TEAM;
    req.session.name = name;

    const newApplication = new Team({ sessionID: req.sessionID, name });
    await newApplication.save();

    req.room.applications.push(newApplication);
    await req.room.save();

    req.session.save(() => {
      res.json({ message: 'Team application received.' });
    });
  })
);

router.delete(
  '/:roomID/applications/:applicationID',
  verifyQuizzMaster,
  catchErrors(async (req, res) => {
    const applicationDocument = req.room.applications.id(req.params.applicationID);

    if (!applicationDocument) {
      return res.status(404).json({ message: 'Application not found.' });
    }

    applicationDocument.remove();
    await req.room.save();

    res.json({ message: 'Application has been rejected.' });
  })
);
//#endregion

//#region teams
router.post(
  '/:roomID/teams',
  verifyQuizzMaster,
  catchErrors(async (req, res) => {
    const applicationDocument = req.room.applications.id(req.body.applicationID);

    if (!applicationDocument) {
      return res.status(404).json({ message: 'Application not found.' });
    }

    const team = await Team.findById(req.body.applicationID);

    req.room.teams.push(team);
    applicationDocument.remove();
    await req.room.save();

    res.json({ message: 'Team has been approved.' });
  })
);

router.patch('/:roomID/teams/:teamID', (req, res) => {
  // @TODO
  res.send('Not implemented yet!');
});
//#endregion

//#region categories
router.post('/:roomID/categories', (req, res) => {
  // @TODO
  res.send('Not implemented yet!');
});

router.delete('/:roomID/categories/:categoryID', (req, res) => {
  // @TODO
  res.send('Not implemented yet!');
});
//#endregion

module.exports = router;
