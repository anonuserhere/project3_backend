const cartDataLayer = require("../DAL/cart_items");

const getCart = async (userId) => {
  if (!userId) {
    throw "No userId provided";
  }
  return await cartDataLayer.getCart(userId);
};

const addToCart = async (userId, productId, quantity) => {
  try {
    console.log("userid: ", userId, "productid: ", productId);
    let cartItem = await cartDataLayer.getCartItemByUserAndProduct(
      userId,
      productId
    );
    console.log("cartItem:", cartItem);
    if (cartItem) {
      let newQty = cartItem.get("quantity") + 1;
      await cartDataLayer.updateQuantity(cartItem, newQty);
    } else {
      return await cartDataLayer.createCartItem(userId, productId, quantity);
    }
  } catch (err) {
    console.error("cart error: ", err);
  }
};

const removeFromCart = async (userId, productId) => {
  await cartDataLayer.removeFromCart(userId, productId);
};

const setQuantity = async (userId, productId, newQty) => {
  await cartDataLayer.updateQuantity(
    (cartItem = null),
    userId,
    productId,
    newQty
  );
};

module.exports = { removeFromCart, setQuantity, addToCart, getCart };
