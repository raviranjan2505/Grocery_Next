export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
export const API_ROUTES = {
  AUTH: `${API_BASE_URL}/api/auth`,
  CATEGORIES: `${API_BASE_URL}/api/Categories`,
  PRODUCTS:`${API_BASE_URL}/api/Products`,
  BANNERS:`${API_BASE_URL}/api/Banners`,
  ADDRESS:`${API_BASE_URL}/api/member/Address`,
  ORDERS:`${API_BASE_URL}/api/member/orders`,
  CHECKOUTS:`${API_BASE_URL}/api/checkout`,
  CARTS:`${API_BASE_URL}/api/Cart`
};
