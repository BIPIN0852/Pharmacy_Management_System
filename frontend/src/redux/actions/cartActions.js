import {
  CART_ADD_ITEM,
  CART_REMOVE_ITEM,
  CART_SAVE_SHIPPING_ADDRESS,
  CART_SAVE_PAYMENT_METHOD,
  CART_CLEAR_ITEMS,
} from "../constants/cartConstants";

/**
 * Add item to cart (with quantity handling & unit support)
 * Normalizes item data for consistent state management
 */
export const addToCart = (item) => (dispatch, getState) => {
  // ✅ STRICT VALIDATION: Ensure we actually have an ID before dispatching
  const productId = item.medicine || item._id || item.id || item.product;

  if (!productId) {
    console.error("Attempted to add invalid item to cart:", item);
    return; // Prevent "ghost" items from entering Redux
  }

  const payload = {
    product: productId, // Standardized ID key for Redux
    medicine: productId, // Added for backward compatibility with your components
    name: item.name || "Unknown Item",
    image: item.image || "",
    price: Number(item.price) || 0,
    countInStock: Number(item.countInStock || item.stock || 0),
    qty: Number(item.qty) || 1,
    unit: item.unit || "Tablet",
    buyingMultiplier: Number(item.buyingMultiplier) || 1,
    prescriptionRequired: item.prescriptionRequired || false,
  };

  dispatch({
    type: CART_ADD_ITEM,
    payload: payload,
  });

  // Save cart to localStorage for persistence
  localStorage.setItem("cartItems", JSON.stringify(getState().cart.cartItems));
};

/**
 * Remove item from cart
 */
export const removeFromCart = (productId) => (dispatch, getState) => {
  if (!productId) return;

  dispatch({
    type: CART_REMOVE_ITEM,
    payload: productId,
  });

  localStorage.setItem("cartItems", JSON.stringify(getState().cart.cartItems));
};

/**
 * Update cart quantity of a specific product
 */
export const updateCartQuantity = (item, qty) => (dispatch, getState) => {
  const productId = item.medicine || item._id || item.id || item.product;
  if (!productId) return;

  dispatch({
    type: CART_ADD_ITEM,
    payload: {
      ...item,
      product: productId,
      medicine: productId,
      qty: Number(qty),
    },
  });

  localStorage.setItem("cartItems", JSON.stringify(getState().cart.cartItems));
};

/**
 * Empty the entire cart (After successful checkout or Logout)
 */
export const emptyCart = () => (dispatch) => {
  dispatch({
    type: CART_CLEAR_ITEMS,
  });

  localStorage.removeItem("cartItems");
};

/**
 * Save shipping address to state and storage
 */
export const saveShippingAddress = (data) => (dispatch) => {
  dispatch({
    type: CART_SAVE_SHIPPING_ADDRESS,
    payload: data,
  });

  localStorage.setItem("shippingAddress", JSON.stringify(data));
};

/**
 * Save payment method to state and storage
 */
export const savePaymentMethod = (paymentMethod) => (dispatch) => {
  dispatch({
    type: CART_SAVE_PAYMENT_METHOD,
    payload: paymentMethod,
  });

  localStorage.setItem("paymentMethod", paymentMethod);
};
