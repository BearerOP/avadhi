import { motion } from "framer-motion";

export default function Hero() {
  return (
    <div className="flex flex-col gap-4 h-[50vh] md:h-[66vh] size-screen mx-auto justify-center z-10">
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
          <h1 className="tracking-tighter text-5xl md:text-7xl xl:text-8xl text-center font-bold my-2">
            Avadhi {" "}<span className="-tracking-normal text-4xl text-teal-400 font-medium bg-teal-400/10 px-4 py-1 rounded-full mb-2 align-middle">
                v0.1
              </span>
          </h1>
        </div>
        <p className="text-primary/80 max-w-lg text-center tracking-tight md:text-lg font-light">
          A platform to monitor your website and API status in real-time and get notified when they are down.
        </p>
        {/* <ContentSearch tracks={tracks} /> */}
      </motion.div>
    </div>
  )
}   