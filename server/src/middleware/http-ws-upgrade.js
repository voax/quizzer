module.exports = sessionParser => wss => (request, socket, head) => {
  sessionParser(request, {}, () => {
    if (!request.session.roomID) {
      socket.destroy();
      return;
    }

    wss.handleUpgrade(request, socket, head, ws => {
      wss.emit('connection', ws, request);
    });
  });
};
