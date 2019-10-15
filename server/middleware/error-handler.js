module.exports = ({ defaultStatusCode, defaultMessage }) => (err, req, res, next) => {
  console.error(err);

  if (!err.statusCode && !err.message) {
    return res.status(defaultStatusCode).send(defaultMessage);
  }
  res.status(err.statusCode).send(err.message);
};
