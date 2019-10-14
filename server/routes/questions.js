const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const Question = mongoose.model('Question');

router.use('/', (req, res, next) => {
  req.mongoQuery = {};

  if (req.language.length > 0) {
    req.mongoQuery.language = req.language[0].code;
  }

  next();
});

router.get('/', async (req, res) => {
  try {
    const questions = await Question.find({ ...req.mongoQuery }, { _id: 0, __v: 0 });
    res.json(questions);
  } catch (error) {
    console.error(error);
    res.status(500).send('Something went wrong...');
  }
});

router.get('/:category', async (req, res) => {
  try {
    const questions = await Question.find(
      { ...req.mongoQuery, category: req.params.category },
      { _id: 0, __v: 0 }
    );
    res.json(questions);
  } catch (error) {
    console.error(error);
    res.status(500).send('Something went wrong...');
  }
});

module.exports = router;
