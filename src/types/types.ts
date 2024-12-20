export interface departmentType {
    id?:number;
    name?:string;
    categories:{name?:string,href?:string}[];
}

export interface productType {
    asin?: string;
    title?: string;
    price?: string;
    imageUrl?: string;
    rating?: { rate?: string; count?: string }
}