const express = require('express');
const mongoose = require('mongoose');

const router = express.Router();
const Question = mongoose.model('Question');

const catchErrors = require('../middleware/catch-errors');
const { QM } = require('./roles');

router.use('/', (req, res, next) => {
  if (req.session.role !== QM) {
    return res.status(401).json({ message: "You're not welcome here..." });
  }

  next();
});

router.get(
  '/',
  catchErrors(async (req, res) => {
    const categories = await Question.find({ language: req.session.language })
      .distinct('category')
      .exec();
    res.json(categories);
  })
);

router.get(
  '/:category/questions',
  catchErrors(async (req, res) => {
    res.json(
      await Question.find({ category: req.params.category, language: req.session.language })
    );
  })
);

module.exports = router;
