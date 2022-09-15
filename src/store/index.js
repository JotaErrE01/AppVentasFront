import {
  useDispatch as useReduxDispatch,
  useSelector as useReduxSelector
} from 'react-redux';
import { persistReducer } from 'redux-persist'
import thunk from 'redux-thunk'
import { configureStore } from '@reduxjs/toolkit';
import { ENABLE_REDUX_DEV_TOOLS } from 'src/constants';
import rootReducer from './rootReducer';
import storage from 'redux-persist/lib/storage'

const persistConfig = {
  key: 'root',
  storage
};

const persistedReducer = persistReducer(persistConfig, rootReducer);


const store = configureStore({
  // reducer: persistedReducer,
  reducer:rootReducer,
  devTools: ENABLE_REDUX_DEV_TOOLS,
  middleware: [thunk]
});

export const useSelector = useReduxSelector;

export const useDispatch = () => useReduxDispatch();

export default store;




