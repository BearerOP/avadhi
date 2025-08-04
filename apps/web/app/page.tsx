'use client'
import Navbar from '../components/core-ui/Navbar';
import Hero from '../components/core-ui/Hero';
import TabList from '../components/core-ui/TabList';
import Footer from '../components/core-ui/Footer';

// export default function Page() {
//   return (
//     <main className="min-h-screen w-full flex flex-col items-center overflow-hidden px-4 font-sans bg-[#121818]">
//       {/* Smooth mesh gradient background */}
//       <div className="absolute inset-0 z-0">
//         <svg className="w-full h-full" viewBox="0 0 1500 1200" fill="none">
//           <defs>
//             <radialGradient id="g1" cx="0.4" cy="0.3" r="0.9">
//               <stop offset="0%" stopColor="#44ffbb" stopOpacity="0.25" />
//               <stop offset="70%" stopColor="#121818" stopOpacity="0" />
//             </radialGradient>
//             <radialGradient id="g2" cx="0.7" cy="0.7" r="0.7">
//               <stop offset="0%" stopColor="#66ff99" stopOpacity="0.15" />
//               <stop offset="90%" stopColor="#121818" stopOpacity="0" />
//             </radialGradient>
//             <radialGradient id="g3" cx="0.7" cy="0.3" r="1.1">
//               <stop offset="0%" stopColor="#16f561" stopOpacity="0.20" />
//               <stop offset="100%" stopColor="#121818" stopOpacity="0" />
//             </radialGradient>
//           </defs>
//           <rect width="1500" height="1200" fill="url(#g1)" />
//           <rect width="1500" height="1200" fill="url(#g2)" />
//           <rect width="1500" height="1200" fill="url(#g3)" />
//         </svg>
//       </div>

//       {/* Navbar */}
//       <Navbar />

//       {/* Hero Section */}
//       <section className="mb-16 w-full flex flex-col items-center">
//         {/* Inset mesh highlight */}
//         <div className="absolute w-80 h-80 bg-gradient-to-br from-green-400/80 via-white/5 to-transparent left-1/2 -translate-x-1/2 top-3 rounded-full blur-3xl opacity-70 pointer-events-none" />
//         <div className="max-w-2xl mx-auto flex flex-col items-center bg-white/5 border-white/10 border backdrop-blur-lg rounded-3xl shadow-2xl px-8 pt-14 pb-10 relative">
//           <h1 className="text-5xl md:text-6xl font-extrabold text-white mb-5 tracking-tight drop-shadow-[0_2px_50px_rgba(39,255,153,0.22)]">
//             See Every Pulse of Your APIs. <span className="inline-block align-middle text-green-400">🌱</span>
//           </h1>
//           <p className="mb-8 text-xl text-gray-200 font-light tracking-wide">
//             All your sites & APIs, one dashboard. Real-time logs, uptime analytics, secure REST API.
//           </p>
//           <Link
//             href="/dashboard"
//             className="rounded-xl bg-gradient-to-r from-green-400/80 to-teal-500/90 px-10 py-4 text-white font-bold text-lg shadow-xl hover:scale-105 transition-transform"
//           >
//             View Dashboard Demo
//           </Link>
//         </div>
//       </section>

//       {/* Cards (Dashboard/API/GitHub/Deploy) */}
//       <section className="z-20 grid sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-4xl w-full mb-20 relative">
//         {LINKS.map(({ title, href, description }) => (
//           <LinkCard href={href} key={title} title={title}>
//             {description}
//           </LinkCard>
//         ))}
//       </section>

//       {/* Feature highlights */}
//       <section className="z-20 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-lg shadow-2xl px-8 py-16 w-full max-w-5xl mb-28 mt-2 flex flex-col items-center">
//         <h2 className="text-3xl font-extrabold mb-12 text-white text-center tracking-tight">Why Avadhi?</h2>
//         <div className="grid gap-12 md:grid-cols-3 w-full">
//           {/* Feature 1 */}
//           <div className="flex flex-col items-center">
//             <div className="mb-5 w-14 h-14 rounded-full bg-green-600/30 flex items-center justify-center shadow-lg">
//               <svg className="w-8 h-8 text-green-300" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
//               </svg>
//             </div>
//             <h3 className="font-semibold text-lg text-white mb-1">Real-Time Monitoring</h3>
//             <p className="text-gray-300 text-base text-center">Instant updates & 5-min status logs for all your APIs.</p>
//           </div>
//           {/* Feature 2 */}
//           <div className="flex flex-col items-center">
//             <div className="mb-5 w-14 h-14 rounded-full bg-teal-400/30 flex items-center justify-center shadow-lg">
//               <svg className="w-8 h-8 text-teal-200" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
//               </svg>
//             </div>
//             <h3 className="font-semibold text-lg text-white mb-1">Analytics Dashboard</h3>
//             <p className="text-gray-300 text-base text-center">See uptime, latency & clear performance trends.</p>
//           </div>
//           {/* Feature 3 */}
//           <div className="flex flex-col items-center">
//             <div className="mb-5 w-14 h-14 rounded-full bg-purple-500/20 flex items-center justify-center shadow-lg">
//               <svg className="w-8 h-8 text-purple-300" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
//               </svg>
//             </div>
//             <h3 className="font-semibold text-lg text-white mb-1">Secure Integrations</h3>
//             <p className="text-gray-300 text-base text-center">REST API w/ JWT for safe programmatic access.</p>
//           </div>
//         </div>
//       </section>

//       {/* Copyright / Footer */}
//       <footer className="mb-10 text-gray-500 z-50 relative text-sm">
//         <div className="flex justify-center items-center gap-2 opacity-90">
//           © {new Date().getFullYear()} Avadhi
//           <span className="text-green-300 text-base">•</span>
//           Crafted with <span className="text-green-300">●</span>
//         </div>
//       </footer>
//     </main>
//   );
// }

// function LinkCard({ href, title, children }: { href: string; title: string; children: React.ReactNode }) {
//   return (
//     <Link
//       href={href}
//       className="flex flex-col bg-white/5 hover:bg-white/10 transition rounded-2xl backdrop-blur-xl border border-white/10 shadow-xl p-6 md:p-7 mx-auto text-left mb-4 md:mb-0"
//       style={{
//         boxShadow: "0 8px 40px 0 rgba(75,255,175,0.08)", // soft glass glow
//       }}
//       target={href.startsWith("http") ? "_blank" : "_self"}
//       rel="noopener noreferrer"
//     >
//       <h4 className="mb-1 font-bold text-lg text-white">{title}</h4>
//       <p className="text-gray-300">{children}</p>
//     </Link>
//   );
// }

// const LINKS = [
//   {
//     title: "Dashboard Demo",
//     href: "/dashboard",
//     description: "View the website monitoring dashboard with real-time logs and analytics.",
//   },
//   {
//     title: "API Documentation",
//     href: "http://localhost:3002",
//     description: "Explore the REST API endpoints for website monitoring.",
//   },
//   {
//     title: "GitHub",
//     href: "https://github.com/your-org/avadhi",
//     description: "View the source code and contribute to the project.",
//   },
//   {
//     title: "Deploy",
//     href: "https://vercel.com/new",
//     description:
//       "Instantly deploy your website monitoring platform to a shareable URL with Vercel.",
//   },
// ];

// import { getAllCategories } from "../components/utils";
// import { getAllTracks } from "../components/utils";
// import Footer from "./footer";
// import Hero from "../components/Hero";
// import { Tracks } from "../components/Tracks";
// import FooterCTA from "./footer-cta";

export default function Landing() {
  // const tracks = await getAllTracks();
  // const categories = await getAllCategories(); // Fetch categories

  return (
    <div className="flex flex-col">
      <Navbar />
      <Hero/>
      <TabList />
      {/* <FooterCTA /> */}
      <Footer /> 
    </div>
  );
}