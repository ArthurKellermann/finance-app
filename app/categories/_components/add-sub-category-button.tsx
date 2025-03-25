"use client";

import { Plus } from "lucide-react";
import { Button } from "@/app/_components/ui/button";
import { useState } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/app/_components/ui/tooltip";
import UpsertSubCategoryDialog from "./upsert-sub-category-dialog";

interface AddSubCategoryButtonProps {
  categoryId: string;
}

const AddSubCategoryButton = ({ categoryId }: AddSubCategoryButtonProps) => {
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
              <Plus />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Adicionar subcategoria</TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <UpsertSubCategoryDialog
        isOpen={dialogIsOpen}
        setIsOpen={setDialogIsOpen}
        categoryId={categoryId}
      />
    </>
  );
};

export default AddSubCategoryButton;
