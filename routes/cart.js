const express = require("express");
const router = express.Router();
const cartServiceLayer = require("../services/cart_services");
const { checkIfAuth } = require("../middleware");

router.get("/", [checkIfAuth], async (req, res) => {
  let cart = await cartServiceLayer.getCart(req.session.user.id);
  res.render("cart/index", {
    cart: cart.toJSON(),
  });
});

router.post("/:productId/add", [checkIfAuth], async (req, res) => {
  let cartItem = await cartServiceLayer.addToCart(
    req.session.user.id,
    req.params.productId,
    1
  );
  console.log("cartItem", cartItem);
  req.flash("success_msg", "Product added to cart.");
  res.redirect("/cart");
});

router.post("/:productId/edit", [checkIfAuth], async (req, res) => {
  const newQty = req.body.newQty;
  await cartServiceLayer.setQuantity(
    req.session.user.id,
    req.params.productId,
    newQty
  );
  req.flash("success_msg", "Quantity updated.");
  res.redirect("/cart");
});

router.post("/:productId/delete", [checkIfAuth], async (req, res) => {
  await cartServiceLayer.removeFromCart(
    req.session.user.id,
    req.params.productId
  );
  req.flash("success_msg", "Item removed.");
  res.redirect("/cart");
});

module.exports = router;
