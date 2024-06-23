// backend/socket.js
const socketIo = require('socket.io');
const axios = require('axios');

const socketHandler = (server) => {
    const io = socketIo(server, {
        cors: {
            origin: "*",
            methods: ["GET", "POST"]
        }
    });
    

    io.on('connection', (socket) => {
        console.log('New client connected');

        socket.on('sendMessage', async (data) => {
            console.log({ data , token: data.token });
            const stringData = JSON.stringify(data)
            try {
                const response = await axios.post('http://localhost:5005/webhooks/rest/webhook', {
                    sender: 'user',
                    message: stringData,
                    // token: data.token
                });
                console.log({ response, data: response?.data });
                socket.emit('botReply', response.data);
            } catch (error) {
                console.error('Error sending message to Rasa:', error);
            }
        });

        socket.on('disconnect', () => {
            console.log('Client disconnected');
        });
    });
};

module.exports = socketHandler;
