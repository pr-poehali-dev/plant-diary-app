import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import Icon from "@/components/ui/icon";

interface Post {
  id: number;
  author: string;
  initials: string;
  avatarColor: string;
  time: string;
  text: string;
  tags: string[];
  likes: number;
  comments: number;
  image?: string;
}

const POSTS: Post[] = [
  {
    id: 1, author: "Елена Садовникова", initials: "ЕС", avatarColor: "bg-pink-200 text-pink-800",
    time: "2 часа назад",
    text: "Мой эхинопсис наконец зацвёл! Ждала этого момента 3 года. Цветок огромный, белый с розовым оттенком. Раскрылся ночью и пахнет невероятно!",
    tags: ["Цветение", "Кактусы"],
    likes: 24, comments: 8
  },
  {
    id: 2, author: "Алексей Зеленин", initials: "АЗ", avatarColor: "bg-green-200 text-green-800",
    time: "5 часов назад",
    text: "Совет: если у фикуса опадают листья зимой — попробуйте досветку фитолампой на 3-4 часа вечером. Мне помогло, за месяц ни одного опавшего листа!",
    tags: ["Советы", "Фикус"],
    likes: 42, comments: 15
  },
  {
    id: 3, author: "Марина Флорист", initials: "МФ", avatarColor: "bg-purple-200 text-purple-800",
    time: "Вчера",
    text: "Делюсь рецептом натуральной подкормки: банановая кожура + яичная скорлупа, залить водой на 3 дня. Растения просто оживают после неё!",
    tags: ["Подкормка", "Лайфхак"],
    likes: 67, comments: 23
  },
];

const Community = () => {
  return (
    <div className="animate-fade-in">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <Icon name="Users" size={20} className="text-primary" />
          Сообщество
        </h2>
        <Button size="sm" variant="outline">
          <Icon name="PenLine" size={14} className="mr-1" />
          Написать
        </Button>
      </div>

      <div className="space-y-3">
        {POSTS.map((post) => (
          <Card key={post.id} className="border-0 shadow-sm bg-white/80 backdrop-blur">
            <CardContent className="p-4">
              <div className="flex items-center gap-3 mb-3">
                <Avatar className="h-9 w-9">
                  <AvatarFallback className={post.avatarColor + " text-xs font-medium"}>
                    {post.initials}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium">{post.author}</p>
                  <p className="text-xs text-muted-foreground">{post.time}</p>
                </div>
              </div>

              <p className="text-sm leading-relaxed mb-3">{post.text}</p>

              <div className="flex items-center gap-2 mb-3">
                {post.tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="text-xs bg-secondary">
                    {tag}
                  </Badge>
                ))}
              </div>

              <div className="flex items-center gap-4 pt-2 border-t">
                <button className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-red-500 transition-colors">
                  <Icon name="Heart" size={15} />
                  {post.likes}
                </button>
                <button className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors">
                  <Icon name="MessageCircle" size={15} />
                  {post.comments}
                </button>
                <button className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors ml-auto">
                  <Icon name="Share2" size={15} />
                </button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Community;
