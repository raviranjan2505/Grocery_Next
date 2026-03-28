// data.d.ts - Type definitions matching backend services schemas

// Product related
export interface ProductImage {
  id: number;
  productId: number;
  url: string;
  isDefault: boolean;
  hash?: string;
  publicId?: string;
}

export interface ProductAttribute {
  id: number;
  productId: number;
  attributeId: number;
  value: string;
  attribute: {
    id: number;
    name: string;
  };
}

export interface ProductVariant {
  id: number;
  productId: number;
  sku: string;
  price: number;
  stock: number;
  attributes?: any;
}

export interface Brand {
  id: number;
  name: string;
  logo?: string;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  image?: string;
  active: boolean;
  parentId?: number;
  subcategories?: Category[];
}

export interface Product {
  id: number;
  productCode: string;
  productName: string;
  shortDescription?: string;
  fullDescription?: string;
  details?: string;
  gstPercentage: number;
  categoryId: number;
  subCategoryId?: number;
  subCategoryId2?: number;
  brandId?: number;
  brandName?: string;
  mrp: number;
  dp: number;
  stockQuantity: number;
  productSlug: string;
  defaultImage?: string;
  category: Category;
  brand?: Brand;
  variants: ProductVariant[];
  images: ProductImage[];
  attributes: ProductAttribute[];
  discounts?: any[];
}

// Alias for detailed product
export type ProductDetails = Product;

// Slider product for home page
export interface SliderProduct {
  id: number;
  categoryId: string;
  title: string;
  subtitle: string;
  slag: string;
  price: number;
  img: string;
  deliveryTime?: string;
}

// Category response for lists is just Category
// export interface CategoryResponse extends Category {}

// Banner
export interface Banner {
  id: number;
  imgId?: number;
  imgName?: string;
  bannerTypeName?: string;
  title: string;
  image?: string;
  imagePublicId?: string;
  imgUrl?: string;
  isActive?: boolean;
  categoryId?: number;
  productId?: number;
  createdAt: string;
  updatedAt: string;
}

// Address
export interface Address {
  id?: number;
  userId?: number;
  fullName?: string;
  name?: string;
  phone?: string;
  mobile?: string;
  address1?: string;
  fullAddress?: string;
  address2?: string;
  city: string;
  state: string;
  country?: string;
  pincode: string;
  locality?: string;
  landmark?: string;
  alternatePhone?: string;
  type?: 'HOME' | 'WORK' | 'OTHER';
  addressType?: 'HOME' | 'WORK' | 'OTHER';
  isDefault?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

// Cart
export interface CartItem {
  id: number;
  cartId?: number;
  productId: string;
  quantity: number;
  price?: number;
  dp?: string;
  name?: string;
  image?: string;
  productName?: string;
}

export interface Cart {
  id: number;
  userId: number;
  items: CartItem[];
  createdAt: string;
  updatedAt: string;
}

// Cart response from API
export interface CartResponse {
  success: boolean;
  data: Cart;
}

// Cart total (calculated on frontend)
export interface CartTotal {
  subTotal: number;
  discount: number;
  tax: number;
  shipping: number;
  payableAmt: number;
}

// Order
export interface OrderItem {
  id: number;
  orderId: number;
  productId: string;
  name?: string;
  image?: string;
  price: number;
  quantity: number;
}

export interface Order {
  id: number;
  userId: number;
  totalAmount: number;
  status: 'PENDING' | 'CREATED' | 'PAID' | 'FULFILLED' | 'CANCELLED' | 'REFUNDED';
  deliveryName: string;
  deliveryPhone: string;
  deliveryAddress: string;
  deliveryCity: string;
  deliveryState: string;
  deliveryCountry: string;
  deliveryPincode: string;
  createdAt: string;
  updatedAt: string;
  items: OrderItem[];
}

// Order Detail (same as Order)
export type OrderDetail = Order;

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
}