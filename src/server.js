require('dotenv').config({ path: '/home/ubuntu/backend.env' });
const http = require('http');
const app = require('./app');
const { connectDB } = require('./config/database');
const { initSocket } = require('./services/socketService');
const initItemsCleanup = require('./utils/cronJobs');

const server = http.createServer(app);

initSocket(server);

const PORT = process.env.PORT || 5000;

connectDB()
    .then(() => {
initItemsCleanup();
        server.listen(PORT,'0.0.0.0', () => {
            console.log(`Server running on port ${PORT}`);
            console.log(`Swagger Docs available at http://localhost:${PORT}/api-docs`);
        });
    })
    .catch((err) => {
        console.error('Failed to connect to database', err);
    });
