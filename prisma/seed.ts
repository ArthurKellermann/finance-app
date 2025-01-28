import { prisma } from "../app/_lib/_prisma/prisma";

const defaultCategories = [
  "HOUSING",
  "TRANSPORTATION",
  "FOOD",
  "ENTERTAINMENT",
  "HEALTH",
  "UTILITY",
  "SALARY",
  "EDUCATION",
  "OTHER",
];

async function main() {
  for (const category of defaultCategories) {
    await prisma.category.upsert({
      where: { name: category },
      update: {},
      create: {
        name: category,
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
