import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Icon from "@/components/ui/icon";

interface Reminder {
  id: number;
  plant: string;
  emoji: string;
  type: string;
  time: string;
  urgent: boolean;
  icon: string;
  color: string;
}

const REMINDERS: Reminder[] = [
  { id: 1, plant: "Фикус Бенджамина", emoji: "🌿", type: "Полив", time: "Сегодня", urgent: true, icon: "Droplets", color: "text-blue-600" },
  { id: 2, plant: "Кактус Эхинопсис", emoji: "🌵", type: "Полив", time: "Сегодня", urgent: true, icon: "Droplets", color: "text-blue-600" },
  { id: 3, plant: "Розмарин", emoji: "🌱", type: "Полив", time: "Завтра", urgent: false, icon: "Droplets", color: "text-blue-500" },
  { id: 4, plant: "Монстера", emoji: "🪴", type: "Подкормка", time: "20 фев", urgent: false, icon: "Sparkles", color: "text-amber-600" },
  { id: 5, plant: "Алоэ Вера", emoji: "🪷", type: "Пересадка", time: "25 фев", urgent: false, icon: "Flower2", color: "text-purple-600" },
];

const Reminders = () => {
  return (
    <div className="animate-fade-in">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <Icon name="Bell" size={20} className="text-primary" />
          Напоминания
        </h2>
        <Badge variant="secondary" className="bg-red-50 text-red-700">
          {REMINDERS.filter(r => r.urgent).length} срочных
        </Badge>
      </div>

      <div className="space-y-2">
        {REMINDERS.map((reminder) => (
          <Card
            key={reminder.id}
            className={`border-0 shadow-sm bg-white/80 backdrop-blur transition-all ${
              reminder.urgent ? "ring-1 ring-red-200" : ""
            }`}
          >
            <CardContent className="p-4 flex items-center gap-3">
              <span className="text-2xl">{reminder.emoji}</span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="font-medium text-sm">{reminder.plant}</h3>
                  {reminder.urgent && (
                    <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                  )}
                </div>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <Icon name={reminder.icon} fallback="Bell" size={13} className={reminder.color} />
                  <span className="text-xs text-muted-foreground">{reminder.type}</span>
                  <span className="text-xs text-muted-foreground">•</span>
                  <span className={`text-xs font-medium ${reminder.urgent ? "text-red-600" : "text-muted-foreground"}`}>
                    {reminder.time}
                  </span>
                </div>
              </div>
              <Button
                size="sm"
                variant={reminder.urgent ? "default" : "outline"}
                className={reminder.urgent ? "bg-primary text-primary-foreground" : ""}
              >
                <Icon name="Check" size={14} className="mr-1" />
                Готово
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="border-0 shadow-sm bg-secondary/30 mt-4">
        <CardContent className="p-4 text-center">
          <Icon name="BellPlus" size={24} className="text-muted-foreground mx-auto mb-2" />
          <p className="text-sm text-muted-foreground">Добавить напоминание</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Reminders;
