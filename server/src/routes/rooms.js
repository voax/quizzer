const router = require('express').Router();
const mongoose = require('mongoose');
const Room = mongoose.model('Room');

const { generateRoomCode } = require('../rooms/code');

//#region rooms
router.post('/', async (req, res) => {
  if (req.session.room && !req.session.room.ended) {
    await Room.deleteOne({ _id: req.session.room._id });
  }
  req.session.role = 'qm';

  const code = generateRoomCode();
  const newlyCreatedRoom = new Room({ code, host: req.sessionID });
  await newlyCreatedRoom.save();
  req.session.room = newlyCreatedRoom;

  req.session.save(() => {
    res.json({ roomCode: code });
  });
});

router.get('/:roomID', (req, res) => {
  // @TODO
  res.send('Not implemented yet!');
});

router.patch('/:roomID', (req, res) => {
  // @TODO
  res.send('Not implemented yet!');
});

router.delete('/:roomID', (req, res) => {
  // @TODO
  res.send('Not implemented yet!');
});
//#endregion

//#region applications
router.post('/rooms/:roomID/applications', (req, res) => {
  // @TODO
  res.send('Not implemented yet!');
});

router.delete('/rooms/:roomID/applications/:applicationId', (req, res) => {
  // @TODO
  res.send('Not implemented yet!');
});
//#endregion

//#region teams
router.post('/rooms/:roomID/teams', (req, res) => {
  // @TODO
  res.send('Not implemented yet!');
});

router.patch('/rooms/:roomID/teams/:teamID', (req, res) => {
  // @TODO
  res.send('Not implemented yet!');
});
//#endregion

//#region categories
router.post('/rooms/:roomID/categories', (req, res) => {
  // @TODO
  res.send('Not implemented yet!');
});

router.delete('/rooms/:roomID/categories/:categoryID', (req, res) => {
  // @TODO
  res.send('Not implemented yet!');
});
//#endregion

module.exports = router;
