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
function findById(id: Number)
{
    for (var i = 0; i < database.length; i++)
        if (database[i]._id == id)
            return database[i];
    return null;
}
function nextAvailableId()
{
    var id = 1;
    while (findById(id))
        id++;
    return id;
}

app.get('/status', (req, res) => res.send({ "status" : "Up" }));
app.get('/articles', (req, res) => res.send(database));
app.get('/articles/:id', (req, res) =>
{
    var id = parseInt(req.params.id);
    if (isNaN(id))
        res.status(400).send();
    var article = findById(id);
    if (!article)
        res.status(404).send();
    res.send(article);
});
app.post('/articles', (req, res) =>
{
    if (!req.body.title) res.status(400).send();
    if (!req.body.subtitle) res.status(400).send();
    if (!req.body.body) res.status(400).send();
    if (!req.body.author) res.status(400).send();

    req.body._id = nextAvailableId();
    database.push(req.body);
    res.send(req.body);
});

app.use((req, res) => res.status(500).send({ status: 500, message: "Not Implemented" }));

export { app, port }
