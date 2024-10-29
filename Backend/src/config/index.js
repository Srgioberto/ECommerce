const Sequelize = require('sequelize');
const config = require('../config/db.config');

const env = process.env.NODE_ENV || 'dev';
const dbConfig = config[env];
console.log('dbConfig', dbConfig);
const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  dialect: dbConfig.dialect,
  pool: dbConfig.pool,
  define: {
    timestamps: false,
  },
});

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

// You can define models here and import them
db.User = require('../models/User.js')(sequelize);
db.Cart = require('../models/Cart.js')(sequelize);
db.Category = require('../models/Category.js')(sequelize);
db.Order = require('../models/Order.js')(sequelize);
db.Product = require('../models/Product.js')(sequelize);
db.CartItem = require('../models/CartItem.js')(sequelize);
db.OrderItem = require('../models/OrderItem.js')(sequelize);

const { User, Cart, Category, Order, Product, CartItem, OrderItem } =
  sequelize.models;

// 1 User - 1 Cart
User.hasOne(Cart);
Cart.belongsTo(User);

// 1 Cart - M CartItem
Cart.hasMany(CartItem);
CartItem.belongsTo(Cart);

// 1 Product - M CartItem
Product.hasMany(CartItem);
CartItem.belongsTo(Product);

// 1 Category - M Products
Category.hasMany(Product);
Product.belongsTo(Category);
// N Category - M Products
// Category.hasMany(Product);
// Product.hasMany(Category);

// 1 User - M Orders
User.hasMany(Order);
Order.belongsTo(User);

// 1 Order - M OrderItem
Order.hasMany(OrderItem);
OrderItem.belongsTo(Order);

// 1 Product- M OrderItem
Product.hasMany(OrderItem);
OrderItem.belongsTo(Product);

module.exports = { ...sequelize.models, db };
