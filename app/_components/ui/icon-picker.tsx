"use client";
import { useState } from "react";
import { IconRenderer } from "./icon-renderer";
import { useIconPicker } from "./use-icon-picker";
import { Button } from "./button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./dialog";
import { Input } from "./input";
import { AppWindow } from "lucide-react";

export const IconPickerDialog = () => {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<null | string>(null);

  return (
    <Dialog open={open} onOpenChange={(e) => setOpen(e)}>
      <DialogTrigger asChild>
        <Button variant="link" className="text-primary">
          {selected ? (
            <Button variant="outline" className="w-10">
              <IconRenderer
                icon={selected}
                style={{ height: "1.5rem", width: "1.5rem" }}
              />
            </Button>
          ) : (
            <AppWindow className="h-6 w-6 text-primary" />
          )}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Selecione o ícone</DialogTitle>
          <DialogDescription>
            Escolha o ícone que melhor combine com sua categoria
          </DialogDescription>
        </DialogHeader>
        <IconPicker
          onChange={(icon) => {
            setSelected(icon);
            setOpen(false);
          }}
        />
      </DialogContent>
    </Dialog>
  );
};
export const IconPicker = ({
  onChange,
}: {
  onChange: (icon: string) => void;
}) => {
  const { search, setSearch, icons } = useIconPicker();

  return (
    <div className="relative">
      <Input
        placeholder="Pesquisar..."
        type="search"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <div className="mt-2 flex h-full max-h-[400px] flex-wrap gap-2 overflow-y-scroll py-4 pb-12">
        {icons.map(({ name, Component }) => (
          <Button
            key={name}
            type="button"
            role="button"
            onClick={() => onChange(name)}
            className="h-11"
          >
            <Component className="!size-6 shrink-0" />
            <span className="sr-only">{name}</span>
          </Button>
        ))}
        {icons.length === 0 && (
          <div className="col-span-full flex grow flex-col items-center justify-center gap-2 text-center">
            <p>Nenhum ícone encontrado</p>
            <Button onClick={() => setSearch("")} variant="ghost">
              Limpar pesquisa
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};
