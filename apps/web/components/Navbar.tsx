import Link from "next/link";

export default function Navbar() {
    return (
        <div className=" p-4 z-20 flex w-full max-w-4xl items-center pt-12 justify-between mb-12 bg-black/60 px-5 py-2 rounded-2xl border-white/10 border   shadow-2xl backdrop-blur-lg">
            <div className="flex gap-4">
                <span className="inline-flex items-center gap-2 text-green-200/80 font-bold bg-black/60 px-5 py-2 rounded-2xl border-white/10 border uppercase tracking-widest shadow-2xl backdrop-blur-lg text-xs md:text-base">
  <svg className="h-4 w-4 text-green-300" fill="currentColor" viewBox="0 0 24 24"><circle cx="12" cy="12" r="8"/></svg>
  Avadhi
</span>            
            </div>

            <div className="flex gap-4">
                <Link href="/login">Login</Link>                
            </div>
        </div>
    )
}

// <div className="z-20 flex w-full max-w-4xl items-center pt-12 justify-between mb-12">

// <span className="text-gray-300/60 tracking-wider font-medium text-xs md:text-sm select-none">
//   Website Monitoring Platform
// </span>
// </div>