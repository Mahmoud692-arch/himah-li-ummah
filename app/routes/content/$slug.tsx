"use client";

import { useEffect, useState } from "react";
import { useParams } from "@tanstack/react-router";
import Container from "@/components/layout/Container";
import Page from "@/components/layout/Page";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import { contentService } from "@/lib/supabase/content";
import { userService } from "@/lib/supabase/user";
import { interactionService } from "@/lib/supabase/interactions";
import { authService } from "@/lib/supabase/auth";
import toast from "react-hot-toast";

export default function ContentDetailPage() {
  const { slug } = useParams({ from: "/content/$slug" });
  const [content, setContent] = useState<any>(null);
  const [comments, setComments] = useState<any[]>([]);
  const [user, setUser] = useState<any>(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(true);
  const [submittingComment, setSubmittingComment] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        // Load content
        const contentData = await contentService.getContentBySlug(slug!);
        setContent(contentData);

        // Increment view count
        await contentService.incrementViewCount(contentData.id);

        // Load comments
        const commentsData = await interactionService.getComments(contentData.id);
        setComments(commentsData.data || []);

        // Load current user
        const currentUser = await authService.getUser();
        if (currentUser) {
          const profile = await userService.getUserProfile(currentUser.id);
          setUser(profile);

          // Check if favorited
          const favorites = await userService.getUserFavorites(currentUser.id);
          setIsFavorite(
            favorites.data?.some((fav: any) => fav.content_id === contentData.id) || false
          );
        }
      } catch (error) {
        console.error("Error loading content:", error);
        toast.error("خطأ في تحميل المحتوى");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [slug]);

  const handleAddToFavorites = async () => {
    if (!user) {
      toast.error("يجب تسجيل الدخول أولاً");
      return;
    }

    try {
      if (isFavorite) {
        await userService.removeFromFavorites(user.id, content.id);
        toast.success("تم إزالة من المفضلة");
      } else {
        await userService.addToFavorites(user.id, content.id);
        toast.success("تمت الإضافة للمفضلة");
      }
      setIsFavorite(!isFavorite);
    } catch (error) {
      toast.error("حدث خطأ");
    }
  };

  const handleAddComment = async () => {
    if (!user) {
      toast.error("يجب تسجيل الدخول أولاً");
      return;
    }

    if (!newComment.trim()) {
      toast.error("أدخل تعليق");
      return;
    }

    try {
      setSubmittingComment(true);
      await interactionService.addComment(content.id, user.id, newComment);
      toast.success("تم إرسال التعليق للمراجعة");
      setNewComment("");

      // Reload comments
      const commentsData = await interactionService.getComments(content.id);
      setComments(commentsData.data || []);
    } catch (error) {
      toast.error("خطأ في إرسال التعليق");
    } finally {
      setSubmittingComment(false);
    }
  };

  if (loading) {
    return (
      <Page rtl>
        <Container className="py-12">
          <div className="text-center">جاري التحميل...</div>
        </Container>
      </Page>
    );
  }

  if (!content) {
    return (
      <Page rtl>
        <Container className="py-12">
          <div className="text-center text-destructive">المحتوى غير موجود</div>
        </Container>
      </Page>
    );
  }

  return (
    <Page rtl>
      <Container className="py-12">
        <div className="max-w-3xl mx-auto space-y-8">
          {/* Header */}
          <div className="space-y-4">
            <div className="flex flex-wrap gap-2">
              {content.content_categories?.map((cat: any) => (
                <Badge key={cat.category_id} variant="secondary">
                  {cat.categories.name_ar}
                </Badge>
              ))}
            </div>
            <h1 className="text-4xl font-bold text-islamic-700">{content.title}</h1>
            <p className="text-lg text-muted-foreground">{content.description}</p>
            <div className="flex items-center justify-between pt-4 border-t border-border">
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span>👁️ {content.view_count} مشاهدة</span>
                <span>⏱️ {content.reading_time_minutes} دقائق قراءة</span>
              </div>
              <Button
                variant={isFavorite ? "default" : "outline"}
                onClick={handleAddToFavorites}
              >
                {isFavorite ? "⭐ في المفضلة" : "☆ أضف للمفضلة"}
              </Button>
            </div>
          </div>

          {/* Cover Image */}
          {content.cover_image_url && (
            <img
              src={content.cover_image_url}
              alt={content.title}
              className="w-full h-96 object-cover rounded-lg"
            />
          )}

          {/* Content */}
          <Card>
            <CardContent className="pt-6">
              <div className="prose dark:prose-invert max-w-none">
                {content.content}
              </div>
            </CardContent>
          </Card>

          {/* Tags */}
          {content.content_tags && content.content_tags.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">الوسوم</h3>
              <div className="flex flex-wrap gap-2">
                {content.content_tags.map((tag: any) => (
                  <Badge key={tag.tag_id}>
                    #{tag.tags.name}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Comments Section */}
          <div className="space-y-6 border-t border-border pt-8">
            <div>
              <h3 className="text-2xl font-semibold mb-6">التعليقات ({comments.length})</h3>

              {user && (
                <Card className="mb-6">
                  <CardContent className="pt-6">
                    <textarea
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      placeholder="أضف تعليقك هنا..."
                      className="w-full h-24 p-3 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring mb-4"
                    />
                    <Button
                      onClick={handleAddComment}
                      isLoading={submittingComment}
                      className="w-full"
                    >
                      إرسال التعليق
                    </Button>
                  </CardContent>
                </Card>
              )}

              {!user && (
                <Card className="mb-6 bg-muted">
                  <CardContent className="pt-6">
                    <p className="text-center text-muted-foreground">
                      يجب <a href="/auth/login" className="text-primary hover:underline">تسجيل الدخول</a> لإضافة تعليق
                    </p>
                  </CardContent>
                </Card>
              )}

              <div className="space-y-4">
                {comments.length === 0 ? (
                  <p className="text-center text-muted-foreground">لا توجد تعليقات حتى الآن</p>
                ) : (
                  comments.map((comment: any) => (
                    <Card key={comment.id}>
                      <CardContent className="pt-6">
                        <div className="flex items-start gap-4">
                          <div className="flex-1">
                            <p className="font-semibold">{comment.users.full_name}</p>
                            <p className="text-sm text-muted-foreground mt-1">{comment.text}</p>
                            <p className="text-xs text-muted-foreground mt-2">
                              {new Date(comment.created_at).toLocaleDateString("ar-EG")}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </Container>
    </Page>
  );
}
