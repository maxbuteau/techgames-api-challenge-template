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

var array: any[] = [];

app.get('/status', (req, res) => res.send({ "status" : "Up" }));
app.get('/db', (req, res) => 
{
    res.send(array);
    array.push("Lol");
});

app.post('/articles', (req, res) => {
    if (!req.body.title) res.status(400).send();
    if (!req.body.subtitle) res.status(400).send();
    if (!req.body.body) res.status(400).send();
    if (!req.body.author) res.status(400).send();

    req.body._id = array.length;
    array.push(req.body);
    res.send(req.body);
});

app.post('/articles/:id', (req, res) => res.send({ params: req.params, body: req.body }));

app.use((req, res) => res.status(500).send({ status: 500, message: "Not Implemented" }));

export { app, port }
