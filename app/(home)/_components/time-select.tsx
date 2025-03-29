"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/_components/ui/select";
import { Calendar } from "lucide-react";
import { useRouter } from "next/navigation";

const MONTH_OPTIONS = [
  { value: "01", label: "Janeiro" },
  { value: "02", label: "Fevereiro" },
  { value: "03", label: "Março" },
  { value: "04", label: "Abril" },
  { value: "05", label: "Maio" },
  { value: "06", label: "Junho" },
  { value: "07", label: "Julho" },
  { value: "08", label: "Agosto" },
  { value: "09", label: "Setembro" },
  { value: "10", label: "Outubro" },
  { value: "11", label: "Novembro" },
  { value: "12", label: "Dezembro" },
];

const TimeSelect = () => {
  const { push } = useRouter();
  //const searchParams = useSearchParams();
  //const month = searchParams.get("month");

  const handleMonthChange = (month: string) => {
    push(`/?month=${month}`);
  };

  return (
    //remove value from Select tag
    <Select onValueChange={(value) => handleMonthChange(value)}>
      <SelectTrigger className="mr-6 w-[150px] rounded-full bg-secondary">
        <div className="flex items-center gap-2">
          <SelectValue placeholder="Mês" />
          <Calendar className="-4 w-4" />
        </div>
      </SelectTrigger>
      <SelectContent>
        {MONTH_OPTIONS.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default TimeSelect;
