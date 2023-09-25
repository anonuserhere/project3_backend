const bookshelf = require("../bookshelf");

const Product = bookshelf.model("Product", {
  tableName: "products",
  category() {
    return this.belongsTo("Category");
  },
  tags() {
    return this.belongsToMany("Tags");
  },
});

const Tags = bookshelf.model("Tags", {
  tableName: "tags",
  products() {
    return this.belongsToMany("Product");
  },
});

const User = bookshelf.model("User", {
  tableName: "users",
});

const Category = bookshelf.model("Category", {
  tableName: "categories",
  products() {
    return this.hasMany("Product");
  },
});

module.exports = { Product, User, Category, Tags };
