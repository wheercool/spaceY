import express from 'express';
import http from 'http';
import { ServerGame } from './ServerGame';
import { WS } from './ws';

const WebSocket = require('ws');


const PORT = process.env.PORT || 8080;

const app = express();
const server = http.createServer(app);
const webSocketServer = new WebSocket.Server({ server });

const game = new ServerGame();
game.startGame();

webSocketServer.on('connection', (ws: WS) => {
  game.addPlayer(ws);
});


server.listen(PORT, () => {
  console.log('App started at ', PORT);
});
