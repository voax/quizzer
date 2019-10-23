module.exports = app => {
  app.use('/categories', require('./categories'));
  app.use('/questions', require('./questions'));
};
