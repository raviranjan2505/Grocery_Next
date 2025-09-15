import ProductInfo from "@/components/Home/ProductInfo";
import ProductImageGallery from "@/components/Home/ProductImageGallery";
import ProductCard from "@/components/Home/ProductCard";
import { getProductDetails, getRelatedProducts } from "@/lib/actions/action";
import { notFound } from "next/navigation";

export default async function ProductDetailsPage({
  params,
}: {
  params: { productId: string; categoriesId: string };
}) {
  const product = await getProductDetails(params.productId);
  if (!product) return notFound();

  const relatedProducts = await getRelatedProducts(params.categoriesId);

  return (
    <main className="px-4 md:px-8 py-6 grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Images */}
      <ProductImageGallery
        images={product.images?.length ? product.images : [product.thumbnail]}
        alt={product.title}
        fallbackImage="/image/bread.png"
      />

      {/* Info */}
      <ProductInfo
        product={product}
        description={product.description}
        highlights={[
          `Category: ${product.category}`,
          `Brand: ${product.brand}`,
          `Product ID: ${product.id}`,
        ]}
      />

      {/* Related */}
      {relatedProducts.length > 0 && (
        <div className="col-span-1 md:col-span-2 mt-12">
          <h2 className="text-lg font-bold mb-6">Related Products</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {relatedProducts.map((r) => (
              <ProductCard
                key={r.id}
                product={{
                  id: r.id.toString(),
                  categoryId: r.category,
                  title: r.title,
                  subtitle: r.brand,
                  price: r.price,
                  img: r.thumbnail,
                }}
              />
            ))}
          </div>
        </div>
      )}
    </main>
  );
}
