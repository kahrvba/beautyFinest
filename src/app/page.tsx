'use client'
import { useEffect, useState } from "react";
import ImageSlider from '../components/ImageSlider';

export default function HomePage() {
    const [products, setProducts] = useState<
        { name: string; price: string; image: string; type: string; description: string; rate: string; productionYear: string; availability: string }[]
    >([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            setError(null);  // Reset error on each fetch attempt

            try {
                // Fetch from all three sources
                const ebayRes = await fetch("/api/scrape-ebay");
                const trendyolRes = await fetch("/api/scrape-trendyol");
                const amazonRes = await fetch("/api/scrape-amazon");



                // Check if the responses are successful
                if (!amazonRes.ok || !ebayRes.ok || !trendyolRes.ok) {
                    throw new Error("Failed to fetch one or more products");
                }

                // Parse the JSON data from each response
                const amazonProducts = await amazonRes.json();
                const ebayProducts = await ebayRes.json();
                const trendyolProducts = await trendyolRes.json();

                // Log the responses to check if data is fetched correctly
                console.log("Amazon Products:", amazonProducts);
                console.log("eBay Products:", ebayProducts);
                console.log("Trendyol Products:", trendyolProducts);

                // Combine all products into one array
                const allProducts = [
                    ...amazonProducts,
                    ...ebayProducts,
                    ...trendyolProducts
                ];

                // Log combined products to verify correct data
                console.log("All Combined Products:", allProducts);

                // Update state with combined products
                setProducts(
                    allProducts.map((product: any) => ({
                        ...product,
                        price: product.price || 'Price not available',
                        image: product.image || 'default-image.jpg',
                        type: product.type || 'Unknown Type',
                        description: product.description || 'No description available',
                        rate: product.rate || 'No rating',
                        productionYear: product.productionYear || 'Not available',
                        availability: product.availability || 'Out of stock',
                    }))
                );
            } catch (error: any) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    return (
        <>
            {/* Header Section with Search Bar */}
            <div className="flex relative bg-yellow-50">
                <div className="relative w-4/12 m-6">
                    <input
                        type="search"
                        className="border-2 p-5 pr-10 w-full h-10 shadow-xl z-20 focus:outline-none"
                        placeholder="Search for a product..."
                    />
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5}
                         stroke="currentColor"
                         className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500">
                        <path strokeLinecap="round" strokeLinejoin="round"
                              d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"/>
                    </svg>
                </div>
                <h1 className="text-5xl font-libre p-6 flex items-center justify-center h-full z-20 ">
                    BeautyFinest
                </h1>
                <div className="flex right-48 absolute p-7">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5}
                         stroke="currentColor" className="size-8">
                        <path strokeLinecap="round" strokeLinejoin="round"
                              d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"/>
                    </svg>
                    <h3 className="text-2xl"><a href="/login" className="cursor-pointer">Sign In</a></h3>
                </div>
                <div className="flex absolute right-12 p-7">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5}
                         stroke="currentColor" className="size-8">
                        <path strokeLinecap="round" strokeLinejoin="round"
                              d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"/>
                    </svg>
                    <h3 className="text-2xl"><a href="#">Basket</a></h3>
                </div>
                <div className="flex absolute right-[340px] p-7">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5}
                         stroke="currentColor" className="size-8 hover:">
                        <path strokeLinecap="round" strokeLinejoin="round"
                              d="M12 6v12m-3-2.818.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"/>
                    </svg>
                    <h3 className="text-2xl m-"><a>Currency</a></h3>
                </div>
            </div>

            {/* Image Slider Section */}
            <div className="relative">
                <div className="flex-col w-full mt-6">
                    <ImageSlider />
                </div>
            </div>

            {/* Product Loading Section */}
            <div>
                <h2 className="text-xl text-center my-4">Loading Products...</h2>
                {loading ? (
                    <div className="text-center text-lg">Loading products from Amazon, eBay, and Trendyol...</div>
                ) : error ? (
                    <div className="text-center text-red-500">{`Error: ${error}`}</div>
                ) : (
                    <div className="grid grid-cols-3 gap-4 p-4">
                        {products.map((product, index) => (
                            <div key={index} className="border p-4 rounded-md shadow-lg">
                                <img src={product.image} alt={product.name} className="w-full h-48 object-cover object-center" />
                                <h3 className="text-lg font-semibold mt-2">{product.name}</h3>
                                <p className="text-sm text-gray-600">{product.price}</p>
                                <p className="text-sm text-gray-500">Type: {product.type}</p>
                                <p className="text-sm text-gray-500">Description: {product.description}</p>
                                <p className="text-sm text-yellow-500">Rating: {product.rate}</p>
                                <p className="text-sm text-gray-500">Year: {product.productionYear}</p>
                                <p className="text-sm text-green-500">Availability: {product.availability}</p>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </>
    );
}
