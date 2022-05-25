const path = require('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const formatMessage = require('./utils/messages');
const {
  userJoin,
  getCurrentUser,
  userLeave,
  getRoomUsers
} = require('./utils/users');

const botName = process.env.BOT_NAME || 'Douglas Bot';
const app = express();
const server = http.createServer(app);
const io = socketio(server);

// Quando um cliente conecta
io.on('connection', socket => {
    socket.on('joinRoom', ({ username, room }) => {
      const user = userJoin(socket.id, username, room);
  
      socket.join(user.room);
  
      // Mensagem de boas vindas
      socket.emit('message', formatMessage(botName, 'Seja bem vindo ao chat!'));
  
      // Transmissão pra sala quando um usuário chega
      socket.broadcast.to(user.room).emit('message',formatMessage(botName, `${user.username} entrou no chat!`));
  
      // Info sobre a sala (Nome e Usuários)
      io.to(user.room).emit('roomUsers', {
        room: user.room,
        users: getRoomUsers(user.room)
      });
    });
  
    // Listener da chatMessage, avisando sobre 
    socket.on('chatMessage', msg => {
      const user = getCurrentUser(socket.id);
  
      io.to(user.room).emit('message', formatMessage(user.username, msg));
    });
  
    // Listener do envio de arquivos, avisando sobre 
    socket.on('fileMessage', fileMessage => {
      const user = getCurrentUser(socket.id);
      const message = formatMessage(user.username, "");
      io.to(user.room).emit('fileMessage', {...fileMessage, ...message});
    });
  
    // Avisando que o Usuário saiu do chat e atualizando as informações da sala
    socket.on('disconnect', () => {
      const user = userLeave(socket.id);
  
      if (user) {
        io.to(user.room).emit(
          'message',
          formatMessage(botName, `${user.username} saiu do chat!`)
        );
  
        // Info da sala (denovo)
        io.to(user.room).emit('roomUsers', {
          room: user.room,
          users: getRoomUsers(user.room)
        });
      }
    });
  });

// Pasta Estática de Uso
app.use(express.static(path.join(__dirname, 'public')));

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));