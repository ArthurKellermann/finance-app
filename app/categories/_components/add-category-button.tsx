"use client";

import { Menu } from "lucide-react";
import { Button } from "@/app/_components/ui/button";
import { useState } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/app/_components/ui/tooltip";
import UpsertCategoryDialog from "./upsert-category-dialog";

interface AddCategoryButtonProps {
  onSuccess?: () => void;
}

const AddCategoryButton = ({ onSuccess }: AddCategoryButtonProps) => {
  const [dialogIsOpen, setDialogIsOpen] = useState(false);

  return (
    <>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="secondary"
              className="rounded-full bg-white/20 text-white transition-colors hover:bg-white/30"
              onClick={() => setDialogIsOpen(true)}
            >
              Adicionar <Menu />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Adicionar categoria</TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <UpsertCategoryDialog
        isOpen={dialogIsOpen}
        setIsOpen={setDialogIsOpen}
        onSuccess={onSuccess}
      />
    </>
  );
};

export default AddCategoryButton;
