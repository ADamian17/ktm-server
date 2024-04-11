import express, { Application } from "express";
import cors from "cors";
import dotenv from "dotenv";

/* == security == */
import rateLimit from "express-rate-limit";
import helmet from "helmet";

import { routes } from "./routes";
import { db } from "./config";

dotenv.config();

const PORT = 8000;
const app: Application = express();

/* == rate limit == */
const LIMIT = rateLimit({
  max: 10000,
  windowMs: 24 * 60 * 60 * 1000, // 1 day
  message: "Too many requests",
});

const corsOption = {
  origin: [process.env.FRONTEND_APP as string, "http://localhost:3000"],
  optionsSuccessStatus: 200,
};

/* == Middleware == */
app.set("trust proxy", 1);
app.use(cors(corsOption));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(LIMIT);
app.use(helmet());

/* logger */
app.use((req, res, next) => {
  console.log(`${req.method} ${req.originalUrl}`);
  next();
});

app.get("/", (req, res) => {
  res.send(`
  <html>
    <head>
        <title>KTM API</title>
    </head>
    <body>
        <h1>Welcome to KTM API</h1>
    </body>
    </html>
  `);
});

/* NOTE API Routes */
app.use("/api/v1/", routes);

// Close Prisma client on app shutdown
app.on("beforeExit", async () => {
  await db.$disconnect();
});

app.listen(PORT, () => {
  console.log(`Server listening at http://localhost:${PORT}`);
});
