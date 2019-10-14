const mongoose = require('mongoose');

const Question = mongoose.model('Question');
const { readFileP } = require('./utils');

const seedQuestion = async (...languages) => {
  await Question.deleteMany();

  const questions = [];

  for (const language of languages) {
    const languageQuestions = JSON.parse(await readFileP(`./data/${language}_questions.json`));
    questions.push(...languageQuestions.map(q => ({ ...q, language })));
  }

  await Question.insertMany(questions);
};

module.exports = async () => {
  const supportedLanguages = ['en', 'nl'];

  await seedQuestion(...supportedLanguages);
};
