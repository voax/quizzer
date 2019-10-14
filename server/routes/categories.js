const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const Question = mongoose.model('Question');

router.use('/', (req, res, next) => {
  req.mongoQueryAggregate = {};

  if (req.language.length > 0) {
    req.mongoQueryAggregate['$match'] = { language: req.language[0].code };
  }

  next();
});

router.get('/', async (req, res) => {
  try {
    const categories = await Question.aggregate([
      { ...req.mongoQueryAggregate },
      { $group: { _id: '$category' } },
    ]);

    res.json(categories.map(({ _id }) => _id));
  } catch (error) {
    console.error(error);
    res.status(500).send('Something went wrong...');
  }
});

module.exports = router;
