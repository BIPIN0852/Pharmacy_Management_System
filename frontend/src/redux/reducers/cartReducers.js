// import {
//   SAVE_PAYMENT_METHOD,
//   ADD_TO_CART,
//   REMOVE_FROM_CART,
//   UPDATE_CART_QTY,
//   EMPTY_CART,
//   SAVE_SHIPPING_ADDRESS,
//   CART_SET_ITEMS, // ✅ NEW
// } from "../actions/cartActions";

// const initialState = {
//   cartItems: [],
//   shippingAddress: {},
//   paymentMethod: "COD",
// };

// export const cartReducer = (state = initialState, action) => {
//   switch (action.type) {
//     case ADD_TO_CART: {
//       const item = action.payload;
//       const existItem = state.cartItems.find(
//         (x) => x.medicine === item.medicine || x._id === item._id
//       );

//       if (existItem) {
//         return {
//           ...state,
//           cartItems: state.cartItems.map((x) =>
//             x.medicine === existItem.medicine || x._id === existItem._id
//               ? { ...item, qty: (x.qty || 1) + (item.qty || 1) }
//               : x
//           ),
//         };
//       } else {
//         return {
//           ...state,
//           cartItems: [...state.cartItems, { ...item, qty: item.qty || 1 }],
//         };
//       }
//     }

//     case REMOVE_FROM_CART:
//       return {
//         ...state,
//         cartItems: state.cartItems.filter(
//           (x) => x.medicine !== action.payload && x._id !== action.payload
//         ),
//       };

//     case UPDATE_CART_QTY: {
//       const { productId, qty } = action.payload;
//       return {
//         ...state,
//         cartItems: state.cartItems.map((x) =>
//           x.medicine === productId || x._id === productId
//             ? { ...x, qty: qty > 0 ? qty : 1 }
//             : x
//         ),
//       };
//     }

//     case EMPTY_CART:
//       return {
//         ...initialState,
//         shippingAddress: state.shippingAddress,
//         paymentMethod: state.paymentMethod,
//       };

//     case SAVE_SHIPPING_ADDRESS:
//       return {
//         ...state,
//         shippingAddress: action.payload,
//       };

//     case SAVE_PAYMENT_METHOD:
//       return {
//         ...state,
//         paymentMethod: action.payload,
//       };

//     // ✅ NEW: replace cart items from storage / initial load
//     case CART_SET_ITEMS:
//       return {
//         ...state,
//         cartItems: Array.isArray(action.payload) ? action.payload : [],
//       };

//     default:
//       return state;
//   }
// };

import {
  CART_ADD_ITEM,
  CART_REMOVE_ITEM,
  CART_SAVE_SHIPPING_ADDRESS,
  CART_SAVE_PAYMENT_METHOD,
  CART_CLEAR_ITEMS,
} from "../constants/cartConstants";

export const cartReducer = (
  state = { cartItems: [], shippingAddress: {} },
  action
) => {
  switch (action.type) {
    case CART_ADD_ITEM:
      const item = action.payload;
      const existItem = state.cartItems.find((x) => x.product === item.product);

      if (existItem) {
        return {
          ...state,
          cartItems: state.cartItems.map((x) =>
            x.product === existItem.product ? item : x
          ),
        };
      } else {
        return {
          ...state,
          cartItems: [...state.cartItems, item],
        };
      }

    case CART_REMOVE_ITEM:
      return {
        ...state,
        cartItems: state.cartItems.filter((x) => x.product !== action.payload),
      };

    case CART_SAVE_SHIPPING_ADDRESS:
      return { ...state, shippingAddress: action.payload };

    case CART_SAVE_PAYMENT_METHOD:
      return { ...state, paymentMethod: action.payload };

    case CART_CLEAR_ITEMS:
      return { ...state, cartItems: [] };

    default:
      return state;
  }
};
