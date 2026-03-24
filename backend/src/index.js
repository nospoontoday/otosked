import dotenv from 'dotenv';
import connectDB from './config/database.js';
import app from './app.js';
import projectRouter from './routes/project.js';

dotenv.config();

const PORT = process.env.PORT || 5000;
const API_VERSION = process.env.API_VERSION || 'v1';

app.use(`/api/${API_VERSION}/projects`, projectRouter);
app.get('/api/health', (_req, res) => res.json({ status: 'ok' }));

connectDB().then(() => {
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}).catch((error) => {
    console.error('MongoDB connection error:', error);
});


