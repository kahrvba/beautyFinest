'use client';

import { useEffect, useState } from "react";
import ImageSlider from '../components/ImageSlider';

// Define the Product interface
interface Product {
    name: string;
    price: string;
    image: string;
    type: string;
    description: string;
    rate: string;
    productionYear: string;
    availability: string;
}

export default function HomePage() {
    // Initialize products state with the correct type
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            setError(null);

            try {
                // Fetch data from APIs
                const ebayRes = await fetch("/api/scrape-ebay");
                const trendyolRes = await fetch("/api/scrape-trendyol");
                const amazonRes = await fetch("/api/scrape-amazon");

                // Check if responses are ok
                if (!amazonRes.ok || !ebayRes.ok || !trendyolRes.ok) {
                    throw new Error("Failed to fetch one or more products");
                }

                // Parse JSON data
                const amazonProducts = (await amazonRes.json()) as Product[];
                const ebayProducts = (await ebayRes.json()) as Product[];
                const trendyolProducts = (await trendyolRes.json()) as Product[];

                // Combine all products
                const allProducts = [
                    ...amazonProducts,
                    ...ebayProducts,
                    ...trendyolProducts
                ];

                // Set products with default values
                setProducts(
                    allProducts.map((product) => ({
                        name: product.name || 'Unnamed Product',
                        price: product.price || 'Price not available',
                        image: product.image || 'default-image.jpg',
                        type: product.type || 'Unknown Type',
                        description: product.description || 'No description available',
                        rate: product.rate || 'No rating',
                        productionYear: product.productionYear || 'Not available',
                        availability: product.availability || 'Out of stock',
                    }))
                );
            } catch (error: unknown) {
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-expect-error
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
            <div className="flex flex-col md:flex-row items-center justify-between bg-yellow-50 p-4">
                {/* Search Bar */}
                <div className="relative w-full md:w-1/3 mb-4 md:mb-0">
                    <input
                        type="search"
                        className="border-2 p-2 pr-10 w-full h-10 shadow-xl z-20 focus:outline-none"
                        placeholder="Search for a product..."
                    />
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
                        />
                    </svg>
                </div>

                {/* Website Name */}
                <h1 className="text-3xl md:text-5xl font-libre text-center mb-4 md:mb-0">
                    BeautyFinest
                </h1>

                {/* Right Section: Sign In, Currency, Basket */}
                <div className="flex items-center space-x-4 md:space-x-8">
                    {/* Sign In */}
                    <div className="flex items-center">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="currentColor"
                            className="w-6 h-6"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0ZM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
                            />
                        </svg>
                        <h3 className="text-lg md:text-2xl ml-2">
                            <a href="/login" className="cursor-pointer">
                                Sign In
                            </a>
                        </h3>
                    </div>

                    {/* Currency */}
                    <div className="flex items-center">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="currentColor"
                            className="w-6 h-6"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0Z"
                            />
                        </svg>
                        <h3 className="text-lg md:text-2xl ml-2">Currency</h3>
                    </div>

                    {/* Basket */}
                    <div className="flex items-center">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="currentColor"
                            className="w-6 h-6"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0Zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0Z"
                            />
                        </svg>
                        <h3 className="text-lg md:text-2xl ml-2">
                            <a href="#">Basket</a>
                        </h3>
                    </div>
                </div>
            </div>

            {/* Image Slider Section */}
            <div className="relative">
                <div className="flex-col w-full mt-6">
                    <ImageSlider/>
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
                                <img src={product.image} alt={product.name}
                                     className="w-full h-48 object-cover object-center"/>
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
