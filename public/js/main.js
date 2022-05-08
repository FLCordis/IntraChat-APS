const chatForm = document.getElementById('chat-form');
const chatMessages = document.querySelector('.chat-messages');
const roomName = document.getElementById('room-name');
const uploadButton = document.getElementById('idSelectionFile');
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

uploadButton.addEventListener('change', function (e){
    var file = e.target.files[0];
    var reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = function () {
        var inputData = reader.result;
        var replaceValue = (inputData.split(',')[0]);
        var base64string = inputData.replace(replaceValue + ",","");

        const fileMessage = {
            name: file.name,
            type: file.type,
            encoded: base64string
        }
        socket.emit('fileMessage', fileMessage);
    }
});

//Mensagem do servidor
socket.on('message', message => {
    outputMessage(message);

    //Scrollando
    chatMessages.scrollTop = chatMessages.scrollHeight;
});

socket.on('fileMessage', message => {
    outputFileMessage(message)

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

// Output mensagem de arquivo para DOM
function outputFileMessage(message){
    const linkSource = `data:application/pdf;base64,${message.encoded}`;
    const div = document.createElement('div');
    div.classList.add('message');
    div.innerHTML = `<p class="meta">${message.username} <span>${message.time}</span></p>
    <p class="text">
        Arquivo: ${message.name} - 
        <a href="${linkSource}" download="${message.name}">
            Download
        </a>
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