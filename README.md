# The Quizzer - by Ivo Breukers & Oktay Dinler

The final assignment for the course DWA in the first semester of 2019.

---

## Contents

- [The Quizzer - by Ivo Breukers & Oktay Dinler](#the-quizzer---by-ivo-breukers--oktay-dinler)
  - [Contents](#contents)
  - [1 Introduction](#1-introduction)
  - [2 Wireframes / resources / system reactions](#2-wireframes--resources--system-reactions)
  - [3. Communitation protocols](#3-communitation-protocols)
    - [3.1 Wesocket](#31-wesocket)
    - [3.2 Rest Endpoints](#32-rest-endpoints)
  - [4. Data Schema](#4-data-schema)
  - [5. Clientside State](#5-clientside-state)
  - [6. Server Structure](#6-server-structure)

---

## 1 Introduction

The Quizzer is a web application that can be used in bars, sports canteens and maybe even prisons to play quizzes as a team. A pub quiz, basically.

There are 3 main roles in this application: The Quizz Master, The Team and The Scoreboard. The idea is that the Quizz Master can host a room which players can join. A game of Quizzer can be played with a minimum of 2 players and a maximum of 6. The game consists of 12 questions per round and can be played indefinitely untill the Quizz Master ends the quiz after the last question of a round. The question, team answers and points are all shown on the scoreboard screen which is updated in near real-time.

---

## 2 Wireframes / resources / system reactions

Click [here](./Wireframes.md) for our wireframes.

---

## 3. Communitation protocols

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

---

## 4. Data Schema

### Mongoose Schema

#### Question

| Property | Type   | Default | Required |
| -------- | ------ | :-----: | :------: |
| question | String |   ❌    |    ✔️    |
| answer   | String |   ❌    |    ✔️    |
| category | String |   ❌    |    ✔️    |
| language | String |   ❌    |    ✔️    |

#### Team

| Property     | Type    | Default | Required |
| ------------ | ------- | :-----: | :------: |
| sessionID    | String  |   ❌    |    ✔️    |
| name         | String  |   ❌    |    ✔️    |
| roundPoints  | Number  |    0    |    ❌    |
| roundScore   | Number  |    0    |    ❌    |
| guess        | String  |   ❌    |    ❌    |
| guessCorrect | Boolean |   ❌    |    ❌    |

#### Room

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

## 5. Clientside State

### websocket

```js
{
  connected: false;
}
```

### team-app

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

### scoreboard

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

### popup

```js
{
  title: '',
  message: '',
  button: '',
  active: false,
}
```

### loader

```js
{
  active: false,
  text: '',
}
```

### qm (Quizz Master)

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

---

## 6. Server Structure

### Middleware

#### accept-language.js

module.exports = `(): (req, res, next) => void`

This module exports a middleware creator which uses the **accept-language-parser** package to parse the Accept-Language HTTP header.
The following properties are added tot the `req` object.

- `language` : The parsed Accept-Language header
- `firstLanguage()` : Returns the first language code in the header in an object: `{ langague: String }`

#### catch-errors.js

module.exports = `(fn: (req, res, next) => Promise ): (req, res, next) => void`

This module exports a router wrapper for async route handlers. It allows the user to use async route handlers without having to use try/catch. When this wrapper 'catches' an error it passes to `next(error)`.

#### error-handler.js

module.exports = `({ defaultStatusCode: Number, defaultMessage: String }): (err, req, res, next) => void`

This module exports a basic error handler middleware creator. If the user does not pass both initial arguments it will use the `statusCode` and `message` props from the object passed from `next()`. Furthermore the closure will also log the error using `console.error` to the console.

#### http-ws-upgrade.js

module.exports = `(sessionParser): (wss): (request, socket, head) => void`

An application specific function for this project which is used to prevent users who do not have a role connecting to our WebSocket server.

#### role.js

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

#### socket.js

module.exports.sessionHasWSConnect = `(errorMsg: String): (req, res, next) => void`

The returned middleware closure checks for whether the request is already connected to the WebSocket server.
If the user is already connected it will respond with a `400` status code and with the passed in `errorMsg` parameter.

### Mongoose methods

#### Room

#### .pingTeams(msg: String)

Ping the WebSocket for all team connections with the given `msg`.

#### .pingScoreboards(msg: String)

Ping the WebSocket for all scoreboard connections with the given `msg`.

#### .pingApplications(msg: String)

Ping the WebSocket for all team-application connections with the given `msg`.

#### .pingHost(msg: String)

Ping the host's WebSocket connection with the given `msg`.

#### async .calculateRP()

This method determines the winnner(s) and respectively gives all the teams their points.

#### async .nextRound()

Updates `roundStarted` to `false` and `questionNo` to `0`. Then it will call `calculateRP()`

#### async .nextQuestion()

1. Updates for all teams their `.roundScore` property if `.guessCorrect` is true
2. Sets `currentQuestion` to `null` and `questionCompleted` to `true`
3. calls `.nextRound()` if the current question is `>= MAX_QUESTIONS_PER_ROUND` defined in `server/.env`

### Team

#### .ping(msg)

Ping the team's WebSocket connection with the given `msg`.
