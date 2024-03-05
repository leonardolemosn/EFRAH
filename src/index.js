require("dotenv").config();
const express = require("express");
const rotas = require("./routers/rotas");
const app = express();

app.use(express.json());
app.use(rotas);

app.listen(3000);
