const chatForm = document.getElementById('chat-form');
const chatMessages = document.querySelector('.chat-messages');
const roomName = document.getElementById('room-name');
const uploadButton = document.getElementById('idSelectionFile');
const userList = document.getElementById('users');
const ONE_MEGABYTE = 1048576;

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

//Mensagem chegando do servidor
socket.on('message', message => {
    outputMessage(message);

    //Scrollando
    chatMessages.scrollTop = chatMessages.scrollHeight;
});

//Arquivo chegando do servidor
socket.on('fileMessage', message => {
    outputFileMessage(message)

    //Scrollando
    chatMessages.scrollTop = chatMessages.scrollHeight;
});

//Envio da Mensagem para o Servidor
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

//Listener olhando mudança no input de upload de arquivo
uploadButton.addEventListener('change', (e) => {
    e.preventDefault();

    //pegando o arquivo enviado
    var file = e.target.files[0];

    //valida se o arquivo excede o tamanho máximo permitido
    if (file.size > ONE_MEGABYTE) {
        //alerta o usuário sobre o tamanho máximo permito para envio de arquivos
        alert('Somente arquivos até um 1 Megabyte são permitidos.');
    } else {
        //método que prepara o arquivo para envio ao servidor
        sendFile(file);
    }
});

//Envio do arquivo para o servidor
const sendFile = (file) => {
    //Cria um leitor para o arquivo já validado
    var reader = new FileReader();

    //método para ler o arquivo
    reader.readAsDataURL(file);

    //evento que é disparado quando a leitura do arquivo é concluída
    reader.onload = () => {
        //pega o resultado da leitura do arquivo que é convertido para base64
        const base64string = (reader.result.split(',')[1]);
        const fileMessage = {
            name: file.name,
            type: file.type,
            encoded: base64string
        }
        socket.emit('fileMessage', fileMessage);
    }
}

// Output mensagem para DOM
const outputMessage = (message) => {
    const div = document.createElement('div');
    div.classList.add('message');
    div.innerHTML = `<p class="meta">${message.username} <span>${message.time}</span></p>
    <p class="text">
        ${message.text}
    </p>`;
    document.querySelector('.chat-messages').appendChild(div);
}

// Output mensagem de arquivo para DOM
const outputFileMessage = (message) => {
    const linkSource = `data:${message.type};base64,${message.encoded}`;
    const div = document.createElement('div');
    div.classList.add('message');
    div.innerHTML = `<p class="meta">${message.username} <span style="font-weight: normal;">enviou um arquivo</span> <span>${message.time}</span></p>
    <p class="text">
        <span style="font-style:italic">${message.name}</span> - 
        <a href="${linkSource}" style="color: #08ad39; font-weight:bold" download="${message.name}">
            Download
        </a>
    </p>`;
    document.querySelector('.chat-messages').appendChild(div);
}

//Adicionando o nome da sala no DOM
const outputRoomName = (room) => {
    roomName.innerText = room;
}

//Adicionando os Usuarios
const outputUsers = (users) => {
    userList.innerHTML = `
    ${users.map(user => `<li>${user.username}</li>`).join('')}
    `;
}