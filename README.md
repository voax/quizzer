# Quizzer

Made by [Ivo Breukers](https://github.com/ivobreukers) and [Oktay Dinler](https://github.com/aod) as our final assignment for the DWA course in the first semester of 2019 at the HAN University of Applied Sciences (Arnhem).

![](https://imgur.com/oXs18rL.png)

## Contents

- [Quizzer](#quizzer)
  - [Contents](#contents)
  - [1 Introduction](#1-introduction)
  - [2 Wireframes / resources / system reactions](#2-wireframes--resources--system-reactions)
  - [3. Communitation protocols](#3-communitation-protocols)
    - [3.1 WebSocket](#31-websocket)
    - [3.2 Rest Endpoints](#32-rest-endpoints)
  - [4. Data Schema](#4-data-schema)
    - [4.1 Mongoose Schema](#41-mongoose-schema)
      - [4.1.1 Question](#411-question)
      - [4.1.2 Team](#412-team)
      - [4.1.3 Room](#413-room)
  - [5. Clientside State](#5-clientside-state)
    - [5.1 websocket](#51-websocket)
    - [5.2 team-app](#52-team-app)
    - [5.3 scoreboard](#53-scoreboard)
    - [5.4 popup](#54-popup)
    - [5.5 loader](#55-loader)
    - [5.6 qm (Quizz Master)](#56-qm-quizz-master)
  - [6. Server Structure](#6-server-structure)
    - [6.1 Middleware](#61-middleware)
      - [6.1.1 catch-errors.js](#611-catch-errorsjs)
      - [6.1.2 error-handler.js](#612-error-handlerjs)
      - [6.1.3 http-ws-upgrade.js](#613-http-ws-upgradejs)
      - [6.1.4 role.js](#614-rolejs)
      - [6.1.5 socket.js](#615-socketjs)
    - [6.2 Mongoose methods](#62-mongoose-methods)
      - [6.2.1 Room](#621-room)
      - [6.2.2 .pingTeams(msg: String)](#622-pingteamsmsg-string)
      - [6.2.3 .pingScoreboards(msg: String)](#623-pingscoreboardsmsg-string)
      - [6.2.4 .pingApplications(msg: String)](#624-pingapplicationsmsg-string)
      - [6.2.5 .pingHost(msg: String)](#625-pinghostmsg-string)
      - [6.2.6 async .calculateRP()](#626-async-calculaterp)
      - [6.2.7 async .nextRound()](#627-async-nextround)
      - [6.2.8 async .nextQuestion()](#628-async-nextquestion)
      - [6.2.9 async .startRound(categories)](#629-async-startroundcategories)
      - [6.2.10 async .startQuestion(question)](#6210-async-startquestionquestion)
    - [6.3 Team](#63-team)
      - [6.3.1 .ping(msg)](#631-pingmsg)

## 1 Introduction

The Quizzer is a web application that can be used in bars, sports canteens and maybe even prisons to play quizzes as a team. A pub quiz, basically.

There are 3 main roles in this application: The Quizz Master, The Team and The Scoreboard. The idea is that the Quizz Master can host a room which players can join. A game of Quizzer can be played with a minimum of 2 players and a maximum of 6. The game consists of 12 questions per round and can be played indefinitely untill the Quizz Master ends the quiz after the last question of a round. The question, team answers and points are all shown on the scoreboard screen which is updated in near real-time.

## 2 Wireframes / resources / system reactions

Click [here](./Wireframes.md) for our wireframes.

## 3 Communitation protocols

### 3.1 WebSocket

Client receives:

- TEAM_APPLIED
- APPLICATION_ACCEPTED
- APPLICATION_REJECTED
- CATEGORIES_SELECTED
- QUESTION_SELECTED
- GUESS_SUBMITTED
- ROOM_CLOSED
- QUESTION_CLOSED
- SCOREBOARD_REFRESH

Clients sends:

- TEAM_APPLIED

### 3.2 Rest Endpoints

| Method | Url                                          |
| ------ | -------------------------------------------- |
| GET    | /categories/                                 |
| GET    | /categories/:categoryID/questions            |
| POST   | /rooms                                       |
| GET    | /rooms/:roomCode                             |
| PATCH  | /rooms/:roomCode                             |
| DELETE | /rooms/:roomCode                             |
| GET    | /rooms/:roomCode/applications                |
| POST   | /rooms/:roomCode/applications                |
| DELETE | /rooms/:roomCode/applications/:applicationId |
| POST   | /rooms/:roomCode/teams                       |
| PATCH  | /rooms/:roomCode/teams/:teamID               |
| PUT    | /rooms/:roomCode/teams/question              |
| PUT    | /rooms/:roomCode/categories                  |
| POST   | /rooms/:roomCode/scoreboards                 |

## 4 Data Schema

### 4.1 Mongoose Schema

#### 4.1.1 Question

| Property | Type   | Default | Required |
| -------- | ------ | :-----: | :------: |
| question | String |   ❌    |    ✔️    |
| answer   | String |   ❌    |    ✔️    |
| category | String |   ❌    |    ✔️    |
| language | String |   ❌    |    ✔️    |

#### 4.1.2 Team

| Property     | Type    | Default | Required |
| ------------ | ------- | :-----: | :------: |
| sessionID    | String  |   ❌    |    ✔️    |
| name         | String  |   ❌    |    ✔️    |
| roundPoints  | Number  |    0    |    ❌    |
| roundScore   | Number  |    0    |    ❌    |
| guess        | String  |   ❌    |    ❌    |
| guessCorrect | Boolean |   ❌    |    ❌    |

#### 4.1.3 Room

| Property          | Type           | Default  | Required |
| ----------------- | -------------- | :------: | :------: |
| code              | String         |    ❌    |    ✔️    |
| host              | String         |    ❌    |    ✔️    |
| language          | String         |    ❌    |    ✔️    |
| round             | Number         |    0     |    ❌    |
| questionNo        | Number         |    0     |    ❌    |
| roundStarted      | Boolean        |  false   |    ❌    |
| teams             | [Team]         |    ❌    |    ❌    |
| applications      | [Team]         |    ❌    |    ❌    |
| categories        | [String]       |    ❌    |    ❌    |
| askedQuestions    | ref:[Question] |    ❌    |    ❌    |
| currentQuestion   | Question       | Question |    ❌    |
| questionClosed    | Boolean        |   true   |    ❌    |
| roomClosed        | Boolean        |  false   |    ❌    |
| scoreboards       | [String]       |    ❌    |    ❌    |
| ended             | Boolean        |  false   |    ❌    |
| questionCompleted | Boolean        |  false   |    ❌    |

## 5 Clientside State

### 5.1 websocket

```js
{
  connected: false;
}
```

### 5.2 team-app

```js
{
  teamID: null,
  roomCode: {
    value: '',
    valid: false,
  },
  team: {
    value: '',
    valid: false,
  },
  roundNo: 0,
  question: {
    open: false,
    number: 0,
    question: '',
    category: '',
  },
  guess: {
    value: '',
    valid: false,
  },
}
```

### 5.3 scoreboard

```js
{
  roomCode: null,
  connectedToRoom: false,
  connectingToRoom: false,
  triedConnectingToRoom: false,

  round: null,
  teams: null,
  category: null,
  question: null,
  questionNo: null,
  questionClosed: null,
}
```

### 5.4 popup

```js
{
  title: '',
  message: '',
  button: '',
  active: false,
}
```

### 5.5 loader

```js
{
  active: false,
  text: '',
}
```

### 5.6 qm (Quizz Master)

```js
{
  roomCode: null,
  language: null,

  selectedTeamApplication: null,
  teamApplications: [],
  approvedTeamApplications: [],
  roomClosed: false,

  round: 0,
  roundStarted: false,
  selectedCategory: null,
  categories: [],
  selectedCategories: [],

  question: 0,
  questions: [],
  questionsAsked: [],
  currentQuestion: null,
  questionClosed: true,
  selectedQuestion: null,

  approvingATeamGuess: false,
},
```

## 6 Server Structure

### 6.1 Middleware

#### 6.1.1 catch-errors.js

module.exports = `(fn: (req, res, next) => Promise ): (req, res, next) => void`

This module exports a router wrapper for async route handlers. It allows the user to use async route handlers without having to use try/catch. When this wrapper 'catches' an error it passes to `next(error)`.

#### 6.1.2 error-handler.js

module.exports = `({ defaultStatusCode: Number, defaultMessage: String }): (err, req, res, next) => void`

This module exports a basic error handler middleware creator. If the user does not pass both initial arguments it will use the `statusCode` and `message` props from the object passed from `next()`. Furthermore the closure will also log the error using `console.error` to the console.

#### 6.1.3 http-ws-upgrade.js

module.exports = `(sessionParser): (wss): (request, socket, head) => void`

An application specific function for this project which is used to prevent users who do not have a role connecting to our WebSocket server.

#### 6.1.4 role.js

module.exports.isRole = `(...conditions: any): (req, res, next) => void`

The `isRole` function export is a middleware creator function. This function takes a 0.\* arguments which are used to check for the users's `session.role` value.

However if the type is a function it will be passed the `req` object and whether the function returns true or false it will respond with an error or `next()` it.

If any condition results into false it will execute the following code:

```js
res.status(400).json({
  message: 'You are not allowed to perform this action.',
});
```

To combine multiple role middleware you can simply put them in an array. To use it like an array in your route handlers you can simply use the spread operator:

```js
const isHost = isRole(req => req.room && req.sessionID === req.room.host)
const isQM = isRole('QM')

const isQMAndHost = [isQuizzMaster, isHost]

//                       spread like so
router.get('/protected', ...isQMAndHost, (req, res) => {...})
// or
app.use('/protected', ...isQMAndHost)
```

#### 6.1.5 socket.js

module.exports.sessionHasWSConnect = `(errorMsg: String): (req, res, next) => void`

The returned middleware closure checks for whether the request is already connected to the WebSocket server.
If the user is already connected it will respond with a `400` status code and with the passed in `errorMsg` parameter.

### 6.2 Mongoose methods

#### 6.2.1 Room

#### 6.2.2 .pingTeams(msg: String)

Ping the WebSocket for all team connections with the given `msg`.

#### 6.2.3 .pingScoreboards(msg: String)

Ping the WebSocket for all scoreboard connections with the given `msg`.

#### 6.2.4 .pingApplications(msg: String)

Ping the WebSocket for all team-application connections with the given `msg`.

#### 6.2.5 .pingHost(msg: String)

Ping the host's WebSocket connection with the given `msg`.

#### 6.2.6 async .calculateRP()

This method determines the winnner(s) and respectively gives all the teams their points.

#### 6.2.7 async .nextRound()

Updates `roundStarted` to `false` and `questionNo` to `0`. Then it will call `calculateRP()`

#### 6.2.8 async .nextQuestion()

1. Updates for all teams their `.roundScore` property if `.guessCorrect` is true
2. Sets `currentQuestion` to `null` and `questionCompleted` to `true`
3. calls `.nextRound()` if the current question is `>= MAX_QUESTIONS_PER_ROUND` defined in `server/.env`

#### 6.2.9 async .startRound(categories)

Increments `round` , updates `questionNo` to `0`, `categories` to `categories`, `roundStarted` to `true` and updates the team's `roundScore` to `0`. Then it will ping the teams with `'CATEGORIES_SELECTED'` and returns `roundStarted`, `round` and `questionNo`.

#### 6.2.10 async .startQuestion(question)

Increments `questionNo` , updates `questionCompleted` to `false`, `questionClosed` to `false`, `currentQuestion` to `question`, adds the `question._id` to the `askedQuestions` array, next it updates the team's `guess` to `''` and `guessCorrect` to `false`. Then it will ping the teams with `'QUESTION_SELECTED'` and the scoreboards with `'SCOREBOARD_REFRESH'`. Then it returns `questionClosed` and `questionNo`.

### 6.3 Team

#### 6.3.1 .ping(msg)

Ping the team's WebSocket connection with the given `msg`.
