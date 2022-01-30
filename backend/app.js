const express = require("express");
var path = require("path");
const port = 4000;
const cookieParser = require("cookie-parser");
const cors = require("cors");
const pino = require("pino");
const logger = pino({
  prettyPrint: true,
});

var metricRouter = require("./routes/metrc");
var activityRouter = require("./routes/activity");

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/metric", metricRouter);
app.use("/activity", activityRouter);

app.listen(port, () => {
  logger.info(`Example app listening on port ${port}!`);
});

module.exports = app;
