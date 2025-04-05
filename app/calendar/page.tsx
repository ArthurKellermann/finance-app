"use client";
import { useState, useEffect, useMemo } from "react";
import {
  format,
  addMonths,
  subMonths,
  parseISO,
  isSameDay,
  isSameMonth,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  startOfWeek,
  endOfWeek,
  isToday,
  addDays,
} from "date-fns";
import { ptBR } from "date-fns/locale";
import { AnimatePresence, motion } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  Calendar as CalendarIcon,
  Trash2,
  Edit,
  Tag,
  Search,
  Layers,
  Download,
  Calendar,
  Repeat,
  Bell,
  FileText,
  MapPin,
  Clock,
  CalendarCheck,
  CalendarPlus,
} from "lucide-react";

import { Button } from "@/app/_components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/app/_components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/_components/ui/select";
import { Input } from "@/app/_components/ui/input";
import { Label } from "@/app/_components/ui/label";
import { Card, CardContent } from "@/app/_components/ui/card";
import { useToast } from "@/app/_hooks/use-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/app/_components/ui/dropdown-menu";
import { Textarea } from "@/app/_components/ui/textarea";
import { Badge } from "@/app/_components/ui/badge";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/app/_components/ui/popover";
import { Switch } from "@/app/_components/ui/switch";
import { DatePicker } from "../_components/ui/date-picker";
import addEvent from "./_actions/add-event";
import { useAuth } from "@clerk/nextjs";
import getEvents from "./_actions/get-events";
import deleteEvent from "./_actions/delete-event";

interface CalendarEvent {
  id: string;
  title: string;
  date: string;
  endDate?: string;
  time: string;
  endTime?: string;
  category: string;
  description: string;
  isAllDay: boolean;
  reminder?: string;
  recurrence?: string;
  location?: string;
  attendees?: string[];
  color?: string;
}

// Categorias de eventos
const eventCategories = [
  { id: "financial", name: "Financeiro", color: "#3b82f6" },
  { id: "personal", name: "Pessoal", color: "#10b981" },
  { id: "work", name: "Trabalho", color: "#f59e0b" },
  { id: "health", name: "Saúde", color: "#ef4444" },
  { id: "study", name: "Estudos", color: "#8b5cf6" },
  { id: "family", name: "Família", color: "#ec4899" },
  { id: "travel", name: "Viagem", color: "#06b6d4" },
  { id: "meeting", name: "Reunião", color: "#6366f1" },
  { id: "other", name: "Outro", color: "#64748b" },
];

// Opções de recorrência
const recurrenceOptions = [
  { id: "none", name: "Não repetir" },
  { id: "daily", name: "Diariamente" },
  { id: "weekly", name: "Semanalmente" },
  { id: "biweekly", name: "Quinzenalmente" },
  { id: "monthly", name: "Mensalmente" },
  { id: "yearly", name: "Anualmente" },
];

// Opções de lembrete
const reminderOptions = [
  { id: "none", name: "Nenhum" },
  { id: "5min", name: "5 minutos antes" },
  { id: "15min", name: "15 minutos antes" },
  { id: "30min", name: "30 minutos antes" },
  { id: "1hour", name: "1 hora antes" },
  { id: "1day", name: "1 dia antes" },
];

const calendarViews = [
  { id: "month", name: "Mês" },
  { id: "week", name: "Semana" },
  { id: "agenda", name: "Agenda" },
];

const CalendarPage = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<CalendarEvent[]>([]);
  const [, setSelectedDate] = useState<Date | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(
    null,
  );
  const [isAddEventOpen, setIsAddEventOpen] = useState(false);
  const [isViewEventOpen, setIsViewEventOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeView, setActiveView] = useState("month");
  const [activeCategories, setActiveCategories] = useState<string[]>(
    eventCategories.map((cat) => cat.id),
  );
  const [isExportMenuOpen, setIsExportMenuOpen] = useState(false);
  const { toast } = useToast();
  const { userId } = useAuth();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  // Estado do evento novo/editado
  const [eventForm, setEventForm] = useState<Omit<CalendarEvent, "id">>({
    title: "",
    date: "",
    endDate: "",
    time: "",
    endTime: "",
    category: "financial",
    description: "",
    isAllDay: false,
    reminder: "none",
    recurrence: "none",
    location: "",
    attendees: [],
  });

  // Carregar eventos do localStorage ao iniciar
  useEffect(() => {
    const fetchEvents = async () => {
      const { events } = await getEvents();
      if (events) {
        try {
          setEvents(events as CalendarEvent[]);
          setFilteredEvents(events as CalendarEvent[]);
        } catch (error) {
          console.error("Erro ao carregar eventos:", error);
          toast({
            title: "Erro ao carregar eventos",
            description: "Ocorreu um erro ao carregar seus eventos salvos.",
            variant: "destructive",
          });
        }
      }
    };

    fetchEvents();
  }, [toast]);

  useEffect(() => {
    let filtered = [...events];

    // Filtrar por termo de busca
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (event) =>
          event.title.toLowerCase().includes(query) ||
          event.description.toLowerCase().includes(query) ||
          (event.location && event.location.toLowerCase().includes(query)),
      );
    }

    // Filtrar por categorias ativas
    filtered = filtered.filter((event) =>
      activeCategories.includes(event.category),
    );

    setFilteredEvents(filtered);
  }, [events, searchQuery, activeCategories]);

  // Salvar eventos no localStorage quando mudarem
  useEffect(() => {
    localStorage.setItem("calendarEvents", JSON.stringify(events));
  }, [events]);

  // Navegação entre períodos (mês, semana, dia)
  const navigatePrevious = () => {
    if (activeView === "month") {
      setCurrentDate(subMonths(currentDate, 1));
    } else if (activeView === "week") {
      setCurrentDate(addDays(currentDate, -7));
    } else if (activeView === "day") {
      setCurrentDate(addDays(currentDate, -1));
    }
  };

  const navigateNext = () => {
    if (activeView === "month") {
      setCurrentDate(addMonths(currentDate, 1));
    } else if (activeView === "week") {
      setCurrentDate(addDays(currentDate, 7));
    } else if (activeView === "day") {
      setCurrentDate(addDays(currentDate, 1));
    }
  };

  const navigateToday = () => {
    setCurrentDate(new Date());
  };

  // Funções auxiliares para visualizações de calendário
  const getDaysForMonthView = useMemo(() => {
    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(currentDate);
    //const monthDays = eachDayOfInterval({ start: monthStart, end: monthEnd });

    // Para exibir dias completos da semana, incluindo os do mês anterior e próximo
    const calendarStart = startOfWeek(monthStart, { locale: ptBR });
    const calendarEnd = endOfWeek(monthEnd, { locale: ptBR });

    return eachDayOfInterval({ start: calendarStart, end: calendarEnd });
  }, [currentDate]);

  const getDaysForWeekView = useMemo(() => {
    const weekStart = startOfWeek(currentDate, { locale: ptBR });
    const weekEnd = endOfWeek(currentDate, { locale: ptBR });
    return eachDayOfInterval({ start: weekStart, end: weekEnd });
  }, [currentDate]);

  // Funções para gerenciar eventos
  const handleAddOrUpdateEvent = async () => {
    if (!eventForm.title || !eventForm.date) {
      toast({
        title: "Campos obrigatórios",
        description: "Preencha pelo menos o título e a data do evento",
        variant: "destructive",
      });
      return;
    }

    // Validar data final (se fornecida)
    if (eventForm.endDate && eventForm.endDate < eventForm.date) {
      toast({
        title: "Data inválida",
        description: "A data final não pode ser anterior à data inicial",
        variant: "destructive",
      });
      return;
    }

    // Validar horário final (se fornecido)
    if (
      eventForm.endTime &&
      eventForm.time &&
      eventForm.date === eventForm.endDate &&
      eventForm.endTime < eventForm.time
    ) {
      toast({
        title: "Horário inválido",
        description:
          "O horário final não pode ser anterior ao horário inicial no mesmo dia",
        variant: "default",
      });
      return;
    }

    if (isEditMode && selectedEvent) {
      // Atualizar evento existente
      const updatedEvents = events.map((event) =>
        event.id === selectedEvent.id
          ? { ...eventForm, id: selectedEvent.id }
          : event,
      );
      setEvents(updatedEvents);

      toast({
        title: "Evento atualizado",
        description: "Seu evento foi atualizado com sucesso",
      });
    } else {
      // Adicionar novo evento
      const newEvent: CalendarEvent = {
        id: Date.now().toString(),
        ...eventForm,
      };

      await addEvent({
        attendees: newEvent.attendees || [],
        category: newEvent.category,
        date: newEvent.date,
        description: newEvent.description,
        endDate: newEvent.endDate || null,
        endTime: newEvent.endTime || null,
        isAllDay: newEvent.isAllDay,
        location: newEvent.location || null,
        title: newEvent.title,
        userId: userId,
        color: newEvent.color || null,
        id: newEvent.id,
        recurrence: newEvent.recurrence || null,
        reminder: newEvent.reminder || null,
        time: newEvent.time,
      });

      setEvents([...events, newEvent]);

      toast({
        title: "Evento adicionado",
        description: "Seu evento foi adicionado com sucesso",
      });
    }

    // Resetar formulário e fechar modal
    resetEventForm();
    setIsEditMode(false);
    setIsAddEventOpen(false);
    setIsViewEventOpen(false);
  };

  const handleDeleteEvent = async (id: string) => {
    setEvents(events.filter((event) => event.id !== id));
    setIsViewEventOpen(false);
    await deleteEvent(id);

    toast({
      title: "Evento removido",
      description: "O evento foi removido com sucesso",
    });
  };

  const handleDateClick = (date: Date) => {
    setSelectedDate(date);

    // Preparar o formato da data para o novo evento
    const formattedDate = format(date, "yyyy-MM-dd");

    setEventForm({
      title: "",
      date: formattedDate,
      endDate: formattedDate,
      time: "",
      endTime: "",
      category: "work",
      description: "",
      isAllDay: false,
      reminder: "none",
      recurrence: "none",
      location: "",
      attendees: [],
    });

    setIsEditMode(false);
    setIsAddEventOpen(true);
  };

  const handleEventClick = (event: CalendarEvent) => {
    setSelectedEvent(event);
    setIsViewEventOpen(true);
    setIsEditMode(false);
  };

  const handleEditEvent = () => {
    if (selectedEvent) {
      setEventForm({
        title: selectedEvent.title,
        date: selectedEvent.date,
        endDate: selectedEvent.endDate || selectedEvent.date,
        time: selectedEvent.time,
        endTime: selectedEvent.endTime || selectedEvent.time,
        category: selectedEvent.category,
        description: selectedEvent.description,
        isAllDay: selectedEvent.isAllDay || false,
        reminder: selectedEvent.reminder || "none",
        recurrence: selectedEvent.recurrence || "none",
        location: selectedEvent.location || "",
        attendees: selectedEvent.attendees || [],
      });

      setIsEditMode(true);
      setIsViewEventOpen(false);
      setIsAddEventOpen(true);
    }
  };

  const resetEventForm = () => {
    setEventForm({
      title: "",
      date: format(new Date(), "yyyy-MM-dd"),
      endDate: format(new Date(), "yyyy-MM-dd"),
      time: "",
      endTime: "",
      category: "work",
      description: "",
      isAllDay: false,
      reminder: "none",
      recurrence: "none",
      location: "",
      attendees: [],
    });
  };

  // Funções auxiliares para eventos
  const getEventsByDate = (date: Date) => {
    return filteredEvents.filter((event) =>
      isSameDay(parseISO(event.date), date),
    );
  };

  const getEventDuration = (event: CalendarEvent) => {
    if (event.isAllDay) return "Dia inteiro";

    const formatTime = (time: string) => time.substring(0, 5);

    if (event.time && !event.endTime) {
      return formatTime(event.time);
    }

    if (event.time && event.endTime) {
      return `${formatTime(event.time)} - ${formatTime(event.endTime)}`;
    }

    return "";
  };

  const getCategoryColor = (categoryId: string) => {
    const category = eventCategories.find((cat) => cat.id === categoryId);
    return category ? category.color : "#64748b";
  };

  const getCategoryName = (categoryId: string) => {
    const category = eventCategories.find((cat) => cat.id === categoryId);
    return category ? category.name : "Outro";
  };

  const getRecurrenceName = (recurrenceId: string) => {
    const recurrence = recurrenceOptions.find(
      (option) => option.id === recurrenceId,
    );
    return recurrence ? recurrence.name : "Não repetir";
  };

  const getReminderName = (reminderId: string) => {
    const reminder = reminderOptions.find((option) => option.id === reminderId);
    return reminder ? reminder.name : "Nenhum";
  };

  // Funções para exportação
  const exportEvents = (formatType: string) => {
    let content = "";
    let filename = `calendario-eventos-${format(new Date(), "yyyy-MM-dd")}.`;

    if (formatType === "csv") {
      // Criar cabeçalho CSV
      content = "Título,Data,Hora,Categoria,Descrição,Local\n";

      // Adicionar dados
      events.forEach((event) => {
        content += `"${event.title}","${event.date}","${event.time || ""}","${getCategoryName(event.category)}","${event.description || ""}","${event.location || ""}"\n`;
      });

      filename += "csv";
    } else if (formatType === "json") {
      content = JSON.stringify(events, null, 2);
      filename += "json";
    } else if (formatType === "ics") {
      // Formato simplificado iCalendar
      content =
        "BEGIN:VCALENDAR\nVERSION:2.0\nPRODID:-//Meu Calendário//PT-BR\n";

      events.forEach((event) => {
        content += "BEGIN:VEVENT\n";
        content += `SUMMARY:${event.title}\n`;
        content += `DTSTART:${event.date.replace(/-/g, "")}T${(event.time || "000000").replace(/:/g, "")}\n`;
        if (event.endDate) {
          content += `DTEND:${event.endDate.replace(/-/g, "")}T${(event.endTime || "000000").replace(/:/g, "")}\n`;
        }
        content += `DESCRIPTION:${event.description || ""}\n`;
        content += `LOCATION:${event.location || ""}\n`;
        content += `CATEGORIES:${getCategoryName(event.category)}\n`;
        content += "END:VEVENT\n";
      });

      content += "END:VCALENDAR";
      filename += "ics";
    }

    // Criar e baixar o arquivo
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: "Eventos exportados",
      description: `Seus eventos foram exportados no formato ${formatType.toUpperCase()}.`,
    });

    setIsExportMenuOpen(false);
  };

  // Renderização condicional das visualizações do calendário
  const renderCalendarView = () => {
    switch (activeView) {
      case "month":
        return renderMonthView();
      case "week":
        return renderWeekView();
      case "agenda":
        return renderAgendaView();
      default:
        return renderMonthView();
    }
  };

  // Componente de renderização da visualização mensal
  const renderMonthView = () => {
    // Calcular o dia da semana do primeiro dia do mês (0 = domingo)
    //const startDay = getDay(startOfMonth(currentDate));

    // Dias da semana
    const weekDays = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

    return (
      <motion.div
        className="grid grid-cols-7 gap-1"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.3 }}
        key={`month-${format(currentDate, "yyyy-MM")}`}
      >
        {/* Dias da semana */}
        {weekDays.map((day) => (
          <div key={day} className="py-2 text-center font-medium text-gray-600">
            {day}
          </div>
        ))}

        {/* Dias do mês com os anteriores e posteriores */}
        {getDaysForMonthView.map((day) => {
          const dayEvents = getEventsByDate(day);
          const isCurrentMonth = isSameMonth(day, currentDate);
          const isTodayDate = isToday(day);

          return (
            <motion.div
              key={format(day, "yyyy-MM-dd")}
              className={`relative min-h-[100px] cursor-pointer rounded-lg border p-1 transition-colors ${
                isTodayDate
                  ? "border-blue-300 bg-blue-50"
                  : isCurrentMonth
                    ? "border-gray-100 hover:bg-gray-50"
                    : "border-gray-50 bg-gray-50/50 text-gray-400 hover:bg-gray-50"
              }`}
              onClick={() => handleDateClick(day)}
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.1 }}
            >
              <div className="flex h-full flex-col">
                <div className="flex items-center justify-between">
                  <span
                    className={`text-sm font-medium ${
                      isTodayDate
                        ? "rounded-full bg-blue-500 px-2 py-0.5 text-white"
                        : isCurrentMonth
                          ? "text-gray-700"
                          : "text-gray-400"
                    }`}
                  >
                    {format(day, "d")}
                  </span>

                  {dayEvents.length > 0 && (
                    <span className="text-xs font-medium text-gray-500">
                      {dayEvents.length > 1
                        ? `${dayEvents.length} eventos`
                        : "1 evento"}
                    </span>
                  )}
                </div>

                <div className="mt-1 flex flex-col gap-1 overflow-y-auto">
                  {dayEvents.slice(0, 3).map((event) => (
                    <div
                      key={event.id}
                      className="group flex items-center truncate rounded p-1 text-xs"
                      style={{
                        backgroundColor: `${getCategoryColor(event.category)}20`,
                        borderLeft: `3px solid ${getCategoryColor(event.category)}`,
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEventClick(event);
                      }}
                    >
                      <span className="truncate font-medium">
                        {event.isAllDay && (
                          <span className="mr-1 text-xs opacity-60">
                            [Dia todo]
                          </span>
                        )}
                        {!event.isAllDay && event.time && (
                          <span className="mr-1 text-xs opacity-60">
                            {event.time.substring(0, 5)}
                          </span>
                        )}
                        {event.title}
                      </span>
                    </div>
                  ))}

                  {dayEvents.length > 3 && (
                    <div
                      className="cursor-pointer rounded-md p-1 text-center text-xs font-medium text-gray-500 hover:bg-gray-100"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedDate(day);
                        setActiveView("day");
                      }}
                    >
                      + {dayEvents.length - 3} mais
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}
      </motion.div>
    );
  };

  // Componente de renderização da visualização semanal
  const renderWeekView = () => {
    const weekDays = getDaysForWeekView;
    const hours = Array.from({ length: 24 }, (_, i) => i);

    return (
      <motion.div
        className="flex flex-col"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.3 }}
        key={`week-${format(weekDays[0], "yyyy-MM-dd")}`}
      >
        {/* Cabeçalho dos dias da semana */}
        <div className="sticky top-0 z-10 mb-2 grid grid-cols-8 gap-1 bg-white">
          <div className="p-2 text-center text-sm font-medium text-gray-500">
            Hora
          </div>
          {weekDays.map((day) => (
            <div
              key={format(day, "yyyy-MM-dd")}
              className={`flex flex-col items-center rounded-lg p-2 ${
                isToday(day) ? "bg-blue-50" : ""
              }`}
              onClick={() => handleDateClick(day)}
            >
              <span className="text-xs font-medium text-gray-500">
                {format(day, "EEE", { locale: ptBR })}
              </span>
              <span
                className={`text-sm font-bold ${
                  isToday(day)
                    ? "rounded-full bg-blue-500 px-2 py-0.5 text-white"
                    : ""
                }`}
              >
                {format(day, "dd")}
              </span>
            </div>
          ))}
        </div>

        {/* Grade de horas */}
        <div className="grid grid-cols-8 gap-1">
          {/* Coluna das horas */}
          <div className="space-y-4">
            {hours.map((hour) => (
              <div
                key={hour}
                className="h-20 px-2 text-right text-xs font-medium text-gray-500"
              >
                {hour.toString().padStart(2, "0")}:00
              </div>
            ))}
          </div>

          {/* Colunas para cada dia da semana */}
          {weekDays.map((day) => {
            const dayEvents = getEventsByDate(day);

            return (
              <div
                key={format(day, "yyyy-MM-dd")}
                className="relative space-y-4 border-l border-gray-100"
              >
                {hours.map((hour) => (
                  <div
                    key={hour}
                    className="h-20 border-t border-gray-100 px-1"
                    onClick={() => {
                      const newDate = new Date(day);
                      newDate.setHours(hour);
                      handleDateClick(newDate);
                    }}
                  ></div>
                ))}

                {/* Eventos do dia */}
                {dayEvents.map((event) => {
                  if (!event.time) return null;

                  const [hours, minutes] = event.time.split(":").map(Number);
                  const top = ((hours * 60 + minutes) / 1440) * 100;

                  // Calcular duração (padrão: 60min)
                  let durationMinutes = 60;
                  if (event.endTime) {
                    const [endHours, endMinutes] = event.endTime
                      .split(":")
                      .map(Number);
                    durationMinutes =
                      endHours * 60 + endMinutes - (hours * 60 + minutes);
                  }

                  const height = (durationMinutes / 1440) * 100;

                  return (
                    <div
                      key={event.id}
                      className="absolute left-0 right-0 z-10 overflow-hidden rounded px-1"
                      style={{
                        top: `${top}%`,
                        height: `${Math.max(height, 5)}%`,
                        backgroundColor: `${getCategoryColor(event.category)}80`,
                        borderLeft: `3px solid ${getCategoryColor(event.category)}`,
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEventClick(event);
                      }}
                    >
                      <div className="p-1 text-xs font-medium text-white">
                        {event.time.substring(0, 5)} - {event.title}
                      </div>
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      </motion.div>
    );
  };

  // Componente de renderização da visualização de agenda
  const renderAgendaView = () => {
    // Agrupar eventos por dia para a visualização de agenda
    const eventsByDate = filteredEvents.reduce(
      (acc, event) => {
        const dateKey = event.date;
        if (!acc[dateKey]) {
          acc[dateKey] = [];
        }
        acc[dateKey].push(event);
        return acc;
      },
      {} as Record<string, CalendarEvent[]>,
    );

    // Ordenar as datas
    const sortedDates = Object.keys(eventsByDate).sort();

    return (
      <motion.div
        className="space-y-6"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.3 }}
        key="agenda-view"
      >
        {sortedDates.length === 0 ? (
          <div className="flex h-40 flex-col items-center justify-center rounded-lg border border-dashed border-gray-200 p-8 text-center">
            <CalendarIcon className="mb-2 h-10 w-10 text-gray-300" />
            <h3 className="mb-1 text-lg font-medium text-gray-900">
              Sem eventos
            </h3>
            <p className="text-sm text-gray-500">
              Nenhum evento encontrado para os filtros selecionados.
            </p>
            <Button
              variant="outline"
              className="mt-4"
              onClick={() => setIsAddEventOpen(true)}
            >
              <Plus className="mr-2 h-4 w-4" />
              Adicionar evento
            </Button>
          </div>
        ) : (
          sortedDates.map((dateKey) => {
            const date = parseISO(dateKey);
            const isDateToday = isToday(date);

            return (
              <div key={dateKey} className="rounded-lg border border-gray-100">
                <div
                  className={`flex items-center gap-2 p-3 ${
                    isDateToday ? "bg-blue-50" : "bg-gray-50"
                  }`}
                >
                  <div
                    className={`flex h-12 w-12 flex-col items-center justify-center rounded-full ${
                      isDateToday
                        ? "bg-blue-500 text-white"
                        : "bg-white text-gray-700"
                    }`}
                  >
                    <span className="text-xs font-medium">
                      {format(date, "MMM", { locale: ptBR })}
                    </span>
                    <span className="text-lg font-bold">
                      {format(date, "dd")}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">
                      {format(date, "EEEE", { locale: ptBR })}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {eventsByDate[dateKey].length} evento
                      {eventsByDate[dateKey].length !== 1 ? "s" : ""}
                    </p>
                  </div>
                </div>

                <div className="divide-y divide-gray-100">
                  {eventsByDate[dateKey]
                    .sort((a, b) => {
                      // Eventos de dia inteiro primeiro
                      if (a.isAllDay && !b.isAllDay) return -1;
                      if (!a.isAllDay && b.isAllDay) return 1;

                      // Ordenar por hora
                      if (a.time && b.time) return a.time.localeCompare(b.time);
                      if (a.time) return -1;
                      if (b.time) return 1;

                      return 0;
                    })
                    .map((event) => (
                      <div
                        key={event.id}
                        className="group flex cursor-pointer items-start p-3 hover:bg-gray-50"
                        onClick={() => handleEventClick(event)}
                      >
                        <div
                          className="mr-3 h-full w-1 self-stretch rounded"
                          style={{
                            backgroundColor: getCategoryColor(event.category),
                          }}
                        ></div>

                        <div className="min-w-24 text-right">
                          {event.isAllDay ? (
                            <span className="text-sm font-medium text-gray-500">
                              Dia inteiro
                            </span>
                          ) : (
                            <span className="text-sm font-medium">
                              {getEventDuration(event)}
                            </span>
                          )}
                        </div>

                        <div className="ml-4 flex-1">
                          <h4 className="font-medium text-gray-900">
                            {event.title}
                          </h4>
                          {event.location && (
                            <p className="mt-1 text-sm text-gray-600">
                              <span className="flex items-center gap-1">
                                {event.location}
                              </span>
                            </p>
                          )}
                          {event.description && (
                            <p className="mt-1 line-clamp-2 text-sm text-gray-500">
                              {event.description}
                            </p>
                          )}
                          <div className="mt-2">
                            <Badge
                              style={{
                                backgroundColor: `${getCategoryColor(event.category)}20`,
                                color: getCategoryColor(event.category),
                                borderColor: getCategoryColor(event.category),
                              }}
                              variant="outline"
                            >
                              {getCategoryName(event.category)}
                            </Badge>
                          </div>
                        </div>

                        <div className="ml-auto flex opacity-0 transition-opacity group-hover:opacity-100">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedEvent(event);
                              handleEditEvent();
                            }}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-red-500 hover:text-red-600"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteEvent(event.id);
                            }}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            );
          })
        )}
      </motion.div>
    );
  };

  // Modais e componentes de UI
  const renderAddEventModal = () => {
    return (
      <Dialog open={isAddEventOpen} onOpenChange={setIsAddEventOpen}>
        <DialogContent
          className="overflow-hidden border-none p-0 shadow-lg sm:max-w-2xl" // Aumentado para sm:max-w-2xl
          style={{ borderRadius: "20px" }}
        >
          <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-6 text-white">
            <DialogHeader>
              <DialogTitle className="mb-1 text-xl font-bold">
                <div className="flex items-center gap-2">
                  {isEditMode ? (
                    <CalendarCheck className="h-6 w-6" />
                  ) : (
                    <CalendarPlus className="h-6 w-6" />
                  )}
                  {isEditMode ? "Editar evento" : "Adicionar evento"}
                </div>
              </DialogTitle>
              <DialogDescription className="text-white/80">
                {isEditMode
                  ? "Edite os detalhes do evento existente"
                  : "Preencha os detalhes para adicionar um novo evento ao calendário"}
              </DialogDescription>
            </DialogHeader>
          </div>

          <div className="space-y-4 p-6">
            <div className="space-y-4">
              {/* Linha 1: Título e Categoria */}
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="title" className="font-medium text-gray-700">
                    Título
                  </Label>
                  <div className="relative">
                    <Tag className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
                    <Input
                      id="title"
                      value={eventForm.title}
                      onChange={(e) =>
                        setEventForm({ ...eventForm, title: e.target.value })
                      }
                      className="rounded-lg border-gray-200 pl-10 focus:border-blue-500"
                      placeholder="Título do evento"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="category"
                    className="font-medium text-gray-700"
                  >
                    Categoria
                  </Label>
                  <div className="relative">
                    <Tag className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
                    <Select
                      value={eventForm.category}
                      onValueChange={(value) =>
                        setEventForm({ ...eventForm, category: value })
                      }
                    >
                      <SelectTrigger className="rounded-lg border-gray-200 pl-10 focus:border-blue-500">
                        <SelectValue placeholder="Selecione uma categoria" />
                      </SelectTrigger>
                      <SelectContent className="rounded-lg border-none shadow-lg">
                        {eventCategories.map((category) => (
                          <SelectItem
                            key={category.id}
                            value={category.id}
                            className="cursor-pointer hover:bg-blue-50"
                          >
                            <div className="flex items-center gap-2">
                              <span
                                className="h-3 w-3 rounded-full"
                                style={{ backgroundColor: category.color }}
                              ></span>
                              {category.name}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {/* Linha 2: Dia inteiro e Local */}
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="flex flex-row items-center justify-between rounded-lg border p-3">
                  <Label className="font-medium text-gray-700">
                    Dia inteiro
                  </Label>
                  <Switch
                    checked={eventForm.isAllDay}
                    onCheckedChange={(checked) =>
                      setEventForm({ ...eventForm, isAllDay: checked })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="location"
                    className="font-medium text-gray-700"
                  >
                    Local
                  </Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
                    <Input
                      id="location"
                      value={eventForm.location || ""}
                      onChange={(e) =>
                        setEventForm({ ...eventForm, location: e.target.value })
                      }
                      className="rounded-lg border-gray-200 pl-10 focus:border-blue-500"
                      placeholder="Local do evento (opcional)"
                    />
                  </div>
                </div>
              </div>

              {/* Linha 3: Datas */}
              <div className="space-y-2">
                <Label htmlFor="date" className="font-medium text-gray-700">
                  Data
                </Label>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="space-y-1">
                    <DatePicker
                      value={
                        eventForm.date ? new Date(eventForm.date) : undefined
                      }
                      onChange={(date) => {
                        if (date) {
                          const isoDate = date.toISOString().split("T")[0];
                          setEventForm({ ...eventForm, date: isoDate });
                        }
                      }}
                    />
                    <span className="text-xs text-gray-500">Início</span>
                  </div>
                  <div className="space-y-1">
                    <DatePicker
                      value={
                        eventForm.endDate
                          ? new Date(eventForm.endDate)
                          : undefined
                      }
                      onChange={(date) => {
                        if (date) {
                          const isoDate = date.toISOString().split("T")[0];
                          setEventForm({ ...eventForm, endDate: isoDate });
                        } else {
                          setEventForm({ ...eventForm, endDate: "" });
                        }
                      }}
                    />
                    <span className="text-xs text-gray-500">
                      Fim (opcional)
                    </span>
                  </div>
                </div>
              </div>

              {/* Linha 4: Horários (se não for dia inteiro) */}
              {!eventForm.isAllDay && (
                <div className="space-y-2">
                  <Label htmlFor="time" className="font-medium text-gray-700">
                    Horário
                  </Label>
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div className="space-y-1">
                      <div className="relative">
                        <Clock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
                        <Input
                          id="time"
                          type="time"
                          value={eventForm.time}
                          onChange={(e) =>
                            setEventForm({ ...eventForm, time: e.target.value })
                          }
                          className="rounded-lg border-gray-200 pl-10 focus:border-blue-500"
                        />
                      </div>
                      <span className="text-xs text-gray-500">Início</span>
                    </div>
                    <div className="space-y-1">
                      <div className="relative">
                        <Clock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
                        <Input
                          id="endTime"
                          type="time"
                          value={eventForm.endTime}
                          onChange={(e) =>
                            setEventForm({
                              ...eventForm,
                              endTime: e.target.value,
                            })
                          }
                          className="rounded-lg border-gray-200 pl-10 focus:border-blue-500"
                        />
                      </div>
                      <span className="text-xs text-gray-500">
                        Fim (opcional)
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Linha 5: Lembrete e Repetição */}
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label
                    htmlFor="reminder"
                    className="font-medium text-gray-700"
                  >
                    Lembrete
                  </Label>
                  <div className="relative">
                    <Bell className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
                    <Select
                      value={eventForm.reminder}
                      onValueChange={(value) =>
                        setEventForm({ ...eventForm, reminder: value })
                      }
                    >
                      <SelectTrigger className="rounded-lg border-gray-200 pl-10 focus:border-blue-500">
                        <SelectValue placeholder="Lembrete" />
                      </SelectTrigger>
                      <SelectContent className="rounded-lg border-none shadow-lg">
                        {reminderOptions.map((option) => (
                          <SelectItem
                            key={option.id}
                            value={option.id}
                            className="cursor-pointer hover:bg-blue-50"
                          >
                            {option.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="recurrence"
                    className="font-medium text-gray-700"
                  >
                    Repetição
                  </Label>
                  <div className="relative">
                    <Repeat className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
                    <Select
                      value={eventForm.recurrence}
                      onValueChange={(value) =>
                        setEventForm({ ...eventForm, recurrence: value })
                      }
                    >
                      <SelectTrigger className="rounded-lg border-gray-200 pl-10 focus:border-blue-500">
                        <SelectValue placeholder="Repetição" />
                      </SelectTrigger>
                      <SelectContent className="rounded-lg border-none shadow-lg">
                        {recurrenceOptions.map((option) => (
                          <SelectItem
                            key={option.id}
                            value={option.id}
                            className="cursor-pointer hover:bg-blue-50"
                          >
                            {option.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {/* Linha 6: Descrição (full width) */}
              <div className="space-y-2">
                <Label
                  htmlFor="description"
                  className="font-medium text-gray-700"
                >
                  Descrição
                </Label>
                <div className="relative">
                  <FileText className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Textarea
                    id="description"
                    value={eventForm.description}
                    onChange={(e) =>
                      setEventForm({
                        ...eventForm,
                        description: e.target.value,
                      })
                    }
                    className="rounded-lg border-gray-200 pl-10 focus:border-blue-500"
                    placeholder="Descrição do evento (opcional)"
                    rows={3}
                  />
                </div>
              </div>
            </div>

            <DialogFooter className="mt-6 flex gap-3">
              <Button
                variant="outline"
                onClick={() => {
                  setIsAddEventOpen(false);
                  resetEventForm();
                }}
                className="flex-1 rounded-lg border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
              >
                Cancelar
              </Button>
              <Button
                onClick={handleAddOrUpdateEvent}
                className="flex-1 rounded-lg border-none bg-gradient-to-r from-blue-500 to-indigo-600 text-white hover:from-blue-600 hover:to-indigo-700"
              >
                {isEditMode ? "Atualizar" : "Adicionar"}
              </Button>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>
    );
  };

  const renderViewEventModal = () => {
    if (!selectedEvent) return null;

    return (
      <Dialog open={isViewEventOpen} onOpenChange={setIsViewEventOpen}>
        <DialogContent
          className="overflow-hidden border-none p-0 shadow-lg sm:max-w-md"
          style={{ borderRadius: "20px" }}
        >
          {/* Cabeçalho com gradiente */}
          <div
            className="bg-gradient-to-r from-purple-500 to-indigo-600 p-6 text-white"
            style={{
              backgroundImage: `linear-gradient(to right, ${adjustColor(getCategoryColor(selectedEvent.category), -20)}, ${adjustColor(getCategoryColor(selectedEvent.category), 20)})`,
            }}
          >
            <DialogHeader>
              <div className="flex items-center gap-3">
                <div
                  className="flex h-10 w-10 items-center justify-center rounded-full"
                  style={{
                    backgroundColor: "rgba(255, 255, 255, 0.2)",
                  }}
                >
                  <div
                    className="h-6 w-6 rounded-full"
                    style={{
                      backgroundColor: getCategoryColor(selectedEvent.category),
                    }}
                  ></div>
                </div>
                <div>
                  <DialogTitle className="mb-1 text-xl font-bold">
                    {selectedEvent.title}
                  </DialogTitle>
                  <div className="flex items-center text-sm text-white/80">
                    <CalendarIcon className="mr-1 h-4 w-4" />
                    {format(
                      parseISO(selectedEvent.date),
                      "dd 'de' MMMM 'de' yyyy",
                      { locale: ptBR },
                    )}
                  </div>
                </div>
              </div>
            </DialogHeader>
          </div>

          {/* Conteúdo */}
          <div className="p-6">
            <div className="space-y-5">
              {/* Data e hora */}
              <div className="flex items-start gap-4 rounded-xl bg-gray-50 p-4">
                <div className="flex-shrink-0 rounded-full bg-indigo-100 p-2.5">
                  <CalendarIcon className="h-5 w-5 text-indigo-600" />
                </div>
                <div>
                  <div className="font-medium text-gray-900">
                    {format(
                      parseISO(selectedEvent.date),
                      "dd 'de' MMMM 'de' yyyy",
                      { locale: ptBR },
                    )}
                    {selectedEvent.endDate &&
                      selectedEvent.endDate !== selectedEvent.date && (
                        <>
                          {" - "}
                          {format(
                            parseISO(selectedEvent.endDate),
                            "dd 'de' MMMM 'de' yyyy",
                            {
                              locale: ptBR,
                            },
                          )}
                        </>
                      )}
                  </div>
                  {selectedEvent.isAllDay ? (
                    <div className="mt-1 text-sm text-gray-500">
                      Dia inteiro
                    </div>
                  ) : (
                    selectedEvent.time && (
                      <div className="mt-1 text-sm text-gray-500">
                        {getEventDuration(selectedEvent)}
                      </div>
                    )
                  )}
                </div>
              </div>

              {/* Local */}
              {selectedEvent.location && (
                <div className="flex items-start gap-4 rounded-xl p-4">
                  <div className="flex-shrink-0 rounded-full bg-orange-100 p-2.5">
                    <MapPin className="h-5 w-5 text-orange-600" />
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">Local</div>
                    <div className="mt-1 text-gray-700">
                      {selectedEvent.location}
                    </div>
                  </div>
                </div>
              )}

              {/* Descrição */}
              {selectedEvent.description && (
                <div className="flex gap-4 rounded-xl p-4">
                  <div className="flex-shrink-0 rounded-full bg-blue-100 p-2.5">
                    <FileText className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">Descrição</div>
                    <div className="mt-1 whitespace-pre-wrap text-gray-700">
                      {selectedEvent.description}
                    </div>
                  </div>
                </div>
              )}

              {/* Tags/Badges */}
              <div className="mt-6 border-t border-gray-100 pt-4">
                <div className="mb-3 text-sm font-medium text-gray-500">
                  Detalhes do evento
                </div>
                <div className="flex flex-wrap gap-2">
                  <Badge className="border-none bg-gradient-to-r from-purple-500 to-indigo-600 px-3 py-1 hover:from-purple-600 hover:to-indigo-700">
                    {getCategoryName(selectedEvent.category)}
                  </Badge>

                  {selectedEvent.recurrence &&
                    selectedEvent.recurrence !== "none" && (
                      <Badge
                        variant="outline"
                        className="border-gray-200 px-3 py-1 font-normal text-gray-700"
                      >
                        <Repeat className="mr-1.5 h-3.5 w-3.5" />
                        {getRecurrenceName(selectedEvent.recurrence)}
                      </Badge>
                    )}

                  {selectedEvent.reminder &&
                    selectedEvent.reminder !== "none" && (
                      <Badge
                        variant="outline"
                        className="border-gray-200 px-3 py-1 font-normal text-gray-700"
                      >
                        <Bell className="mr-1.5 h-3.5 w-3.5" />
                        {getReminderName(selectedEvent.reminder)}
                      </Badge>
                    )}
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <DialogFooter className="flex justify-between border-t border-gray-100 px-6 py-4 sm:justify-between">
            <Button
              variant="destructive"
              onClick={() => handleDeleteEvent(selectedEvent.id)}
              className="gap-2 bg-red-50 text-red-600 hover:bg-red-100"
            >
              <Trash2 className="h-4 w-4" />
              Excluir
            </Button>
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => setIsViewEventOpen(false)}
                className="border-gray-200 text-gray-700 hover:bg-gray-50"
              >
                Fechar
              </Button>
              <Button
                onClick={handleEditEvent}
                className="gap-2 border-none bg-gradient-to-r from-purple-500 to-indigo-600 text-white hover:from-purple-600 hover:to-indigo-700"
              >
                <Edit className="h-4 w-4" />
                Editar
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  };

  // Função auxiliar para ajustar a cor - deve ser adicionada junto com o componente
  const adjustColor = (color: string, amount: number) => {
    // Função que permite escurecer ou clarear uma cor
    // Se a cor for um nome como "blue", esta função não funcionará
    if (!color.startsWith("#")) {
      // Para cores nomeadas, retorne uma cor padrão do mesmo tom
      if (amount > 0) {
        return color === "purple" ? "#9333ea" : "#818cf8";
      } else {
        return color === "purple" ? "#7e22ce" : "#6366f1";
      }
    }

    let r = parseInt(color.substring(1, 3), 16);
    let g = parseInt(color.substring(3, 5), 16);
    let b = parseInt(color.substring(5, 7), 16);

    r = Math.max(0, Math.min(255, r + amount));
    g = Math.max(0, Math.min(255, g + amount));
    b = Math.max(0, Math.min(255, b + amount));

    return `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="overflow-hidden rounded-xl shadow-lg">
        <div className="flex items-center justify-between bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white shadow-lg">
          <div className="flex items-center gap-4">
            <Calendar className="h-8 w-8" />
            <div>
              <h1 className="text-2xl font-bold">Calendário</h1>
              <p className="text-sm">
                Gerencie seus eventos e compromissos de forma eficiente
              </p>
            </div>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row">
            <Button
              variant="secondary"
              className="rounded-full bg-white/20 text-white transition-colors hover:bg-white/30"
              onClick={() => setIsExportMenuOpen(!isExportMenuOpen)}
            >
              <Download className="mr-2 h-4 w-4" />
              Exportar
            </Button>
            <Popover open={isExportMenuOpen} onOpenChange={setIsExportMenuOpen}>
              <PopoverTrigger asChild>
                <span />
              </PopoverTrigger>
              <PopoverContent className="w-56" align="end">
                <div className="space-y-1">
                  <Button
                    variant="ghost"
                    className="w-full justify-start"
                    onClick={() => exportEvents("csv")}
                  >
                    Exportar como CSV
                  </Button>
                  <Button
                    variant="ghost"
                    className="w-full justify-start"
                    onClick={() => exportEvents("json")}
                  >
                    Exportar como JSON
                  </Button>
                  <Button
                    variant="ghost"
                    className="w-full justify-start"
                    onClick={() => exportEvents("ics")}
                  >
                    Exportar como iCalendar
                  </Button>
                </div>
              </PopoverContent>
            </Popover>
            <Button
              onClick={() => setIsAddEventOpen(true)}
              variant="secondary"
              className="rounded-full bg-white/20 text-white transition-colors hover:bg-white/30"
            >
              <Plus className="mr-2 h-4 w-4" />
              Novo evento
            </Button>
          </div>
        </div>

        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={navigatePrevious}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon" onClick={navigateNext}>
                  <ChevronRight className="h-4 w-4" />
                </Button>
                <Button variant="ghost" onClick={navigateToday}>
                  Hoje
                </Button>
                <h2 className="text-xl font-bold">
                  {activeView === "month" &&
                    format(currentDate, "MMMM yyyy", { locale: ptBR })}
                  {activeView === "week" &&
                    `${format(getDaysForWeekView[0], "dd MMM", { locale: ptBR })} - ${format(
                      getDaysForWeekView[6],
                      "dd MMM",
                      { locale: ptBR },
                    )}, ${format(currentDate, "yyyy")}`}
                  {activeView === "day" &&
                    format(currentDate, "EEEE, dd 'de' MMMM 'de' yyyy", {
                      locale: ptBR,
                    })}
                  {activeView === "agenda" && "Visualização de Agenda"}
                </h2>
              </div>

              <div className="flex flex-col gap-2 sm:flex-row">
                <div className="flex items-center rounded-md border pl-2">
                  <Search className="h-4 w-4 text-gray-400" />
                  <Input
                    type="text"
                    placeholder="Buscar eventos..."
                    className="border-0 focus-visible:ring-0"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>

                <Select value={activeView} onValueChange={setActiveView}>
                  <SelectTrigger className="w-[120px]">
                    <SelectValue placeholder="Visualização" />
                  </SelectTrigger>
                  <SelectContent>
                    {calendarViews.map((view) => (
                      <SelectItem key={view.id} value={view.id}>
                        {view.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline">
                      <Layers className="mr-2 h-4 w-4" />
                      Categorias
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56">
                    {eventCategories.map((category) => (
                      <DropdownMenuItem
                        key={category.id}
                        onClick={(e) => {
                          e.preventDefault();
                          setActiveCategories((prev) =>
                            prev.includes(category.id)
                              ? prev.filter((id) => id !== category.id)
                              : [...prev, category.id],
                          );
                        }}
                      >
                        <div className="flex w-full items-center">
                          <div className="flex flex-1 items-center gap-2">
                            <div
                              className="h-3 w-3 rounded-full"
                              style={{ backgroundColor: category.color }}
                            ></div>
                            {category.name}
                          </div>
                          <input
                            type="checkbox"
                            checked={activeCategories.includes(category.id)}
                            onChange={() => {}}
                            className="h-4 w-4 rounded border-gray-300"
                          />
                        </div>
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <AnimatePresence mode="wait">
              {renderCalendarView()}
            </AnimatePresence>
          </CardContent>
        </Card>

        {renderAddEventModal()}
        {renderViewEventModal()}
      </div>
    </div>
  );
};

export default CalendarPage;
