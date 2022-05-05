const chatForm = document.getElementById('chat-form');
const chatMessages = document.querySelector('.chat-messages');
const roomName = document.getElementById('room-name');
const userList = document.getElementById('users');

// Pegar o Usuário e a Sala pela URL
const {username, room} = Qs.parse(location.search,{
    ignoreQueryPrefix: true
});

const socket = io();

//Entrar na sala do Chat
socket.emit('joinRoom', {username, room});

//Pegar os usuários e as salas
socket.on('roomUsers', ({room, users}) => {
     outputRoomName(room);
     outputUsers(users);
});

//Mensagem do servidor
socket.on('message', message => {
    console.log(message);
    outputMessage(message);

    //Scrollando
    chatMessages.scrollTop = chatMessages.scrollHeight;
});

//Envio da Mensagem
chatForm.addEventListener('submit', (e) => {
    e.preventDefault();

    //Pegando o texto da mensagem
    const msg = e.target.elements.msg.value;

    //Emitindo a mensagem para o server
    socket.emit('chatMessage', msg);

    //Limpando o Input
    e.target.elements.msg.value = '';
    e.target.elements.msg.focus();
});

// Output mensagem para DOM
function outputMessage(message){
    const div = document.createElement('div');
    div.classList.add('message');
    div.innerHTML = `<p class="meta">${message.username} <span>${message.time}</span></p>
    <p class="text">
        ${message.text}
    </p>`;
    document.querySelector('.chat-messages').appendChild(div);
}

//Adicionando o nome da sala no DOM
function outputRoomName(room){
    roomName.innerText = room;
}

//Adicionando os Usuarios
function outputUsers(users){
    userList.innerHTML = `
    ${users.map(user => `<li>${user.username}</li>`).join('')}
    `;
}