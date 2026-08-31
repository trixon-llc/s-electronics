import Link from "next/link";
import { ArrowRight } from "lucide-react";

const categories = [
    { name: "Kitchen", count: "12 Products", image: "https://i.ibb.co/WvgBHgLG/kitchen.webp" },
    { name: "Climate", count: "8 Products", image: "https://i.ibb.co/KcSYnqjG/climate.png" },
    { name: "Cleaning", count: "5 Products", image: "https://i.ibb.co/hJgDHyB2/clean.jpg" },
    { name: "Smart Home", count: "15 Products", image: "https://i.ibb.co/WW36NBb4/home.webp" },
];

export default function CategoryGrid() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {categories.map((cat) => (
                <Link
                    href="/store"
                    key={cat.name}
                    className="group relative h-64 overflow-hidden rounded-2xl border border-white/5 bg-gray-900 p-6 transition-all hover:border-white/20 cursor-pointer"
                >
                    <div className="absolute inset-0 z-0">
                        <img
                            src={cat.image}
                            alt={cat.name}
                            className="h-full w-full object-cover opacity-60 transition-transform duration-700 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                    </div>

                    <div className="relative z-10 flex h-full flex-col justify-end">
                        <div>
                            <h3 className="text-2xl font-bold text-white mb-2">{cat.name}</h3>
                            <p className="text-white/60 text-sm">{cat.count}</p>
                        </div>

                        <div className="flex items-center gap-2 text-sm font-medium text-white/50 opacity-0 transition-all group-hover:opacity-100 group-hover:translate-x-2 mt-4">
                            <span>Explore</span>
                            <ArrowRight className="h-4 w-4" />
                        </div>
                    </div>
                </Link>
            ))}
        </div>
    );
}
