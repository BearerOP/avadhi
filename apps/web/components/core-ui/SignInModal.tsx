import { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@repo/ui";
import { X, Github } from "lucide-react";

interface SignInModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SignInModal({ isOpen, onClose }: SignInModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);

  // Handle outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscapeKey);
      document.body.style.overflow = 'hidden'; // Prevent background scroll
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscapeKey);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  return (
    <AnimatePresence mode="wait">
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15, ease: [0.4, 0.0, 0.2, 1] }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/30"
        >
          <motion.div 
            ref={modalRef}
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ 
              duration: 0.15, 
              ease: [0.4, 0.0, 0.2, 1],
              opacity: { duration: 0.1 }
            }}
            className="bg-background/70 backdrop-blur-xl border border-border shadow-xl p-6 rounded-xl w-full max-w-md mx-4 relative"
            style={{ willChange: 'transform, opacity' }}
          >
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-1 rounded-lg hover:bg-muted/50 transition-colors duration-150"
            >
              <X className="w-4 h-4 text-muted-foreground" />
            </button>

            <div className="flex flex-col gap-6">
              {/* Header */}
              <div className="flex flex-col gap-2 pr-8">
                <h2 className="text-xl font-semibold text-foreground">Welcome back</h2>
                <p className="text-sm text-muted-foreground">
                  Sign in to access your monitoring dashboard
                </p>
              </div>

              {/* Sign in options */}
              <div className="flex flex-col gap-3">
                <Button 
                  variant="outline" 
                  className="w-full rounded-xl cursor-pointer justify-center gap-2 h-11 border-border hover:bg-teal-950/30  transition-colors duration-150"
                  onClick={() => {
                    // Handle Google OAuth
                    console.log('Google OAuth');
                  }}
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path
                      fill="currentColor"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="currentColor"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                  Continue with Google
                </Button>

                <Button 
                  variant="outline" 
                  className="w-full rounded-xl justify-center gap-2 h-11 border-border hover:bg-teal-950/30 transition-colors duration-150"
                  onClick={() => {
                    // Handle GitHub OAuth
                    console.log('GitHub OAuth');
                  }}
                >
                  <Github className="w-4 h-4" />
                  Continue with GitHub
                </Button>
              </div>

              {/* Footer */}
              <div className="text-center">
                <p className="text-xs text-muted-foreground">
                  I agree to our{" "}
                  <button className="underline hover:text-foreground transition-colors duration-150">
                    Terms of Service
                  </button>{" "}
                  and{" "}
                  <button className="underline hover:text-foreground transition-colors duration-150">
                    Privacy Policy
                  </button>
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}