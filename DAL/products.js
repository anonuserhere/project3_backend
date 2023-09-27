const { Product, Category } = require("../models");

const getAllCategories = async () => {
  return await Category.fetchAll().map((category) => {
    return [category.get("id"), category.get("name")];
  });
};

module.exports = { getAllCategories };
