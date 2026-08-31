import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";

interface ProductProps {
    name: string;
    price: string;
    image: string;
    tag?: string;
    href?: string;
    onClick?: () => void;
}

export default function ProductCard({ name, price, image, tag, onClick, ...props }: ProductProps) {
    const Content = () => (
        <>
            {tag && (
                <div className="absolute top-4 left-4 z-10 rounded-full bg-indigo-500/20 px-3 py-1 text-xs font-medium text-indigo-300 backdrop-blur-md">
                    {tag}
                </div>
            )}

            <div className="relative aspect-square w-full mb-4 overflow-hidden rounded-xl bg-black/20">
                {image ? (
                    <img src={image} alt={name} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" />
                ) : (
                    <div className="h-full w-full bg-gradient-to-br from-gray-800 to-gray-900" />
                )}
            </div>

            <div className="flex items-end justify-between">
                <div>
                    <h3 className="text-lg font-semibold text-white mb-1 group-hover:text-indigo-300 transition-colors">{name}</h3>
                    <p className="text-sm text-white/60">{price}</p>
                </div>
                <div className="rounded-full bg-white/10 p-2 text-white transition-colors hover:bg-white/20 group-hover:bg-indigo-500">
                    <ArrowUpRight className="h-5 w-5" />
                </div>
            </div>
        </>
    );

    if (onClick) {
        return (
            <button
                onClick={onClick}
                className="block w-full text-left group relative glass-panel rounded-2xl overflow-hidden p-4 transition-all hover:bg-white/5 hover:scale-[1.02]"
            >
                <Content />
            </button>
        );
    }

    return (
        <Link
            href={onClick ? "#" : (props.href || "/store")}
            className="block group relative glass-panel rounded-2xl overflow-hidden p-4 transition-all hover:bg-white/5 hover:scale-[1.02]"
        >
            <Content />
        </Link>
    );
}
