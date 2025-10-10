import axiosInstance from "@/lib/axios";
import { API_ROUTES, API_BASE_URL } from "@/utils/api";
import Cookies from "js-cookie";

export interface ProductImage {
  imageName: string;
  image: string;
}

export interface ProductSpecification {
  id: number;
  pid: number;
  name: string;
  value: string;
}

// src/lib/actions/types.ts
export interface ProductDetails {
  pid: number;
  pCode: string;
  productName: string;
  categoryName: string;
  subCategoryName: string;
  details: string;
  dp: number;
  mrp: number;
  wishlistEnable: boolean;
  sellerName: string;
  maxQuantity: number;
  outstockPurchase: boolean;
  showQty: boolean;
  bv: number; 
  productImages: ProductImage[];
  productSpecifications: ProductSpecification[];
  productAttributes: any[];
}



export const getProductDetails = async (
  slag: string
): Promise<{ success: boolean; message: string; data: ProductDetails } | null> => {
  try {
    const res = await axiosInstance.get<{ success: boolean; message: string; data: ProductDetails }>(
      `${API_ROUTES.PRODUCTS}/slag/${slag}`
    );
    return res.data;
  } catch (error) {
    console.error("Error fetching product details:", error);
    return null;
  }
};


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
export interface CategoryResponse {
  categoryId: number;
  categoryName: string;
  slagurl: string;
  catimg: string | null;
  subcategories: CategoryResponse[];
}

// ✅ Get all categories
export const getCategories = async (): Promise<CategoryResponse[]> => {
  try {
    const res = await axiosInstance.get<{ data: CategoryResponse[] }>(API_ROUTES.CATEGORIES);
    return res.data.data;
  } catch (error) {
    console.error("Error fetching categories:", error);
    return [];
  }
};

// ✅ Get category by ID
export async function getCategoryById(id: number) {
  try {
    const res = await axiosInstance.get(`${API_ROUTES.CATEGORIES}/${id}`);
    return res.data;
  } catch (error) {
    console.error("Error fetching category by ID:", error);
    return null;
  }
}

// ✅ Get products by category slug
export async function getProductsBySlug(slug: string) {
  try {
    const res = await axiosInstance.get(`${API_ROUTES.PRODUCTS}/category/${slug}`);
   
    return res.data;
  } catch (error) {
    console.error("Error fetching products by slug:", error);
    return [];
  }
}

export async function getProductsBySubCategoriesSlug(slug: string, subcategoryslug:string){
  try {
    const res = await axiosInstance.get(`${API_ROUTES.PRODUCTS}/category/${slug}/${subcategoryslug}`);
    return res.data;
  }catch(error) {
    console.error("Error fetching products by subcategoryId:", error)
  }
}

export const getCategoriesForSlider = async (): Promise<
  { slug: string; name: string;  categorySlagUrl:string; products: SliderProduct[] }[]
> => {
  try {
    const res = await axiosInstance.get(`${API_ROUTES.PRODUCTS}/homeproducts`);
    const json = res.data;

    const categories = json.data.map((cat: any) => {
      const products: SliderProduct[] = cat.homeProductItems.map((p: any) => ({
        id: p.pid,
        categoryId: String(cat.categoryId ?? cat.name), 
        title: p.productName,
        subtitle: p.productCode ?? p.productSlag ?? "",
        slag: p.productSlag ?? "",
        price: p.dp,
        img: p.defaultImage?.startsWith("http")
          ? p.defaultImage
          : `${API_BASE_URL}${p.defaultImage}`,
        deliveryTime: "2-3 Days",
      }));

      return {
        slug: cat.name.toLowerCase().replace(/\s+/g, "-"),
        name: cat.name,
        categorySlagUrl:cat.categorySlagUrl,
        products,
      };
    });

    return categories;
  } catch (error) {
    console.error("Error fetching categories:", error);
    return [];
  }
};


// ✅ Get products by category slug from slider
export const getProductsByCategory = async (
  slug: string
): Promise<SliderProduct[]> => {
  const categories = await getCategoriesForSlider();
  const category = categories.find((c) => c.slug === slug);
  return category ? category.products : [];
};


// types for banners
export interface Banner {
  imgId: number;
  pid: number;
  imgName: string;
  imgUrl: string;
  defaultImg: boolean;
  isActive: boolean;
  bannerTypeId: number;
  bannerTypeName: string;
  link: number;
  linkType: number;
  displayOrder: number;
  categoryId: number;
  productId: number;
}


export const getActiveBanners = async (): Promise<Banner[]> => {
  try {
    const res = await axiosInstance.get<{ data: Banner[] }>(
      `${API_ROUTES.BANNERS}/active`
    );
    return res.data.data.map((b: Banner) => ({
      ...b,
      imgUrl: b.imgUrl.startsWith("http")
        ? b.imgUrl
        : `${API_BASE_URL}${b.imgUrl}`,
    }));
  } catch (error) {
    console.error("Error fetching banners:", error);
    return [];
  }
};



// --------------------- TYPES ---------------------
export interface Address {
  id: number
  userId?: number
  name: string
  mobile: string
  pincode: string
  locality: string
  fullAddress: string
  city: string
  state: string // <-- now store stateId
  landmark?: string
  alternatePhone?: string
  addressType: string
  isDefault: boolean
}

export interface State {
  sid: number
  cid: number
  stateName: string
  sActive: number
}

// Get all states
export const getStates = async (): Promise<State[]> => {
  try {
    const res = await axiosInstance.get<{ success: boolean; data: State[] }>(
      "https://forestgarden.nexusitsoftech.com/api/member/Address/GetStates"
    )
    if (res.data.success) {
      return res.data.data
    }
    return []
  } catch (error) {
    console.error("Error fetching states:", error)
    return []
  }
}

// Get all addresses
export const getAddresses = async (token: string): Promise<Address[]> => {
  try {
    const res = await axiosInstance.get<{ data: Address[] }>(API_ROUTES.ADDRESS, {
      headers: { Authorization: `Bearer ${token}` },
    })
    return res.data.data
  } catch (error) {
    console.error("Error fetching addresses:", error)
    return []
  }
}

// Add a new address
export const addAddress = async (
  token: string,
  address: Omit<Address, "id" | "userId">
): Promise<Address | null> => {
  try {
    const payload = {
      name: address.name,
      mobile: address.mobile,
      pincode: address.pincode,
      locality: address.locality,
      fullAddress: address.fullAddress,
      city: address.city,
      state: address.state.toString(), // <-- send SID as string
      landmark: address.landmark || "",
      alternatePhone: address.alternatePhone || "",
      addressType: address.addressType,
      isDefault: address.isDefault,
    }

    const res = await axiosInstance.post<Address>(API_ROUTES.ADDRESS, payload, {
      headers: { Authorization: `Bearer ${token}` },
    })

    return res.data
  } catch (error: any) {
    console.error("Error adding address:", error.response?.data || error.message)
    return null
  }
}


// Get address by ID
export const getAddressById = async (token: string, id: number): Promise<Address | null> => {
  try {
    const res = await axiosInstance.get<Address>(`${API_ROUTES.ADDRESS}/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    return res.data
  } catch (error) {
    console.error("Error fetching address by id:", error)
    return null
  }
}

export const updateAddress = async (
  token: string,
  address: Address // pass full Address object including id
): Promise<boolean> => {
  try {
    const res = await axiosInstance.put(
      `${API_ROUTES.ADDRESS}/${address.id}`,
      address, // send full address object
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    return res.status === 200;
  } catch (error: any) {
    console.error("Error updating address:", error.response?.data || error.message);
    return false;
  }
};



//Delete address
export const deleteAddress = async (token: string, id: number): Promise<boolean> => {
  try {
    const res = await axiosInstance.delete(`${API_ROUTES.ADDRESS}/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    return res.status === 200
  } catch (error) {
    console.error("Error deleting address:", error)
    return false
  }
}



export interface CartItemAPI {
  slagurl: string;
  productId: string;
  productName: string;
  quantity: number;
  dp: string;
  mrp: string;
  picture: { thumbImageUrl: string };
}

export interface CartResponse {
  cookieId: string;
  shoppingCartItems: number;
  wishlistItems: number;
  items: CartItemAPI[];
}

export interface CartTotal {
  subTotal: number;
  discount: number;
  tax: number;
  shipping: number;
  payableAmt: number;
}

// Add / remove item
export const saveOrUpdateCart = async (
  productID: string,
  quantity: number,
  type: "insert" | "remove",
  cookiesID?: string
): Promise<CartResponse | null> => {
  try {
    const payload = {
      referralCode: "",
      productID,
      quantity: quantity.toString(),
      cookiesID: cookiesID || "",
      regno: "",
      type,
      attributes: [{ key: "", value: "" }]
    };

    const res = await axiosInstance.post(`${API_ROUTES.CARTS}/SaveOrUpdateCart`, payload);
    return res.data.data;
  } catch (error) {
    console.error("Error in saveOrUpdateCart:", error);
    return null;
  }
};

// Get all cart items
export const getCartItems = async (cookiesID: string): Promise<CartResponse | null> => {
  try {
    const res = await axiosInstance.get(`${API_ROUTES.CARTS}/GetCartItems?cookieid=${cookiesID}`);
    return res.data.data;
  } catch (error) {
    console.error("Error in getCartItems:", error);
    return null;
  }
};

// Get cart totals
export const getCartTotal = async (cookiesID: string): Promise<CartTotal | null> => {
  try {
    const res = await axiosInstance.get(`${API_ROUTES.CARTS}/GetCartTotal?cookieid=${cookiesID}`);
    return res.data.data;
  } catch (error) {
    console.error("Error in getCartTotal:", error);
    return null;
  }
};




// Checkout API
export const handleCheckoutAPI = async (
  cookieId: string,
  selectedAddressId: number,
  paymentMethod: string
) => {
  try {
    const token = Cookies.get("authToken");
    console.log(token,"token")
    const payload = {
      cookieId,
      selectedAddressId,
      paymentMethod,
      regno: 1,
    };

    const res = await axiosInstance.post(`${API_ROUTES.CHECKOUTS}/PlaceOrder`, payload, {
      headers: {
        Authorization: `Bearer ${token}`, // send token here
        "Content-Type": "application/json",
      },
    });

    return res.data;
  } catch (error: any) {
    console.error("Checkout error:", error.response ?? error);
    return null;
  }
};



export interface OrderItem {
  productId: number;
  productName: string;
  image: string;
  totalPrice: number;
}

export interface Order {
  orderPlaced: string;
  orderAmount: number;
  orderNumber: string;
  shipToCustomerName: string;
  status: string;
  orderItems: OrderItem[];
}

export const getMyOrder = async (): Promise<Order[] | null> => {
  try {
    const res = await axiosInstance.get(`${API_ROUTES.ORDERS}/GetMyOrdersHistory`);
    if (res.data.success) {
      return res.data.data;
    }
    return [];
  } catch (error) {
    console.error("Error fetching orders:", error);
    return null;
  }
};


export interface OrderDetailItem {
  productId: number;
  productName: string;
  image: string;
  totalPrice: number;
}

export interface OrderDetail {
  orderPlaced: string;
  orderAmount: number;
  orderNumber: string;
  shipToCustomerName: string;
  status: string;
  orderItems: OrderDetailItem[];
}

export const getOrderDetails = async (orderNo: string): Promise<OrderDetail | null> => {
  try {
    const res = await axiosInstance.get(
      `${API_ROUTES.ORDERS}/GetOrderPlacedDetails?orderNo=${orderNo}`
    );

    if (res.data.success && res.data.data.length > 0) {
      // The API returns an array but we only need the first object
      return res.data.data[0];
    }
    return null;
  } catch (error) {
    console.error("Error fetching order details:", error);
    return null;
  }
};


