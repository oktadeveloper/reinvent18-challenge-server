"use strict";

const Koa = require("koa");
const Router = require("koa-router");
const Sequelize = require("sequelize");
const bodyParser = require("koa-bodyparser");

const app = new Koa();
const router = new Router();

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  operatorAliases: false
});

const Winner = sequelize.define("winner", {
  email: { type: Sequelize.TEXT }
});

Winner.sync({ force: true });

router.post("/", async ctx => {
  ctx.body = ctx.request.body;
});

app
  .use(bodyParser())
  .use(router.routes())
  .use(router.allowedMethods());

app.listen(process.env.PORT);
