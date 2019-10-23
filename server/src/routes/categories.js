const express = require('express');
const mongoose = require('mongoose');

const router = express.Router();
const Question = mongoose.model('Question');

const catchErrors = require('../middleware/catch-errors');
const { QM } = require('./roles');

router.use('/', (req, res, next) => {
  req.mongoQueryAggregate = { $match: {} };
  req.mongoQueryProjection = { _id: 0, __v: 0 };

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

router.get(
  '/:category/questions',
  catchErrors(async (req, res) => {
    if (req.session.role !== QM) {
      return res.status(401).json({ message: "You're not welcome here..." });
    }
    res.json(
      await Question.find({ category: req.params.category }, { ...req.mongoQueryProjection })
    );
  })
);

module.exports = router;
