// import {
//   ORDER_CREATE_REQUEST,
//   ORDER_CREATE_SUCCESS,
//   ORDER_CREATE_FAIL,
//   ORDER_CREATE_RESET,
// } from "../constants/orderConstants";

// export const orderCreateReducer = (state = {}, action) => {
//   switch (action.type) {
//     case ORDER_CREATE_REQUEST:
//       return { loading: true };
//     case ORDER_CREATE_SUCCESS:
//       return { loading: false, success: true, order: action.payload };
//     case ORDER_CREATE_FAIL:
//       return { loading: false, error: action.payload };
//     case ORDER_CREATE_RESET:
//       return {};
//     default:
//       return state;
//   }
// };

// frontend/src/redux/reducers/orderReducers.js
import {
  ORDER_CREATE_REQUEST,
  ORDER_CREATE_SUCCESS,
  ORDER_CREATE_FAIL,
  ORDER_CREATE_RESET,
  ORDER_LIST_MY_REQUEST,
  ORDER_LIST_MY_SUCCESS,
  ORDER_LIST_MY_FAIL,
  ORDER_LIST_MY_RESET,
} from "../constants/orderConstants";

/**
 * Handles the state for creating a new order
 */
export const orderCreateReducer = (state = {}, action) => {
  switch (action.type) {
    case ORDER_CREATE_REQUEST:
      return { loading: true };
    case ORDER_CREATE_SUCCESS:
      return { loading: false, success: true, order: action.payload };
    case ORDER_CREATE_FAIL:
      return { loading: false, error: action.payload };
    case ORDER_CREATE_RESET:
      return {};
    default:
      return state;
  }
};

/**
 * Handles the state for fetching the logged-in user's order history
 * Used in OrderHistory.jsx
 */
export const orderListMyReducer = (state = { orders: [] }, action) => {
  switch (action.type) {
    case ORDER_LIST_MY_REQUEST:
      return { loading: true };
    case ORDER_LIST_MY_SUCCESS:
      return { loading: false, orders: action.payload };
    case ORDER_LIST_MY_FAIL:
      return { loading: false, error: action.payload };
    case ORDER_LIST_MY_RESET:
      return { orders: [] };
    default:
      return state;
  }
};
