"use strict";

const Koa = require("koa");
const Router = require("koa-router");
const Sequelize = require("sequelize");
const bodyParser = require("koa-bodyparser");
const sendgrid = require("sendgrid");

const app = new Koa();
const router = new Router();

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  operatorAliases: false
});
sendgrid.setApiKey(process.env.SENDGRID_API_KEY);

const Winner = sequelize.define("winner", {
  email: {
    type: Sequelize.TEXT,
    validate: {
      isEmail: true,
      notEmpty: true
    },
    unique: true
  }
});

Winner.sync({ force: true });

router.post("/", async ctx => {
  const json = ctx.request.body;

  if (!(json && json.email)) {
    ctx.status = 400;
    ctx.body = { error: "email required" };
    return;
  }

  let winner = await Winner.findOrCreate({ where: { email: json.email }});
  console.log(winner.isNewRecord);

  ctx.status = 201;
  ctx.body = "";
});

app
  .use(bodyParser())
  .use(router.routes())
  .use(router.allowedMethods());

app.listen(process.env.PORT);
