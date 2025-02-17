import { CalendarEvent } from "@schedule-x/calendar";
type props = {
  calendarEvent: CalendarEvent;
};

const TimeGridEvent = ({ calendarEvent }: props) => {
  return (
    <div>
      <span>{calendarEvent.title}</span>
      {calendarEvent.status === "todo" && <span>TODO</span>}
      {calendarEvent.status === "done" && <span>DONE</span>}
    </div>
  );
};

export default TimeGridEvent;
