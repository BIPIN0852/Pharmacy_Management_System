import { combineReducers } from "redux";
import { cartReducer } from "./reducers/cartReducers";
import {
  userLoginReducer,
  userRegisterReducer,
  userDetailsReducer,
  userUpdateProfileReducer,
} from "./reducers/userReducers";
import {
  orderCreateReducer,
  orderListMyReducer,
} from "./reducers/orderReducers";

/**
 * The Root Reducer combines all individual domain-specific reducers
 * into a single state tree used by the Redux Store.
 */
const rootReducer = combineReducers({
  // Cart State
  cart: cartReducer,

  // User & Auth State
  userLogin: userLoginReducer,
  userRegister: userRegisterReducer,
  userDetails: userDetailsReducer,
  userUpdateProfile: userUpdateProfileReducer,

  // Order State
  orderCreate: orderCreateReducer,
  orderListMy: orderListMyReducer,
});

export default rootReducer;
