import axios from "axios";
import { load } from "cheerio";
import { browserAgents, getRandomUserAgent } from "../utilities/browserAgents";
import { departmentType } from "../types/types";
import departments from '../data/departmentData.json';
import { promises as fs } from 'fs'; // Import the fs/promises module
import path from 'path'; // Import path module for handling file paths

const departmentData: departmentType[] = departments.departments;

// Function to write items to a JSON file
const writeToJsonFile = async (filename: string, data: any) => {
  const filePath = path.join(__dirname, '../data', filename); // Create the full file path
  try {
    await fs.writeFile(filePath, JSON.stringify(data, null, 2)); // Write data to the file
    console.log(`Data successfully written to ${filePath}`);
  } catch (error) {
    console.error("Error writing to file:", error);
  }
};

// Function to scrape Amazon category pages using department and category
const scrapeAmazonCategory = async (department: string, category: string) => {
  const departmentInfo = departmentData.find((dep: departmentType) => dep.name?.toLowerCase() === department.toLowerCase());
  
  if (!departmentInfo) {
    console.error(`Department "${department}" not found.`);
    return;
  }

  const categoryInfo = departmentInfo.categories.find(cat => cat.name?.toLowerCase() === category.toLowerCase());

  if (!categoryInfo) {
    console.error(`Category "${category}" not found in department "${department}".`);
    return;
  }

  const url = `https://www.amazon.com${categoryInfo.href}`;
  
  try {
    const response = await axios.get(url, {
      headers: {
        "User-Agent": getRandomUserAgent(),
      },
    });

    console.log("Response status:", response.status);

    if (response.status === 200) {
      const $ = load(response.data);
      const items: {
        asin?: string;
        title?: string;
        price?: string;
        imageUrl?: string;
        rating: { rate?: string; count?: string };
      }[] = [];

      $("div[data-asin]").each((index, element) => {
        const asin = $(element).attr("data-asin");
        if (asin) {
          const imageUrl = $(element).find("img").attr("src");
          const title = $(element).find("div[data-cy] h2 span").text().trim();
          const rate: string = $(element)
            .find("i[data-cy] span")
            .text()
            .trim()
            .split(" out of")[0];
          const reviewCount = $(element)
            .find("span[data-component-type] div span a")
            .text();
          const price = $(element)
            .find("span.a-price > span.a-offscreen")
            .text();

          items.push({
            asin,
            imageUrl,
            title,
            rating: {
              rate,
              count: reviewCount,
            },
            price,
          });
        }
      });

      // Log extracted items
      console.log("Extracted items:", items);

      // Write the extracted items to a JSON file in the data directory
      await writeToJsonFile('scrapedItems.json', items);
    } else {
      console.error(`Failed to fetch page: ${response.status}`);
    }
  } catch (error) {
    console.error("Error fetching the category:", error);
  }
};

// Example usage:
const department = "Video Games"; // Change to desired department
const category = "PlayStation 4"; // Change to desired category
scrapeAmazonCategory(department, category);
