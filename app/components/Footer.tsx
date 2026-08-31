"use client";

import { useState } from "react";
import { ChevronDown, Facebook, Twitter, Instagram } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Footer() {
    const [openSection, setOpenSection] = useState<string | null>(null);

    const toggleSection = (section: string) => {
        setOpenSection(openSection === section ? null : section);
    };

    const AccordionItem = ({ title, children, sectionId }: { title: string, children: React.ReactNode, sectionId: string }) => {
        const isOpen = openSection === sectionId;

        return (
            <div className="border-b border-white/5 md:border-none">
                <button
                    onClick={() => toggleSection(sectionId)}
                    className="flex w-full items-center justify-between py-4 text-left font-semibold text-white md:cursor-default md:py-0 md:mb-4"
                >
                    {title}
                    <ChevronDown className={`h-4 w-4 transition-transform md:hidden ${isOpen ? "rotate-180" : ""}`} />
                </button>

                {/* Mobile: Animated Dropdown */}
                <div className="md:hidden">
                    <AnimatePresence>
                        {isOpen && (
                            <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: "auto", opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                className="overflow-hidden"
                            >
                                <div className="pb-4">
                                    {children}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Desktop: Always Visible */}
                <div className="hidden md:block">
                    {children}
                </div>
            </div>
        );
    };

    return (
        <footer className="border-t border-white/10 bg-black/50 backdrop-blur-xl py-12 px-6 md:px-20 mt-20">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-12 mb-12">
                <div className="col-span-1 md:col-span-2 mb-8 md:mb-0">
                    <h2 className="text-2xl font-bold text-white mb-4">Survival Electronics</h2>
                    <p className="text-white/40 max-w-sm">
                        Engineering appliances that feel like the future.
                        Designed for those who appreciate the details.
                    </p>
                </div>

                <AccordionItem title="Shop" sectionId="shop">
                    <ul className="space-y-2 text-sm text-white/60">
                        <li className="hover:text-white cursor-pointer">All Products</li>
                        <li className="hover:text-white cursor-pointer">New Arrivals</li>
                        <li className="hover:text-white cursor-pointer">Accessories</li>
                    </ul>
                </AccordionItem>

                <AccordionItem title="Company" sectionId="company">
                    <ul className="space-y-2 text-sm text-white/60">
                        <li className="hover:text-white cursor-pointer">About</li>
                        <li className="hover:text-white cursor-pointer">Careers</li>
                        <li className="hover:text-white cursor-pointer">Contact</li>
                    </ul>
                </AccordionItem>

                <AccordionItem title="Contact Us" sectionId="contact">
                    <ul className="space-y-4 text-sm text-white/60">
                        <li>
                            <span className="block text-white/40 text-xs mb-1">Business Name</span>
                            Survival electronics and electrical store
                        </li>
                        <li>
                            <span className="block text-white/40 text-xs mb-1">Address</span>
                            39 Oluwole olaniyan street Agege, Lagos
                        </li>
                        <li>
                            <span className="block text-white/40 text-xs mb-1">Phone</span>
                            07063638558
                        </li>
                    </ul>
                    <div className="flex gap-4 mt-6">
                        <a href="#" className="text-white/60 hover:text-white transition-colors">
                            <Facebook className="h-5 w-5" />
                        </a>
                        <a href="#" className="text-white/60 hover:text-white transition-colors">
                            <Twitter className="h-5 w-5" />
                        </a>
                        <a href="#" className="text-white/60 hover:text-white transition-colors">
                            <Instagram className="h-5 w-5" />
                        </a>
                    </div>
                </AccordionItem>
            </div>
            <div className="flex flex-col md:flex-row justify-between items-center text-xs text-white/20 pt-8 border-t border-white/5">
                <p>&copy; 2026 Survival Electronics. All rights reserved.</p>
                <div className="flex gap-4 mt-4 md:mt-0">
                    <span>Privacy Policy</span>
                    <span>Terms of Service</span>
                </div>
            </div>
        </footer>
    );
}
