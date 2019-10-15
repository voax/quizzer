const express = require('express');
const mongoose = require('mongoose');
const catchErrors = require('../middleware/catch-errors');

const router = express.Router();
const Question = mongoose.model('Question');

router.use('/', (req, res, next) => {
  req.mongoQuery = {};
  req.mongoQueryProjection = { _id: 0, __v: 0 };

  if (req.language.length > 0) {
    req.mongoQuery.language = req.language[0].code;
  }

  next();
});

router.get(
  '/',
  catchErrors(async (req, res) => {
    res.json(await Question.find({ ...req.mongoQuery }, { ...req.mongoQueryProjection }));
  })
);

router.get(
  '/:category',
  catchErrors(async (req, res) => {
    res.json(
      await Question.find(
        { ...req.mongoQuery, category: req.params.category },
        { ...req.mongoQueryProjection }
      )
    );
  })
);

module.exports = router;
