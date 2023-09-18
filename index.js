const express = require("express");
require("dotenv").config();
const cors = require("cors");
const hbs = require("hbs");
const wax = require("wax-on");

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

async function main() {
  app.use("/", require("./routes/index"));
}

main();

app.listen(process.env.PORT, () => {
  console.log("listening on port " + process.env.PORT);
});
