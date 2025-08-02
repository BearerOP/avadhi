import { motion } from "framer-motion";
import { ProgressiveBlur } from "@repo/ui";
export default function Hero() {
    return (
        <div className="flex flex-col gap-4 h-[50vh] md:h-[75vh] size-screen mx-auto justify-center">
<motion.div
animate={{ y: 0, opacity: 1 }}
transition={{ duration: 0.5, ease: "easeInOut", type: "spring", damping: 10, delay: 0.3 }}
initial={{ y: -20, opacity: 0 }}
className="max-w-7xl mx-auto px-4 flex flex-col gap-4 items-center justify-center"
>
<div className="flex flex-col items-center justify-center">
  <span className="tracking-tighter text-2xl md:text-3xl text-center font-medium text-primary/80 ">
    Introducing
  </span>
  <h1 className="text-6xl md:text-8xl xl:text-9xl text-center font-bold my-2">
    <span >Avadhi</span> {" "}<span className="tracking-tight text-teal-300 font-mono text-3xl md:text-4xl xl:text-7xl">v0.1</span>
  </h1>
</div>
<p className="text-primary/80 max-w-lg text-center tracking-tight md:text-lg font-light">
 A platform to monitor your website and API status in real-time and get notified when they are down.
</p>
<ProgressiveBlur className="absolute top-0 left-0 w-full h-full" />
</motion.div>
</div>
    )
}   