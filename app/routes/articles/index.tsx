"use client";

import { useEffect, useState } from "react";
import Container from "@/components/layout/Container";
import Page from "@/components/layout/Page";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { contentService } from "@/lib/supabase/content";
import { useNavigate } from "@tanstack/react-router";

export default function ArticlesPage() {
  const navigate = useNavigate();
  const [articles, setArticles] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState<string>("article");
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);

  const contentTypes = [
    { value: "article", label: "📰 مقالات" },
    { value: "hadith", label: "🕋 أحاديث" },
    { value: "story", label: "📖 قصص" },
    { value: "lesson", label: "🎓 دروس" },
    { value: "quiz", label: "❓ اختبارات" },
    { value: "quranic", label: "📿 قرآني" },
  ];

  useEffect(() => {
    const loadArticles = async () => {
      try {
        setLoading(true);
        const { data } = await contentService.getPublishedContent(selectedType, page, 12);
        setArticles(data || []);
      } catch (error) {
        console.error("Error loading articles:", error);
      } finally {
        setLoading(false);
      }
    };

    loadArticles();
  }, [selectedType, page]);

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    try {
      setLoading(true);
      const data = await contentService.searchContent(searchQuery);
      setArticles(data || []);
    } catch (error) {
      console.error("Error searching:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Page rtl>
      <Container className="py-12">
        <div className="space-y-8">
          {/* Header */}
          <div className="space-y-4">
            <h1 className="text-4xl font-bold text-islamic-700">📚 المحتوى</h1>
            <p className="text-lg text-muted-foreground">
              استكشف مكتبتنا الشاملة من المحتوى الإسلامي المتنوع
            </p>
          </div>

          {/* Search */}
          <div className="flex gap-2">
            <Input
              placeholder="ابحث عن محتوى..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSearch()}
              className="flex-1"
            />
            <Button onClick={handleSearch}>بحث</Button>
          </div>

          {/* Type Filter */}
          <div className="flex flex-wrap gap-2">
            {contentTypes.map((type) => (
              <Button
                key={type.value}
                variant={selectedType === type.value ? "default" : "outline"}
                onClick={() => {
                  setSelectedType(type.value);
                  setPage(1);
                }}
              >
                {type.label}
              </Button>
            ))}
          </div>

          {/* Articles Grid */}
          {loading ? (
            <div className="text-center py-12">جاري التحميل...</div>
          ) : articles.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              لا توجد مقالات حالياً
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {articles.map((article: any) => (
                <Card
                  key={article.id}
                  className="cursor-pointer hover:shadow-lg transition-shadow duration-200"
                  onClick={() => navigate({ to: `/content/${article.slug}` })}
                >
                  {article.cover_image_url && (
                    <img
                      src={article.cover_image_url}
                      alt={article.title}
                      className="w-full h-48 object-cover"
                    />
                  )}
                  <CardHeader>
                    <CardTitle className="line-clamp-2">{article.title}</CardTitle>
                    <CardDescription className="line-clamp-2">
                      {article.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex flex-wrap gap-2">
                        {article.content_tags?.slice(0, 3).map((tag: any) => (
                          <Badge key={tag.tag_id} variant="outline">
                            {tag.tags.name}
                          </Badge>
                        ))}
                      </div>
                      <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <span>👁️ {article.view_count}</span>
                        <span>⏱️ {article.reading_time_minutes} دقائق</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Pagination */}
          <div className="flex justify-center gap-2">
            <Button
              variant="outline"
              disabled={page === 1}
              onClick={() => setPage(page - 1)}
            >
              السابق
            </Button>
            <span className="flex items-center px-4">{page}</span>
            <Button
              variant="outline"
              onClick={() => setPage(page + 1)}
            >
              التالي
            </Button>
          </div>
        </div>
      </Container>
    </Page>
  );
}
