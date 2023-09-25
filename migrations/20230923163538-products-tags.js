"use strict";

var dbm;
var type;
var seed;

/**
 * We receive the dbmigrate dependency from dbmigrate initially.
 * This enables us to not have to rely on NODE_PATH.
 */
exports.setup = function (options, seedLink) {
  dbm = options.dbmigrate;
  type = dbm.dataType;
  seed = seedLink;
};

exports.up = function (db) {
  return db.createTable("products_tags", {
    id: { type: "int", primaryKey: true, autoIncrement: true },
    product_id: {
      type: "int",
      notNull: true,
      unsigned: true,
      foreignKey: {
        name: "products_tags_product_fk",
        table: "products",
        rules: {
          onDelete: "CASCADE",
          onUpdate: "RESTRICT",
        },
        mapping: "id",
      },
    },
    tag_id: {
      type: "int",
      notNull: true,
      unsigned: true,
      foreignKey: {
        name: "products_tags_tag_fk",
        table: "tags",
        rules: {
          onDelete: "CASCADE",
          onUpdate: "RESTRICT",
        },
        mapping: "id",
      },
    },
  });
};

exports.down = async function (db) {
  await removeForeignKey("products_tags", "products_tags_products_fk");
  await removeForeignKey("products_tags", "products_tags_tags_fk");
  return db.dropTable("products_tags");
};

exports._meta = {
  version: 1,
};
