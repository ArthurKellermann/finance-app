"use client";
import { useIconPicker } from "./use-icon-picker";
import { Button } from "./button";
import { Input } from "./input";

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
