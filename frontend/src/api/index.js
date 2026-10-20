import axiosClient from './axiosClient';

export const authApi = {
  login: (credentials) => axiosClient.post('/auth/login', credentials),
  register: (data) => axiosClient.post('/auth/register', data),
  getMe: () => axiosClient.get('/auth/me'),
  updateProfile: (data) => axiosClient.put('/users/profile', data),
};

export const storeApi = {
  getStores: (query) => axiosClient.get('/stores', { params: { query } }),
  getStoreById: (id) => axiosClient.get(`/stores/${id}`),
  getStoreProducts: (storeId, params) => axiosClient.get(`/stores/${storeId}/products`, { params }),
  getStorePickupSlots: (storeId) => axiosClient.get(`/stores/${storeId}/pickup-slots`),
};

export const categoryApi = {
  getCategories: () => axiosClient.get('/categories'),
};

export const cartApi = {
  getCart: () => axiosClient.get('/cart'),
  addItem: (data) => axiosClient.post('/cart/items', data),
  updateQuantity: (itemId, quantity) => axiosClient.patch(`/cart/items/${itemId}`, { quantity }),
  removeItem: (itemId) => axiosClient.delete(`/cart/items/${itemId}`),
  clearCart: () => axiosClient.delete('/cart'),
};

export const orderApi = {
  previewOrder: (pickupSlotId, couponCode) => axiosClient.post('/orders/preview', null, { params: { pickupSlotId, couponCode } }),
  placeOrder: (data) => axiosClient.post('/orders', data),
  getMyOrders: () => axiosClient.get('/orders/my'),
  getOrderById: (orderId) => axiosClient.get(`/orders/${orderId}`),
  cancelOrder: (orderId) => axiosClient.patch(`/orders/${orderId}/cancel`),
  getCustomerDashboard: () => axiosClient.get('/customer/dashboard'),
};

export const couponApi = {
  getAvailableCoupons: (params) => axiosClient.get('/coupons/available', { params }),
  validateCoupon: (data) => axiosClient.post('/coupons/validate', data),
  getAllCoupons: () => axiosClient.get('/coupons'),
  getStoreCoupons: (storeId) => axiosClient.get(`/coupons/store/${storeId}`),
  getCouponById: (id) => axiosClient.get(`/coupons/${id}`),
  createCoupon: (data) => axiosClient.post('/coupons', data),
  updateCoupon: (id, data) => axiosClient.put(`/coupons/${id}`, data),
  toggleCouponStatus: (id) => axiosClient.patch(`/coupons/${id}/toggle`),
  deleteCoupon: (id) => axiosClient.delete(`/coupons/${id}`),
};

export const shopkeeperApi = {
  getStore: () => axiosClient.get('/shopkeeper/store'),
  createStore: (data) => axiosClient.post('/shopkeeper/store', data),
  updateStore: (data) => axiosClient.put('/shopkeeper/store', data),
  getProducts: () => axiosClient.get('/shopkeeper/products'),
  addProduct: (data) => axiosClient.post('/shopkeeper/products', data),
  updateProduct: (id, data) => axiosClient.put(`/shopkeeper/products/${id}`, data),
  deleteProduct: (id) => axiosClient.delete(`/shopkeeper/products/${id}`),
  getOrders: (status) => axiosClient.get('/shopkeeper/orders', { params: { status } }),
  updateOrderStatus: (orderId, status) => axiosClient.patch(`/shopkeeper/orders/${orderId}/status`, { status }),
  getPickupSlots: () => axiosClient.get('/shopkeeper/pickup-slots'),
  createPickupSlot: (data) => axiosClient.post('/shopkeeper/pickup-slots', data),
  deletePickupSlot: (slotId) => axiosClient.delete(`/shopkeeper/pickup-slots/${slotId}`),
  getDashboard: () => axiosClient.get('/shopkeeper/dashboard'),
};

export const adminApi = {
  getDashboard: () => axiosClient.get('/admin/dashboard'),
  getStores: (status) => axiosClient.get('/admin/stores', { params: { status } }),
  updateStoreApproval: (storeId, status) => axiosClient.patch(`/admin/stores/${storeId}/approval`, null, { params: { status } }),
  toggleStoreStatus: (storeId) => axiosClient.patch(`/admin/stores/${storeId}/status`),
  getCategories: () => axiosClient.get('/admin/categories'),
  createCategory: (data) => axiosClient.post('/admin/categories', data),
  updateCategory: (id, data) => axiosClient.put(`/admin/categories/${id}`, data),
  toggleCategoryStatus: (id) => axiosClient.patch(`/admin/categories/${id}/status`),
  getUsers: () => axiosClient.get('/admin/users'),
  toggleUserStatus: (userId) => axiosClient.patch(`/admin/users/${userId}/status`),
  getAllOrders: () => axiosClient.get('/admin/orders'),
};
