import { configureStore } from '@reduxjs/toolkit'

import authReducer from './features/auth/authSlice'
import cartReducer from './features/cartSlice'
import authApi from './features/auth/authApi'
import productsApi from './features/productsApi'
import reviewsApi from './features/reviewsApi'
import ordersApi from './features/ordersApi'
import statsApi from './features/statsApi'

export const store = configureStore({
	reducer: {
		auth: authReducer,
		cart: cartReducer,

		[authApi.reducerPath]: authApi.reducer,
		[productsApi.reducerPath]: productsApi.reducer,
		[reviewsApi.reducerPath]: reviewsApi.reducer,
		[ordersApi.reducerPath]: ordersApi.reducer,
		[statsApi.reducerPath]: statsApi.reducer,
	},
	middleware: (getDefaultMiddleware) =>
		getDefaultMiddleware().concat(
			authApi.middleware,
			productsApi.middleware,
			reviewsApi.middleware,
			ordersApi.middleware,
			statsApi.middleware
		),
}) 
