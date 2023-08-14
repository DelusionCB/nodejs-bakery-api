import express from 'express';
import routes from './Routes/routes';
import {createDatabase} from './Database/db';

const app = express();
const port = 8080;

// Use JSON middleware to parse request bodies
app.use(express.json());

// Use the routes defined in routes.ts
app.use('/', routes);

// Start the server
app.listen(port, async () => {
    try {
        await createDatabase();
        console.log(`Server is running on port ${port}`);
    } catch (error) {
        console.error('Error creating the database:', error);
    }
});
