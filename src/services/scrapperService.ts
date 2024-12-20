import axios from "axios";
import { load } from "cheerio";
import { getRandomUserAgent } from "../utilities/browserAgents";
import { departmentType, productType } from "../types/types";
import departments from '../data/departmentData.json';
import { promises as fs } from 'fs'; // Import the fs/promises module
import path from "path";
import { writeToJsonFile } from "../utilities/writeDataToJsonFile";

const departmentData: departmentType[] = departments.departments;

// Function to scrape Amazon category pages using department and category
export const scrapeProducts = async (department: string, category: string) => {
    // console.log("scrapper department: ",department);
    // console.log("scrapper category: ",category)
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

//   console.log("category href:", categoryInfo.href);
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
      const items: productType[] = [];
      const seenImages = new Set<string>(); // Track seen image URLs
      const duplicateImages = new Set<string>(); // Track duplicates

      $("div[data-asin], div[cel_widget_id]").each((index, element) => {
        const asin = $(element).attr("data-asin");
        const div = $(element).attr("cel_widget_id");
        const imageUrl = $(element).find("img").attr("src");

        // console.log("asin: ",asin)
        // console.log("div: ",div)
        const titl = $(element).find('h2').text();
        // console.log("title 2: ", titl)
        const title = $(element).find(`div[data-cy="title-recipe"] h2`).text().trim();
        const rate = $(element).find("i[data-cy] span").text().trim().split(" out of")[0];
        const reviewCount = $(element).find("span[data-component-type] div span a").text();
        const price = $(element).find("span.a-price > span.a-offscreen").text();

        if (asin) {
            
          // Check if image URL is already seen
        //   if (imageUrl && seenImages.has(imageUrl)) {
        //     duplicateImages.add(imageUrl);
        //   } else if (imageUrl) {
        //     seenImages.add(imageUrl);
        //   }
          if(imageUrl && title){

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
        } 
        if(div && title == '')  {
          // Track non-asin div elements
          if(imageUrl){
                if (seenImages.has(imageUrl)) {
                  duplicateImages.add(imageUrl);
                } else {
                  seenImages.add(imageUrl);
                }

                items.push({
                  imageUrl,
                  
                });
          }

        }
      });
    //   console.log("duplicate: ",items)

      // Filter out duplicates by image URL
      const filteredItems = items.filter(item => !duplicateImages.has(item.imageUrl!));

      console.log("Filtered items (duplicates removed):", filteredItems);
    //   console.log("items:",items);

      // Write the filtered items to a JSON file
      
      await writeToJsonFile('scrapedItems.json', filteredItems);

      return { success: true,data: filteredItems, message: "Successfully written to the JSON file." };
    } else {
      console.error(`Failed to fetch page: ${response.status}`);
      return { success: false, message: `Failed to fetch page: ${response.status}` };
    }
  } catch (error) {
    console.error("Error fetching the category:", error);
    return { success: false, message: "Error fetching the category." };
  }
};

let department;
let category;
department = "Computers";
category = "Computer Accessories & Peripherals";
// Example usage:
department = "Smart Home"; 
category = "Amazon Smart Home";
category = "Works with Alexa Devices"
category = "Security Cameras and Systems"


// scrapeProducts(department, category).then(result => console.log(result));
