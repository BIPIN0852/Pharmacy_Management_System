import { combineReducers } from "redux";
import { cartReducer } from "./reducers/cartReducers";
import { userLoginReducer, userRegisterReducer } from "./reducers/userReducers";
import { orderCreateReducer } from "./reducers/orderReducers"; // ✅ Add this import

const rootReducer = combineReducers({
  cart: cartReducer,
  userLogin: userLoginReducer,
  userRegister: userRegisterReducer,
  orderCreate: orderCreateReducer, // ✅ Add this line
});

export default rootReducer;
