
export default function Logo() {
    return (
        <a href="/" className="group flex items-center gap-3 no-underline outline-none rounded-lg focus-visible:ring-2 focus-visible:ring-blue-600">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-linear-to-br from-blue-600 to-blue-400 text-white font-bold text-xl shadow-sm group-hover:shadow-md group-hover:scale-105 transition-all duration-300">
                L
            </div>
            <span className="text-xl font-bold tracking-tighter text-[#171717]">
                App<span className="text-blue-600">Citas</span>
            </span>
        </a>
    )
}