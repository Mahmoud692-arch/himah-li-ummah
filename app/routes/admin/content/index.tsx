"use client";

import { useEffect, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import Container from "@/components/layout/Container";
import Page from "@/components/layout/Page";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import { supabase } from "@/lib/supabase/client";
import toast from "react-hot-toast";

export default function AdminContentPage() {
  const navigate = useNavigate();
  const [content, setContent] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "draft" | "published" | "archived">("all");

  useEffect(() => {
    const loadContent = async () => {
      try {
        setLoading(true);
        let query = supabase
          .from("content")
          .select("*")
          .order("created_at", { ascending: false });

        if (filter !== "all") {
          query = query.eq("status", filter);
        }

        const { data, error } = await query;
        if (error) throw error;
        setContent(data || []);
      } catch (error) {
        console.error("Error loading content:", error);
        toast.error("خطأ في تحميل المحتوى");
      } finally {
        setLoading(false);
      }
    };

    loadContent();
  }, [filter]);

  const handleCreateContent = () => {
    navigate({ to: "/admin/content/new" });
  };

  const handleDeleteContent = async (id: string) => {
    if (!window.confirm("هل أنت متأكد من حذف هذا المحتوى؟")) return;

    try {
      const { error } = await supabase.from("content").delete().eq("id", id);
      if (error) throw error;
      setContent(content.filter(c => c.id !== id));
      toast.success("تم حذف المحتوى بنجاح");
    } catch (error) {
      toast.error("خطأ في حذف المحتوى");
    }
  };

  const statusColors = {
    draft: "outline",
    published: "default",
    archived: "secondary",
  } as any;

  const statusLabels = {
    draft: "مسودة",
    published: "منشور",
    archived: "مؤرشف",
  } as any;

  return (
    <Page rtl>
      <Container className="py-12">
        <div className="space-y-8">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <h1 className="text-4xl font-bold text-islamic-700">📝 إدارة المحتوى</h1>
              <p className="text-muted-foreground">إنشاء وتعديل المحتوى الإسلامي</p>
            </div>
            <Button size="lg" onClick={handleCreateContent}>
              ➕ محتوى جديد
            </Button>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-2">
            {(["all", "draft", "published", "archived"] as const).map((status) => (
              <Badge
                key={status}
                variant={filter === status ? "default" : "outline"}
                className="cursor-pointer"
                onClick={() => setFilter(status)}
              >
                {status === "all" ? "الكل" : statusLabels[status]}
              </Badge>
            ))}
          </div>

          {/* Content List */}
          {loading ? (
            <div className="text-center py-12">جاري التحميل...</div>
          ) : content.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              لا يوجد محتوى
            </div>
          ) : (
            <div className="space-y-4">
              {content.map((item: any) => (
                <Card key={item.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="text-lg font-semibold">{item.title}</h3>
                          <Badge variant={statusColors[item.status]}>
                            {statusLabels[item.status]}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {item.description}
                        </p>
                        <div className="flex gap-4 mt-4 text-xs text-muted-foreground">
                          <span>📅 {new Date(item.created_at).toLocaleDateString("ar-EG")}</span>
                          <span>👁️ {item.view_count} مشاهدة</span>
                          <span>⏱️ {item.reading_time_minutes} دقائق</span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => navigate({ to: `/admin/content/${item.id}` })}
                        >
                          تعديل
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleDeleteContent(item.id)}
                        >
                          حذف
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </Container>
    </Page>
  );
}
