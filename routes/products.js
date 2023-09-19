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
    UC_PUBLIC: process.env.UC_PUBLIC,
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
      product.set("image", form.data.image.slice(1));
      await product.save();
      res.redirect("/products");
    },
    error: async (form) => {
      res.render("products/create", {
        form: form.toHTML(bootstrapField),
      });
    },
  });
});

router.get("/:id/edit", async (req, res) => {
  const id = req.params.id;
  const product = await Product.where({
    id: id,
  }).fetch({
    require: true,
  });

  const productForm = createProductForm();
  productForm.fields.name.value = product.get("name");
  productForm.fields.price.value = product.get("price");
  productForm.fields.quantity.value = product.get("quantity");
  productForm.fields.description.value = product.get("description");

  res.render("products/edit", {
    UC_PUBLIC: process.env.UC_PUBLIC,
    form: productForm.toHTML(bootstrapField),
    product: product.toJSON(),
  });
});

router.post("/:id/edit", async (req, res) => {
  const id = req.params.id;
  const product = await Product.where({
    id: id,
  }).fetch({
    require: true,
  });

  const productForm = createProductForm();
  productForm.handle(req, {
    success: async (form) => {
      product.set({
        name: form.data.name,
        price: form.data.price,
        quantity: form.data.quantity,
        description: form.data.description,
      });
      console.log(form.data);
      product.set("image", form.data.image.slice(1));
      product.save();
      res.redirect("/products");
    },
    error: async (form) => {
      res.render("/products/update", {
        form: form.toHTML(bootstrapField),
        product: product.toJSON(),
      });
    },
  });
});

router.get("/:id/delete", async (req, res) => {
  const product = await Product.where({
    id: req.params.id,
  }).fetch({
    require: true,
  });
  res.render("products/delete", {
    product: product.toJSON(),
  });
});

router.post("/:id/delete", async (req, res) => {
  const product = await Product.where({
    id: req.params.id,
  }).fetch({
    require: true,
  });
  await product.destroy();
  res.redirect("/products");
});

module.exports = router;
