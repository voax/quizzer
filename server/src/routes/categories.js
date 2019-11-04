const express = require('express');
const mongoose = require('mongoose');

const router = express.Router();
const Question = mongoose.model('Question');

const catchErrors = require('../middleware/catch-errors');
const { isQM } = require('../middleware/role');

router.use('/', isQM);

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
