"use server";

import { prisma } from "@/app/_lib/_prisma/prisma";

export default async function getEvents() {
  const events = await prisma.calendarEvent.findMany();

  return { events };
}
