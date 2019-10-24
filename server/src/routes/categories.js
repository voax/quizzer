const express = require('express');
const mongoose = require('mongoose');
const catchErrors = require('../middleware/catch-errors');

const router = express.Router();
const Question = mongoose.model('Question');

router.use('/', (req, res, next) => {
  req.mongoQueryAggregate = { $match: {} };

  if (req.language.length > 0) {
    req.mongoQueryAggregate.$match = { language: req.language[0].code };
  }

  next();
});

router.get(
  '/',
  catchErrors(async (req, res) => {
    const categories = await Question.aggregate([
      { ...req.mongoQueryAggregate },
      { $group: { _id: '$category' } },
    ]);
    res.json(categories.map(({ _id }) => _id));
  })
);

module.exports = router;
