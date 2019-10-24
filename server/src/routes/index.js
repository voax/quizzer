module.exports = app => {
  app.use('/categories', require('./categories'));
  app.use('/rooms', require('./rooms'));
};
