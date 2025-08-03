import { Button } from "@repo/ui";
import { Plus } from "lucide-react";

export default function AddWebsite({addNewWebsite}: {addNewWebsite: () => void}) {
    return (
        <div className="flex justify-center p-4 relative mx-auto border rounded-3xl max-h-[50vh] w-[50vw] bg-background overflow-hidden">
       
       <Button
      onClick={addNewWebsite} 
       className=" transition-all duration-300 border border-dashed border-teal-500 bg-transparent hover:bg-teal-950 text-muted-foreground flex min-h-20 w-full items-center justify-center rounded-xl cursor-pointer "
     >
       <Plus className="h-4 w-4 mr-2" />
       Add Website
     </Button>
     </div>
    )
}