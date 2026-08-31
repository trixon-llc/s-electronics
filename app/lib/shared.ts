export interface Product {
    id: string | number;
    name: string;
    price: string;
    image: string;
    description: string;
    tag?: string;
}

// Helper to create SEO-friendly slugs
export function createSlug(product: Product): string {
    const slugName = product.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-') // Replace non-alphanumeric with dashes
        .replace(/(^-|-$)+/g, ''); // Remove leading/trailing dashes
    return `${slugName}-${product.id}`;
}

// Extract ID from slug (assuming format name-id)
export function getIdFromSlug(slug: string): string {
    const parts = slug.split('-');
    return parts[parts.length - 1];
}

// Helper to get array of images from comma-separated string
export function getProductImages(product: Product): string[] {
    if (!product.image) return [];
    return product.image.split(',').map(url => url.trim()).filter(url => url.length > 0);
}
