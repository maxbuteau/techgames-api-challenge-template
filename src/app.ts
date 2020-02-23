import express from "express";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import cors from "cors";
import { Application, Request, Response } from "express";

dotenv.config();

const app: Application = express();
const port = process.env.SERVER_PORT || 3000;

app.use(bodyParser.json());
app.use(cors());

if (port == "") {
    // tslint:disable-next-line:no-console
    console.log("Missing environment variables for configuration (check .env.example and create a .env)")
    process.exit(1);
}

var database: any[] = [];

app.get('/status', (req, res) => res.send({ "status" : "Up" }));

app.get('/articles', (req, res) => res.send(database));
app.post('/articles', (req, res) =>
{
    if (!req.body.title) res.status(400).send();
    if (!req.body.subtitle) res.status(400).send();
    if (!req.body.body) res.status(400).send();
    if (!req.body.author) res.status(400).send();

    req.body._id = database.length;
    database.push(req.body);
    res.send(req.body);
});

app.use((req, res) => res.status(500).send({ status: 500, message: "Not Implemented" }));

export { app, port }
