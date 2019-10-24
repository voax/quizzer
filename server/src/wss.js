module.exports = wss => {
  wss.on('connection', (socket, request) => {
    console.log('New connection!', request.session.id);

    socket.on('message', data => {
      console.log('Data received:', data);
    });
  });
};
