const checkIfAuth = (req, res, next) => {
  if (req.session.user) {
    next();
  } else {
    req.flash("error_msg", "You must be logged in to view this.");
    res.redirect("/users/login");
  }
};

module.exports = { checkIfAuth };
