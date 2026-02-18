import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import Icon from "@/components/ui/icon";
import { communityApi, type CommunityPost } from "@/lib/api";

const AVATAR_PALETTES = [
  "bg-pink-200 text-pink-800",
  "bg-green-200 text-green-800",
  "bg-purple-200 text-purple-800",
  "bg-blue-200 text-blue-800",
  "bg-amber-200 text-amber-800",
  "bg-cyan-200 text-cyan-800",
  "bg-rose-200 text-rose-800",
  "bg-teal-200 text-teal-800",
];

function getAvatarColor(name: string): string {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return AVATAR_PALETTES[Math.abs(hash) % AVATAR_PALETTES.length];
}

const Community = () => {
  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    communityApi.getAll().then((data) => {
      setPosts(data);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const handleLike = (postId: number) => {
    setPosts((prev) =>
      prev.map((p) => (p.id === postId ? { ...p, likes: p.likes + 1 } : p))
    );
    communityApi.like(postId);
  };

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

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Icon name="Loader2" size={24} className="animate-spin text-primary" />
        </div>
      ) : (
        <div className="space-y-3">
          {posts.map((post) => {
            const avatarColor = getAvatarColor(post.author_name);
            return (
              <Card key={post.id} className="border-0 shadow-sm bg-white/80 backdrop-blur">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <Avatar className="h-9 w-9">
                      <AvatarFallback className={avatarColor + " text-xs font-medium"}>
                        {post.initials}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium">{post.author_name}</p>
                      <p className="text-xs text-muted-foreground">{post.time_ago}</p>
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
                    <button
                      className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-red-500 transition-colors"
                      onClick={() => handleLike(post.id)}
                    >
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
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Community;