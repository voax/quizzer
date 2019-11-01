module.exports = ({ defaultStatusCode, defaultMessage }) => (err, req, res, next) => {
  console.error(err);

  if (!err.statusCode && !err.message) {
    return res.status(defaultStatusCode).send({ message: defaultMessage });
  }
  res.status(err.statusCode).json({ message: err.message });
};
