"use client";

import { Button } from "@/app/_components/ui/button";
import { useState } from "react";
import UpsertCategoryDialog from "./upsert-category-dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/app/_components/ui/tooltip";
import { Edit } from "lucide-react";
import type { Category } from "@prisma/client";

interface EditCategoryButtonProps {
  category: Category;
  onSuccess?: () => void;
}
const EditCategoryButton = ({
  category,
  onSuccess,
}: EditCategoryButtonProps) => {
  const [dialogIsOpen, setDialogIsOpen] = useState(false);

  return (
    <>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              onClick={() => setDialogIsOpen(true)}
              variant="ghost"
              size="icon"
              className="rounded-full text-muted-foreground"
            >
              <Edit />
            </Button>
          </TooltipTrigger>
          <TooltipContent></TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <UpsertCategoryDialog
        isOpen={dialogIsOpen}
        setIsOpen={setDialogIsOpen}
        defaultValues={category}
        id={category.id}
        onSuccess={onSuccess}
      />
    </>
  );
};

export default EditCategoryButton;
