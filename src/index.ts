import  http from 'http';
import {IncomingMessage, ServerResponse,createServer} from 'http'
import dotenv from 'dotenv';
import path from 'path';
import crossOrigin from './utilities/crossOrigin';
import { RouteHandlers } from './types/requestTypes';
import { productRoutes } from './routes/productRoutes';

//Loading the environment file
dotenv.config({path: path.resolve(__dirname,'utilities/environment.env')})

const PORT:number =  parseInt(process.env.PORT as string,10);

const server = http.createServer((req:IncomingMessage, res: ServerResponse) => {
  crossOrigin(res);

  //Handing data post
 if(req.url?.startsWith("/api/products") || req.url?.startsWith("/api/categories")){
  console.log("we are here")
  productRoutes(req,res);
 }

  // res.writeHead(200, { 'Content-Type': 'application/json' });
  // res.end(JSON.stringify({success: true, data: `This is my data,  on ${process.env.PORT}`}));
});

server.listen(PORT, () => {
  console.log(`AScraper Server running at http://localhost:${PORT}/`);
});
