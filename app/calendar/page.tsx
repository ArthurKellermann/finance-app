"use client";
import { useCalendarApp, ScheduleXCalendar } from "@schedule-x/react";
import { createViewDay, createViewWeek } from "@schedule-x/calendar";
import { createEventsServicePlugin } from "@schedule-x/events-service";
import { createDragAndDropPlugin } from "@schedule-x/drag-and-drop";
import { createEventModalPlugin } from "@schedule-x/event-modal";
import "@schedule-x/theme-default/dist/index.css";
import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import TimeGridEvent from "./_components/time-grid-event";

function CalendarApp() {
  const [eventsService] = useState(() => createEventsServicePlugin());
  const [dragAndDrop] = useState(() => createDragAndDropPlugin());
  const [eventModal] = useState(() => createEventModalPlugin());

  const { theme } = useTheme();
  const isDark = theme === "dark";

  const calendar = useCalendarApp({
    views: [createViewDay(), createViewWeek()],

    locale: "pt-BR",
    events: [
      {
        id: "1",
        title: "Café com João",
        start: "2025-02-16",
        end: "2025-02-16",
      },
      {
        id: "2",
        title: "Reunião com Maria",
        description: "Discutir o novo projeto",
        location: "Escritório",
        start: "2025-02-17 10:00",
        end: "2025-02-17 11:00",
      },
      {
        id: "3",
        title: "Academia",
        start: "2025-02-18 06:00",
        end: "2025-02-18 07:00",
        calendarId: "leisure",
      },
      {
        id: "4",
        title: "Férias",
        start: "2025-02-20",
        end: "2025-02-25",
        calendarId: "leisure",
      },
    ],
    calendars: {
      leisure: {
        colorName: "leisure",
        lightColors: {
          main: "#1c7df9",
          container: "#d2e7ff",
          onContainer: "#002859",
        },
        darkColors: {
          main: "#1c7df9",
          onContainer: "#dee6ff",
          container: "#426aa2",
        },
      },
    },
    plugins: [eventsService, dragAndDrop, eventModal],
  });

  useEffect(() => {
    eventsService.getAll();
    calendar.setTheme(isDark ? "dark" : "light");
  }, [eventsService]);

  return (
    <div>
      <ScheduleXCalendar
        calendarApp={calendar}
        customComponents={{ TimeGridEvent: TimeGridEvent }}
      />
    </div>
  );
}

export default CalendarApp;
