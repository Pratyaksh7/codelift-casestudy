import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import rootReducer from './reducers';

// TODO: remove devtools in production
var store = createStore(
  rootReducer,
  applyMiddleware(thunk)
);

export default store;
