module.exports = wss => {
  const sockets = new Map();

  wss.on('connection', (socket, request) => {
    const { id, room } = request.session;
    console.log('New connection!', id);
    sockets.set(id, socket);

    socket.on('message', data => {
      console.log('Data received:', data);

      const { command } = JSON.parse(data);
      switch (command) {
        case 'TEAM_APPLIED':
          sockets[room.host].send(command);
          return;
        default:
          return;
      }
    });

    socket.on('close', (code, reason) => {
      console.log('Connection closed!', code, reason);
      sockets.delete(id);
    });
  });
};
