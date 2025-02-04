import { prisma } from "../app/_lib/_prisma/prisma";

type Category = {
  name: string;
  icon: string;
  color: string;
};

const categoryIconsAndColors: Record<string, Category> = {
  HOUSING: {
    name: "HOUSING",
    icon: "HomeIcon",
    color: "#1D4ED8",
  },
  TRANSPORTATION: {
    name: "TRANSPORTATION",
    icon: "CarIcon",
    color: "#10B981",
  },
  FOOD: {
    name: "FOOD",
    icon: "FastFoodIcon",
    color: "#F59E0B",
  },
  ENTERTAINMENT: {
    name: "ENTERTAINMENT",
    icon: "FilmIcon",
    color: "#F43F5E",
  },
  HEALTH: {
    name: "HEALTH",
    icon: "HeartIcon",
    color: "#34D399",
  },
  UTILITY: {
    name: "UTILITY",
    icon: "WrenchIcon",
    color: "#64748B",
  },
  SALARY: {
    name: "SALARY",
    icon: "CurrencyDollarIcon",
    color: "#22D3EE",
  },
  EDUCATION: {
    name: "EDUCATION",
    icon: "AcademicCapIcon",
    color: "#4F46E5",
  },
  OTHER: {
    name: "OTHER",
    icon: "AdjustmentsHorizontalIcon",
    color: "#6B7280",
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
