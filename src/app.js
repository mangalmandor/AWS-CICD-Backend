const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const chatRoutes = require('./routes/chatRoutes');
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const path = require('path'); // <-- NAYI LINE ADD KI HAI

const app = express();

app.use(cors({
    origin: [
        'http://localhost:5173',
        'https://market-tred-frontend.vercel.app',
        process.env.CLIENT_URL
    ].filter(Boolean),
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// <-- YAHAN PATH CHANGE KIYA HAI -->
const swaggerPath = path.join(__dirname, '../swagger.yaml');
const swaggerDocument = YAML.load(swaggerPath);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/chat', chatRoutes);

app.get('/api/health', (req, res) => {
    res.status(200).json({ status: 'Active', message: 'Server is awake!' });
});

app.get('/api/test', async (req, res) => {
    res.json({
        msg: 'test route is perfectly giving response on api route! congratulations !!!'
    })
});

module.exports = app;