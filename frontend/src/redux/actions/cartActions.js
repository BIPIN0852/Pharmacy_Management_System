// frontend/src/redux/actions/cartActions.js

export const ADD_TO_CART = "ADD_TO_CART";
export const REMOVE_FROM_CART = "REMOVE_FROM_CART";
export const UPDATE_CART_QTY = "UPDATE_CART_QTY";
export const EMPTY_CART = "EMPTY_CART";
export const SAVE_SHIPPING_ADDRESS = "SAVE_SHIPPING_ADDRESS";
export const SAVE_PAYMENT_METHOD = "SAVE_PAYMENT_METHOD";
// ✅ NEW: set full cart from storage
export const CART_SET_ITEMS = "CART_SET_ITEMS";

// Add item to cart (with quantity handling)
export const addToCart = (item) => (dispatch, getState) => {
  dispatch({
    type: ADD_TO_CART,
    payload: item,
  });

  // Save cart to localStorage
  localStorage.setItem("cartItems", JSON.stringify(getState().cart.cartItems));
};

// Remove item from cart
export const removeFromCart = (productId) => (dispatch, getState) => {
  dispatch({
    type: REMOVE_FROM_CART,
    payload: productId,
  });

  localStorage.setItem("cartItems", JSON.stringify(getState().cart.cartItems));
};

// Update cart quantity of a specific product
export const updateCartQuantity = (productId, qty) => (dispatch, getState) => {
  dispatch({
    type: UPDATE_CART_QTY,
    payload: { productId, qty },
  });

  localStorage.setItem("cartItems", JSON.stringify(getState().cart.cartItems));
};

// Empty the entire cart
export const emptyCart = () => (dispatch) => {
  dispatch({
    type: EMPTY_CART,
  });

  localStorage.removeItem("cartItems");
};

// ✅ NEW: hydrate cart from localStorage (used in Cart.jsx useEffect)
export const setCartFromStorage = (items) => (dispatch) => {
  dispatch({
    type: CART_SET_ITEMS,
    payload: items || [],
  });
};

// Save shipping address
export const saveShippingAddress = (data) => (dispatch) => {
  dispatch({
    type: SAVE_SHIPPING_ADDRESS,
    payload: data,
  });

  localStorage.setItem("shippingAddress", JSON.stringify(data));
};

// Save payment method
export const savePaymentMethod = (paymentMethod) => (dispatch) => {
  dispatch({
    type: SAVE_PAYMENT_METHOD,
    payload: paymentMethod,
  });

  localStorage.setItem("paymentMethod", paymentMethod);
};
