import axios from "axios";
import * as cheerio from "cheerio";
import { NextResponse } from "next/server";

// Helper function to add delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const USER_AGENTS = [
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
    "Mozilla/5.0 (Windows NT 6.1; WOW64; rv:60.0) Gecko/20100101 Firefox/60.0",
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.1.2 Safari/605.1.15",
    "Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0 Mobile/15E148 Safari/604.1",
];

// Fetch product data with retries in case of failure
const fetchWithRetry = async (url: string, retries = 5) => {
    let attempt = 0;
    while (attempt < retries) {
        try {
            console.log(`Fetching URL: ${url}, Attempt: ${attempt + 1}`);
            const response = await axios.get(url, {
                headers: {
                    "User-Agent": USER_AGENTS[Math.floor(Math.random() * USER_AGENTS.length)]
                }
            });
            return response.data;
        } catch (error) {
            attempt++;
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-expect-error
            console.error(`Attempt ${attempt} failed, error: ${error.message}`);
            await delay(Math.random() * 4000 + 1000); // Random delay between 1-5 seconds
        }
    }
    throw new Error('Failed after maximum retries');
};

export async function GET() {
    try {
        const url = "https://www.trendyol.com/sr?q=beauty+products";
        const data = await fetchWithRetry(url);  // Fetch with retry
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

        // Update selectors based on Trendyol's structure
        $(".prdct-cntnr-wrppr .p-card-wrppr").each((_, element) => {
            const name = $(element).find(".prdct-desc-cntnr-ttl").text().trim();
            const price = $(element).find(".prc-box-dscntd").text().trim();
            const image = $(element).find(".p-card-img-wr img").attr("src") || "";
            const type = "Trendyol Product"; // Placeholder
            const description = name; // Placeholder
            const rate = "Not Rated"; // Trendyol does not typically show ratings
            const productionYear = "Unknown"; // Placeholder
            const availability = "In Stock"; // Placeholder

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
        return NextResponse.json({ error: "Failed to scrape Trendyol" }, { status: 500 });
    }
}


