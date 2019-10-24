const mongoose = require('mongoose');
const Room = mongoose.model('Room');
const blackListedRoomCodes = require('./blacklisted');

const rooms = {};

const randomLetter = () => String.fromCharCode(Math.floor(Math.random() * (90 - 65) + 65));

const generateRoomCode = () => {
  let roomCode = '';

  for (let i = 0; i < 4; i++) {
    roomCode += randomLetter();
  }

  if (blackListedRoomCodes[roomCode] || rooms[roomCode]) {
    return generateRoomCode();
  }
  rooms[roomCode] = true;

  return roomCode;
};

const removeRoomCode = code => {
  delete rooms[code];
};

const initRoomCodes = async () => {
  const rooms = await Room.find({ ended: false });
  rooms.forEach(({ code }) => {
    rooms[code] = true;
  });
};

module.exports = {
  generateRoomCode,
  removeRoomCode,
  initRoomCodes,
};
