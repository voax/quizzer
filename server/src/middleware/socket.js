const sockets = require('../wss-clients');

const sessionHasWSConnect = errorMsg => (req, res, next) => {
  if (sockets.has(req.sessionID)) {
    return res.status(400).json({
      message: errorMsg,
    });
  }
  next();
};

module.exports = {
  sessionHasWSConnect,
};
