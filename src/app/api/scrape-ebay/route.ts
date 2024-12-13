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
            await delay(4000); // Add delay between retries
        }
    }
    throw new Error('Failed after maximum retries');
};

export async function GET() {
    try {
        const baseUrl = "https://www.ebay.com/sch/i.html?_from=R40&_trksid=p2334524.m570.l1311&_nkw=beauty+products&_sacat=0&_odkw=beauty+produsts&_osacat=0&page=";
        const totalPages = 5; // Adjust this value for how many pages you want to scrape
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

        for (let page = 1; page <= totalPages; page++) {
            const url = `${baseUrl}${page}`;
            const data = await fetchWithRetry(url);
            const $ = cheerio.load(data);

            $(".s-item").each((_, element) => {
                const name = $(element).find(".s-item__title").text().trim();
                const price = $(element).find(".s-item__price").text().trim();
                const image =
                    $(element).find(".s-item__image-wrapper img").attr("src") ||
                    $(element).find(".s-item__image-wrapper img").attr("data-src") ||
                    $(element).find(".s-item__image-wrapper img").attr("data-large-src") ||
                    "https://via.placeholder.com/150";
                const type = "eBay Product"; // eBay does not categorize like Amazon
                const description = name; // Placeholder
                const rate = "3.5 out of 5"; // eBay does not typically show ratings
                const productionYear = "2024"; // Placeholder
                const availability = $(element).find(".s-item__availability").text().trim() || "Available at ebay";

                if (name && price) {
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
        }

        return NextResponse.json(products, { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Failed to scrape eBay" }, { status: 500 });
    }
}
