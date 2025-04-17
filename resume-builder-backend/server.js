// Backend/server.js
const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');
const resumeRoutes = require('./routes/resume');

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// MySQL connection
const dbConfig = {
    host: 'localhost',
    user: 'root',
    password: '12345678',  // change this!
    database: 'resumeBuilder'
};

async function startServer() {
    try {
        const connection = await mysql.createConnection(dbConfig);
        console.log('Connected to MySQL');

        // Attach the connection to request object for use in routes
        app.use((req, res, next) => {
            req.db = connection;
            next();
        });

        // Mount routes
        app.use('/api/resumes', resumeRoutes);

        // Start server
        const PORT = 5000;
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    } catch (err) {
        console.error('MySQL connection error:', err);
    }
}

startServer();
