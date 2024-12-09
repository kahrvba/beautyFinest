import axios from "axios";
import * as cheerio from "cheerio";
import { NextResponse } from "next/server";

// Helper function to add delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const USER_AGENTS = [
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
    "Mozilla/5.0 (Windows NT 6.1; WOW64; rv:60.0) Gecko/20100101 Firefox/60.0",
    // Add more User-Agent strings as needed
];

// Fetch product data with retries in case of failure
const fetchWithRetry = async (url: string, retries = 3) => {
    let attempt = 0;
    while (attempt < retries) {
        try {
            const response = await axios.get(url, {
                headers: {
                    "User-Agent": USER_AGENTS[Math.floor(Math.random() * USER_AGENTS.length)]
                }
            });

            return response.data;
        } catch (error) {
            attempt++;
            // TypeScript safe handling for unknown error type
            if (error instanceof Error) {
                console.error(`Attempt ${attempt} failed, error: ${error.message}`);
            } else {
                console.error(`Attempt ${attempt} failed, unknown error.`);
            }
            await delay(1000); // Add delay between retries
        }
    }
    throw new Error('Failed after maximum retries');
};

export async function GET() {
    try {
        const url = "https://www.trendyol.com/en/sr?q=beauty+products&qt=beauty+products&st=beauty+products&os=1";
        const data = await fetchWithRetry(url);  // Fetch with proxy and retry
        const $ = cheerio.load(data);

        const products: {
            name: string;
            price: string;
            image: string;
            type: string;
            description: string;
            rate: string;
            productionYear: string;
            availability: string;
        }[] = [];

        $(".p-card-wrppr").each((_, element) => {
            const name = $(element).find(".prdct-desc-cntnr-name").text().trim();
            const price = $(element).find(".prc-box-dscntd").text().trim();
            const image = $(element).find(".prdct-img-wrppr img").attr("src");
            const type = $(element).find(".prdct-desc-cntnr-name").text().trim(); // Placeholder for type, use a specific element if available
            const description = $(element).find(".prdct-desc").text().trim(); // Placeholder for description, adapt if needed
            const rate = $(element).find(".review-star").attr("title")?.trim() || "No rating"; // Extract rating, if available
            const productionYear = "Not available"; // Placeholder, as this may not be available on the page
            const availability = "In stock"; // Placeholder for availability

            if (name && price && image) {
                products.push({
                    name,
                    price,
                    image,
                    type,
                    description,
                    rate,
                    productionYear,
                    availability
                });
            }
        });

        await delay(5000); // Add delay to avoid rate-limiting

        return NextResponse.json(products);
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Failed to scrape Trendyol" }, { status: 500 });
    }
}
