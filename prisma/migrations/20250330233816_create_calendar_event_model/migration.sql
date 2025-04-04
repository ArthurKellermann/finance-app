-- CreateTable
CREATE TABLE "calendar_events" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "date" TEXT NOT NULL,
    "endDate" TEXT,
    "time" TEXT NOT NULL,
    "endTime" TEXT,
    "category" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "isAllDay" BOOLEAN NOT NULL,
    "reminder" TEXT,
    "recurrence" TEXT,
    "location" TEXT,
    "attendees" TEXT[],
    "color" TEXT,

    CONSTRAINT "calendar_events_pkey" PRIMARY KEY ("id")
);
