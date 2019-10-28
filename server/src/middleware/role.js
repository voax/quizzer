const { QM } = require('../routes/roles');

const isRole = (...conditions) => (req, res, next) => {
  const role = req.session.role || null;

  const error = () => {
    res.status(400).json({ message: 'You are not allowed to perform this action.' });
  };

  for (const condition of conditions) {
    switch (typeof condition) {
      case 'function':
        if (!condition(req)) {
          return error();
        }
        break;
      default:
        if (condition !== role) {
          return error();
        }
        break;
    }
  }

  next();
};

const isQM = isRole(QM);
const isHost = isRole(req => req.room && req.sessionID === req.room.host);

const isQMAndHost = [isQM, isHost];

module.exports = {
  isRole,
  isQM,
  isHost,
  isQMAndHost,
};
