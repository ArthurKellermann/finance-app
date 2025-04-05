"use server";

import { prisma } from "@/app/_lib/_prisma/prisma";

async function deleteEvent(id: string) {
  await prisma.calendarEvent.delete({
    where: {
      id,
    },
  });
}

export default deleteEvent;
