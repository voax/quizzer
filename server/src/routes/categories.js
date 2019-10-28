const express = require('express');
const mongoose = require('mongoose');

const router = express.Router();
const Question = mongoose.model('Question');

const catchErrors = require('../middleware/catch-errors');
const { QM } = require('./roles');

router.get(
  '/',
  catchErrors(async (req, res) => {
    const categories = await Question.find({ ...req.firstLanguage() })
      .distinct('category')
      .exec();
    res.json(categories);
  })
);

router.get(
  '/:category/questions',
  catchErrors(async (req, res) => {
    if (req.session.role !== QM) {
      return res.status(401).json({ message: "You're not welcome here..." });
    }
    res.json(
      await Question.find({ category: req.params.category, ...req.firstLanguage() }, { __v: 0 })
    );
  })
);

module.exports = router;
