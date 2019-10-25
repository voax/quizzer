const mongoose = require('mongoose');
const Room = mongoose.model('Room');
const sockets = require('./wss-clients');

module.exports = wss => {
  wss.on('connection', (socket, request) => {
    const { id, roomID } = request.session;
    console.log('New connection!', id);
    sockets.set(id, socket);

    socket.on('message', async data => {
      const room = await Room.findById(roomID);
      console.log('Data received:', data);

      const { command } = JSON.parse(data);
      switch (command) {
        case 'TEAM_APPLIED':
          sockets.get(room.host).send(command);
          return;
        default:
          return;
      }
    });

    socket.on('close', async (code, reason) => {
      console.log('Connection closed!', code, reason);

      const room = await Room.findById(roomID);

      if (id === room.host) {
        room.ended = true;
        for (const t of [...room.teams, ...room.applications]) {
          const s = sockets.get(t.sessionID);
          if (s) {
            s.send('ROOM_CLOSED');
            s.close();
          }
        }
        await room.save();
      }

      sockets.delete(id);
    });
  });
};
