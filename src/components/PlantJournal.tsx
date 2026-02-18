import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Icon from "@/components/ui/icon";
import { journalApi, type JournalEntry } from "@/lib/api";

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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    journalApi.getAll().then((data) => {
      setEntries(data);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  return (
    <div className="animate-fade-in">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <Icon name="BookOpen" size={20} className="text-primary" />
          Дневник наблюдений
        </h2>
        <button className="text-sm text-primary font-medium hover:underline flex items-center gap-1">
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