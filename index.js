const express = require("express");
require("dotenv").config();
const cors = require("cors");
const hbs = require("hbs");
const wax = require("wax-on");
const session = require("express-session");
const flash = require("connect-flash");
const FileStore = require("session-file-store")(session);
const csrf = require("csurf");

let app = express();
app.use(cors());
app.set("view engine", "hbs");
app.use(express.static("public"));
wax.on(hbs.handlebars);
wax.setLayoutPath("./views/layouts");

app.use(
  session({
    store: new FileStore(),
    secret: process.env.FS_SECRET,
    resave: false,
    saveUninitialized: true,
  })
);

app.use(
  express.urlencoded({
    extended: false,
  })
);

app.use(function (req, res, next) {
  res.locals.user = req.session.user;
  next();
});

app.use(flash());
app.use(function (req, res, next) {
  res.locals.success_msg = req.flash("success_msg");
  res.locals.error_msg = req.flash("error_msg");
  next();
});

app.use(csrf());
app.use(function (err, req, res, next) {
  if (err && err.code == "EBADCSRFTOKEN") {
    req.flash("error_msg", "Form expired. Please try again");
    res.redirect("back");
  } else {
    next();
  }
});

app.use(function (req, res, next) {
  res.locals.csrfToken = req.csrfToken();
  next();
});

// app.use((err, req, res, next) => {
//   console.error("Error: ", err);
//   res.status(500).send("Something went wrong.");
// });

async function main() {
  app.use("/", require("./routes/index"));
  app.use("/products", require("./routes/products"));
  app.use("/orders", require("./routes/orders"));
  app.use("/users", require("./routes/users"));
  app.use("/cart", require("./routes/cart"));
}

main();

app.listen(process.env.PORT, () => {
  console.log("listening on port " + process.env.PORT);
});
