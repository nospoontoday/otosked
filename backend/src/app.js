import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';

dotenv.config();

const app = express();
const COOKIE_SECRET = process.env.COOKIE_SECRET || 'dev_cookie_secret';

app.set('trust proxy', true);
app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
}));
app.use(express.json({ limit: '16kb' }));
app.use(cookieParser(COOKIE_SECRET));

export default app;