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
  Info,
  Search,
  Layers,
  Download,
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
    const storedEvents = localStorage.getItem("calendarEvents");
    if (storedEvents) {
      try {
        const parsedEvents = JSON.parse(storedEvents);
        setEvents(parsedEvents);
        setFilteredEvents(parsedEvents);
      } catch (error) {
        console.error("Erro ao carregar eventos:", error);
        toast({
          title: "Erro ao carregar eventos",
          description: "Ocorreu um erro ao carregar seus eventos salvos.",
          variant: "destructive",
        });
      }
    }
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
  const handleAddOrUpdateEvent = () => {
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
        variant: "destructive",
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

  const handleDeleteEvent = (id: string) => {
    setEvents(events.filter((event) => event.id !== id));
    setIsViewEventOpen(false);

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
      description: `Seus eventos foram exportados no formato ${format.toString().toUpperCase()}`,
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
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>
              {isEditMode ? "Editar evento" : "Adicionar evento"}
            </DialogTitle>
            <DialogDescription>
              {isEditMode
                ? "Edite os detalhes do evento existente"
                : "Preencha os detalhes para adicionar um novo evento ao calendário"}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="title" className="text-right">
                Título
              </Label>
              <Input
                id="title"
                value={eventForm.title}
                onChange={(e) =>
                  setEventForm({ ...eventForm, title: e.target.value })
                }
                className="col-span-3"
                placeholder="Título do evento"
                required
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">Dia inteiro</Label>
              <div className="col-span-3">
                <Switch
                  checked={eventForm.isAllDay}
                  onCheckedChange={(checked) =>
                    setEventForm({ ...eventForm, isAllDay: checked })
                  }
                />
              </div>
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="date" className="text-right">
                Data
              </Label>
              <div className="col-span-3 grid grid-cols-2 gap-2">
                <div>
                  <Input
                    id="date"
                    type="date"
                    value={eventForm.date}
                    onChange={(e) =>
                      setEventForm({ ...eventForm, date: e.target.value })
                    }
                    required
                  />
                  <span className="mt-1 text-xs text-gray-500">Início</span>
                </div>
                <div>
                  <Input
                    id="endDate"
                    type="date"
                    value={eventForm.endDate}
                    onChange={(e) =>
                      setEventForm({ ...eventForm, endDate: e.target.value })
                    }
                  />
                  <span className="mt-1 text-xs text-gray-500">
                    Fim (opcional)
                  </span>
                </div>
              </div>
            </div>

            {!eventForm.isAllDay && (
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="time" className="text-right">
                  Horário
                </Label>
                <div className="col-span-3 grid grid-cols-2 gap-2">
                  <div>
                    <Input
                      id="time"
                      type="time"
                      value={eventForm.time}
                      onChange={(e) =>
                        setEventForm({ ...eventForm, time: e.target.value })
                      }
                    />
                    <span className="mt-1 text-xs text-gray-500">Início</span>
                  </div>
                  <div>
                    <Input
                      id="endTime"
                      type="time"
                      value={eventForm.endTime}
                      onChange={(e) =>
                        setEventForm({ ...eventForm, endTime: e.target.value })
                      }
                    />
                    <span className="mt-1 text-xs text-gray-500">
                      Fim (opcional)
                    </span>
                  </div>
                </div>
              </div>
            )}

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="category" className="text-right">
                Categoria
              </Label>
              <Select
                value={eventForm.category}
                onValueChange={(value) =>
                  setEventForm({ ...eventForm, category: value })
                }
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Selecione uma categoria" />
                </SelectTrigger>
                <SelectContent>
                  {eventCategories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
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

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="location" className="text-right">
                Local
              </Label>
              <Input
                id="location"
                value={eventForm.location || ""}
                onChange={(e) =>
                  setEventForm({ ...eventForm, location: e.target.value })
                }
                className="col-span-3"
                placeholder="Local do evento (opcional)"
              />
            </div>

            <div className="grid grid-cols-4 items-start gap-4">
              <Label htmlFor="description" className="text-right">
                Descrição
              </Label>
              <Textarea
                id="description"
                value={eventForm.description}
                onChange={(e) =>
                  setEventForm({ ...eventForm, description: e.target.value })
                }
                className="col-span-3"
                placeholder="Descrição do evento (opcional)"
                rows={3}
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="reminder" className="text-right">
                Lembrete
              </Label>
              <Select
                value={eventForm.reminder}
                onValueChange={(value) =>
                  setEventForm({ ...eventForm, reminder: value })
                }
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Lembrete" />
                </SelectTrigger>
                <SelectContent>
                  {reminderOptions.map((option) => (
                    <SelectItem key={option.id} value={option.id}>
                      {option.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="recurrence" className="text-right">
                Repetição
              </Label>
              <Select
                value={eventForm.recurrence}
                onValueChange={(value) =>
                  setEventForm({ ...eventForm, recurrence: value })
                }
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Repetição" />
                </SelectTrigger>
                <SelectContent>
                  {recurrenceOptions.map((option) => (
                    <SelectItem key={option.id} value={option.id}>
                      {option.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsAddEventOpen(false);
                resetEventForm();
              }}
            >
              Cancelar
            </Button>
            <Button onClick={handleAddOrUpdateEvent}>
              {isEditMode ? "Atualizar" : "Adicionar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  };

  const renderViewEventModal = () => {
    if (!selectedEvent) return null;

    return (
      <Dialog open={isViewEventOpen} onOpenChange={setIsViewEventOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <div className="flex items-center gap-2">
              <div
                className="h-4 w-4 rounded-full"
                style={{
                  backgroundColor: getCategoryColor(selectedEvent.category),
                }}
              ></div>
              <DialogTitle className="text-xl">
                {selectedEvent.title}
              </DialogTitle>
            </div>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="flex items-start gap-2">
              <CalendarIcon className="h-5 w-5 flex-shrink-0 text-gray-500" />
              <div>
                <div className="font-medium">
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
                  <div className="text-sm text-gray-500">Dia inteiro</div>
                ) : (
                  selectedEvent.time && (
                    <div className="text-sm text-gray-500">
                      {getEventDuration(selectedEvent)}
                    </div>
                  )
                )}
              </div>
            </div>

            {selectedEvent.location && (
              <div className="flex items-start gap-2">
                <Tag className="h-5 w-5 flex-shrink-0 text-gray-500" />
                <div className="font-medium">{selectedEvent.location}</div>
              </div>
            )}

            {selectedEvent.description && (
              <div className="flex gap-2">
                <Info className="h-5 w-5 flex-shrink-0 text-gray-500" />
                <div className="whitespace-pre-wrap">
                  {selectedEvent.description}
                </div>
              </div>
            )}

            <div className="flex flex-wrap gap-2">
              <Badge>{getCategoryName(selectedEvent.category)}</Badge>

              {selectedEvent.recurrence &&
                selectedEvent.recurrence !== "none" && (
                  <Badge variant="outline">
                    {getRecurrenceName(selectedEvent.recurrence)}
                  </Badge>
                )}

              {selectedEvent.reminder && selectedEvent.reminder !== "none" && (
                <Badge variant="outline">
                  Lembrete: {getReminderName(selectedEvent.reminder)}
                </Badge>
              )}
            </div>
          </div>
          <DialogFooter className="flex justify-between sm:justify-between">
            <div>
              <Button
                variant="destructive"
                onClick={() => handleDeleteEvent(selectedEvent.id)}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Excluir
              </Button>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => setIsViewEventOpen(false)}
              >
                Fechar
              </Button>
              <Button onClick={handleEditEvent}>
                <Edit className="mr-2 h-4 w-4" />
                Editar
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  };

  return (
    <div className="container mx-auto py-6">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold">Calendário</h1>
          <p className="text-gray-500">
            Gerencie seus eventos e compromissos de forma eficiente
          </p>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row">
          <Button
            variant="outline"
            className="justify-between"
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
          <Button onClick={() => setIsAddEventOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Novo evento
          </Button>
        </div>
      </div>

      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-2">
              <Button variant="outline" size="icon" onClick={navigatePrevious}>
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
          <AnimatePresence mode="wait">{renderCalendarView()}</AnimatePresence>
        </CardContent>
      </Card>

      {renderAddEventModal()}
      {renderViewEventModal()}
    </div>
  );
};

export default CalendarPage;
