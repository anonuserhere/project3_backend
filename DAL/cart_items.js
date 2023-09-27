const { CartItem } = require("../models");

const getCart = async (userId) => {
  return await CartItem.collection()
    .where({
      user_id: userId,
    })
    .fetch({
      require: false,
      withRelated: ["product", "product.category"],
    });
};

const getCartItemByUserAndProduct = async (userId, productId) => {
  return await CartItem.where({ user_id: userId, product_id: productId }).fetch(
    {
      require: false,
    }
  );
};

const createCartItem = async (userId, productId, quantity) => {
  try {
    const cartItem = new CartItem({
      user_id: userId,
      product_id: productId,
      quantity: quantity,
    });
    await cartItem.save();
    return cartItem;
  } catch (error) {
    console.error("error: ", error);
  }
};

const removeFromCart = async (userId, productId) => {
  let cartItem = await getCartItemByUserAndProduct(userId, productId);
  if (cartItem) {
    await cartItem.destroy();
    return true;
  }
  return false;
};

const updateQuantity = async (
  cartItem = null,
  userId = null,
  productId = null,
  newQty = null
) => {
  try {
    if (!cartItem) {
      cartItem = await getCartItemByUserAndProduct(userId, productId);
    }
    if (cartItem) {
      cartItem.set("quantity", newQty);
      await cartItem.save();
    }
  } catch (error) {
    console.error("update error: ", error);
  }
};

module.exports = {
  getCart,
  getCartItemByUserAndProduct,
  createCartItem,
  removeFromCart,
  updateQuantity,
};
