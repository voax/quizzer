const sockets = require('../wss-clients');

const sessionHasWSConnect = errorMsg => (req, res, next) => {
  if (sockets.has(req.sessionID)) {
    return res.status(400).json({
      message: errorMsg,
    });
  }
  next();
};

const hasNotJoinedOrHosted = sessionHasWSConnect(
  'Already hosting/joined a room. Please close the session in order to create a new room'
);

module.exports = {
  sessionHasWSConnect,
  hasNotJoinedOrHosted,
};
