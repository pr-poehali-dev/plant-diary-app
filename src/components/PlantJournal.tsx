import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Icon from "@/components/ui/icon";

interface JournalEntry {
  id: number;
  date: string;
  plant: string;
  emoji: string;
  type: string;
  text: string;
  photo?: string;
  tag: string;
  tagColor: string;
}

const ENTRIES: JournalEntry[] = [
  {
    id: 1, date: "18 февраля", plant: "Монстера", emoji: "🪴",
    type: "Наблюдение", text: "Появился новый лист! Разворачивается красиво, ярко-зелёного цвета. Высота растения уже 65 см.",
    tag: "Рост", tagColor: "bg-green-100 text-green-700"
  },
  {
    id: 2, date: "16 февраля", plant: "Розмарин", emoji: "🌱",
    type: "Уход", text: "Произвёл обрезку верхушек для лучшего ветвления. Срезанные веточки использовал в готовке.",
    tag: "Обрезка", tagColor: "bg-amber-100 text-amber-700"
  },
  {
    id: 3, date: "14 февраля", plant: "Фикус Бенджамина", emoji: "🌿",
    type: "Проблема", text: "Заметил пожелтение нижних листьев. Переместил дальше от батареи, увеличил опрыскивание до 2 раз в день.",
    tag: "Проблема", tagColor: "bg-red-100 text-red-700"
  },
  {
    id: 4, date: "10 февраля", plant: "Алоэ Вера", emoji: "🪷",
    type: "Наблюдение", text: "Появились 3 детки у основания. Планирую отсадить через 2 недели, когда подрастут до 5 см.",
    tag: "Размножение", tagColor: "bg-purple-100 text-purple-700"
  },
  {
    id: 5, date: "8 февраля", plant: "Кактус Эхинопсис", emoji: "🌵",
    type: "Наблюдение", text: "Заметил бутон! Впервые за 2 года. Увеличил освещение, поставил ближе к окну.",
    tag: "Цветение", tagColor: "bg-pink-100 text-pink-700"
  },
];

const PlantJournal = () => {
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

      <div className="relative">
        <div className="absolute left-5 top-0 bottom-0 w-px bg-border" />

        <div className="space-y-4">
          {ENTRIES.map((entry) => (
            <div key={entry.id} className="relative pl-12">
              <div className="absolute left-3.5 top-4 w-3 h-3 rounded-full bg-primary border-2 border-background" />
              
              <Card className="border-0 shadow-sm bg-white/80 backdrop-blur">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{entry.emoji}</span>
                      <span className="font-medium text-sm">{entry.plant}</span>
                      <Badge variant="secondary" className={`text-xs ${entry.tagColor}`}>
                        {entry.tag}
                      </Badge>
                    </div>
                    <span className="text-xs text-muted-foreground">{entry.date}</span>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">{entry.text}</p>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PlantJournal;
