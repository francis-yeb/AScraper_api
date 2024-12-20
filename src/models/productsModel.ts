import productData from '../../scrapedItems.json'
// import productData from '../data/scrapedItems.json'
import { departmentType, productType } from '../types/types'
import departments from '../data/departmentData.json';

const GetProducts = () => {
    const allProducts: productType[] = Array.isArray(productData) ? productData : [];

    console.log("Model products: ", allProducts)

    return {success: true, data: allProducts}
}

const GetCategories = () => {
    let allDepartments:departmentType[] = [];
    allDepartments = departments.departments;

    const allCategories = allDepartments.map((dep:departmentType) => ({
        id: dep.id,
        department: dep.name, 
        categories: dep.categories.map(cat => cat.name),

    })); 
    return {success: true, data: allCategories};
}

export {
    GetProducts,
    GetCategories,
}