const express = require("express");
const router = express.Router();
const crypto = require("crypto");
const { User } = require("../models");
const {
  createRegistrationForm,
  bootstrapField,
  createLoginForm,
} = require("../forms");
const { checkIfAuth } = require("../middleware");

const hashedPW = (password) => {
  const sha256 = crypto.createHash("sha256");
  const hash = sha256.update(password).digest("base64");
  return hash;
};

router.get("/register", (req, res) => {
  const registrationForm = createRegistrationForm();
  res.render("users/register", {
    form: registrationForm.toHTML(bootstrapField),
  });
});

router.post("/register", async (req, res) => {
  const registrationForm = createRegistrationForm();
  registrationForm.handle(req, {
    success: async (form) => {
      const user = new User({
        username: form.data.username,
        email: form.data.email,
        password: hashedPW(form.data.password),
      });
      await user.save();
      req.session.save();
      req.flash("success_msg", "Successfully registered!");
      res.redirect("/users/login");
    },
    error: async (form) => {
      res.render("users/register", {
        form: form.toHTML(bootstrapField),
      });
    },
  });
});

router.get("/login", (req, res) => {
  const loginForm = createLoginForm();
  res.render("users/login", {
    form: loginForm.toHTML(bootstrapField),
  });
});

router.post("/login", async (req, res) => {
  const loginForm = createLoginForm();
  loginForm.handle(req, {
    success: async (form) => {
      let user = await User.where({
        email: form.data.email,
      }).fetch({
        require: false,
      });
      if (!user) {
        req.flash("error_msg", "No matching account found");
        res.redirect("/users/login");
      } else {
        if (user.get("password") === hashedPW(form.data.password)) {
          req.session.user = {
            username: user.get("username"),
            email: user.get("email"),
            id: user.get("id"),
          };
          req.session.save();
          console.log(req.session.user);
          req.flash("success_msg", `Welcome back, ${user.get("username")}`);
          res.redirect("/users/profile");
        } else {
          req.flash("error_msg", "Invalid login");
          res.redirect("/users/login");
        }
      }
    },
    error: async (form) => {
      req.flash("error_msg", "Something went wrong, please try again.");
      res.render("users/login", {
        form: form.toHTML(bootstrapField),
      });
    },
  });
});

router.get("/profile", [checkIfAuth], (req, res) => {
  const user = req.session.user;
  if (!user) {
    req.flash("error_msg", "PLease login first.");
    res.redirect("/users/login");
  } else {
    res.render("users/profile", {
      user: user,
    });
  }
});

router.get("/logout", (req, res) => {
  req.session.user = null;
  req.flash("success_msg", "See you!");
  res.redirect("/");
});

module.exports = router;
