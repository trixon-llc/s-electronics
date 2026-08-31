import { cache } from 'react';
import { Product, createSlug, getIdFromSlug } from './shared';
export { createSlug, getIdFromSlug };
export type { Product };

const API_URL = "https://script.google.com/macros/s/AKfycbyplvUAE760KF1SRVjWMyBMDH9LZcEMNpCzOKT0v9ecfNfM_wp37PXwDp8bvYXBn6OK/exec";


export const getProducts = cache(async (): Promise<Product[]> => {
    try {
        const response = await fetch(`${API_URL}?type=json`, {
            next: { revalidate: 0 } // Cache for 0 seconds (always fresh for testing)
        });
        if (!response.ok) throw new Error('Failed to fetch products');
        return await response.json();
    } catch (error) {
        console.error("Error fetching products:", error);
        return [];
    }
});

export const getProductBySlug = async (slug: string): Promise<Product | undefined> => {
    const products = await getProducts();
    const id = getIdFromSlug(slug);
    // Try matching by ID first (more robust)
    const productById = products.find(p => String(p.id) === id);
    if (productById) return productById;

    // Fallback: match by full generated slug
    return products.find(p => createSlug(p) === slug);
};
