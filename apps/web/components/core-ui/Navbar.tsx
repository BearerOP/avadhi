"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@repo/ui";
import { useState } from "react";
import { useSession } from "next-auth/react";
import SignInModal from "./SignInModal";
import UserProfile from "./UserProfile";
import Image from "next/image";

export default function Navbar() {
    const [isSignInModalOpen, setIsSignInModalOpen] = useState<boolean>(false);
    const { data: session, status } = useSession();

    // handle sign in modal
    const handleSignIn = () => {
        setIsSignInModalOpen(true);
    };

    return (
        <>
        <SignInModal
            isOpen={isSignInModalOpen}
            onClose={() => setIsSignInModalOpen(false)}
        />
        <motion.nav
        
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{
            duration: 0.5,
            ease: "easeInOut",
            type: "spring",
            damping: 20,
        }}
        className="sticky max-w-3xl w-full mx-auto top-4 z-50 flex items-center justify-between place-self-center flex-wrap gap-2 p-2 px-4 mt-4 rounded-xl  h-full bg-teal-700 dark:bg-teal-50/10 shadow-lg shadow-neutral-600/5 backdrop-blur-md ">
            {/* sign in modal */}

            <div
               
                className="flex w-full justify-between items-center text-gray-800 dark:text-gray-200"
            >
                <Link href={"/"} className="flex items-center gap-2 cursor-pointer">
                    <span className="
                    inline-flex items-center gap-2 text-green-200/80 font-bold  rounded-lg uppercase tracking-widest shadow-2xl  text-xs sm:text-sm p-2">
                        <Image src="/icon.svg" alt="Avadhi" width={16} height={16} />
                        <svg
                            className="h-3 w-3 sm:h-4 sm:w-4 md:h-5 md:w-5 text-teal-300"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <circle cx="12" cy="12" r="6" />
                        </svg>
                        Avadhi
                    </span>
                </Link>

                <div className="flex gap-2 sm:gap-3 md:gap-4 items-center">
                    {status === "loading" ? (
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-muted animate-pulse rounded-full"></div>
                            <div className="w-20 h-4 bg-muted animate-pulse rounded"></div>
                        </div>
                    ) : !session ? (
                        <Button
                            onClick={handleSignIn}
                            size={"sm"}
                            className="bg-teal-600 hover:bg-teal-700 text-white px-3 py-4 md:px-5 md:py-2 rounded-lg transition-colors duration-200 font-medium text-sm sm:text-base md:text-sm shadow-lg hover:shadow-xl cursor-pointer"
                        >
                            Sign In
                        </Button>
                    ) : (
                        <div className="flex items-center gap-2 sm:gap-3 md:gap-4">
                            {/* Welcome message with username */}
                            <div className="hidden sm:flex items-center gap-2">
                                <span className="text-gray-300 text-sm">Welcome,</span>
                                <span className="font-semibold text-white bg-teal-600/30 px-3 py-1 rounded-full border border-teal-400/30 text-sm">
                                    {session.user?.name || session.user?.email?.split('@')[0] || 'User'}
                                </span>
                            </div>
                            
                            {/* Mobile version - shorter */}
                            <div className="sm:hidden flex items-center">
                                <span className="font-semibold text-white bg-teal-600/30 px-2 py-1 rounded-full border border-teal-400/30 text-xs">
                                    {session.user?.name?.split(' ')[0] || session.user?.email?.split('@')[0] || 'User'}
                                </span>
                            </div>
                            
                            <div className="flex items-center gap-2">
                                <Link
                                    href="/dashboard"
                                    className="text-gray-300 hover:text-white transition-colors duration-200 font-medium text-xs sm:text-sm px-2 py-1 sm:px-3 sm:py-2 rounded-lg hover:bg-white/10 border border-transparent hover:border-teal-400/30"
                                >
                                    Dashboard
                                </Link>
                                <UserProfile />
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </motion.nav>
        </>

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
