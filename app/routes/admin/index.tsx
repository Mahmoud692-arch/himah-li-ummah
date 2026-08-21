"use client";

import { useEffect, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import Container from "@/components/layout/Container";
import Page from "@/components/layout/Page";
import Button from "@/components/ui/Button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import { authService } from "@/lib/supabase/auth";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalContent: 0,
    pendingComments: 0,
    pendingSuggestions: 0,
  });

  useEffect(() => {
    const loadAdmin = async () => {
      try {
        setLoading(true);
        const currentUser = await authService.getUser();
        if (!currentUser) {
          navigate({ to: "/auth/login" });
          return;
        }
        // TODO: Check if user is admin/moderator
        setUser(currentUser);
      } catch (error) {
        console.error("Error loading admin:", error);
        navigate({ to: "/" });
      } finally {
        setLoading(false);
      }
    };

    loadAdmin();
  }, [navigate]);

  if (loading) {
    return (
      <Page rtl>
        <Container className="py-12">
          <div className="text-center">جاري التحميل...</div>
        </Container>
      </Page>
    );
  }

  return (
    <Page rtl>
      <Container className="py-12">
        <div className="space-y-8">
          {/* Header */}
          <div className="space-y-2">
            <h1 className="text-4xl font-bold text-islamic-700">⚙️ لوحة تحكم الإدارة</h1>
            <p className="text-muted-foreground">إدارة المحتوى والمستخدمين والمجتمع</p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardContent className="pt-6 text-center">
                <div className="text-3xl font-bold text-islamic-700">{stats.totalUsers}</div>
                <p className="text-sm text-muted-foreground mt-1">المستخدمين</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6 text-center">
                <div className="text-3xl font-bold text-islamic-700">{stats.totalContent}</div>
                <p className="text-sm text-muted-foreground mt-1">المحتوى</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6 text-center">
                <div className="text-3xl font-bold text-islamic-700">{stats.pendingComments}</div>
                <p className="text-sm text-muted-foreground mt-1">تعليقات معلقة</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6 text-center">
                <div className="text-3xl font-bold text-islamic-700">{stats.pendingSuggestions}</div>
                <p className="text-sm text-muted-foreground mt-1">اقتراحات معلقة</p>
              </CardContent>
            </Card>
          </div>

          {/* Admin Sections */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => navigate({ to: "/admin/content" })}>
              <CardHeader>
                <CardTitle>📝 إدارة المحتوى</CardTitle>
                <CardDescription>
                  إنشاء وتعديل ونشر المحتوى الإسلامي
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="w-full">الذهاب</Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => navigate({ to: "/admin/users" })}>
              <CardHeader>
                <CardTitle>👥 إدارة المستخدمين</CardTitle>
                <CardDescription>
                  مراقبة وإدارة المستخدمين والأدوار
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="w-full">الذهاب</Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => navigate({ to: "/admin/comments" })}>
              <CardHeader>
                <CardTitle>💬 التعليقات</CardTitle>
                <CardDescription>
                  مراجعة وموافقة التعليقات
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="w-full">الذهاب</Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => navigate({ to: "/admin/suggestions" })}>
              <CardHeader>
                <CardTitle>💡 الاقتراحات</CardTitle>
                <CardDescription>
                  مراجعة الاقتراحات والآراء
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="w-full">الذهاب</Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => navigate({ to: "/admin/anonymous" })}>
              <CardHeader>
                <CardTitle>🔐 الرسائل المجهولة</CardTitle>
                <CardDescription>
                  مراجعة رسائل صراحني
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="w-full">الذهاب</Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => navigate({ to: "/admin/settings" })}>
              <CardHeader>
                <CardTitle>⚙️ الإعدادات</CardTitle>
                <CardDescription>
                  إعدادات الموقع والمنصة
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="w-full">الذهاب</Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </Container>
    </Page>
  );
}
