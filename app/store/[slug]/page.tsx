import { Metadata } from 'next';
import { getProductBySlug, getProducts } from '../../lib/api';
import { createSlug, getProductImages } from '../../lib/shared';
import Navbar from '../../components/Navbar';
import ImageCarousel from '../../components/ImageCarousel';
import Footer from '../../components/Footer';
import { notFound } from 'next/navigation';
import { MessageCircle, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

interface Props {
    params: Promise<{ slug: string }>;
}

// Generate Static Params for SSG (Optional but good for SEO)
export async function generateStaticParams() {
    const products = await getProducts();
    return products.map((product) => ({
        slug: createSlug(product),
    }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params;
    const product = await getProductBySlug(slug);

    if (!product) {
        return {
            title: 'Product Not Found | Survival Electronics',
        };
    }

    return {
        title: `${product.name} - Buy in Lagos | Survival Electronics`,
        description: `Buy ${product.name} in Lagos at the best price. ${product.description.substring(0, 100)}... Available now at Survival Electronics.`,
        openGraph: {
            title: product.name,
            description: product.description,
            images: [product.image],
            type: 'website',
        },
    };
}

export default async function ProductPage({ params }: Props) {
    const { slug } = await params;
    const product = await getProductBySlug(slug);

    if (!product) {
        notFound();
    }

    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'Product',
        name: product.name,
        image: getProductImages(product),
        description: product.description,
        offers: {
            '@type': 'Offer',
            priceCurrency: 'NGN',
            price: String(product.price || '0').replace(/[^0-9]/g, ''), // Extract numeric price
            availability: 'https://schema.org/InStock',
            seller: {
                '@type': 'Organization',
                name: 'Survival Electronics',
            },
        },
    };

    const handleBuyUrl = `https://wa.me/2347063638558?text=${encodeURIComponent(`I saw this on your website and want to buy: ${product.name} (${product.price})`)}`;

    return (
        <main className="min-h-screen bg-black text-white">
            <Navbar />

            {/* Structured Data for Google */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />

            <div className="container mx-auto px-6 pt-32 pb-20">
                <Link href="/store" className="inline-flex items-center gap-2 text-white/60 hover:text-white mb-8 transition-colors">
                    <ArrowLeft className="w-4 h-4" />
                    Back to Store
                </Link>

                <div className="grid md:grid-cols-2 gap-12 items-start">
                    {/* Image Section */}
                    <div className="relative aspect-square rounded-2xl overflow-hidden bg-white/5 border border-white/10">
                        <ImageCarousel
                            images={getProductImages(product)}
                            alt={product.name}
                            className="h-full w-full"
                        />
                        {product.tag && (
                            <div className="absolute top-4 left-4 bg-indigo-600 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider z-10">
                                {product.tag}
                            </div>
                        )}
                    </div>

                    {/* Details Section */}
                    <div className="space-y-8">
                        <div>
                            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent mb-4">
                                {product.name}
                            </h1>
                            <p className="text-3xl text-indigo-400 font-semibold">{product.price}</p>
                        </div>

                        <div className="h-px bg-white/10" />

                        <div>
                            <h3 className="text-sm font-medium text-white/40 uppercase tracking-wider mb-4">Product Description</h3>
                            <p className="text-white/70 leading-relaxed text-lg whitespace-pre-line">
                                {product.description}
                            </p>
                        </div>

                        <div className="pt-4">
                            <a
                                href={handleBuyUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="block w-full md:w-fit"
                            >
                                <button className="w-full md:w-auto px-12 py-4 bg-green-600 hover:bg-green-500 text-white font-bold rounded-xl flex items-center justify-center gap-3 transition-all active:scale-95 shadow-lg shadow-green-900/20">
                                    <MessageCircle className="w-5 h-5" />
                                    Buy on WhatsApp
                                </button>
                            </a>
                            <p className="text-white/30 text-xs mt-4">
                                Secure checkout via WhatsApp. Fast delivery in Lagos.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </main>
    );
}
