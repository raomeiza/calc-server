import {createServer} from 'http';
import app from './api'; // index.ts
import { PORT, BASE_URL } from './config';
import cors from 'cors'
import {Server} from 'socket.io';


// Spin server
const server = createServer(app);
const socketIo = new Server(server, {cors: {origin: '*'}})

socketIo.on('connection', (socket) => {
  console.log('A client connected');

  socket.on('disconnect', () => {
    console.log('A client disconnected');
  })
  socket.on('message', (message) => {
    console.log('New message', message);
    socketIo.emit('message', message);
  }).on('error', (err) => {
    console.log('Socket error', err);
  });

  socket.on('offer', (offer) => {
    console.log('New offer', offer);
    console.log('New offer', offer);
    socket.broadcast.emit('offer', offer);
  }).on('error', (err) => {
    console.log('Socket error', err);
  });

  socket.on('answer', (answer) => {
    console.log('New answer', answer);
    console.log('New answer', answer);
    socket.broadcast.emit('answer', answer);
  }).on('error', (err) => {
    console.log('Socket error', err);
  });

  socket.on('candidate', (candidate) => {
    console.log('New candidate', candidate);
    socket.broadcast.emit('candidate', candidate);
  }).on('error', (err) => {
    console.log('Socket error', err);
  });
});

server.listen(PORT, () => console.info(`Server listening on ${BASE_URL}`));

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
 console.error('There was an uncaught error', err)
 console.log('Shutting down the server due to Uncaught Exception');
  // Close server & exit process
  server.close(() => process.exit(1));
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err:any) => {
  console.error('There was an unhandled rejection', err)
  console.log('Shutting down the server due to Unhandled Promise rejection');
  server.close(() => process.exit(1));
});
