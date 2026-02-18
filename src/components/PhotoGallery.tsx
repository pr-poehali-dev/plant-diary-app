import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Icon from "@/components/ui/icon";

interface Photo {
  id: number;
  plant: string;
  date: string;
  note: string;
  color: string;
  emoji: string;
}

const PHOTOS: Photo[] = [
  { id: 1, plant: "Монстера", date: "18 фев", note: "Новый лист разворачивается", color: "from-green-200 to-emerald-300", emoji: "🪴" },
  { id: 2, plant: "Кактус", date: "15 фев", note: "Появился бутон!", color: "from-amber-200 to-orange-300", emoji: "🌵" },
  { id: 3, plant: "Розмарин", date: "12 фев", note: "После обрезки", color: "from-lime-200 to-green-300", emoji: "🌱" },
  { id: 4, plant: "Фикус", date: "10 фев", note: "Новое место у окна", color: "from-teal-200 to-cyan-300", emoji: "🌿" },
  { id: 5, plant: "Алоэ", date: "8 фев", note: "Детки растут", color: "from-emerald-200 to-green-400", emoji: "🪷" },
  { id: 6, plant: "Монстера", date: "5 фев", note: "Общий вид", color: "from-green-300 to-emerald-400", emoji: "🪴" },
];

const PhotoGallery = () => {
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);

  return (
    <div className="animate-fade-in">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <Icon name="Camera" size={20} className="text-primary" />
          Фотогалерея
        </h2>
        <button className="text-sm text-primary font-medium hover:underline flex items-center gap-1">
          <Icon name="ImagePlus" size={14} />
          Добавить фото
        </button>
      </div>

      {selectedPhoto ? (
        <Card className="border-0 shadow-md bg-white/80 backdrop-blur animate-scale-in">
          <CardContent className="p-4">
            <button
              onClick={() => setSelectedPhoto(null)}
              className="flex items-center gap-1 text-sm text-muted-foreground mb-3 hover:text-foreground transition-colors"
            >
              <Icon name="ArrowLeft" size={16} />
              Назад
            </button>
            <div className={`bg-gradient-to-br ${selectedPhoto.color} rounded-xl h-64 flex items-center justify-center mb-4`}>
              <span className="text-7xl">{selectedPhoto.emoji}</span>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">{selectedPhoto.plant}</h3>
                <p className="text-sm text-muted-foreground">{selectedPhoto.note}</p>
              </div>
              <Badge variant="secondary">{selectedPhoto.date}</Badge>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-2 gap-2">
          {PHOTOS.map((photo) => (
            <Card
              key={photo.id}
              className="border-0 shadow-sm overflow-hidden cursor-pointer hover:shadow-md transition-all hover:-translate-y-0.5"
              onClick={() => setSelectedPhoto(photo)}
            >
              <div className={`bg-gradient-to-br ${photo.color} h-28 flex items-center justify-center`}>
                <span className="text-4xl">{photo.emoji}</span>
              </div>
              <CardContent className="p-2.5">
                <p className="text-xs font-medium truncate">{photo.plant}</p>
                <p className="text-xs text-muted-foreground truncate">{photo.note}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default PhotoGallery;
