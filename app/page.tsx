import MachineScroll from "./components/MachineScroll";
import Navbar from "./components/Navbar";
import SectionTitle from "./components/SectionTitle";
import CategoryGrid from "./components/CategoryGrid";
import ProductCard from "./components/ProductCard";
import Footer from "./components/Footer";
import { MoveRight } from "lucide-react";
import { getProducts, createSlug, Product } from "./lib/api";

export default async function Home() {
    let dbProducts: Product[] = [];
    try {
        const allProducts = await getProducts();
        dbProducts = allProducts.slice(0, 3);
    } catch (e) {
        console.error("Failed to load trending products:", e);
    }

    const fallbackProducts = [
        {
            id: "fb-1",
            name: "Sonic Blender 9000",
            price: "from ₦48,000.00",
            image: "https://i.ibb.co/qFpkYgCS/blender.jpg",
            tag: "Best Seller"
        },
        {
            id: "fb-2",
            name: "Atyme 32-inch HD TV",
            price: "from ₦178,000.00",
            image: "https://i.ibb.co/TxK1TFJq/tv1.jpg",
            tag: "New"
        },
        {
            id: "fb-3",
            name: "18-inch Solar Standing Fan",
            price: "from ₦90,500.00",
            image: "https://i.ibb.co/LDCvrCNs/Total-Solar-Energy-Solar-Standing-Fan.jpg",
            tag: ""
        }
    ] as any[];

    const displayProducts = [...dbProducts];
    if (displayProducts.length < 3) {
        const needed = 3 - displayProducts.length;
        displayProducts.push(...fallbackProducts.slice(0, needed));
    }

    return (
        <main className="relative bg-black min-h-screen">

            <Navbar />

            {/* Main Hero Scroll Experience */}
            <div className="flex flex-col md:flex-row mb-20">

                {/* Left Column: Narrative (Scrolls naturally) */}
                <div className="w-full md:w-1/2 relative z-10">
 
                    {/* Section 1: Intro (0vh - 100vh) */}
                    <section className="flex h-screen flex-col justify-center px-6 md:px-20">
                        <div className="glass-panel inline-flex w-fit items-center gap-2 rounded-full px-4 py-1.5 mb-6 text-xs font-medium text-indigo-300">
                            <span className="h-1.5 w-1.5 rounded-full bg-indigo-500 animate-pulse" />
                            Trusted Electronics Dealer
                        </div>
                        <h1 className="text-5xl md:text-7xl font-bold leading-[0.9] text-white/90 mb-6">
                            Survival <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
                                Electronics.
                            </span>
                        </h1>
                        <p className="max-w-md text-lg text-white/60 leading-relaxed mb-8">
                            <b>Your #1 Electronics Store in Lagos.</b> <br />
                            We sell original TVs, generators, fans, and home appliances at the best prices.
                            Visit our optimization shop today for genuine products and expert advice.
                        </p>
                        <div className="flex items-center gap-4 text-sm text-white/40">
                            <span>SCROLL TO EXPLORE</span>
                            <MoveRight className="w-4 h-4 animate-bounce" />
                        </div>
                    </section>

                    {/* Section 2: Expansion (100vh - 200vh) */}
                    <section className="flex h-screen flex-col justify-center px-6 md:px-20">
                        <h2 className="text-4xl md:text-5xl font-semibold text-white/90 mb-6">
                            Genuine <br /> Brands
                        </h2>
                        <p className="max-w-md text-lg text-white/60 leading-relaxed">
                            We are authorized dealers for major brands like Samsung, LG, Hisense, and reliable generator brands.
                            Get original products with manufacturer warranty.
                        </p>
                        <div className="mt-8 grid grid-cols-2 gap-4">
                            <div className="glass-panel p-4 rounded-xl">
                                <div className="text-2xl font-bold text-white mb-1">100%<span className="text-sm text-white/40 ml-1">Original</span></div>
                                <div className="text-xs text-white/50">Quality Guaranteed</div>
                            </div>
                            <div className="glass-panel p-4 rounded-xl">
                                <div className="text-2xl font-bold text-white mb-1">24/7<span className="text-sm text-white/40 ml-1">Support</span></div>
                                <div className="text-xs text-white/50">Expert Advice</div>
                            </div>
                        </div>
                    </section>

                    {/* Section 3: Core (200vh - 300vh) */}
                    <section className="flex h-screen flex-col justify-center px-6 md:px-20">
                        <h2 className="text-4xl md:text-5xl font-semibold text-white/90 mb-6">
                            Power <br /> Solutions
                        </h2>
                        <p className="max-w-md text-lg text-white/60 leading-relaxed">
                            Don't let power cuts stop you. We stock durable generators, solar fans, and inverters
                            perfect for Lagos homes and businesses.
                        </p>
                    </section>

                    {/* Section 4: Reassembly/Conclusion (300vh - 400vh) */}
                    <section className="flex h-screen flex-col justify-center px-6 md:px-20">
                        <h2 className="text-4xl md:text-5xl font-semibold text-white/90 mb-6">
                            Visit Our <br /> Store
                        </h2>
                        <div className="flex flex-col gap-4">
                            <p className="text-white/60 mb-4">
                                Located in Lagos. Call us to confirm availability or get directions.
                            </p>
                            <a
                                href="https://wa.me/2347063638558?text=Hello%20Survival%20Electronics%20I%20want%20to%20make%20enquiry"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-fit rounded-full bg-white px-8 py-4 text-black font-semibold hover:bg-gray-200 transition-colors inline-block text-center"
                            >
                                Chat on WhatsApp
                            </a>
                        </div>
                    </section>

                </div>

                {/* Right Column: Visuals (Sticky inside component) */}
                <div className="absolute inset-0 z-0 h-full w-full pointer-events-none md:pointer-events-auto md:relative md:inset-auto md:w-1/2 md:pr-12">
                    <MachineScroll />
                </div>
            </div>

            {/* New Content Sections */}
            <div className="relative z-10 bg-gradient-to-b from-transparent to-black/80 pt-20">

                {/* Categories */}
                <section id="categories" className="container mx-auto px-6 py-20">
                    <SectionTitle title="Explore by Category" subtitle="Curated Collections" />
                    <CategoryGrid />
                </section>

                {/* Trending Products */}
                <section id="products" className="container mx-auto px-6 py-20">
                    <SectionTitle title="Trending Now" subtitle="Customer Favorites" />
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {displayProducts.map((product) => (
                            <ProductCard
                                key={product.id}
                                name={product.name}
                                price={product.price}
                                image={product.image ? product.image.split(',')[0] : "https://i.ibb.co/zh1sb5mT/No-Image-for-this-Product-yet.png"}
                                tag={product.tag}
                                href={`/store/${createSlug(product as any)}`}
                            />
                        ))}
                    </div>
                </section>

                {/* Brand Vision/Banner */}
                <section id="vision" className="my-20 px-6">
                    <div className="container mx-auto rounded-3xl bg-indigo-900/20 border border-indigo-500/20 p-12 text-center md:p-24 relative overflow-hidden">
                        <div className="absolute inset-0 opacity-30 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-indigo-500 via-transparent to-transparent" />
                        <div className="relative z-10">
                            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">Why Choose Survival Electronics?</h2>
                            <p className="text-white/60 max-w-2xl mx-auto text-lg mb-8">
                                We are committed to providing durable, high-quality electronics to every Lagosian.
                                Trust us for the best deals on home appliances.
                            </p>
                            <button className="bg-white text-black px-8 py-3 rounded-full font-medium hover:bg-gray-200 transition-colors">
                                View Products
                            </button>
                        </div>
                    </div>
                </section>

                <Footer />
            </div>

            {/* Ambient Background Elements */}
            <div className="nebula-glow" style={{ '--x': '20%', '--y': '30%' } as React.CSSProperties} />
            <div className="nebula-glow" style={{ '--x': '80%', '--y': '70%', background: 'radial-gradient(600px circle at var(--x) var(--y), rgba(147, 51, 234, 0.1), transparent 40%)' } as React.CSSProperties} />

        </main>
    );
}
