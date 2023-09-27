const express = require("express");
const router = express.Router();
const {
  bootstrapField,
  createProductForm,
  createSearchForm,
} = require("../forms");
const { Product, Category } = require("../models");
const { checkIfAuth } = require("../middleware");
const dataLayer = require("../DAL/products");

router.get("/", async (req, res) => {
  const allCategories = await dataLayer.getAllCategories();
  allCategories.unshift([0, "Choose a category below:"]);
  const searchForm = createSearchForm(allCategories);
  let query = Product.collection();

  searchForm.handle(req, {
    success: async (form) => {
      if (form.data.name) {
        query.where("name", "like", "%" + form.data.name + "%");
      }
      if (form.data.category_id && form.data.category_id != "0") {
        query.where("category_id", "=", form.data.category_id);
      }
      if (form.data.min_cost) {
        query.where("price", ">=", form.data.min_cost);
      }
      if (form.data.max_cost) {
        query.where("price", "<=", form.data.max_cost);
      }
      const products = await query.fetch({
        withRelated: ["category"],
      });
      console.log(form.data);
      res.render("products/index", {
        products: products.toJSON(),
        form: form.toHTML(bootstrapField),
      });
    },
    empty: async (form) => {
      const products = await Product.collection().fetch({
        withRelated: ["category"],
      });
      res.render("products/index", {
        products: products.toJSON(),
        form: form.toHTML(bootstrapField),
      });
    },
    error: async (form) => {
      const products = await Product.collection().fetch({
        withRelated: ["category"],
      });
      res.render("products/index", {
        products: products.toJSON(),
        form: form.toHTML(bootstrapField),
      });
    },
  });
});

router.get("/create", [checkIfAuth], async (req, res) => {
  const allCategories = await dataLayer.getAllCategories();
  const productForm = createProductForm(allCategories);
  res.render("products/create", {
    UC_PUBLIC: process.env.UC_PUBLIC,
    form: productForm.toHTML(bootstrapField),
  });
});

router.post("/create", [checkIfAuth], async (req, res) => {
  const productForm = createProductForm();
  productForm.handle(req, {
    success: async (form) => {
      const product = new Product();
      console.log(form.data);
      product.set("name", form.data.name);
      product.set("price", form.data.price);
      product.set("quantity", form.data.quantity);
      product.set("description", form.data.description);
      product.set("image", form.data.image.slice(1));
      product.set("category_id", form.data.category_id);
      await product.save();
      console.log("product: ", product);
      req.flash("success_msg", `New Product ${product.get("name")} created`);
      res.redirect("/products");
    },
    error: async (form) => {
      res.render("products/create", {
        form: form.toHTML(bootstrapField),
      });
    },
  });
});

router.post("/:id/edit", [checkIfAuth], async (req, res) => {
  const id = req.params.id;
  const product = await Product.where({
    id: id,
  }).fetch({
    require: true,
  });

  const allCategories = await dataLayer.getAllCategories();
  const productForm = createProductForm(allCategories);
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

router.post("/:id/edit", [checkIfAuth], async (req, res) => {
  const id = req.params.id;
  const product = await Product.where({
    id: id,
  }).fetch({
    require: true,
  });

  const originalImage = product.attributes.image;
  const productForm = createProductForm();
  productForm.handle(req, {
    success: async (form) => {
      product.set({
        name: form.data.name,
        price: form.data.price,
        quantity: form.data.quantity,
        description: form.data.description,
      });
      if (form.data.image.slice(1)) {
        product.set("image", null);
        product.set("image", form.data.image.slice(1));
      } else {
        product.set("image", originalImage);
      }
      console.log("form data: ", form.data);
      await product.save();
      req.flash(
        "success_msg",
        `Product ${product.get("name")} edited successfully`
      );
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

router.get("/:id/delete", [checkIfAuth], async (req, res) => {
  const product = await Product.where({
    id: req.params.id,
  }).fetch({
    require: true,
  });
  res.render("products/delete", {
    product: product.toJSON(),
  });
});

router.post("/:id/delete", [checkIfAuth], async (req, res) => {
  const product = await Product.where({
    id: req.params.id,
  }).fetch({
    require: true,
  });
  await product.destroy();
  console.log("Product deleted");
  req.flash("success_msg", "Product deleted successfully");
  res.redirect("/products");
});

module.exports = router;
