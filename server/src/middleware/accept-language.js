const languageParser = require('accept-language-parser');

module.exports = () => (req, res, next) => {
  req.language = languageParser.parse(req.header('Accept-Language'));
  next();
};
