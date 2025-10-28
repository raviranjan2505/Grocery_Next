// "use client";

// import { useEffect, useState } from "react";
// import { useSearchParams } from "next/navigation";
// import { getProductsBySearch } from "@/lib/actions/action";
// import { ProductDetails } from "@/lib/actions/action";
// import SkeletonLoader from "@/components/Loaders/SkeletonLoader";
// import ProductCard from "@/components/Home/ProductCard";
// import { API_BASE_URL } from "@/utils/api";
// import { UIProductCard } from "@/components/Home/ProductCard";

// export default function ProductSearchPage() {
//   const searchParams = useSearchParams();
//   const query = searchParams.get("query") || "";

//   const [products, setProducts] = useState<UIProductCard[]>([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     if (!query) return;

//     const fetchProducts = async () => {
//       setLoading(true);
//       const data = await getProductsBySearch(query);
//       const mappedProducts: UIProductCard[] = data.map((p: ProductDetails) => {
//         const image =
//           p.productImages?.[0]?.image && p.productImages[0].image.startsWith("http")
//             ? p.productImages[0].image
//             : p.productImages?.[0]?.image
//             ? `${API_BASE_URL}${p.productImages[0].image}`
//             : "/no-image.png";

//         const slag = (p as any).product_slagurl || p.pCode || "";

//         return {
//           id: String(p.pid),
//           categoryId: p.subCategoryName || p.categoryName || "unknown",
//           title: p.productName || "Unnamed Product",
//           subtitle: p.details?.slice(0, 40) || "",
//           price: p.dp ?? 0,
//           slag,
//           img: image,
//           deliveryTime: "16 MINS",
//         };
//       });

//       setProducts(mappedProducts);
//       setLoading(false);
//     };

//     fetchProducts();
//   }, [query]);

//   if (loading) {
//     return (
//       <div className="flex">
//         <aside className="w-52 border-r bg-white h-screen sticky top-0 overflow-y-auto">
//           <SkeletonLoader type="category" count={5} />
//         </aside>
//         <main className="flex-1 p-4 bg-gray-50">
//           <SkeletonLoader type="product" count={8} />
//         </main>
//       </div>
//     );
//   }

//   return (
//     <main className="flex-1 p-4 overflow-y-auto h-[calc(100vh-100px)] bg-gray-50">
//       <h1 className="text-xl font-semibold mb-4">`Search Results for {query}`</h1>

//       {products.length === 0 ? (
//         <p className="text-gray-500">`No products found for {query}`</p>
//       ) : (
//         <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
//           {products.map((product, index) => (
//             <ProductCard key={`${product.id}-${index}`} product={product} />
//           ))}
//         </div>
//       )}
//     </main>
//   );
// }

"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { getProductsBySearch } from "@/lib/actions/action";
import { ProductDetails } from "@/lib/actions/action";
import SkeletonLoader from "@/components/Loaders/SkeletonLoader";
import ProductCard from "@/components/Home/ProductCard";
import { API_BASE_URL } from "@/utils/api";
import { UIProductCard } from "@/components/Home/ProductCard";

function SearchResults() {
  const searchParams = useSearchParams();
  const query = searchParams.get("query") || "";

  const [products, setProducts] = useState<UIProductCard[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!query) return;

    const fetchProducts = async () => {
      setLoading(true);
      const data = await getProductsBySearch(query);
      const mappedProducts: UIProductCard[] = data.map((p: ProductDetails) => {
        const image =
          p.productImages?.[0]?.image && p.productImages[0].image.startsWith("http")
            ? p.productImages[0].image
            : p.productImages?.[0]?.image
            ? `${API_BASE_URL}${p.productImages[0].image}`
            : "/no-image.png";

        const slag = (p as any).product_slagurl || p.pCode || "";

        return {
          id: String(p.pid),
          categoryId: p.subCategoryName || p.categoryName || "unknown",
          title: p.productName || "Unnamed Product",
          subtitle: p.details?.slice(0, 40) || "",
          price: p.dp ?? 0,
          slag,
          img: image,
          deliveryTime: "16 MINS",
        };
      });

      setProducts(mappedProducts);
      setLoading(false);
    };

    fetchProducts();
  }, [query]);

  if (loading) {
    return (
      <div className="flex">
        <aside className="w-52 border-r bg-white h-screen sticky top-0 overflow-y-auto">
          <SkeletonLoader type="category" count={5} />
        </aside>
        <main className="flex-1 p-4 bg-gray-50">
          <SkeletonLoader type="product" count={8} />
        </main>
      </div>
    );
  }

  return (
    <main className="flex-1 p-4 overflow-y-auto h-[calc(100vh-100px)] bg-gray-50">
      <h1 className="text-xl font-semibold mb-4">
        Search Results for “{query}”
      </h1>

      {products.length === 0 ? (
        <p className="text-gray-500">No products found for “{query}”</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
          {products.map((product, index) => (
            <ProductCard key={`${product.id}-${index}`} product={product} />
          ))}
        </div>
      )}
    </main>
  );
}

export default function ProductSearchPage() {
  return (
    <Suspense fallback={<SkeletonLoader type="product" count={8} />}>
      <SearchResults />
    </Suspense>
  );
}

