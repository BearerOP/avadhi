"use client";
import Link from "next/link";
import { motion } from "framer-motion";

export default function Navbar() {
    const { user } = { user: null }

    return (
        <nav className="sticky top-4 z-20 flex w-full max-w-7xl mx-auto items-center justify-between mb-12 py-3 px-6">
            <motion.div
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, ease: "easeInOut", type: "spring", damping: 10 }}
                className="flex w-full justify-between items-center bg-black/20 shadow-2xl backdrop-blur-lg border border-white/10 p-6 rounded-2xl"
            >
                <Link href={"/"} className="flex items-center gap-2 cursor-pointer">
                    <span className="inline-flex items-center gap-2 text-green-200/80 font-bold bg-black/60 px-4 py-2 md:px-6 md:py-3 rounded-2xl uppercase tracking-widest shadow-2xl backdrop-blur-lg text-xs sm:text-sm md:text-base lg:text-lg">
                        <svg className="h-3 w-3 sm:h-4 sm:w-4 md:h-5 md:w-5 text-green-300" fill="currentColor" viewBox="0 0 24 24"><circle cx="12" cy="12" r="8" /></svg>
                        Avadhi
                    </span>
                </Link>
                
                <div className="flex gap-2 sm:gap-3 md:gap-4">
                    {!user ? (
                        <>
                            <Link 
                                href="/login" 
                                className="text-gray-300 hover:text-white transition-colors duration-200 font-medium text-sm sm:text-base md:text-lg px-3 py-2 md:px-4 md:py-2 rounded-lg hover:bg-white/10"
                            >
                                Login
                            </Link>
                            <Link 
                                href="/signup" 
                                className="bg-green-600 hover:bg-green-700 text-white px-3 py-2 md:px-5 md:py-2 rounded-lg transition-colors duration-200 font-medium text-sm sm:text-base md:text-lg shadow-lg hover:shadow-xl"
                            >
                                Sign Up
                            </Link>
                        </>
                    ) : (
                        <div className="flex items-center gap-4">
                            <Link 
                                href="/dashboard" 
                                className="text-gray-300 hover:text-white transition-colors duration-200 font-medium text-sm sm:text-base md:text-lg px-3 py-2 md:px-4 md:py-2 rounded-lg hover:bg-white/10"
                            >
                                Dashboard
                            </Link>
                            <button className="text-gray-300 hover:text-white transition-colors duration-200 font-medium text-sm sm:text-base md:text-lg px-3 py-2 md:px-4 md:py-2 rounded-lg hover:bg-white/10">
                                Logout
                            </button>
                        </div>
                    )}
                </div>
            </motion.div>
        </nav>
    );
}



// return (
//     <nav className="sticky mx-auto wrapper top-0 z-50 flex items-center gap-2 py-6 w-full">
//       <motion.div
//         initial={{ y: -20, opacity: 0 }}
//         animate={{ y: 0, opacity: 1 }}
//         transition={{ duration: 0.5, ease: "easeInOut", type: "spring", damping: 10 }}
//         className="flex w-full justify-between mx-auto bg-secondary/15 shadow-lg shadow-neutral-600/5 backdrop-blur-lg border border-primary/10 p-6 rounded-2xl"
//       >
//         <Link href={"/"} className="flex items-center gap-2 cursor-pointer">
          
//           <span className="text-lg md:text-2xl font-bold tracking-tight text-foreground hidden md:block">
//             Avadhi
//           </span>
//         </Link>
//         <div className="flex items-center gap-8">
//           {/* <ModeToggle /> */}
//           {!user ? (
//             <button
//             //   size={"lg"}
//             //   onClick={async () => {
//             //     await signIn();
//             //   }}
//             >
//               Login
//             </button>
//           ) : (
//             ""
//           )}

//           {/* <UserAccountDropDown /> */}
//         </div>
//       </motion.div>
//     </nav>
//   );
// };

