import express from "express";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import cors from "cors";
import { Application, Request, Response } from "express";
import fs from 'fs';

dotenv.config();

//mongodb+srv://maxbuteau:<password>@maxcluster-kggbs.mongodb.net/test?retryWrites=true&w=majority

const app: Application = express();
const port = process.env.SERVER_PORT || 3000;

const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://maxbuteau:maxbuteau@maxcluster-kggbs.mongodb.net/test?retryWrites=true&w=majority"
const client = new MongoClient(uri, { useNewUrlParser: true })
client.connect((err: String) => {
    const collection = client.db("test").collection("devices");
    // perform actions on the collection object
    client.close();
});


app.use(bodyParser.json());
app.use(cors());

if (port == "") {
    // tslint:disable-next-line:no-console
    console.log("Missing environment variables for configuration (check .env.example and create a .env)")
    process.exit(1);
}

var database: any[] = [];
function getIndex(id: Number)
{
    for (var i = 0; i < database.length; i++)
        if (database[i]._id == id)
            return i;
    return -1;
}
function findById(id: Number)
{
    var index = getIndex(id);
    return index != -1 ? database[index] : null;
}
function nextAvailableId()
{
    var id = 1;
    while (findById(id))
        id++;
    return id;
}
function commit()
{
    fs.writeFile('database.json', JSON.stringify(database), null, null);
}

app.get('/status', (req, res) => res.status(200).send({ "status" : "Up" }));
app.get('/articles', (req, res) => res.status(200).send(database));
app.get('/articles/:id', (req, res) =>
{
    var id = parseInt(req.params.id);
    if (isNaN(id))
        res.status(400).send();
    var article = findById(id);
    if (!article)
        res.status(404).send();
    res.status(200).send(article);
});
app.post('/articles', (req, res) =>
{
    if (!req.body.title) res.status(400).send();
    if (!req.body.subtitle) res.status(400).send();
    if (!req.body.body) res.status(400).send();
    if (!req.body.author) res.status(400).send();

    req.body._id = nextAvailableId();
    database.push(req.body);
    commit();
    res.status(200).send(req.body);
});
app.put('/articles/:id', (req, res) =>
{
    var id = parseInt(req.params.id);
    if (isNaN(id))
        res.status(400).send();
    var article = findById(id);
    if (!article)
        res.status(404).send();
    for (var prop in req.body)
        article[prop] = req.body[prop];
    commit();
    res.status(200).send(article);
});
app.delete('/articles/:id', (req, res) =>
{
    var id = parseInt(req.params.id);
    if (isNaN(id))
        res.status(400).send();
    var article = findById(id);
    if (!article)
        res.status(404).send();
    database.splice(getIndex(id), 1);
    commit();
    res.status(200).send(article);
})

app.use((req, res) => res.status(500).send({ status: 500, message: "Not Implemented" }));


export { app, port }
