'use client'
import Link from "next/link";
import { motion } from "framer-motion";
import { Heart, Github, Mail, Globe } from "lucide-react";
import Image from "next/image";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <motion.footer 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="w-full mt-20 mb-8"
    >
      <div className="max-w-4xl mx-auto px-6">
        {/* Subtle divider */}
        <div className="w-full h-px bg-gradient-to-r from-transparent via-border to-transparent mb-8" />
        
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Logo and tagline */}
          <div className="flex flex-col items-center md:items-start gap-2">
            <div className="flex items-center gap-2">
              <Image src="/icon.svg" alt="Avadhi" width={16} height={16} />
              <span className="text-xl font-bold tracking-tight">
                Avadhi
              </span>
              <span className="text-xs text-teal-400 font-medium bg-teal-400/10 px-2 py-1 rounded-full">
                v0.1
              </span>
            </div>
            <p className="text-sm text-muted-foreground text-center md:text-left">
              Monitor. Notify. Optimize.
            </p>
          </div>

          {/* Links */}
          <div className="flex items-center gap-6">
            <Link 
              href="https://github.com" 
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Github className="w-4 h-4" />
              <span className="hidden sm:inline">GitHub</span>
            </Link>
            <Link 
              href="mailto:hello@avadhi.dev" 
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <Mail className="w-4 h-4" />
              <span className="hidden sm:inline">Contact</span>
            </Link>
            <Link 
              href="/docs" 
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <Globe className="w-4 h-4" />
              <span className="hidden sm:inline">Docs</span>
            </Link>
          </div>

          {/* Copyright */}
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>© {currentYear} Avadhi</span>
            <span className="text-teal-400">•</span>
            <span>Made with</span>
            <Heart className="w-4 h-4 text-red-400 fill-current" />
          </div>
        </div>
      </div>
    </motion.footer>
  );
};

export default Footer;