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

### 3.1 Wesocket

- **Team App**
  - WS_TEAM_APPROVED
  - WS_SELECTING_CATEGORIES
  - WS_SELECTING_QUESTION
  - WS_QUESTION_STARTED
  - WS_QUESTION_CLOSED
  - WS_ROUND_ENDED
  - WS_ROOM_CLOSED
- **Quizz Master App**
  - WS_ROOM_CREATED
  - WS_TEAM_APPLIED
  - WS_GUESS_SUBMITTED
  - WS_ROOM_DESTROYED
- **Scoreboard App**
  - WS_QUESTION_STARTED
  - WS_GUESS_SUBMITTED
  - WS_QUESTION_ENDED_AND_APPROVED

### 3.2 Rest Endpoints

| Method | Url                                        |
| ------ | ------------------------------------------ |
| GET    | /categories/                               |
| GET    | /categories/:categoryID/questions          |
| POST   | /rooms                                     |
| GET    | /rooms/:roomID                             |
| PATCH  | /rooms/:roomID                             |
| DELETE | /rooms/:roomID                             |
| POST   | /rooms/:roomID/applications                |
| DELETE | /rooms/:roomID/applications/:applicationId |
| POST   | /rooms/:roomID/teams                       |
| PATCH  | /rooms/:roomID/teams/:teamID               |
| POST   | /rooms/:roomID/categories                  |
| DELETE | /rooms/:roomID/categories/:categoryID      |

---

## 4. Data Schema

- Mongoose Schema
  - **Room**
    - code: String
    - host: String
    - round: Number
    - roundStarted: Boolean
    - questionNo: Number
    - askedQuestions: [Question]
    - currentQuestion: Question
    - questionClosed: Boolean
    - teams: [Team]
  - **Question**
    - question: String
    - answer: String
    - category: String
    - language: String
  - **Team**
    - name: String
    - roundPoints: String
    - roundScore: Number
    - guess: String
    - guessCorrect: Boolean

---

## 5. Clientside State

- **Redux - Reducers:**
  - **loader**
    - text: string
    - active: boolean
  - **pop-up**
    - title: string
    - message: string
    - button: string
    - active: boolean
  - **team-app**
    - room: string
    - team: string
    - round: number
    - question: object
      - open: boolean
      - number: number
      - question: string
      - category: string
    - guess: string
  - **quizz-master-app**
    - room: string
    - categories: array
    - selectedCategories: array
    - questions: array
    - questionsAsked: array
    - currentQuestion: object
    - round: number
    - question: number
    - teams: array
  - **scoreboard-app**
    - room: string
    - round: number
    - question: object
      - open: boolean
      - number: number
      - question: string
      - category: string
    - teams: array

---

## 6. Server Structure

- Middleware
  - useAcceptLanguageHeader
  - catchErrors
  - simpleRouteErrorHandler
- Mongoose
  - validatie methodes
  - model methodes

---
