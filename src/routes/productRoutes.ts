import { IncomingMessage, ServerResponse } from "http";
import url from "url";
import { categories, index, search } from "../controllers/productController";

const productRoutes = (req: IncomingMessage, res: ServerResponse) => {
    const parsedUrl = url.parse(req.url!);
    const pathname = decodeURIComponent(parsedUrl.pathname!); 

    const searchRegex = /^\/api\/products\/([^\/]+)\/([^\/]+)\/?$/;

    console.log("path name: ", pathname);

    if(req.method === 'GET' && pathname === '/api/categories'){
        console.log("category route")
        categories(req,res);
        return;
    }

    if(req.method === 'GET' && pathname === '/api/products') {
        index(req,res);
        return;
    }
    // Match GET request and path using regex
    if (req.method === 'GET' && searchRegex.test(pathname)) {
        console.log("product route")
        search(req, res);
        return;
    } else {
        res.statusCode = 404;
        res.setHeader('Content-Type', 'application/json'); 
        res.end(JSON.stringify({ success: false, message: "Not Found" }));
    }
};

export {
    productRoutes
};
