import type { TransactionType } from "@prisma/client";
import { prisma } from "../app/_lib/_prisma/prisma";

type Category = {
  name: string;
  icon: string;
  color: string;
  type: TransactionType;
};

const categoryIconsAndColors: Record<string, Category> = {
  HOUSING: {
    name: "HOUSING",
    icon: "HomeIcon",
    color: "#1D4ED8",
    type: "EXPENSE",
  },
  TRANSPORTATION: {
    name: "TRANSPORTATION",
    icon: "CarIcon",
    color: "#10B981",
    type: "EXPENSE",
  },
  FOOD: {
    name: "FOOD",
    icon: "FastFoodIcon",
    color: "#F59E0B",
    type: "EXPENSE",
  },
  ENTERTAINMENT: {
    name: "ENTERTAINMENT",
    icon: "FilmIcon",
    color: "#F43F5E",
    type: "EXPENSE",
  },
  HEALTH: {
    name: "HEALTH",
    icon: "HeartIcon",
    color: "#34D399",
    type: "EXPENSE",
  },
  UTILITY: {
    name: "UTILITY",
    icon: "WrenchIcon",
    color: "#64748B",
    type: "EXPENSE",
  },
  SALARY: {
    name: "SALARY",
    icon: "CurrencyDollarIcon",
    color: "#22D3EE",
    type: "DEPOSIT",
  },
  EDUCATION: {
    name: "EDUCATION",
    icon: "AcademicCapIcon",
    color: "#4F46E5",
    type: "EXPENSE",
  },
  OTHER: {
    name: "OTHER",
    icon: "AdjustmentsHorizontalIcon",
    color: "#6B7280",
    type: "EXPENSE",
  },
};

async function main() {
  for (const categoryKey in categoryIconsAndColors) {
    const category =
      categoryIconsAndColors[
        categoryKey as keyof typeof categoryIconsAndColors
      ];
    await prisma.category.upsert({
      where: { name: category.name },
      update: {},
      create: {
        name: category.name,
        icon: category.icon,
        color: category.color,
        type: category.type,
        isDefault: true,
      },
    });
  }
  console.log("Default categories added to the database.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
