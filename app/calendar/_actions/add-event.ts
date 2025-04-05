"use server";

import { prisma } from "@/app/_lib/_prisma/prisma";
import type { CalendarEvent } from "@prisma/client";

async function addEvent(calendarEvent: CalendarEvent) {
  await prisma.calendarEvent.create({
    data: {
      ...calendarEvent,
    },
  });
}

export default addEvent;
