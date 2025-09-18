export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
export const API_ROUTES = {
  AUTH: `${API_BASE_URL}/api/auth`,
  CATEGORIES: `${API_BASE_URL}/api/Categories`,
  PRODUCTS:`${API_BASE_URL}/api/Products`,
  BANNERS:`${API_BASE_URL}/api/Banners`
};
