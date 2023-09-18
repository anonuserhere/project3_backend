const express = require("express");
const router = express.Router();
const { bootstrapField, createProductForm } = require("../forms");
const { Product } = require("../models");

router.get("/", async (req, res) => {
  let products = await Product.collection().fetch();
  res.render("products/index", {
    products: products.toJSON(),
  });
});

router.get("/create", async (req, res) => {
  const productForm = createProductForm();
  res.render("products/create", {
    form: productForm.toHTML(bootstrapField),
  });
});

router.post("/create", async (req, res) => {
  const productForm = createProductForm();
  productForm.handle(req, {
    success: async (form) => {
      const product = new Product();
      product.set("name", form.data.name);
      product.set("price", form.data.price);
      product.set("quantity", form.data.quantity);
      product.set("description", form.data.description);
      product.set("image", form.data.image);
      await product.save();
      res.redirect("/products");
    },
  });
});

module.exports = router;
