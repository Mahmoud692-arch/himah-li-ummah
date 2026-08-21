"use client";

import { useEffect, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import Container from "@/components/layout/Container";
import Page from "@/components/layout/Page";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Avatar from "@/components/ui/Avatar";
import { authService } from "@/lib/supabase/auth";
import { userService } from "@/lib/supabase/user";
import { gamificationService } from "@/lib/supabase/gamification";
import toast from "react-hot-toast";

export default function ProfilePage() {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [badges, setBadges] = useState<any[]>([]);
  const [favorites, setFavorites] = useState<any[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [fullName, setFullName] = useState("");
  const [bio, setBio] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        setLoading(true);
        const currentUser = await authService.getUser();
        if (!currentUser) {
          navigate({ to: "/auth/login" });
          return;
        }

        const profile = await userService.getUserProfile(currentUser.id);
        setUser(profile);
        setFullName(profile.full_name || "");
        setBio(profile.bio || "");

        const userBadges = await gamificationService.getUserBadges(currentUser.id);
        setBadges(userBadges || []);

        const userFavorites = await userService.getUserFavorites(currentUser.id);
        setFavorites(userFavorites.data || []);
      } catch (error) {
        console.error("Error loading profile:", error);
        toast.error("خطأ في تحميل الملف الشخصي");
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [navigate]);

  const handleSaveProfile = async () => {
    if (!user) return;

    try {
      setSaving(true);
      await userService.updateUserProfile(user.id, {
        full_name: fullName,
        bio: bio,
      });
      setUser({ ...user, full_name: fullName, bio: bio });
      setIsEditing(false);
      toast.success("تم حفظ البيانات بنجاح");
    } catch (error) {
      toast.error("خطأ في حفظ البيانات");
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    try {
      await authService.signOut();
      navigate({ to: "/auth/login" });
      toast.success("تم تسجيل الخروج");
    } catch (error) {
      toast.error("خطأ في تسجيل الخروج");
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

  if (!user) {
    return null;
  }

  return (
    <Page rtl>
      <Container className="py-12">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Profile Header */}
          <Card className="bg-gradient-to-r from-islamic-50 to-islamic-100">
            <CardContent className="pt-6">
              <div className="space-y-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-6">
                    <Avatar
                      src={user.avatar_url || ""}
                      alt={user.full_name}
                      size="lg"
                    />
                    <div>
                      <h1 className="text-3xl font-bold">{user.full_name}</h1>
                      <p className="text-muted-foreground">{user.email}</p>
                      {user.bio && (
                        <p className="text-sm text-foreground mt-2">{user.bio}</p>
                      )}
                    </div>
                  </div>
                  {!isEditing && (
                    <Button onClick={() => setIsEditing(true)}>تعديل</Button>
                  )}
                </div>

                {isEditing && (
                  <div className="space-y-4 pt-4 border-t border-border">
                    <Input
                      label="الاسم الكامل"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                    />
                    <textarea
                      placeholder="نبذة عنك"
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      className="w-full h-20 p-3 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
                    />
                    <div className="flex gap-2">
                      <Button
                        onClick={handleSaveProfile}
                        isLoading={saving}
                        className="flex-1"
                      >
                        حفظ
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => setIsEditing(false)}
                        className="flex-1"
                      >
                        إلغاء
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="pt-6 text-center">
                <div className="text-3xl font-bold text-islamic-700">
                  {user.user_points?.[0]?.points || 0}
                </div>
                <p className="text-sm text-muted-foreground mt-1">النقاط</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6 text-center">
                <div className="text-3xl font-bold text-islamic-700">
                  {user.user_points?.[0]?.level || 1}
                </div>
                <p className="text-sm text-muted-foreground mt-1">المستوى</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6 text-center">
                <div className="text-3xl font-bold text-islamic-700">
                  {badges.length}
                </div>
                <p className="text-sm text-muted-foreground mt-1">الشارات</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6 text-center">
                <div className="text-3xl font-bold text-islamic-700">
                  {favorites.length}
                </div>
                <p className="text-sm text-muted-foreground mt-1">المفضلة</p>
              </CardContent>
            </Card>
          </div>

          {/* Badges */}
          {badges.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-2xl font-bold">⭐ شارتك</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {badges.map((badge: any) => (
                  <Card key={badge.id} className="text-center hover:shadow-md transition-shadow">
                    <CardContent className="pt-6">
                      <div className="text-4xl mb-2">{badge.badges.icon_url}</div>
                      <h3 className="font-semibold text-sm">{badge.badges.name_ar}</h3>
                      <p className="text-xs text-muted-foreground mt-1">
                        {new Date(badge.earned_at).toLocaleDateString("ar-EG")}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Favorites */}
          {favorites.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-2xl font-bold">❤️ المفضلة ({favorites.length})</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {favorites.map((fav: any) => (
                  <Card
                    key={fav.id}
                    className="cursor-pointer hover:shadow-md transition-shadow"
                    onClick={() => navigate({ to: `/content/${fav.content.slug}` })}
                  >
                    <CardHeader>
                      <CardTitle className="line-clamp-2">{fav.content.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {fav.content.description}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Logout */}
          <div className="pt-8 border-t border-border">
            <Button
              variant="destructive"
              onClick={handleLogout}
              className="w-full"
            >
              تسجيل الخروج
            </Button>
          </div>
        </div>
      </Container>
    </Page>
  );
}
