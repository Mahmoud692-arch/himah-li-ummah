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

export default function AdminCommentsPage() {
  const navigate = useNavigate();
  const [comments, setComments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"pending" | "approved" | "all">("pending");

  useEffect(() => {
    const loadComments = async () => {
      try {
        setLoading(true);
        let query = supabase
          .from("comments")
          .select(
            `
            *,
            users(id, full_name, email),
            content(id, title, slug)
          `
          )
          .order("created_at", { ascending: false });

        if (filter !== "all") {
          query = query.eq("is_approved", filter === "approved");
        }

        const { data, error } = await query;
        if (error) throw error;
        setComments(data || []);
      } catch (error) {
        console.error("Error loading comments:", error);
        toast.error("خطأ في تحميل التعليقات");
      } finally {
        setLoading(false);
      }
    };

    loadComments();
  }, [filter]);

  const handleApproveComment = async (id: string) => {
    try {
      const { error } = await supabase
        .from("comments")
        .update({ is_approved: true })
        .eq("id", id);
      if (error) throw error;
      setComments(comments.map(c => c.id === id ? { ...c, is_approved: true } : c));
      toast.success("تم الموافقة على التعليق");
    } catch (error) {
      toast.error("خطأ في الموافقة");
    }
  };

  const handleDeleteComment = async (id: string) => {
    if (!window.confirm("هل أنت متأكد من حذف هذا التعليق؟")) return;

    try {
      const { error } = await supabase.from("comments").delete().eq("id", id);
      if (error) throw error;
      setComments(comments.filter(c => c.id !== id));
      toast.success("تم حذف التعليق");
    } catch (error) {
      toast.error("خطأ في الحذف");
    }
  };

  return (
    <Page rtl>
      <Container className="py-12">
        <div className="space-y-8">
          {/* Header */}
          <div className="space-y-2">
            <h1 className="text-4xl font-bold text-islamic-700">💬 إدارة التعليقات</h1>
            <p className="text-muted-foreground">مراجعة وموافقة التعليقات</p>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-2">
            {(["pending", "approved", "all"] as const).map((status) => (
              <Badge
                key={status}
                variant={filter === status ? "default" : "outline"}
                className="cursor-pointer"
                onClick={() => setFilter(status)}
              >
                {status === "pending" ? "معلقة" : status === "approved" ? "موافق عليها" : "الكل"}
              </Badge>
            ))}
          </div>

          {/* Comments List */}
          {loading ? (
            <div className="text-center py-12">جاري التحميل...</div>
          ) : comments.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              لا توجد تعليقات
            </div>
          ) : (
            <div className="space-y-4">
              {comments.map((comment: any) => (
                <Card key={comment.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="pt-6">
                    <div className="space-y-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <p className="font-semibold">{comment.users.full_name}</p>
                            <Badge variant={comment.is_approved ? "default" : "outline"}>
                              {comment.is_approved ? "✅ موافق" : "⏳ معلق"}
                            </Badge>
                          </div>
                          <a
                            href={`/content/${comment.content.slug}`}
                            className="text-sm text-primary hover:underline mb-2 block"
                          >
                            على: {comment.content.title}
                          </a>
                          <p className="text-sm text-foreground">{comment.text}</p>
                          <p className="text-xs text-muted-foreground mt-2">
                            {new Date(comment.created_at).toLocaleDateString("ar-EG")}
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-2 justify-end">
                        {!comment.is_approved && (
                          <Button
                            size="sm"
                            onClick={() => handleApproveComment(comment.id)}
                          >
                            ✅ الموافقة
                          </Button>
                        )}
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleDeleteComment(comment.id)}
                        >
                          🗑️ حذف
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
