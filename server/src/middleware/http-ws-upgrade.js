module.exports = sessionParser => wss => (request, socket, head) => {
  sessionParser(request, {}, () => {
    if (!request.session.role) {
      socket.destroy();
      return;
    }

    wss.handleUpgrade(request, socket, head, ws => {
      wss.emit('connection', ws, request);
    });
  });
};
