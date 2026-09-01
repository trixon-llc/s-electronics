"use client";

import { useState, useEffect, useMemo } from 'react';
import { supabase } from '../lib/supabase';
import { Product } from '../lib/shared';
import { Key, ArrowRight, Upload, X, LogOut, Search } from 'lucide-react';
import { Fredoka } from 'next/font/google';

const fredoka = Fredoka({ subsets: ['latin'] });

export default function AdminPage() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [password, setPassword] = useState('');
    
    // Product form state
    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [description, setDescription] = useState('');
    const [tag, setTag] = useState('');
    
    // Image handling
    const [imageFiles, setImageFiles] = useState<File[]>([]);
    const [imagePreviews, setImagePreviews] = useState<string[]>([]);
    
    const [searchQuery, setSearchQuery] = useState('');
    
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [products, setProducts] = useState<Product[]>([]);

    const filteredProducts = useMemo(() => {
        return products.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()));
    }, [products, searchQuery]);

    useEffect(() => {
        if (isAuthenticated) {
            fetchProducts();
        }
    }, [isAuthenticated]);

    const fetchProducts = async () => {
        const { data, error } = await supabase.from('products').select('*').order('id', { ascending: false });
        if (data) setProducts(data);
    };

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        // Fallback simple password for now, user should set this in env
        if (password === (process.env.NEXT_PUBLIC_ADMIN_PASSWORD || 'survival2026')) {
            setIsAuthenticated(true);
        } else {
            alert('Incorrect password');
        }
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const files = Array.from(e.target.files);
            setImageFiles(prev => [...prev, ...files]);
            
            const newPreviews = files.map(file => URL.createObjectURL(file));
            setImagePreviews(prev => [...prev, ...newPreviews]);
        }
    };

    const removeFile = (index: number) => {
        setImageFiles(prev => prev.filter((_, i) => i !== index));
        setImagePreviews(prev => {
            const newPreviews = prev.filter((_, i) => i !== index);
            URL.revokeObjectURL(prev[index]); // Cleanup
            return newPreviews;
        });
    };

    const handleAddProduct = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');

        try {
            let uploadedUrls: string[] = [];

            if (imageFiles.length === 0) {
                throw new Error("Please select at least one image.");
            }

            // Upload images to Supabase storage
            for (const file of imageFiles) {
                const fileExt = file.name.split('.').pop();
                const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
                const filePath = `${fileName}`;
                
                const { data: uploadData, error: uploadError } = await supabase.storage
                    .from('product-images')
                    .upload(filePath, file);

                if (uploadError) throw uploadError;

                const { data: { publicUrl } } = supabase.storage
                    .from('product-images')
                    .getPublicUrl(filePath);

                uploadedUrls.push(publicUrl);
            }

            const finalImageStr = uploadedUrls.join(',');

            const { data, error } = await supabase.from('products').insert([
                { name, price, image: finalImageStr, description, tag }
            ]);

            if (error) throw error;

            setMessage('Product added successfully!');
            setName('');
            setPrice('');
            setImageFiles([]);
            setImagePreviews([]);
            setDescription('');
            setTag('');
            fetchProducts();
        } catch (error: any) {
            setMessage(`Error: ${error.message}`);
        }
        
        setLoading(false);
    };

    const handleDelete = async (id: string | number) => {
        if (!confirm('Are you sure you want to delete this product?')) return;
        
        try {
            // Find product to get its images
            const product = products.find(p => p.id === id);
            
            if (product && product.image) {
                const urls = product.image.split(',').filter(Boolean);
                const filePaths = urls.map(url => {
                    const parts = url.split('product-images/');
                    if (parts.length > 1) {
                        const pathWithQuery = parts[1];
                        const cleanPath = pathWithQuery.split('?')[0];
                        return decodeURIComponent(cleanPath);
                    }
                    return null;
                }).filter(Boolean) as string[];
                
                if (filePaths.length > 0) {
                    const { error: storageError } = await supabase.storage
                        .from('product-images')
                        .remove(filePaths);
                    
                    if (storageError) {
                        console.error('Error deleting images from storage:', storageError);
                    }
                }
            }

            // Delete from database
            const { error: dbError } = await supabase.from('products').delete().eq('id', id);
            if (dbError) throw dbError;
            
            fetchProducts();
        } catch (error: any) {
            alert(`Error deleting product: ${error.message}`);
        }
    };

    if (!isAuthenticated) {
        return (
            <main className={`min-h-screen bg-black flex flex-col items-center justify-center relative font-sans selection:bg-indigo-500/30 overflow-hidden ${fredoka.className}`}>
                {/* Ambient Background Elements */}
                <div className="nebula-glow pointer-events-none" style={{ '--x': '30%', '--y': '20%' } as React.CSSProperties} />
                <div className="nebula-glow pointer-events-none" style={{ '--x': '70%', '--y': '80%', background: 'radial-gradient(600px circle at var(--x) var(--y), rgba(147, 51, 234, 0.15), transparent 40%)' } as React.CSSProperties} />

                <div className="relative z-10 flex flex-col items-center w-full">
                    {/* Logo and Title */}
                    <div className="flex flex-col items-center mb-10">
                        <div className="mb-6">
                            <img 
                                src="/logo.png" 
                                alt="Survival Electronics Logo" 
                                className="h-12 w-auto object-contain drop-shadow-[0_0_15px_rgba(255,255,255,0.1)]"
                            />
                        </div>
                        <h1 className="text-[22px] text-white font-bold tracking-wide">Survival Electronics</h1>
                        <p className="text-[#6c7385] text-[13px] mt-2 font-medium">Internal dashboard - restricted access</p>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleLogin} className="w-full max-w-[340px] flex flex-col gap-3">
                        {/* Input Field */}
                        <div className="flex items-center bg-[#13161e]/80 backdrop-blur-sm border border-white/5 focus-within:border-indigo-500/50 focus-within:bg-[#161a23]/80 rounded-2xl px-4 py-3.5 transition-all shadow-xl">
                            <Key className="w-4 h-4 text-[#5c6375] mr-3 flex-shrink-0" />
                            <input 
                                type="text" 
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                placeholder="Access ID"
                                className="bg-transparent text-white w-full focus:outline-none text-[15px] placeholder:text-[#5c6375] font-medium"
                                autoComplete="off"
                                spellCheck="false"
                            />
                        </div>
                        
                        {/* Submit Button */}
                        <button 
                            type="submit" 
                            className={`w-full ${password.length > 0 ? 'bg-indigo-600 hover:bg-indigo-500 text-white border-transparent shadow-[0_0_20px_rgba(79,70,229,0.3)]' : 'bg-[#181c25]/80 hover:bg-[#1f2430]/80 border-white/[0.03] text-white/70'} backdrop-blur-sm border rounded-2xl px-4 py-3.5 text-[15px] font-semibold transition-all duration-300 flex items-center justify-center gap-2 group`}
                        >
                            Continue <ArrowRight className={`w-4 h-4 ${password.length > 0 ? 'text-white translate-x-1' : 'text-white/40 group-hover:text-white/70'} transition-all duration-300`} />
                        </button>
                    </form>
                </div>

                {/* Footer Text */}
                <p className="absolute bottom-12 text-[#464c59] text-[11px] font-medium z-10">
                    Session expires after 8 hours
                </p>
            </main>
        );
    }

    return (
        <main className={`min-h-screen bg-black flex flex-col ${fredoka.className} text-white`}>
            {/* Vercel-style Top Navigation */}
            <header className="border-b border-[#222] bg-black/80 backdrop-blur-md sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <img src="/logo.png" className="h-6 w-auto" alt="Logo" />
                        <div className="h-5 w-[1px] bg-[#333] mx-1"></div>
                        <span className="font-semibold text-lg tracking-wide">Dashboard</span>
                    </div>
                    <button onClick={() => setIsAuthenticated(false)} className="flex items-center gap-2 px-3 py-1.5 border border-[#333] hover:border-[#555] hover:bg-[#111] rounded-md text-sm font-medium text-[#aaa] hover:text-white transition-all">
                        <LogOut className="w-4 h-4" />
                        Logout
                    </button>
                </div>
            </header>

            <div className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
                <div className="flex flex-col lg:flex-row gap-8 items-start">
                    
                    {/* Left Column: Add Product Form */}
                    <div className="w-full lg:w-[400px] flex-shrink-0">
                        <div className="bg-[#0A0A0A] border border-[#222] rounded-xl p-5 sm:p-6 shadow-2xl">
                            <h2 className="text-xl font-semibold mb-6">Add Product</h2>
                            <form onSubmit={handleAddProduct} className="flex flex-col gap-5">
                                <div>
                                    <label className="text-[13px] text-[#888] mb-1.5 block font-medium">Product Name</label>
                                    <input required value={name} onChange={e => setName(e.target.value)} className="w-full bg-black border border-[#333] rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-white focus:ring-1 focus:ring-white transition-all placeholder:text-[#444]" placeholder="e.g. Sonic Blender 9000" />
                                </div>
                                <div>
                                    <label className="text-[13px] text-[#888] mb-1.5 block font-medium">Price</label>
                                    <input required value={price} onChange={e => setPrice(e.target.value)} className="w-full bg-black border border-[#333] rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-white focus:ring-1 focus:ring-white transition-all placeholder:text-[#444]" placeholder="e.g. ₦48,000.00" />
                                </div>
                                
                                {/* Image Upload Area */}
                                <div>
                                    <label className="text-[13px] text-[#888] mb-1.5 block font-medium">Images (last will be used as cover)</label>
                                    <div className="w-full border border-dashed border-[#444] rounded-lg p-3 hover:border-[#888] transition-colors bg-black">
                                        <div className="flex flex-wrap gap-3 mb-3">
                                            {imagePreviews.map((preview, idx) => (
                                                <div key={idx} className="relative group w-16 h-16 rounded-md overflow-hidden border border-[#333]">
                                                    <img src={preview} alt="preview" className="w-full h-full object-cover" />
                                                    <button 
                                                        type="button" 
                                                        onClick={() => removeFile(idx)}
                                                        className="absolute inset-0 bg-black/70 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                                                    >
                                                        <X className="w-5 h-5 text-white" />
                                                    </button>
                                                </div>
                                            ))}
                                            
                                            <label className="w-16 h-16 rounded-md border border-[#333] bg-[#0A0A0A] flex flex-col items-center justify-center cursor-pointer hover:bg-[#111] transition-colors text-[#666] hover:text-white">
                                                <Upload className="w-5 h-5 mb-1" />
                                                <input 
                                                    type="file" 
                                                    accept="image/*" 
                                                    multiple 
                                                    className="hidden" 
                                                    onChange={handleFileSelect}
                                                />
                                            </label>
                                        </div>
                                        {imagePreviews.length === 0 && (
                                            <p className="text-[11px] text-[#666] text-center">Select product images</p>
                                        )}
                                    </div>
                                </div>

                                <div>
                                    <label className="text-[13px] text-[#888] mb-1.5 block font-medium">Tag (Optional)</label>
                                    <input value={tag} onChange={e => setTag(e.target.value)} className="w-full bg-black border border-[#333] rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-white focus:ring-1 focus:ring-white transition-all placeholder:text-[#444]" placeholder="e.g. Best Seller, Trending" />
                                </div>
                                <div>
                                    <label className="text-[13px] text-[#888] mb-1.5 block font-medium">Description</label>
                                    <textarea required value={description} onChange={e => setDescription(e.target.value)} className="w-full bg-black border border-[#333] rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-white focus:ring-1 focus:ring-white transition-all min-h-[100px] resize-y placeholder:text-[#444]" placeholder="Product details..." />
                                </div>
                                
                                <button type="submit" disabled={loading} className="w-full bg-white text-black hover:bg-gray-200 font-semibold py-2.5 rounded-lg mt-2 disabled:opacity-50 transition-colors text-sm">
                                    {loading ? 'Saving...' : 'Save Product'}
                                </button>
                                {message && <p className={`text-[13px] mt-1 text-center font-medium ${message.includes('Error') ? 'text-red-500' : 'text-green-500'}`}>{message}</p>}
                            </form>
                        </div>
                    </div>

                    {/* Right Column: Product List */}
                    <div className="w-full flex-1">
                        <div className="bg-[#0A0A0A] border border-[#222] rounded-xl overflow-hidden shadow-2xl">
                            <div className="p-5 sm:p-6 border-b border-[#222] flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-black">
                                <div className="flex items-center gap-3">
                                    <h2 className="text-xl font-semibold">Database</h2>
                                    <span className="bg-[#222] text-[11px] px-2.5 py-1 rounded-md text-[#aaa] font-medium border border-[#333]">
                                        {filteredProducts.length} Products
                                    </span>
                                </div>
                                <div className="w-full sm:w-auto relative">
                                    <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#666]" />
                                    <input 
                                        type="text" 
                                        placeholder="Search products..." 
                                        value={searchQuery}
                                        onChange={e => setSearchQuery(e.target.value)}
                                        className="w-full sm:w-64 bg-[#111] border border-[#333] rounded-lg pl-9 pr-3 py-2 text-sm focus:outline-none focus:border-white focus:ring-1 focus:ring-white transition-all placeholder:text-[#555]"
                                    />
                                </div>
                            </div>
                            
                            <div className="divide-y divide-[#222]">
                                {filteredProducts.length === 0 ? (
                                    <div className="p-12 text-center text-[#666] text-sm">
                                        No products found.
                                    </div>
                                ) : filteredProducts.map(p => (
                                    <div key={p.id} className="p-4 sm:p-6 flex flex-col sm:flex-row gap-5 items-start sm:items-center hover:bg-[#111] transition-colors group">
                                        <div className="flex -space-x-3 flex-shrink-0">
                                            {p.image.split(',').filter(Boolean).slice(0, 3).map((img, i) => (
                                                <div key={i} className="w-14 h-14 bg-black rounded-lg overflow-hidden border-2 border-[#0A0A0A] relative z-[1]">
                                                    <img src={img} alt={`${p.name} - ${i}`} className="w-full h-full object-cover" />
                                                </div>
                                            ))}
                                            {p.image.split(',').filter(Boolean).length > 3 && (
                                                <div className="w-14 h-14 rounded-lg bg-[#222] border-2 border-[#0A0A0A] flex items-center justify-center text-xs font-medium text-[#aaa] relative z-[1]">
                                                    +{p.image.split(',').filter(Boolean).length - 3}
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h3 className="font-semibold text-[15px] truncate text-white" title={p.name}>{p.name}</h3>
                                            <div className="flex items-center gap-3 mt-1">
                                                <p className="text-[#888] text-sm font-medium">{p.price}</p>
                                                {p.tag && (
                                                    <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-[#222] text-[#ccc] border border-[#333]">
                                                        {p.tag}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                        <button 
                                            onClick={() => handleDelete(p.id)} 
                                            className="w-full sm:w-auto px-4 py-2 rounded-lg border border-red-900/50 text-red-500 hover:bg-red-500/10 transition-colors text-[13px] font-medium"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </main>
    );
}
