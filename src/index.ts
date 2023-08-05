import express, { Express, Request, Response } from "express";
import { config } from "./config";
import { PrismaClient } from "@prisma/client";

const app: Express = express();
const prisma = new PrismaClient();

app.get("/", (req: Request, res: Response) => {
  res.send("Code with Harry. Ready to run on Heroku.");
});

app.get("/users", async (req: Request, res: Response) => {
  try {
    const users = await prisma.user.findMany();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: "Error occurred while retrieving users" });
  }
});

app.listen(config.server.port, () => {
  return console.log(`[server]: Server is running on ${config.server.port}`);
});
