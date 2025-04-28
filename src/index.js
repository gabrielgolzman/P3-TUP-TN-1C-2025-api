import express from 'express'

import { PORT } from './config.js';
import { sequelize } from './db.js';
import bookRoutes from './routes/books.routes.js';
import userRoutes from './routes/users.routes.js'


import "./models/Book.js";
import "./models/User.js";

const app = express();

try {
    app.use(express.json());
    app.use((req, res, next) => {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "*");
        res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
        next();
    })
    app.listen(PORT);
    app.use(bookRoutes);
    app.use(userRoutes);

    await sequelize.sync();

    console.log(`Server listening in port: ${PORT} `);
} catch (error) {
    console.log("There was an error on initialization");
}

