const knex = require("knex")({
  client: process.env.DB_DRIVER,
  connection: {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    host: process.env.DB_HOST,
  },
});

const bookshelf = require("bookshelf")(knex);

console.log(`MySQL Connection Configuration: 
DB: ${knex.client.config.connection.database}
Host: ${knex.client.config.connection.host}`);

module.exports = bookshelf;
