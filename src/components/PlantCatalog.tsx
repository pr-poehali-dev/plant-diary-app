import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import Icon from "@/components/ui/icon";
import { plantsApi, type Plant } from "@/lib/api";

const EMOJIS = ["🌱", "🪴", "🌿", "🌵", "🪷", "🌻", "🌺", "🌹", "🍀", "🌾"];

function formatDate(dateStr: string | null): string {
  if (!dateStr) return "—";
  const d = new Date(dateStr);
  const day = d.getDate();
  const months = ["янв", "фев", "мар", "апр", "мая", "июн", "июл", "авг", "сен", "окт", "ноя", "дек"];
  return `${day} ${months[d.getMonth()]}`;
}

function formatWaterFrequency(days: number): string {
  return `Раз в ${days} дней`;
}

const PlantCatalog = () => {
  const [plants, setPlants] = useState<Plant[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPlant, setSelectedPlant] = useState<Plant | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    name: "", species: "", emoji: "🌱", water_frequency_days: 7,
    light: "", humidity: 50, notes: "",
  });

  useEffect(() => {
    loadPlants();
  }, []);

  const loadPlants = () => {
    plantsApi.getAll().then((data) => {
      setPlants(data);
      setLoading(false);
    }).catch(() => setLoading(false));
  };

  const handleSubmit = async () => {
    if (!form.name.trim()) return;
    setSaving(true);
    await plantsApi.create(form);
    setShowForm(false);
    setForm({ name: "", species: "", emoji: "🌱", water_frequency_days: 7, light: "", humidity: 50, notes: "" });
    setSaving(false);
    loadPlants();
  };

  if (showForm) {
    return (
      <div className="animate-fade-in">
        <button
          onClick={() => setShowForm(false)}
          className="flex items-center gap-1 text-sm text-muted-foreground mb-4 hover:text-foreground transition-colors"
        >
          <Icon name="ArrowLeft" size={16} />
          Назад к списку
        </button>

        <Card className="border-0 shadow-md bg-white/80 backdrop-blur">
          <CardContent className="pt-6 space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Icon name="Plus" size={18} className="text-primary" />
              Новое растение
            </h3>

            <div>
              <p className="text-sm font-medium mb-2">Иконка</p>
              <div className="flex gap-2 flex-wrap">
                {EMOJIS.map((e) => (
                  <button
                    key={e}
                    onClick={() => setForm({ ...form, emoji: e })}
                    className={`w-10 h-10 rounded-lg text-xl flex items-center justify-center transition-all ${
                      form.emoji === e ? "bg-primary/15 ring-2 ring-primary" : "bg-secondary hover:bg-secondary/80"
                    }`}
                  >
                    {e}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p className="text-sm font-medium mb-1">Название</p>
              <Input
                placeholder="Монстера, Фикус..."
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </div>

            <div>
              <p className="text-sm font-medium mb-1">Вид (латынь)</p>
              <Input
                placeholder="Monstera deliciosa"
                value={form.species}
                onChange={(e) => setForm({ ...form, species: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <p className="text-sm font-medium mb-1">Полив (дни)</p>
                <Input
                  type="number"
                  min={1}
                  max={60}
                  value={form.water_frequency_days}
                  onChange={(e) => setForm({ ...form, water_frequency_days: Number(e.target.value) })}
                />
              </div>
              <div>
                <p className="text-sm font-medium mb-1">Влажность %</p>
                <Input
                  type="number"
                  min={0}
                  max={100}
                  value={form.humidity}
                  onChange={(e) => setForm({ ...form, humidity: Number(e.target.value) })}
                />
              </div>
            </div>

            <div>
              <p className="text-sm font-medium mb-1">Освещение</p>
              <div className="flex gap-2 flex-wrap">
                {["Прямой свет", "Рассеянный свет", "Яркий свет", "Полутень", "Тень"].map((l) => (
                  <button
                    key={l}
                    onClick={() => setForm({ ...form, light: l })}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                      form.light === l ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                    }`}
                  >
                    {l}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p className="text-sm font-medium mb-1">Заметки</p>
              <Textarea
                placeholder="Особенности ухода, наблюдения..."
                value={form.notes}
                onChange={(e) => setForm({ ...form, notes: e.target.value })}
                rows={3}
              />
            </div>

            <Button
              onClick={handleSubmit}
              disabled={!form.name.trim() || saving}
              className="w-full bg-primary text-primary-foreground"
            >
              {saving ? (
                <Icon name="Loader2" size={16} className="animate-spin mr-2" />
              ) : (
                <Icon name="Check" size={16} className="mr-2" />
              )}
              Добавить растение
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
          <Icon name="Leaf" size={20} className="text-primary" />
          Мои растения
        </h2>
        <Button size="sm" className="bg-primary hover:bg-primary/90 text-primary-foreground" onClick={() => setShowForm(true)}>
          <Icon name="Plus" size={16} className="mr-1" />
          Добавить
        </Button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Icon name="Loader2" size={24} className="animate-spin text-primary" />
        </div>
      ) : selectedPlant ? (
        <Card className="border-0 shadow-md bg-white/80 backdrop-blur animate-scale-in">
          <CardContent className="pt-6">
            <button
              onClick={() => setSelectedPlant(null)}
              className="flex items-center gap-1 text-sm text-muted-foreground mb-4 hover:text-foreground transition-colors"
            >
              <Icon name="ArrowLeft" size={16} />
              Назад к списку
            </button>
            <div className="text-center mb-4">
              <span className="text-5xl">{selectedPlant.emoji}</span>
              <h3 className="text-xl font-semibold mt-2">{selectedPlant.name}</h3>
              <p className="text-sm text-muted-foreground italic">{selectedPlant.species}</p>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="bg-blue-50 rounded-lg p-3 text-center">
                <Icon name="Droplets" size={18} className="text-blue-600 mx-auto mb-1" />
                <p className="text-xs text-muted-foreground">Полив</p>
                <p className="text-sm font-medium">{formatWaterFrequency(selectedPlant.water_frequency_days)}</p>
              </div>
              <div className="bg-amber-50 rounded-lg p-3 text-center">
                <Icon name="Sun" size={18} className="text-amber-600 mx-auto mb-1" />
                <p className="text-xs text-muted-foreground">Освещение</p>
                <p className="text-sm font-medium">{selectedPlant.light}</p>
              </div>
              <div className="bg-cyan-50 rounded-lg p-3 text-center">
                <Icon name="CloudRain" size={18} className="text-cyan-600 mx-auto mb-1" />
                <p className="text-xs text-muted-foreground">Влажность</p>
                <p className="text-sm font-medium">{selectedPlant.humidity}%</p>
              </div>
              <div className="bg-green-50 rounded-lg p-3 text-center">
                <Icon name="Heart" size={18} className="text-green-600 mx-auto mb-1" />
                <p className="text-xs text-muted-foreground">Здоровье</p>
                <p className="text-sm font-medium">{selectedPlant.health}%</p>
              </div>
            </div>

            <div className="mb-3">
              <div className="flex justify-between text-sm mb-1">
                <span className="text-muted-foreground">Состояние</span>
                <span className="font-medium">{selectedPlant.health}%</span>
              </div>
              <Progress value={selectedPlant.health} className="h-2" />
            </div>

            <div className="bg-secondary/50 rounded-lg p-3 mb-3">
              <p className="text-sm flex items-start gap-2">
                <Icon name="NotebookPen" size={16} className="text-primary mt-0.5 shrink-0" />
                {selectedPlant.notes}
              </p>
            </div>

            <div className="flex gap-2 text-sm text-muted-foreground">
              <span>💧 Полив: {formatDate(selectedPlant.last_watered)}</span>
              <span>→</span>
              <span className="font-medium text-foreground">Следующий: {formatDate(selectedPlant.next_water)}</span>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-2">
          {plants.map((plant) => (
            <Card
              key={plant.id}
              className="border-0 shadow-sm bg-white/80 backdrop-blur cursor-pointer hover:shadow-md transition-all hover:-translate-y-0.5"
              onClick={() => setSelectedPlant(plant)}
            >
              <CardContent className="p-4 flex items-center gap-3">
                <span className="text-3xl">{plant.emoji}</span>
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium">{plant.name}</h3>
                  <p className="text-xs text-muted-foreground truncate">{plant.species}</p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <Badge variant="secondary" className="text-xs bg-blue-50 text-blue-700">
                    💧 {formatDate(plant.next_water)}
                  </Badge>
                  <div className="w-8 h-8 rounded-full bg-green-50 flex items-center justify-center">
                    <span className="text-xs font-semibold text-green-700">{plant.health}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default PlantCatalog;
