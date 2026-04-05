import {
  CART_ADD_ITEM,
  CART_REMOVE_ITEM,
  CART_SAVE_SHIPPING_ADDRESS,
  CART_SAVE_PAYMENT_METHOD,
  CART_CLEAR_ITEMS,
  CART_RESET,
} from "../constants/cartConstants";

/**
 * Cart Reducer handles the state for the shopping basket,
 * shipping details, and payment preferences.
 */
export const cartReducer = (
  state = { cartItems: [], shippingAddress: {}, paymentMethod: "Khalti" },
  action,
) => {
  switch (action.type) {
    case CART_ADD_ITEM:
      const item = action.payload;

      // Find if item already exists in cart with the SAME unit (e.g., Tablets vs Strips)
      const existItem = state.cartItems.find(
        (x) => x.product === item.product && x.unit === item.unit,
      );

      if (existItem) {
        return {
          ...state,
          cartItems: state.cartItems.map((x) =>
            x.product === existItem.product && x.unit === existItem.unit
              ? { ...item, qty: existItem.qty + item.qty } // Cumulative quantity
              : x,
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
        // Checks both 'product' and 'medicine' keys
        // to guarantee no ghost items are left behind in the array.
        cartItems: state.cartItems.filter(
          (x) => x.product !== action.payload && x.medicine !== action.payload,
        ),
      };

    case CART_SAVE_SHIPPING_ADDRESS:
      return {
        ...state,
        shippingAddress: action.payload,
      };

    case CART_SAVE_PAYMENT_METHOD:
      return {
        ...state,
        paymentMethod: action.payload,
      };

    // Replaces EMPTY_CART to match cartConstants
    case CART_CLEAR_ITEMS:
    case CART_RESET:
      return {
        ...state,
        cartItems: [],
      };

    default:
      return state;
  }
};
