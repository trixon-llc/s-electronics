import { cache } from 'react';
import { Product, createSlug, getIdFromSlug } from './shared';
import { supabase } from './supabase';
export { createSlug, getIdFromSlug };
export type { Product };

export const getProducts = cache(async (): Promise<Product[]> => {
    try {
        const { data, error } = await supabase
            .from('products')
            .select('*')
            .order('id', { ascending: false });

        if (error) {
            console.error("Supabase error fetching products:", error);
            throw new Error(error.message);
        }
        return data as Product[];
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

