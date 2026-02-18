import { useState, useEffect } from "react";
import Icon from "@/components/ui/icon";
import PlantCalendar from "@/components/PlantCalendar";
import PlantCatalog from "@/components/PlantCatalog";
import Reminders from "@/components/Reminders";
import PlantJournal from "@/components/PlantJournal";
import PhotoGallery from "@/components/PhotoGallery";
import Community from "@/components/Community";
import { plantsApi, remindersApi } from "@/lib/api";

type Tab = "calendar" | "plants" | "reminders" | "journal" | "gallery" | "community";

const TABS: { id: Tab; label: string; icon: string }[] = [
  { id: "calendar", label: "Календарь", icon: "CalendarDays" },
  { id: "plants", label: "Растения", icon: "Leaf" },
  { id: "reminders", label: "Напоминания", icon: "Bell" },
  { id: "journal", label: "Дневник", icon: "BookOpen" },
  { id: "gallery", label: "Галерея", icon: "Camera" },
  { id: "community", label: "Сообщество", icon: "Users" },
];

const HERO_IMAGE = "https://cdn.poehali.dev/projects/b8bfb12b-7328-4f2c-9ee7-63c7f56b01ce/files/1921f3da-547b-4819-9de5-d1311a79e7be.jpg";

const Index = () => {
  const [activeTab, setActiveTab] = useState<Tab>("calendar");
  const [plantsCount, setPlantsCount] = useState(0);
  const [todayRemindersCount, setTodayRemindersCount] = useState(0);

  useEffect(() => {
    plantsApi.getAll().then((data) => setPlantsCount(data.length)).catch(() => {});
    remindersApi.getAll().then((data) => {
      setTodayRemindersCount(data.filter((r) => r.urgent).length);
    }).catch(() => {});
  }, []);

  const renderContent = () => {
    switch (activeTab) {
      case "calendar": return <PlantCalendar />;
      case "plants": return <PlantCatalog />;
      case "reminders": return <Reminders />;
      case "journal": return <PlantJournal />;
      case "gallery": return <PhotoGallery />;
      case "community": return <Community />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50/80 via-background to-emerald-50/30">
      <header className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={HERO_IMAGE}
            alt="Растения"
            className="w-full h-full object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-green-900/30 to-background" />
        </div>

        <div className="relative max-w-lg mx-auto px-4 pt-8 pb-6">
          <div className="flex items-center justify-between mb-1">
            <div>
              <h1 className="text-2xl font-bold text-foreground">
                🌿 MyPlants
              </h1>
              <p className="text-sm text-muted-foreground font-handwriting text-lg">
                Ежедневник растениевода
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button className="w-9 h-9 rounded-full bg-white/80 backdrop-blur flex items-center justify-center shadow-sm hover:bg-white transition-colors">
                <Icon name="Search" size={18} className="text-foreground" />
              </button>
              <button className="w-9 h-9 rounded-full bg-white/80 backdrop-blur flex items-center justify-center shadow-sm hover:bg-white transition-colors relative">
                <Icon name="Bell" size={18} className="text-foreground" />
                <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white" />
              </button>
            </div>
          </div>

          <div className="mt-4 bg-white/60 backdrop-blur-md rounded-2xl p-3 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <Icon name="Sprout" size={22} className="text-primary" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">{plantsCount} растений под присмотром</p>
                <p className="text-xs text-muted-foreground">{todayRemindersCount} задачи на сегодня</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-muted-foreground">18 фев 2026</p>
                <p className="text-xs font-medium text-primary">Среда</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <nav className="sticky top-0 z-10 bg-background/80 backdrop-blur-md border-b">
        <div className="max-w-lg mx-auto px-4">
          <div className="flex overflow-x-auto gap-1 py-2 scrollbar-hide -mx-4 px-4">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all shrink-0 ${
                  activeTab === tab.id
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:bg-secondary"
                }`}
              >
                <Icon name={tab.icon} fallback="Circle" size={15} />
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </nav>

      <main className="max-w-lg mx-auto px-4 py-6">
        {renderContent()}
      </main>

      <footer className="max-w-lg mx-auto px-4 pb-8 pt-4">
        <div className="text-center">
          <p className="text-xs text-muted-foreground">
            🌱 MyPlants — заботьтесь о растениях с любовью
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;