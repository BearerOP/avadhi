"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@repo/ui";
import { X } from "lucide-react";

type NotificationSystem = "none" | "email" | "sms";

interface AddWebsitePopupProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { url: string; alias: string; notificationSystem: string }) => void;
}

export default function AddWebsitePopup({ isOpen, onClose, onSubmit }: AddWebsitePopupProps) {
  const [formData, setFormData] = useState<{
    url: string;
    alias: string;
    notificationSystem: NotificationSystem;
  }>({
    url: "",
    alias: "",
    notificationSystem: "none"
  });
  
  const [errors, setErrors] = useState({
    url: "",
    alias: ""
  });

  const validateUrl = (url: string) => {
    try {
      new URL(url.startsWith('http') ? url : `https://${url}`);
      return true;
    } catch {
      return false;
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Reset errors
    setErrors({ url: "", alias: "" });
    
    // Validate form
    let hasErrors = false;
    
    if (!formData.url.trim()) {
      setErrors(prev => ({ ...prev, url: "Website URL is required" }));
      hasErrors = true;
    } else if (!validateUrl(formData.url)) {
      setErrors(prev => ({ ...prev, url: "Please enter a valid URL" }));
      hasErrors = true;
    }
    
    if (!formData.alias.trim()) {
      setErrors(prev => ({ ...prev, alias: "Alias name is required" }));
      hasErrors = true;
    }
    
    if (hasErrors) return;
    
    // Submit the form
    onSubmit(formData);
    
    // Reset form and close
    setFormData({ url: "", alias: "", notificationSystem: "none" });
  };

  const handleClose = () => {
    setFormData({ url: "", alias: "", notificationSystem: "none" });
    setErrors({ url: "", alias: "" });
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0, y: -20 }}
          animate={{ opacity: 1, height: "auto", y: 0 }}
          exit={{ opacity: 0, height: 0, y: -20 }}
          transition={{ duration: 0.2, ease: "easeInOut" }}
          className="mt-4 mx-auto w-[50vw] bg-background border rounded-2xl shadow-2xl overflow-hidden"
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2, delay: 0.1 }}
            className="p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-foreground">Add New Website</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClose}
                className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Website URL Field */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">
                  Original Website URL
                </label>
                <input
                  type="url"
                  value={formData.url}
                  onChange={(e) => setFormData(prev => ({ ...prev, url: e.target.value }))}
                  placeholder="https://example.com"
                  className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-colors text-foreground placeholder:text-muted-foreground"
                  required
                />
                {errors.url && (
                  <p className="text-red-500 text-xs">{errors.url}</p>
                )}
              </div>

              {/* Alias Name Field */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">
                  Alias Name
                </label>
                <input
                  type="text"
                  value={formData.alias}
                  onChange={(e) => setFormData(prev => ({ ...prev, alias: e.target.value }))}
                  placeholder="My Website"
                  className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-colors text-foreground placeholder:text-muted-foreground"
                  required
                />
                {errors.alias && (
                  <p className="text-red-500 text-xs">{errors.alias}</p>
                )}
              </div>

              {/* Notification System Dropdown */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">
                  Notification System
                </label>
                <select
                  value={formData.notificationSystem}
                  onChange={(e) => setFormData(prev => ({ ...prev, notificationSystem: e.target.value as NotificationSystem }))}
                  className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-colors text-foreground"
                >
                  <option value="none">None</option>
                  <option value="email">Email</option>
                  <option value="sms">SMS</option>
                </select>
              </div>

              {/* Submit Buttons */}
              <div className="flex gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleClose}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="flex-1 bg-teal-600 hover:bg-teal-700 text-white"
                >
                  Add Website
                </Button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}