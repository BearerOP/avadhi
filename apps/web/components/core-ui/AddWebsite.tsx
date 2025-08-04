"use client";

import { useState } from "react";
import { Button } from "@repo/ui";
import { Plus } from "lucide-react";
import AddWebsitePopup from "./AddWebsitePopup";

interface AddWebsiteProps {
  addNewWebsite: (data: { url: string; alias: string; notificationSystem: string }) => void;
}

export default function AddWebsite({ addNewWebsite }: AddWebsiteProps) {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [toggle, setToggle] = useState(0);

  const handleAddWebsite = (data: { url: string; alias: string; notificationSystem: string }) => {
    addNewWebsite(data);
    setIsPopupOpen(false);
    setToggle(0);
  };

  return (
    <div className="flex flex-col mx-auto w-[50vw]">
      <div className="flex justify-center p-4 border rounded-3xl bg-background">
        <Button
          onClick={() => {
            setIsPopupOpen(true);
            setToggle(toggle + 1);
            // Scroll down by 50vh to bring popup into view
            if (toggle == 0) {
              setTimeout(() => {
                window.scrollBy({
                  top: window.innerHeight * 0.5,
                  behavior: 'smooth'
                });
              }, 100);
            }
          }}
          className="transition-all duration-300 border border-dashed border-teal-500 bg-transparent hover:bg-teal-950 text-muted-foreground flex min-h-20 w-full items-center justify-center rounded-xl cursor-pointer"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Website
        </Button>
      </div>

      <AddWebsitePopup
        isOpen={isPopupOpen}
        onClose={() => setIsPopupOpen(false)}
        onSubmit={handleAddWebsite}
      />
    </div>
  );
}