// // frontend/src/redux/store.js

// import { createStore, combineReducers, applyMiddleware } from "redux";
// import thunk from "redux-thunk";
// //import { composeWithDevTools } from "redux-devtools-extension";
// import { cartReducer } from "./reducers/cartReducer";
// // import other reducers as needed (e.g., userReducer, orderReducer, etc.)

// const rootReducer = combineReducers({
//   cart: cartReducer,
//   // other reducers here
// });

// // Initialize state from localStorage if available
// const cartItemsFromStorage = localStorage.getItem("cartItems")
//   ? JSON.parse(localStorage.getItem("cartItems"))
//   : [];

// const shippingAddressFromStorage = localStorage.getItem("shippingAddress")
//   ? JSON.parse(localStorage.getItem("shippingAddress"))
//   : {};

// const paymentMethodFromStorage = localStorage.getItem("paymentMethod")
//   ? localStorage.getItem("paymentMethod")
//   : "";

// const initialState = {
//   cart: {
//     cartItems: cartItemsFromStorage,
//     shippingAddress: shippingAddressFromStorage,
//     paymentMethod: paymentMethodFromStorage,
//   },
//   // initialize other slices if needed
// };

// const middleware = [thunk];

// const store = createStore(
//   rootReducer,
//   initialState,
//   composeWithDevTools(applyMiddleware(...middleware))
// );

// export default store;

// frontend/src/redux/store.js

// import { configureStore, combineReducers } from "@reduxjs/toolkit";
// import thunk from "redux-thunk";
// import { cartReducer } from "./reducers/cartReducer";
// // import other reducers as needed (e.g., userReducer, orderReducer, etc.)

// const rootReducer = combineReducers({
//   cart: cartReducer,
//   // other reducers here
// });

// // Initialize state from localStorage if available
// const cartItemsFromStorage = localStorage.getItem("cartItems")
//   ? JSON.parse(localStorage.getItem("cartItems"))
//   : [];

// const shippingAddressFromStorage = localStorage.getItem("shippingAddress")
//   ? JSON.parse(localStorage.getItem("shippingAddress"))
//   : {};

// const paymentMethodFromStorage = localStorage.getItem("paymentMethod")
//   ? localStorage.getItem("paymentMethod")
//   : "";

// const initialState = {
//   cart: {
//     cartItems: cartItemsFromStorage,
//     shippingAddress: shippingAddressFromStorage,
//     paymentMethod: paymentMethodFromStorage,
//   },
// };

// const middleware = [thunk];

// const store = configureStore({
//   reducer: rootReducer,
//   middleware: (getDefaultMiddleware) =>
//     getDefaultMiddleware().concat(middleware),
//   preloadedState: initialState,
//   devTools: process.env.NODE_ENV !== "production", // enable devtools conditionally
// });

// export default store;

// frontend/src/redux/store.js

import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { cartReducer } from "./reducers/cartReducer";
// import other reducers as needed

const rootReducer = combineReducers({
  cart: cartReducer,
  // other reducers
});

// Initialize state from localStorage
const cartItemsFromStorage = localStorage.getItem("cartItems")
  ? JSON.parse(localStorage.getItem("cartItems"))
  : [];

const shippingAddressFromStorage = localStorage.getItem("shippingAddress")
  ? JSON.parse(localStorage.getItem("shippingAddress"))
  : {};

const paymentMethodFromStorage = localStorage.getItem("paymentMethod") || "";

const initialState = {
  cart: {
    cartItems: cartItemsFromStorage,
    shippingAddress: shippingAddressFromStorage,
    paymentMethod: paymentMethodFromStorage,
  },
};

const store = configureStore({
  reducer: rootReducer,
  preloadedState: initialState,
  devTools: process.env.NODE_ENV !== "production",
});

export default store;
