import express from 'express';
import cors from 'cors';
import 'dotenv/config'
import routes from './routes';

const PORT = process.env.PORT || 3010;

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }))
app.use(cors({
    origin: ['http://localhost:3000', 'http://localhost:3001'],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"]
}));

app.disable('x-powered-by');

routes(app);

app.listen((PORT), () => {
    console.log("Server running on http://localhost:" + PORT);
})

export default app;
