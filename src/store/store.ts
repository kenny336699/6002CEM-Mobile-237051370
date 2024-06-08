import {combineReducers, configureStore} from '@reduxjs/toolkit';
import {createLogger} from 'redux-logger';
import {persistReducer, persistStore} from 'redux-persist';

import {persistConfig} from './redux-persist';
import citiesReducer from '../reducers/citiesReducer';
import appReducer from '../reducers/appReducer';
const logger = createLogger({
  // ...options
});

const rootReducer = combineReducers({
  cities: citiesReducer,
  app: appReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: getDefaultMiddleware => {
    const middlewares = getDefaultMiddleware({serializableCheck: false});

    return middlewares;
  },
  devTools: {latency: 0},
});

export const persistor = persistStore(store);

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
