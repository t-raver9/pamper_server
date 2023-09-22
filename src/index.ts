import express, { Express } from "express";
import { config } from "./config";
import cors from "cors";
import userRoutes from "./routes/users";
import session from "express-session";
import passport from "./middleware/authentication";
import categoryRoutes from "./routes/categories";
import venueRoutes from "./routes/venues";
import authenticationRoutes from "./routes/authentication";
import serviceRoutes from "./routes/services";

const cookieParser = require("cookie-parser");

const app: Express = express();

app.use(passport.initialize());
app.use(cors({ credentials: true, origin: process.env.CLIENT_URL }));
app.use(express.json());
app.use(cookieParser());

// Session setup
app.use(
  session({
    secret: "mySecret",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: true },
  })
);
app.use(passport.session());

// Routes
app.use("/auth", authenticationRoutes);
app.use("/users", userRoutes);
app.use("/categories", categoryRoutes);
app.use("/venues", venueRoutes);
app.use("/services", serviceRoutes);

app.listen(config.server.port, () => {
  console.log(`[server]: Server is running on ${config.server.port}`);
});
