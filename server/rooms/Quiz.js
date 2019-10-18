const { Room } = require('colyseus');
const schema = require('@colyseus/schema');
const { Schema, ArraySchema } = schema;

const blackListedRoomCodes = {
  AARS: true,
  ANAL: true,
  ANUS: true,
  ARSE: true,
  BOOB: true,
  BUTT: true,
  COCK: true,
  COON: true,
  CRAP: true,
  CUNT: true,
  DAMN: true,
  DARN: true,
  DICK: true,
  DYKE: true,
  FECK: true,
  FUCK: true,
  GOOK: true,
  HELL: true,
  HOMO: true,
  HORE: true,
  JERK: true,
  JIZZ: true,
  MUFF: true,
  PEDO: true,
  PISS: true,
  POOP: true,
  PORN: true,
  PUBE: true,
  SEXY: true,
  SHIT: true,
  SLUT: true,
  SUCK: true,
  TITS: true,
  TURD: true,
  TWAT: true,
  WANK: true,
};

const rooms = {};
const generateRoomCode = () => {
  let roomCode = '';
  for (let i = 0; i < 4; i++) {
    const random_ascii = Math.floor(Math.random() * (90 - 65) + 65);
    roomCode += String.fromCharCode(random_ascii);
  }
  if (blackListedRoomCodes[roomCode] || rooms[roomCode]) {
    return generateRoomCode();
  }
  rooms[roomCode] = true;
  return roomCode;
};

class QuizTeam extends Schema {}
schema.defineTypes(QuizTeam, {
  name: 'string',
  guess: 'string',
});

class QuizState extends Schema {
  constructor() {
    super();
    this.teams = new ArraySchema();
  }
}
schema.defineTypes(QuizState, {
  questionNo: 'number', // Which question we're on, max 12
  roundNo: 'number', // Which round we're on
  host: 'string', // Client id
  teams: [QuizTeam],
});

module.exports = class Quiz extends Room {
  // maxClients = 6;
  maxQuestions = 12;

  onCreate(options) {
    console.log('Room created', options);

    this.roomId = generateRoomCode();
    this.setPrivate(true);
    this.setState(new QuizState());
    this.state.questionNo = 1;
    this.state.roundNo = 1;
  }

  onJoin(client, options) {
    console.log('Client joined', client.id, 'options:', options);

    if (!this.state.host) {
      this.state.host = client.id;
    }

    const team = new QuizTeam();
    team.name = 'Hello world';
    team.guess = '';
    this.state.teams.push(team);
    console.log(this.state.teams);

    // this.disconnect();
  }

  onMessage(client, message) {
    console.log('Message received from client', client.id, message);
  }

  onLeave(client, consented) {
    console.log('Client left', client.id, 'consented:', consented);
  }

  onDispose() {
    console.log('Disposed', this.roomName, this.roomId);

    delete rooms[this.roomId];
  }
};
