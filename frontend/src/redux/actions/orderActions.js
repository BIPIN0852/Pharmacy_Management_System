// import axios from "axios";
// import {
//   ORDER_CREATE_REQUEST,
//   ORDER_CREATE_SUCCESS,
//   ORDER_CREATE_FAIL,
// } from "../constants/orderConstants";
// import { CART_CLEAR_ITEMS } from "../constants/cartConstants";

// const API_BASE_URL = "http://localhost:5000/api";

// export const createOrder = (order) => async (dispatch, getState) => {
//   try {
//     dispatch({ type: ORDER_CREATE_REQUEST });

//     const {
//       userLogin: { userInfo },
//     } = getState();

//     const config = {
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: `Bearer ${userInfo.token}`,
//       },
//     };

//     const { data } = await axios.post(`${API_BASE_URL}/orders`, order, config);

//     dispatch({
//       type: ORDER_CREATE_SUCCESS,
//       payload: data,
//     });

//     // Optional: Clear cart after successful order placement
//     // dispatch({ type: CART_CLEAR_ITEMS });
//     // localStorage.removeItem("cartItems");
//   } catch (error) {
//     dispatch({
//       type: ORDER_CREATE_FAIL,
//       payload:
//         error.response && error.response.data.message
//           ? error.response.data.message
//           : error.message,
//     });
//   }
// };

import {
  ORDER_CREATE_REQUEST,
  ORDER_CREATE_SUCCESS,
  ORDER_CREATE_FAIL,
} from "../constants/orderConstants";
import { EMPTY_CART } from "./cartActions"; // Import your standardized cart action
import api from "../services/api"; // ✅ Use the configured api service with interceptors

/**
 * Create a new medicine order
 * The 'api' service automatically handles the Authorization token via interceptors
 */
export const createOrder = (order) => async (dispatch) => {
  try {
    dispatch({ type: ORDER_CREATE_REQUEST });

    // ✅ Using the api service - it already knows the base URL and the User Token
    const data = await api.post("/orders", order);

    dispatch({
      type: ORDER_CREATE_SUCCESS,
      payload: data,
    });

    // ✅ Clear cart after successful order placement
    // This keeps the Redux state and LocalStorage in sync
    dispatch({ type: EMPTY_CART });
    localStorage.removeItem("cartItems");
  } catch (error) {
    dispatch({
      type: ORDER_CREATE_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};
