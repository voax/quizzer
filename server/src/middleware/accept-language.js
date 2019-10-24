const languageParser = require('accept-language-parser');

module.exports = () => (req, res, next) => {
  const language = languageParser.parse(req.header('Accept-Language'));
  req.language = language;
  req.firstLanguage = () => {
    return req.language.length > 0 ? { language: language[0].code } : { language: '' };
  };
  next();
};
