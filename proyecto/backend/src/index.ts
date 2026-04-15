import express from 'express';
import cors from 'cors';
import 'dotenv/config'
import routes from './routes';

const PORT = process.env.PORT || 3010;

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }))

// Configuración flexible de CORS
const allowedOrigins: (string | RegExp)[] = [
    'http://localhost:3000',
    'http://localhost:3001',
    /^https:\/\/.*\.vercel\.app$/
];

// Agregar FRONTEND_URL si existe
if (process.env.FRONTEND_URL) {
    allowedOrigins.push(process.env.FRONTEND_URL);
}

app.use(cors({
    origin: allowedOrigins,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));

app.disable('x-powered-by');

routes(app);

app.listen((PORT), () => {
    console.log("Server running on http://localhost:" + PORT);
    console.log("CORS origins:", allowedOrigins);
})

export default app;
