import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Icon from "@/components/ui/icon";
import { remindersApi, plantsApi, type Reminder, type Plant } from "@/lib/api";

const TYPE_STYLES: Record<string, { icon: string; color: string }> = {
  "Полив": { icon: "Droplets", color: "text-blue-600" },
  "Подкормка": { icon: "Sparkles", color: "text-amber-600" },
  "Пересадка": { icon: "Flower2", color: "text-purple-600" },
  "Обрезка": { icon: "Scissors", color: "text-green-600" },
  "Опрыскивание": { icon: "CloudRain", color: "text-cyan-600" },
};

const TYPES = Object.keys(TYPE_STYLES);

const Reminders = () => {
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [plants, setPlants] = useState<Plant[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ plant_id: 0, type: "Полив", due_date: "" });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    Promise.all([remindersApi.getAll(), plantsApi.getAll()]).then(([r, p]) => {
      setReminders(r);
      setPlants(p);
      if (p.length > 0 && form.plant_id === 0) setForm((f) => ({ ...f, plant_id: p[0].id }));
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      if (!form.due_date) setForm((f) => ({ ...f, due_date: tomorrow.toISOString().split("T")[0] }));
      setLoading(false);
    }).catch(() => setLoading(false));
  };

  const handleComplete = (id: number) => {
    setReminders((prev) => prev.filter((r) => r.id !== id));
    remindersApi.complete(id);
  };

  const handleSubmit = async () => {
    if (!form.plant_id || !form.due_date) return;
    setSaving(true);
    await remindersApi.create(form);
    setShowForm(false);
    setSaving(false);
    loadData();
  };

  const urgentCount = reminders.filter((r) => r.urgent).length;

  if (showForm) {
    return (
      <div className="animate-fade-in">
        <button
          onClick={() => setShowForm(false)}
          className="flex items-center gap-1 text-sm text-muted-foreground mb-4 hover:text-foreground transition-colors"
        >
          <Icon name="ArrowLeft" size={16} />
          Назад к напоминаниям
        </button>

        <Card className="border-0 shadow-md bg-white/80 backdrop-blur">
          <CardContent className="pt-6 space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Icon name="BellPlus" size={18} className="text-primary" />
              Новое напоминание
            </h3>

            <div>
              <p className="text-sm font-medium mb-2">Растение</p>
              <div className="flex gap-2 flex-wrap">
                {plants.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => setForm({ ...form, plant_id: p.id })}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm transition-all ${
                      form.plant_id === p.id
                        ? "bg-primary text-primary-foreground"
                        : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                    }`}
                  >
                    <span>{p.emoji}</span>
                    {p.name}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p className="text-sm font-medium mb-2">Тип ухода</p>
              <div className="flex gap-2 flex-wrap">
                {TYPES.map((t) => {
                  const style = TYPE_STYLES[t];
                  return (
                    <button
                      key={t}
                      onClick={() => setForm({ ...form, type: t })}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm transition-all ${
                        form.type === t
                          ? "bg-primary text-primary-foreground"
                          : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                      }`}
                    >
                      <Icon name={style.icon} fallback="Bell" size={14} />
                      {t}
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <p className="text-sm font-medium mb-1">Дата</p>
              <Input
                type="date"
                value={form.due_date}
                onChange={(e) => setForm({ ...form, due_date: e.target.value })}
              />
            </div>

            <Button
              onClick={handleSubmit}
              disabled={!form.plant_id || !form.due_date || saving}
              className="w-full bg-primary text-primary-foreground"
            >
              {saving ? (
                <Icon name="Loader2" size={16} className="animate-spin mr-2" />
              ) : (
                <Icon name="Check" size={16} className="mr-2" />
              )}
              Создать напоминание
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

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

      <Card
        className="border-0 shadow-sm bg-secondary/30 mt-4 cursor-pointer hover:bg-secondary/50 transition-colors"
        onClick={() => setShowForm(true)}
      >
        <CardContent className="p-4 text-center">
          <Icon name="BellPlus" size={24} className="text-muted-foreground mx-auto mb-2" />
          <p className="text-sm text-muted-foreground">Добавить напоминание</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Reminders;
