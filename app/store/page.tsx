"use client";

import { useState, useMemo, useEffect } from "react";
import Navbar from "../components/Navbar";
import ProductCard from "../components/ProductCard";
import Footer from "../components/Footer";

import { Search, Loader2, MessageCircle, X } from "lucide-react";
import { createSlug, getProductImages } from "../lib/shared";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import ImageCarousel from "../components/ImageCarousel";

// --- Configuration --- 
// PASTE YOUR GOOGLE APPS SCRIPT WEB APP URL BELOW
const API_URL = "https://script.google.com/macros/s/AKfycbxWqHrzwXpo-YOc6MusfIrmJJMND14W6euIuwK0Dp4mgnVhDh5bQE8QUA-cm6cScEq-/exec";
const FALLBACK_IMAGE = "https://i.ibb.co/zh1sb5mT/No-Image-for-this-Product-yet.png";

interface Product {
    id: string | number;
    name: string;
    price: string;
    image: string;
    description: string;
    tag?: string;
}

export default function StorePage() {
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    // Fetch products from Google Sheets on mount
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                // We append ?type=json to tell the script we want data, not the dashboard HTML
                const response = await fetch(`${API_URL}?type=json`);
                const data = await response.json();
                setProducts(data);
            } catch (error) {
                console.error("Failed to fetch products:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    const filteredProducts = useMemo(() => {
        const lowerQuery = searchQuery.toLowerCase();
        return products.filter(p =>
            p.name.toLowerCase().includes(lowerQuery)
        );
    }, [searchQuery, products]);



    return (
        <main className="relative bg-black min-h-screen text-white font-sans selection:bg-indigo-500/30">
            <Navbar />

            {/* Ambient Background Elements */}
            <div className="nebula-glow" style={{ '--x': '10%', '--y': '20%' } as React.CSSProperties} />
            <div className="nebula-glow" style={{ '--x': '90%', '--y': '80%', background: 'radial-gradient(600px circle at var(--x) var(--y), rgba(147, 51, 234, 0.1), transparent 40%)' } as React.CSSProperties} />

            <div className="relative z-10 pt-32 pb-20 container mx-auto px-6">

                {/* Header */}
                <div className="flex flex-col items-center justify-center mb-10 text-center">
                    <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">
                        Buy Electronics in Lagos
                    </h1>
                    <p className="text-white/60 max-w-lg mb-8 text-lg">
                        Explore our premium range of TVs, generators, and home appliances.
                        Best prices and fast delivery in Lagos.
                    </p>
                </div>

                {/* Sticky Search Bar */}
                <div className="fixed top-6 right-6 left-20 z-50 w-auto md:w-full md:sticky md:top-6 md:inset-x-0 md:flex md:justify-center md:mb-10 pointer-events-none">
                    <div className="w-full max-w-sm md:max-w-md group pointer-events-auto relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <Search className="h-5 w-5 text-white/40 group-focus-within:text-indigo-400 transition-colors" />
                        </div>
                        <input
                            type="text"
                            placeholder="Search..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="block w-full rounded-full border border-white/10 bg-black/60 pl-11 pr-4 py-2 md:py-3 text-white placeholder-white/30 focus:border-indigo-500/50 focus:bg-black/90 focus:ring-4 focus:ring-indigo-500/10 focus:outline-none transition-all backdrop-blur-xl shadow-lg text-sm md:text-base"
                        />
                    </div>
                </div>

                {/* Product Grid */}
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20">
                        <Loader2 className="h-10 w-10 animate-spin text-indigo-500 mb-4" />
                        <p className="text-white/40">Loading Inventory...</p>
                    </div>
                ) : filteredProducts.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 mt-8">
                        {filteredProducts.map((product) => (
                            <ProductCard
                                key={product.id}
                                name={product.name}
                                price={product.price}
                                image={product.image || FALLBACK_IMAGE}
                                tag={product.tag}
                                href={`/store/${createSlug(product)}`}
                                onClick={() => setSelectedProduct(product)}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-20 text-center">
                        <div className="text-6xl mb-4">🔍</div>
                        <h3 className="text-2xl font-semibold text-white mb-2">No products found</h3>
                        <p className="text-white/40">
                            Looking for something else?{' '}
                            <a
                                href="https://wa.me/2347063638558?text=Hello%2C%20I%20am%20looking%20for%20a%20product%20that%20I%20could%20not%20find%20on%20your%20store."
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-indigo-400 hover:text-indigo-300 underline transition-colors"
                            >
                                Make an Inquiry here
                            </a>
                        </p>
                    </div>
                )}
            </div>

            <Footer />

            {/* Slide-over Product Details */}
            <AnimatePresence>
                {selectedProduct && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setSelectedProduct(null)}
                            className="fixed inset-0 z-[60] bg-black/80 backdrop-blur-sm"
                        />

                        {/* Drawer */}
                        <motion.div
                            initial={{ x: "100%" }}
                            animate={{ x: 0 }}
                            exit={{ x: "100%" }}
                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                            className="fixed inset-y-0 right-0 z-[70] w-full max-w-md bg-[#0a0a0a] border-l border-white/10 p-6 shadow-2xl overflow-y-auto"
                        >
                            <button
                                onClick={() => setSelectedProduct(null)}
                                className="absolute top-6 right-6 p-2 rounded-full bg-white/5 hover:bg-white/10 transition-colors"
                            >
                                <X className="h-6 w-6 text-white/60" />
                            </button>

                            <div className="mt-12">
                                <div className="w-full rounded-2xl bg-white/5 overflow-hidden mb-8 border border-white/5 group relative aspect-square">
                                    <Link href={`/store/${createSlug(selectedProduct)}`}>
                                        <div className="absolute top-3 left-0 right-0 z-20 flex justify-center md:hidden pointer-events-none">
                                            <span className="bg-black/40 backdrop-blur-md text-white/90 text-xs font-medium px-3 py-1 rounded-full border border-white/10">
                                                Tap image to view full page
                                            </span>
                                        </div>
                                        <ImageCarousel
                                            images={getProductImages(selectedProduct).length > 0 ? getProductImages(selectedProduct) : [selectedProduct.image || FALLBACK_IMAGE]}
                                            alt={selectedProduct.name}
                                            className="h-full w-full"
                                        />
                                        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center hidden md:flex pointer-events-none">
                                            <span className="bg-white/10 backdrop-blur-md text-white px-4 py-2 rounded-full text-sm font-medium">View Full Page</span>
                                        </div>
                                    </Link>
                                </div>

                                <div className="space-y-6">
                                    <div>
                                        <h2 className="text-3xl font-bold text-white mb-2">{selectedProduct.name}</h2>
                                        <p className="text-2xl text-indigo-400 font-semibold">{selectedProduct.price}</p>
                                    </div>

                                    <div className="h-px w-full bg-white/10" />

                                    <div>
                                        <h3 className="text-sm font-medium text-white/40 uppercase tracking-wider mb-3">Description</h3>
                                        <p className="text-white/70 leading-relaxed text-lg">
                                            {selectedProduct.description}
                                        </p>
                                    </div>

                                    <div className="pt-6">
                                        <a
                                            href={`https://wa.me/2347063638558?text=${encodeURIComponent(`I want this: ${selectedProduct.name} (${selectedProduct.price})`)}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            <button
                                                className="w-full flex items-center justify-center gap-3 bg-green-600 hover:bg-green-500 text-white font-bold py-4 rounded-xl transition-all active:scale-[0.98]"
                                            >
                                                <MessageCircle className="h-5 w-5" />
                                                I Want This
                                            </button>
                                        </a>
                                        <p className="text-center text-xs text-white/30 mt-4">
                                            Opens WhatsApp to contact our sales team directly.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </main>
    );
}