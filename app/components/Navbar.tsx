"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
    const pathname = usePathname();
    const isStorePage = pathname === "/store";

    const scrollToSection = (id: string) => {
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: "smooth" });
        }
    };

    return (
        <motion.nav
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.5, ease: "easeOut" }}
            className="fixed top-6 left-0 right-0 z-50 flex items-center justify-between px-6 pointer-events-none"
        >
            {/* Logo - Always Visible (Left) */}
            <div className="pointer-events-auto">
                <Link href="/" className="flex items-center gap-2">
                    <img src="/logo.png" alt="Survival Electronics" className="h-8 w-auto object-contain" />
                </Link>
            </div>

            {/* Centered Pill Navbar - Hidden on Store Page and Mobile */}
            {!isStorePage && (
                <div className="hidden md:flex pointer-events-auto glass-panel rounded-full px-6 py-3 items-center gap-6 text-sm font-medium text-white/60 shadow-2xl shadow-indigo-500/10">
                    <button onClick={() => scrollToSection('products')} className="hover:text-white transition-colors">Trending</button>
                    <button onClick={() => scrollToSection('categories')} className="hover:text-white transition-colors">Categories</button>
                    <button onClick={() => scrollToSection('vision')} className="hover:text-white transition-colors">Vision</button>
                </div>
            )}

            {/* View Products Button - Always Visible (Right) EXCEPT on Store Page */}
            <div className="pointer-events-auto">
                {!isStorePage && (
                    <Link
                        href="/store"
                        className="flex items-center bg-white text-black px-4 py-2 rounded-full text-sm font-medium hover:bg-gray-200 transition-colors"
                    >
                        View Products
                    </Link>
                )}
            </div>
        </motion.nav>
    );
}
