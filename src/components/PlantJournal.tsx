import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import Icon from "@/components/ui/icon";
import { journalApi, plantsApi, type JournalEntry, type Plant } from "@/lib/api";

const TAG_COLORS: Record<string, string> = {
  "Рост": "bg-green-100 text-green-700",
  "Обрезка": "bg-amber-100 text-amber-700",
  "Проблема": "bg-red-100 text-red-700",
  "Размножение": "bg-purple-100 text-purple-700",
  "Цветение": "bg-pink-100 text-pink-700",
  "Полив": "bg-blue-100 text-blue-700",
  "Пересадка": "bg-cyan-100 text-cyan-700",
  "Подкормка": "bg-orange-100 text-orange-700",
};

const TAGS = Object.keys(TAG_COLORS);

function formatDateRu(dateStr: string): string {
  const d = new Date(dateStr);
  const day = d.getDate();
  const months = [
    "января", "февраля", "марта", "апреля", "мая", "июня",
    "июля", "августа", "сентября", "октября", "ноября", "декабря",
  ];
  return `${day} ${months[d.getMonth()]}`;
}

const PlantJournal = () => {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [plants, setPlants] = useState<Plant[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ plant_id: 0, tag: "", text: "" });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    Promise.all([journalApi.getAll(), plantsApi.getAll()]).then(([j, p]) => {
      setEntries(j);
      setPlants(p);
      if (p.length > 0 && form.plant_id === 0) setForm((f) => ({ ...f, plant_id: p[0].id }));
      setLoading(false);
    }).catch(() => setLoading(false));
  };

  const handleSubmit = async () => {
    if (!form.text.trim() || !form.plant_id) return;
    setSaving(true);
    await journalApi.create(form);
    setShowForm(false);
    setForm({ plant_id: plants[0]?.id || 0, tag: "", text: "" });
    setSaving(false);
    loadData();
  };

  if (showForm) {
    return (
      <div className="animate-fade-in">
        <button
          onClick={() => setShowForm(false)}
          className="flex items-center gap-1 text-sm text-muted-foreground mb-4 hover:text-foreground transition-colors"
        >
          <Icon name="ArrowLeft" size={16} />
          Назад к записям
        </button>

        <Card className="border-0 shadow-md bg-white/80 backdrop-blur">
          <CardContent className="pt-6 space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Icon name="PenLine" size={18} className="text-primary" />
              Новая запись
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
              <p className="text-sm font-medium mb-2">Тег</p>
              <div className="flex gap-2 flex-wrap">
                {TAGS.map((t) => (
                  <button
                    key={t}
                    onClick={() => setForm({ ...form, tag: form.tag === t ? "" : t })}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                      form.tag === t ? TAG_COLORS[t] + " ring-2 ring-offset-1 ring-current" : "bg-secondary text-secondary-foreground"
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p className="text-sm font-medium mb-1">Запись</p>
              <Textarea
                placeholder="Что нового с растением? Рост, изменения, наблюдения..."
                value={form.text}
                onChange={(e) => setForm({ ...form, text: e.target.value })}
                rows={4}
              />
            </div>

            <Button
              onClick={handleSubmit}
              disabled={!form.text.trim() || !form.plant_id || saving}
              className="w-full bg-primary text-primary-foreground"
            >
              {saving ? (
                <Icon name="Loader2" size={16} className="animate-spin mr-2" />
              ) : (
                <Icon name="Check" size={16} className="mr-2" />
              )}
              Сохранить запись
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
          <Icon name="BookOpen" size={20} className="text-primary" />
          Дневник наблюдений
        </h2>
        <button
          onClick={() => setShowForm(true)}
          className="text-sm text-primary font-medium hover:underline flex items-center gap-1"
        >
          <Icon name="PenLine" size={14} />
          Новая запись
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Icon name="Loader2" size={24} className="animate-spin text-primary" />
        </div>
      ) : (
        <div className="relative">
          <div className="absolute left-5 top-0 bottom-0 w-px bg-border" />

          <div className="space-y-4">
            {entries.map((entry) => (
              <div key={entry.id} className="relative pl-12">
                <div className="absolute left-3.5 top-4 w-3 h-3 rounded-full bg-primary border-2 border-background" />

                <Card className="border-0 shadow-sm bg-white/80 backdrop-blur">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xl">{entry.plant_emoji}</span>
                        <span className="font-medium text-sm">{entry.plant_name}</span>
                        <Badge variant="secondary" className={`text-xs ${TAG_COLORS[entry.tag] || "bg-gray-100 text-gray-700"}`}>
                          {entry.tag}
                        </Badge>
                      </div>
                      <span className="text-xs text-muted-foreground">{formatDateRu(entry.entry_date)}</span>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed">{entry.text}</p>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default PlantJournal;
