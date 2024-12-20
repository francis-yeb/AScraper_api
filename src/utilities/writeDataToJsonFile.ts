// import path from "path";
// import {promises as fs} from 'fs';
import fs from 'fs'


export const writeToJsonFile = async (filename: string, data: any) => {
    try {
    //   const filePath = path.join('../AScraper_api/src/data', filename);
    //   fs.writeFileSync(filePath, JSON.stringify(data, null, 2)); // Write data to the file
    // await fs.writeFileSync(filename,JSON.stringify(data,null,2))
    fs.writeFileSync(filename,JSON.stringify(data,null,2))
      console.log(`Data successfully written to ${filename}`);
    } catch (error) {
      console.error("Error writing to file:", error);
    }
  };