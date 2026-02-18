import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Icon from "@/components/ui/icon";

const DAYS = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"];
const MONTHS = [
  "Январь", "Февраль", "Март", "Апрель", "Май", "Июнь",
  "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"
];

interface CareEvent {
  date: number;
  type: "water" | "fertilize" | "prune" | "repot";
  plant: string;
}

const MOCK_EVENTS: CareEvent[] = [
  { date: 3, type: "water", plant: "Монстера" },
  { date: 5, type: "fertilize", plant: "Фикус" },
  { date: 8, type: "water", plant: "Кактус" },
  { date: 10, type: "prune", plant: "Роза" },
  { date: 14, type: "water", plant: "Монстера" },
  { date: 15, type: "repot", plant: "Алоэ" },
  { date: 18, type: "water", plant: "Фикус" },
  { date: 20, type: "fertilize", plant: "Монстера" },
  { date: 22, type: "water", plant: "Кактус" },
  { date: 25, type: "water", plant: "Монстера" },
];

const EVENT_CONFIG = {
  water: { icon: "Droplets", color: "bg-blue-100 text-blue-700", label: "Полив" },
  fertilize: { icon: "Sparkles", color: "bg-amber-100 text-amber-700", label: "Подкормка" },
  prune: { icon: "Scissors", color: "bg-green-100 text-green-800", label: "Обрезка" },
  repot: { icon: "FlowerIcon", color: "bg-purple-100 text-purple-700", label: "Пересадка" },
};

const PlantCalendar = () => {
  const [currentDate] = useState(new Date(2026, 1));
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDay = (new Date(year, month, 1).getDay() + 6) % 7;
  const today = new Date().getDate();

  const [selectedDay, setSelectedDay] = useState<number | null>(today);

  const getEventsForDay = (day: number) =>
    MOCK_EVENTS.filter((e) => e.date === day);

  const days = [];
  for (let i = 0; i < firstDay; i++) {
    days.push(<div key={`empty-${i}`} className="h-10" />);
  }
  for (let d = 1; d <= daysInMonth; d++) {
    const events = getEventsForDay(d);
    const isToday = d === today;
    const isSelected = d === selectedDay;
    days.push(
      <button
        key={d}
        onClick={() => setSelectedDay(d)}
        className={`h-10 w-full rounded-lg text-sm font-medium relative transition-all
          ${isToday ? "ring-2 ring-primary ring-offset-1" : ""}
          ${isSelected ? "bg-primary text-primary-foreground" : "hover:bg-secondary"}
        `}
      >
        {d}
        {events.length > 0 && (
          <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 flex gap-0.5">
            {events.map((e, i) => (
              <span
                key={i}
                className={`w-1.5 h-1.5 rounded-full ${
                  isSelected ? "bg-primary-foreground" : 
                  e.type === "water" ? "bg-blue-500" : 
                  e.type === "fertilize" ? "bg-amber-500" : 
                  e.type === "prune" ? "bg-green-600" : "bg-purple-500"
                }`}
              />
            ))}
          </span>
        )}
      </button>
    );
  }

  const selectedEvents = selectedDay ? getEventsForDay(selectedDay) : [];

  return (
    <Card className="animate-fade-in border-0 shadow-md bg-white/80 backdrop-blur">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center gap-2">
            <Icon name="CalendarDays" size={20} className="text-primary" />
            Календарь ухода
          </span>
          <span className="text-base font-medium text-muted-foreground">
            {MONTHS[month]} {year}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-7 gap-1 mb-1">
          {DAYS.map((day) => (
            <div key={day} className="text-center text-xs font-medium text-muted-foreground py-1">
              {day}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-1">{days}</div>

        {selectedDay && (
          <div className="mt-4 pt-4 border-t">
            <p className="text-sm font-medium mb-2">
              {selectedDay} {MONTHS[month]}
            </p>
            {selectedEvents.length > 0 ? (
              <div className="space-y-2">
                {selectedEvents.map((event, i) => {
                  const config = EVENT_CONFIG[event.type];
                  return (
                    <div key={i} className="flex items-center gap-2">
                      <Badge variant="secondary" className={config.color}>
                        <Icon name={config.icon} fallback="Leaf" size={12} className="mr-1" />
                        {config.label}
                      </Badge>
                      <span className="text-sm">{event.plant}</span>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">Нет запланированных дел</p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PlantCalendar;
