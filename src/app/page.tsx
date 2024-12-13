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
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [userRatings, setUserRatings] = useState<{ [key: string]: number }>({});
    const [currency, setCurrency] = useState<string>("USD");
    const [favoriteWebsites, setFavoriteWebsites] = useState<string[]>([]);

    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            setError(null);

            try {
                const ebayRes = await fetch("/api/scrape-ebay");
                const amazonRes = await fetch("/api/scrape-amazon");

                if (!amazonRes.ok || !ebayRes.ok) {
                    throw new Error("Failed to fetch one or more products");
                }

                const amazonProducts = (await amazonRes.json()) as Product[];
                const ebayProducts = (await ebayRes.json()) as Product[];

                const allProducts = [
                    ...amazonProducts,
                    ...ebayProducts,
                ];

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

        // Load user ratings from local storage
        const savedRatings = localStorage.getItem('userRatings');
        if (savedRatings) {
            setUserRatings(JSON.parse(savedRatings));
        }

        // Load favorite websites from local storage
        const savedFavorites = localStorage.getItem('favoriteWebsites');
        if (savedFavorites) {
            setFavoriteWebsites(JSON.parse(savedFavorites));
        }

        // Load currency preference from local storage
        const savedCurrency = localStorage.getItem('currency');
        if (savedCurrency) {
            setCurrency(savedCurrency);
        }
    }, []);

    const handleRateProduct = (productName: string, rating: number) => {
        const newRatings = { ...userRatings, [productName]: rating };
        setUserRatings(newRatings);
        localStorage.setItem('userRatings', JSON.stringify(newRatings));
    };

    const handleCurrencyChange = (newCurrency: string) => {
        setCurrency(newCurrency);
        localStorage.setItem('currency', newCurrency);
    };

    const handleAddFavoriteWebsite = (website: string) => {
        if (!favoriteWebsites.includes(website)) {
            const newFavorites = [...favoriteWebsites, website];
            setFavoriteWebsites(newFavorites);
            localStorage.setItem('favoriteWebsites', JSON.stringify(newFavorites));
        }
    };

    const filteredProducts = products.filter((product) =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
        (!userRatings[product.name] || userRatings[product.name] >= 3)
    );

    const sortedProducts = filteredProducts.sort((a, b) => {
        const aRating = userRatings[a.name] || 0;
        const bRating = userRatings[b.name] || 0;
        return bRating - aRating;
    });

    return (
        <>
            <div className="flex flex-col md:flex-row items-center justify-between bg-yellow-50 p-4">
                <div className="relative w-full md:w-1/3 mb-4 md:mb-0">
                    <input
                        type="search"
                        className="border-2 p-2 pr-10 w-full h-10 shadow-xl z-20 focus:outline-none"
                        placeholder="Search for a product..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
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

                <h1 className="text-3xl md:text-5xl font-libre text-center mb-4 md:mb-0">
                    BeautyFinest
                </h1>

                <div className="flex items-center space-x-4 md:space-x-8">
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
                        <h3 className="text-lg md:text-2xl ml-2">
                            <select
                                value={currency}
                                onChange={(e) => handleCurrencyChange(e.target.value)}
                            >
                                <option value="USD">USD</option>
                                <option value="EUR">EUR</option>
                                <option value="GBP">GBP</option>
                            </select>
                        </h3>
                    </div>

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

            <div className="relative">
                <div className="flex-col w-full mt-6">
                    <ImageSlider />
                </div>
            </div>

            <div>
                <h2 className="text-xl text-center my-4">Loading Products...</h2>
                {loading ? (
                    <div className="text-center text-lg">Loading products from Amazon, eBay, and Trendyol...</div>
                ) : error ? (
                    <div className="text-center text-red-500">{`Error: ${error}`}</div>
                ) : (
                    <div className="grid grid-cols-3 gap-4 p-4">
                        {sortedProducts.map((product, index) => (
                            <div key={index} className="border p-4 rounded-md shadow-lg">
                                <img src={product.image} alt={product.name}
                                     className="w-full h-48 object-cover object-center"/>
                                <h3 className="text-lg font-semibold mt-2">{product.name}</h3>
                                <p className="text-sm text-gray-600">{product.price}</p>
                                <p className="text-sm text-gray-500">Type: {product.type}</p>
                                <p className="text-sm text-gray-500">Description: {product.description}</p>
                                <p className="text-sm text-gray-500">Rating: {product.rate}</p>
                                <p className="text-sm text-gray-500">Year: {product.productionYear}</p>
                                <p className="text-sm text-green-500">Availability: {product.availability}</p>
                                <div className="mt-2">
                                    <label>Rate this product:</label>
                                    <select
                                        value={userRatings[product.name] || 0}
                                        onChange={(e) => handleRateProduct(product.name, parseInt(e.target.value))}
                                    >
                                        <option value={0}>0</option>
                                        <option value={1}>1</option>
                                        <option value={2}>2</option>
                                        <option value={3}>3</option>
                                        <option value={4}>4</option>
                                        <option value={5}>5</option>
                                    </select>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <div className="mt-4">
                <h2 className="text-xl text-center my-4">Favorite Websites</h2>
                <ul className="list-disc list-inside">
                    {favoriteWebsites.map((website, index) => (
                        <li key={index}>{website}</li>
                    ))}
                </ul>
                <input
                    type="text"
                    placeholder="Add a favorite website"
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                            handleAddFavoriteWebsite(e.currentTarget.value);
                            e.currentTarget.value = '';
                        }
                    }}
                />
            </div>
        </>
    );
}