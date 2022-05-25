const users = [];

//Usuário entrando no chat
const userJoin = (id, username, room) => {
    const user = {id, username, room};
    users.push(user);
    return(user);
}

//Pegar o usuário atual
const getCurrentUser = (id) => {
    return users.find(user => user.id === id);
}

//Usuário saiu do chat
const userLeave = (id) => {
    const index= users.findIndex(user => user.id === id);
    if(index !== -1){
        return users.splice(index, 1)[0];
    }
}

// Pegar os usuários da sala
const getRoomUsers = (room) => {
    return users.filter(user => user.room === room);
}

module.exports = {
    userJoin,
    getCurrentUser,
    userLeave,
    getRoomUsers
};