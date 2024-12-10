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
const fetchWithRetry = async (url: string, retries = 5) => {
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
            await delay(4000); // Add delay between retries
        }
    }
    throw new Error('Failed after maximum retries');
};

export async function GET() {
    try {
        const url = "https://www.ebay.com/sch/i.html?_from=R40&_trksid=p2334524.m570.l1311&_nkw=beauty+products&_sacat=0&_odkw=beauty+produsts&_osacat=0";
        const data = await fetchWithRetry(url);
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

        // Update selectors based on eBay's structure
        $(".s-item").each((_, element) => {
            const name = $(element).find(".s-item__title").text().trim();
            console.log("Name:", name);
            const price = $(element).find(".s-item__price").text().trim();
            console.log("Price:", price);
            const image = $(element).find(".s-item__image-img").attr("src") || "";
            const type = "eBay Product"; // eBay does not categorize like Amazon
            const description = name; // Placeholder
            const rate = "Not Rated"; // eBay does not typically show ratings
            const productionYear = "Unknown"; // Placeholder
            const availability = $(element).find(".s-item__availability").text().trim() || "Unknown";

            if (name && price && image) {
                products.push({
                    name,
                    price,
                    image,
                    type,
                    description,
                    rate,
                    productionYear,
                    availability,
                });
            }
        });

        await delay(5000); // Add delay to avoid rate-limiting
        return NextResponse.json(products);
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Failed to scrape eBay" }, { status: 500 });
    }
}

