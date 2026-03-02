// // frontend/src/redux/actions/cartActions.js

// export const ADD_TO_CART = "ADD_TO_CART";
// export const REMOVE_FROM_CART = "REMOVE_FROM_CART";
// export const UPDATE_CART_QTY = "UPDATE_CART_QTY";
// export const EMPTY_CART = "EMPTY_CART";
// export const SAVE_SHIPPING_ADDRESS = "SAVE_SHIPPING_ADDRESS";
// export const SAVE_PAYMENT_METHOD = "SAVE_PAYMENT_METHOD";
// // ✅ NEW: set full cart from storage
// export const CART_SET_ITEMS = "CART_SET_ITEMS";

// // Add item to cart (with quantity handling)
// export const addToCart = (item) => (dispatch, getState) => {
//   dispatch({
//     type: ADD_TO_CART,
//     payload: item,
//   });

//   // Save cart to localStorage
//   localStorage.setItem("cartItems", JSON.stringify(getState().cart.cartItems));
// };

// // Remove item from cart
// export const removeFromCart = (productId) => (dispatch, getState) => {
//   dispatch({
//     type: REMOVE_FROM_CART,
//     payload: productId,
//   });

//   localStorage.setItem("cartItems", JSON.stringify(getState().cart.cartItems));
// };

// // Update cart quantity of a specific product
// export const updateCartQuantity = (productId, qty) => (dispatch, getState) => {
//   dispatch({
//     type: UPDATE_CART_QTY,
//     payload: { productId, qty },
//   });

//   localStorage.setItem("cartItems", JSON.stringify(getState().cart.cartItems));
// };

// // Empty the entire cart
// export const emptyCart = () => (dispatch) => {
//   dispatch({
//     type: EMPTY_CART,
//   });

//   localStorage.removeItem("cartItems");
// };

// // ✅ NEW: hydrate cart from localStorage (used in Cart.jsx useEffect)
// export const setCartFromStorage = (items) => (dispatch) => {
//   dispatch({
//     type: CART_SET_ITEMS,
//     payload: items || [],
//   });
// };

// // Save shipping address
// export const saveShippingAddress = (data) => (dispatch) => {
//   dispatch({
//     type: SAVE_SHIPPING_ADDRESS,
//     payload: data,
//   });

//   localStorage.setItem("shippingAddress", JSON.stringify(data));
// };

// // Save payment method
// export const savePaymentMethod = (paymentMethod) => (dispatch) => {
//   dispatch({
//     type: SAVE_PAYMENT_METHOD,
//     payload: paymentMethod,
//   });

//   localStorage.setItem("paymentMethod", paymentMethod);
// };

// // frontend/src/redux/actions/cartActions.js

// export const ADD_TO_CART = "ADD_TO_CART";
// export const REMOVE_FROM_CART = "REMOVE_FROM_CART";
// export const UPDATE_CART_QTY = "UPDATE_CART_QTY";
// export const EMPTY_CART = "EMPTY_CART";
// export const SAVE_SHIPPING_ADDRESS = "SAVE_SHIPPING_ADDRESS";
// export const SAVE_PAYMENT_METHOD = "SAVE_PAYMENT_METHOD";
// // ✅ NEW: set full cart from storage
// export const CART_SET_ITEMS = "CART_SET_ITEMS";

// /**
//  * Add item to cart (with quantity handling & unit support)
//  * Normalizes item data for consistent state management
//  */
// export const addToCart = (item) => (dispatch, getState) => {
//   // Normalize the payload to ensure all necessary fields for the logic exist
//   const payload = {
//     product: item.medicine || item._id || item.id, // Standardized ID key
//     name: item.name,
//     image: item.image,
//     price: Number(item.price), // Price based on selected Unit
//     countInStock: item.countInStock || item.stock, // Total stock available
//     qty: Number(item.qty) || 1, // Quantity user wants to buy
//     unit: item.unit || "Tablet", // Default unit
//     buyingMultiplier: Number(item.buyingMultiplier) || 1, // Unit multiplier (e.g., 10 for Strips)
//     prescriptionRequired: item.prescriptionRequired || false,
//   };

//   dispatch({
//     type: ADD_TO_CART,
//     payload: payload,
//   });

//   // Save cart to localStorage
//   localStorage.setItem("cartItems", JSON.stringify(getState().cart.cartItems));
// };

// /**
//  * Remove item from cart
//  */
// export const removeFromCart = (productId) => (dispatch, getState) => {
//   dispatch({
//     type: REMOVE_FROM_CART,
//     payload: productId,
//   });

//   localStorage.setItem("cartItems", JSON.stringify(getState().cart.cartItems));
// };

// /**
//  * Update cart quantity of a specific product
//  */
// export const updateCartQuantity = (productId, qty) => (dispatch, getState) => {
//   dispatch({
//     type: UPDATE_CART_QTY,
//     payload: { productId, qty: Number(qty) },
//   });

//   localStorage.setItem("cartItems", JSON.stringify(getState().cart.cartItems));
// };

// /**
//  * Empty the entire cart (After successful checkout)
//  */
// export const emptyCart = () => (dispatch) => {
//   dispatch({
//     type: EMPTY_CART,
//   });

//   localStorage.removeItem("cartItems");
// };

// /**
//  * Hydrate cart from localStorage (used in Cart.jsx or App initialization)
//  */
// export const setCartFromStorage = (items) => (dispatch) => {
//   dispatch({
//     type: CART_SET_ITEMS,
//     payload: Array.isArray(items) ? items : [],
//   });
// };

// /**
//  * Save shipping address to state and storage
//  */
// export const saveShippingAddress = (data) => (dispatch) => {
//   dispatch({
//     type: SAVE_SHIPPING_ADDRESS,
//     payload: data,
//   });

//   localStorage.setItem("shippingAddress", JSON.stringify(data));
// };

// /**
//  * Save payment method to state and storage
//  */
// export const savePaymentMethod = (paymentMethod) => (dispatch) => {
//   dispatch({
//     type: SAVE_PAYMENT_METHOD,
//     payload: paymentMethod,
//   });

//   localStorage.setItem("paymentMethod", paymentMethod);
// };

// ✅ Import standardized constants to match the Reducer
// import {
//   CART_ADD_ITEM,
//   CART_REMOVE_ITEM,
//   CART_SAVE_SHIPPING_ADDRESS,
//   CART_SAVE_PAYMENT_METHOD,
//   CART_CLEAR_ITEMS,
// } from "../constants/cartConstants";

// /**
//  * Add item to cart (with quantity handling & unit support)
//  * Normalizes item data for consistent state management
//  */
// export const addToCart = (item) => (dispatch, getState) => {
//   // Normalize the payload to ensure all necessary fields for the logic exist
//   const payload = {
//     product: item.medicine || item._id || item.id, // Standardized ID key
//     name: item.name,
//     image: item.image,
//     price: Number(item.price), // Price based on selected Unit
//     countInStock: item.countInStock || item.stock, // Total stock available
//     qty: Number(item.qty) || 1, // Quantity user wants to buy
//     unit: item.unit || "Tablet", // Default unit
//     buyingMultiplier: Number(item.buyingMultiplier) || 1, // Unit multiplier
//     prescriptionRequired: item.prescriptionRequired || false,
//   };

//   dispatch({
//     type: "CART_ADD_ITEM",
//     payload: {
//       product: data._id,
//       name: data.name,
//       image: data.image,
//       price: data.price,
//       countInStock: data.countInStock,
//       // ✅ NEW: Tell the cart to remember if this needs a prescription
//       prescriptionRequired: data.prescriptionRequired,
//     },
//   });

//   // Save cart to localStorage for persistence
//   localStorage.setItem("cartItems", JSON.stringify(getState().cart.cartItems));
// };

// /**
//  * Remove item from cart
//  */
// export const removeFromCart = (productId) => (dispatch, getState) => {
//   dispatch({
//     type: CART_REMOVE_ITEM, // ✅ Updated to match constant
//     payload: productId,
//   });

//   localStorage.setItem("cartItems", JSON.stringify(getState().cart.cartItems));
// };

// /**
//  * Update cart quantity of a specific product
//  * Re-uses CART_ADD_ITEM logic to simplify state updates
//  */
// export const updateCartQuantity = (item, qty) => (dispatch, getState) => {
//   dispatch({
//     type: CART_ADD_ITEM,
//     payload: { ...item, qty: Number(qty) },
//   });

//   localStorage.setItem("cartItems", JSON.stringify(getState().cart.cartItems));
// };

// /**
//  * Empty the entire cart (After successful checkout)
//  */
// export const emptyCart = () => (dispatch) => {
//   dispatch({
//     type: CART_CLEAR_ITEMS, // ✅ Updated to match constant
//   });

//   localStorage.removeItem("cartItems");
// };

// /**
//  * Save shipping address to state and storage
//  */
// export const saveShippingAddress = (data) => (dispatch) => {
//   dispatch({
//     type: CART_SAVE_SHIPPING_ADDRESS, // ✅ Updated to match constant
//     payload: data,
//   });

//   localStorage.setItem("shippingAddress", JSON.stringify(data));
// };

// /**
//  * Save payment method to state and storage
//  */
// export const savePaymentMethod = (paymentMethod) => (dispatch) => {
//   dispatch({
//     type: CART_SAVE_PAYMENT_METHOD, // ✅ Updated to match constant
//     payload: paymentMethod,
//   });

//   localStorage.setItem("paymentMethod", paymentMethod);
// };

// // import axios from "axios";
// // import { CART_ADD_ITEM, CART_REMOVE_ITEM } from "../constants/cartConstants";

// // export const addToCart = (id, qty, unit) => async (dispatch, getState) => {
// //   // 1. Fetch latest medicine data
// //   const { data } = await axios.get(`/api/medicines/${id}`);

// //   // 2. Validate Stock
// //   if (data.countInStock < qty) {
// //     alert("Insufficient stock available!");
// //     return;
// //   }

// //   // 3. Dispatch to State
// //   dispatch({
// //     type: CART_ADD_ITEM,
// //     payload: {
// //       medicine: data._id,
// //       name: data.name,
// //       image: data.image,
// //       price: data.price,
// //       countInStock: data.countInStock,
// //       qty,
// //       unit,
// //     },
// //   });

// //   // 4. Persist to LocalStorage (or call Backend API to sync)
// //   localStorage.setItem("cartItems", JSON.stringify(getState().cart.cartItems));
// // };

// import {
//   CART_ADD_ITEM,
//   CART_REMOVE_ITEM,
//   CART_SAVE_SHIPPING_ADDRESS,
//   CART_SAVE_PAYMENT_METHOD,
//   CART_CLEAR_ITEMS,
// } from "../constants/cartConstants";

// /**
//  * Add item to cart (with quantity handling & unit support)
//  * Normalizes item data for consistent state management
//  */
// export const addToCart = (item) => (dispatch, getState) => {
//   // Normalize the payload to ensure all necessary fields for the logic exist
//   const payload = {
//     product: item.medicine || item._id || item.id || item.product, // Standardized ID key
//     name: item.name,
//     image: item.image,
//     price: Number(item.price), // Price based on selected Unit
//     countInStock: item.countInStock || item.stock, // Total stock available
//     qty: Number(item.qty) || 1, // Quantity user wants to buy
//     unit: item.unit || "Tablet", // Default unit
//     buyingMultiplier: Number(item.buyingMultiplier) || 1, // Unit multiplier
//     // ✅ NEW: Tell the cart to remember if this needs a prescription
//     prescriptionRequired: item.prescriptionRequired || false,
//   };

//   dispatch({
//     type: CART_ADD_ITEM, // ✅ Updated to use the imported constant
//     payload: payload, // ✅ Now correctly using the normalized payload above
//   });

//   // Save cart to localStorage for persistence
//   localStorage.setItem("cartItems", JSON.stringify(getState().cart.cartItems));
// };

// /**
//  * Remove item from cart
//  */
// export const removeFromCart = (productId) => (dispatch, getState) => {
//   dispatch({
//     type: CART_REMOVE_ITEM,
//     payload: productId,
//   });

//   localStorage.setItem("cartItems", JSON.stringify(getState().cart.cartItems));
// };

// /**
//  * Update cart quantity of a specific product
//  * Re-uses CART_ADD_ITEM logic to simplify state updates
//  */
// export const updateCartQuantity = (item, qty) => (dispatch, getState) => {
//   dispatch({
//     type: CART_ADD_ITEM,
//     payload: { ...item, qty: Number(qty) },
//   });

//   localStorage.setItem("cartItems", JSON.stringify(getState().cart.cartItems));
// };

// /**
//  * Empty the entire cart (After successful checkout)
//  */
// export const emptyCart = () => (dispatch) => {
//   dispatch({
//     type: CART_CLEAR_ITEMS,
//   });

//   localStorage.removeItem("cartItems");
// };

// /**
//  * Save shipping address to state and storage
//  */
// export const saveShippingAddress = (data) => (dispatch) => {
//   dispatch({
//     type: CART_SAVE_SHIPPING_ADDRESS,
//     payload: data,
//   });

//   localStorage.setItem("shippingAddress", JSON.stringify(data));
// };

// /**
//  * Save payment method to state and storage
//  */
// export const savePaymentMethod = (paymentMethod) => (dispatch) => {
//   dispatch({
//     type: CART_SAVE_PAYMENT_METHOD,
//     payload: paymentMethod,
//   });

//   localStorage.setItem("paymentMethod", paymentMethod);
// };

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
