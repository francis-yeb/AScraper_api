import { IncomingMessage, ServerResponse } from "http";
import { scrapeProducts } from "../services/scrapperService";
import { GetCategories, GetProducts } from "../models/productsModel";

const index = async (req: IncomingMessage, res: ServerResponse) => {
    try{

        const urlParts = req.url?.split('/');
        console.log("am i here")
        
        // Decode the department and category parameters
        const departmentParam: string | undefined = urlParts && urlParts[3] ? decodeURIComponent(urlParts[3]) : undefined;
        const categoryParam: string | undefined = urlParts && urlParts[4] ? decodeURIComponent(urlParts[4]) : undefined;
    
        console.log("department param: ", departmentParam);
        console.log("category param: ", categoryParam);
        const products = GetProducts();
    
       
        
        if (products.success) {
            res.writeHead(200, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ success: true, data: products.data }));
            return;
        } else {
            res.writeHead(404, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ success: false, message: "Products not found" }));
            return;
        }
        
    }catch(error){
        console.log("error: ",error)
    }
};

const search = async (req: IncomingMessage, res: ServerResponse) => {
    try{

        const urlParts = req.url?.split('/');
        console.log("am i here")
        
        // Decode the department and category parameters
        const departmentParam: string | undefined = urlParts && urlParts[3] ? decodeURIComponent(urlParts[3]) : undefined;
        const categoryParam: string | undefined = urlParts && urlParts[4] ? decodeURIComponent(urlParts[4]) : undefined;
    
        console.log("department param: ", departmentParam);
        console.log("category param: ", categoryParam);
    
        if (departmentParam && categoryParam) {
            // Call the service to scrape products based on department and category
            const searchProduct = await scrapeProducts(departmentParam, categoryParam);
            console.log("search response: ", searchProduct)
            
            if (searchProduct && searchProduct.success) {
                const products = GetProducts();
                res.writeHead(200, { "Content-Type": "application/json" });
                res.end(JSON.stringify({ success: true, data: searchProduct.data }));
                return;
            } else {
                res.writeHead(404, { "Content-Type": "application/json" });
                res.end(JSON.stringify({ success: false, message: "Products not found" }));
                return;
            }
        } 
        else {
            res.writeHead(400, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ success: false, message: "Invalid department or category" }));
            return;
        }
    }catch(error){
        console.log("error: ",error)
    }
};

const categories = (req:IncomingMessage, res:ServerResponse) => {
    const fetchCategories = GetCategories();
    if(fetchCategories.success){
        res.writeHead(200, {"Content-Type": "application/json"});
        res.end(JSON.stringify({success: true, data: fetchCategories.data}));
    }
}

export {
    index,
    categories,
    search,
};
