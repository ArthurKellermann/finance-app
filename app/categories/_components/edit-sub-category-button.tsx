"use client";

import { Button } from "@/app/_components/ui/button";
import { useState } from "react";
import UpsertSubCategoryDialog from "./upsert-sub-category-dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/app/_components/ui/tooltip";
import { Edit } from "lucide-react";
import type { SubCategory } from "@prisma/client";

interface EditSubCategoryButtonProps {
  subcategory: SubCategory;
  onSuccess?: () => void;
}
const EditSubCategoryButton = ({
  subcategory,
  onSuccess,
}: EditSubCategoryButtonProps) => {
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
      <UpsertSubCategoryDialog
        isOpen={dialogIsOpen}
        setIsOpen={setDialogIsOpen}
        defaultValues={subcategory}
        subCategoryId={subcategory.id}
        categoryId={subcategory.categoryId}
        onSuccess={onSuccess}
      />
    </>
  );
};

export default EditSubCategoryButton;
