const API_URL = process.env.NEXT_PUBLIC_API_URL;
const VERSION = process.env.NEXT_PUBLIC_API_VERSION;
const endPoints = {
  auth: {
    login: (email, password) => `${API_URL}/api/${VERSION}/auth/login?email=${email}&password=${password}`,
    profile: `${API_URL}/api/${VERSION}/auth/profile`,
  },
  products: {
    getProduct: (id) => `${API_URL}/api/${VERSION}/products/${id}`,
    getProducts: (limit, offset) => `${API_URL}/api/${VERSION}/products?limit=${limit}&offset=${offset}`,
    putProduct: (id) => `${API_URL}/api/${VERSION}/products/${id}`,
    deleteProduct: (id) => `${API_URL}/api/${VERSION}/products/${id}`,
    postProducts: `${API_URL}/api/${VERSION}/products`,
  },
  users: {
    getUsers: `${API_URL}/api/${VERSION}/users`,
    postUsers: `${API_URL}/api/${VERSION}/users`,
  },
  categories: {
    getCategories: (limit) => `${API_URL}/api/${VERSION}/categories?limit=${limit}`,
    postCategories: `${API_URL}/api/${VERSION}/categories`,
    getCategory: (id) => `${API_URL}/api/${VERSION}/categories/${id}`,
    putCategory: (id) => `${API_URL}/api/${VERSION}/categories/${id}`,
    deleteCategory: (id) => `${API_URL}/api/${VERSION}/categories/${id}`,
    getProductsFromCategory: (id, limit, offset) => `${API_URL}/api/${VERSION}/categories/${id}/products?limit=${limit}&offset=${offset}`,
  },
  files: {
    getFile: (filename) => `${API_URL}/api/${VERSION}/files/${filename}`,
    postFile: `${API_URL}/api/${VERSION}/files/upload`,
  },
};

export default endPoints;
