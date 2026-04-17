import { combineReducers } from 'redux';
import authReducer from './authReducer';
import productReducer from './productReducer';
import orderReducer from './orderReducer';
import userReducer from './userReducer';
import analyticsReducer from './analyticsReducer';
import inventoryReducer from './inventoryReducer';
import couponReducer from './couponReducer';
import settingsReducer from './settingsReducer';
import notificationReducer from './notificationReducer';

export default combineReducers({
  auth: authReducer,
  products: productReducer,
  orders: orderReducer,
  users: userReducer,
  analytics: analyticsReducer,
  inventory: inventoryReducer,
  coupons: couponReducer,
  settings: settingsReducer,
  notifications: notificationReducer,
});
