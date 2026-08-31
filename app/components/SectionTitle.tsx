export default function SectionTitle({ title, subtitle }: { title: string; subtitle?: string }) {
    return (
        <div className="mb-12">
            {subtitle && (
                <div className="mb-2 text-sm font-medium text-indigo-400 uppercase tracking-widest">
                    {subtitle}
                </div>
            )}
            <h2 className="text-3xl md:text-5xl font-bold text-white/90">
                {title}
            </h2>
            <div className="mt-4 h-1 w-20 rounded-full bg-gradient-to-r from-blue-500 to-purple-600" />
        </div>
    );
}
