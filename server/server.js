import express from 'express';
import cors from 'cors';
import membersRoutes from './routes/members.js';
import { connectDB } from './config/db.js';

const app = express();

app.use(cors());
app.use(express.json());

connectDB();

app.use('/api/members', membersRoutes);

app.listen(8080, () => {
    console.log("Server running on port 8080");
});
