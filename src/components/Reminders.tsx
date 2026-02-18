import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Icon from "@/components/ui/icon";
import { remindersApi, type Reminder } from "@/lib/api";

const TYPE_STYLES: Record<string, { icon: string; color: string }> = {
  "Полив": { icon: "Droplets", color: "text-blue-600" },
  "Подкормка": { icon: "Sparkles", color: "text-amber-600" },
  "Пересадка": { icon: "Flower2", color: "text-purple-600" },
  "Обрезка": { icon: "Scissors", color: "text-green-600" },
  "Опрыскивание": { icon: "CloudRain", color: "text-cyan-600" },
};

const Reminders = () => {
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    remindersApi.getAll().then((data) => {
      setReminders(data);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const handleComplete = (id: number) => {
    setReminders((prev) => prev.filter((r) => r.id !== id));
    remindersApi.complete(id);
  };

  const urgentCount = reminders.filter((r) => r.urgent).length;

  return (
    <div className="animate-fade-in">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <Icon name="Bell" size={20} className="text-primary" />
          Напоминания
        </h2>
        <Badge variant="secondary" className="bg-red-50 text-red-700">
          {urgentCount} срочных
        </Badge>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Icon name="Loader2" size={24} className="animate-spin text-primary" />
        </div>
      ) : (
        <div className="space-y-2">
          {reminders.map((reminder) => {
            const style = TYPE_STYLES[reminder.type] || { icon: "Bell", color: "text-gray-600" };
            return (
              <Card
                key={reminder.id}
                className={`border-0 shadow-sm bg-white/80 backdrop-blur transition-all ${
                  reminder.urgent ? "ring-1 ring-red-200" : ""
                }`}
              >
                <CardContent className="p-4 flex items-center gap-3">
                  <span className="text-2xl">{reminder.plant_emoji}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium text-sm">{reminder.plant_name}</h3>
                      {reminder.urgent && (
                        <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                      )}
                    </div>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <Icon name={style.icon} fallback="Bell" size={13} className={style.color} />
                      <span className="text-xs text-muted-foreground">{reminder.type}</span>
                      <span className="text-xs text-muted-foreground">•</span>
                      <span className={`text-xs font-medium ${reminder.urgent ? "text-red-600" : "text-muted-foreground"}`}>
                        {reminder.time_label}
                      </span>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    variant={reminder.urgent ? "default" : "outline"}
                    className={reminder.urgent ? "bg-primary text-primary-foreground" : ""}
                    onClick={() => handleComplete(reminder.id)}
                  >
                    <Icon name="Check" size={14} className="mr-1" />
                    Готово
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

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