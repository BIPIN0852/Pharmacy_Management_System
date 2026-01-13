// import { combineReducers } from "redux";
// import { cartReducer } from "./reducers/cartReducers";
// import { userLoginReducer, userRegisterReducer } from "./reducers/userReducers";
// import { orderCreateReducer } from "./reducers/orderReducers"; // ✅ Add this import

// const rootReducer = combineReducers({
//   cart: cartReducer,
//   userLogin: userLoginReducer,
//   userRegister: userRegisterReducer,
//   orderCreate: orderCreateReducer, // ✅ Add this line
// });

// export default rootReducer;

import { combineReducers } from "redux";

// ✅ Updated paths to include the 'reducers' directory
// If your files are NOT in a subfolder, remove the "reducers/" part.
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
