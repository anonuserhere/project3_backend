const express = require("express");
require("dotenv").config();
const cors = require("cors");
const hbs = require("hbs");
const wax = require("wax-on");
const session = require("express-session");
const flash = require("connect-flash");
const FileStore = require("session-file-store")(session);

let app = express();
app.use(cors());
app.set("view engine", "hbs");
app.use(express.static("public"));
wax.on(hbs.handlebars);
wax.setLayoutPath("./views/layouts");

app.use(
  express.urlencoded({
    extended: false,
  })
);

app.use(
  session({
    store: new FileStore(),
    secret: process.env.FS_SECRET,
    resave: true,
    saveUninitialized: true,
  })
);

app.use(flash());
app.use(function (req, res, next) {
  res.locals.success_msg = req.flash("success_msg");
  res.locals.error_msg = req.flash("error_msg");
  next();
});

async function main() {
  app.use("/", require("./routes/index"));
  app.use("/products", require("./routes/products"));
  app.use("/orders", require("./routes/orders"));
}

main();

app.listen(process.env.PORT, () => {
  console.log("listening on port " + process.env.PORT);
});
