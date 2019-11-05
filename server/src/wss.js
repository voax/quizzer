const mongoose = require('mongoose');
const Room = mongoose.model('Room');
const sockets = require('./wss-clients');

module.exports = wss => {
  wss.on('connection', (socket, request) => {
    const { id, roomID } = request.session;

    console.log('[WSS] New connection!', id);
    sockets.set(id, socket);

    socket.on('message', async data => {
      const room = await Room.findById(roomID);
      console.log('Data received:', data);

      const { command } = JSON.parse(data);
      switch (command) {
        case 'TEAM_APPLIED':
          sockets.get(room.host).send(command);
          break;
        default:
          break;
      }
    });

    socket.on('close', async (code, reason) => {
      console.log('[WSS] Connection closed!', code, reason);

      if (roomID) {
        const room = await Room.findById(roomID);
        request.session.roomID = null;
        if (id === room.host) {
          room.ended = true;
          room.pingScoreboards('SCOREBOARD_QUIZZ_ENDED');
          for (const team of [...room.teams, ...room.applications]) {
            const s = sockets.get(team.sessionID);
            if (s) {
              s.send('ROOM_CLOSED');
              s.close();
            }
          }
          await room.save();
        }
      }

      request.session.save(() => {
        sockets.delete(id);
      });
    });
  });
};
