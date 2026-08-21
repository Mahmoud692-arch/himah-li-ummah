"use client";

import { useEffect, useState } from "react";
import Container from "@/components/layout/Container";
import Page from "@/components/layout/Page";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Avatar from "@/components/ui/Avatar";
import { gamificationService } from "@/lib/supabase/gamification";

export default function LeaderboardPage() {
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [timeframe, setTimeframe] = useState<"all" | "month" | "week">("all");

  useEffect(() => {
    const loadLeaderboard = async () => {
      try {
        setLoading(true);
        const data = await gamificationService.getLeaderboard(100);
        setLeaderboard(data || []);
      } catch (error) {
        console.error("Error loading leaderboard:", error);
      } finally {
        setLoading(false);
      }
    };

    loadLeaderboard();
  }, []);

  return (
    <Page rtl>
      <Container className="py-12">
        <div className="space-y-8">
          {/* Header */}
          <div className="space-y-4">
            <h1 className="text-4xl font-bold text-islamic-700">🏆 لوحة المتصدرين</h1>
            <p className="text-lg text-muted-foreground">
              أفضل الأعضاء النشطين في منصة همة لأمة
            </p>
          </div>

          {/* Timeframe Filter */}
          <div className="flex gap-2">
            {[
              { value: "week" as const, label: "هذا الأسبوع" },
              { value: "month" as const, label: "هذا الشهر" },
              { value: "all" as const, label: "كل الوقت" },
            ].map((option) => (
              <Badge
                key={option.value}
                variant={timeframe === option.value ? "default" : "outline"}
                className="cursor-pointer"
                onClick={() => setTimeframe(option.value)}
              >
                {option.label}
              </Badge>
            ))}
          </div>

          {/* Leaderboard */}
          {loading ? (
            <div className="text-center py-12">جاري التحميل...</div>
          ) : (
            <div className="space-y-4">
              {leaderboard.map((user: any, index: number) => {
                const rankMedal = {
                  0: "🥇",
                  1: "🥈",
                  2: "🥉",
                }[index] || `#${index + 1}`;

                return (
                  <Card key={user.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="pt-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="text-2xl font-bold w-12 text-center">
                            {rankMedal}
                          </div>
                          <Avatar
                            src={user.users?.avatar_url || ""}
                            alt={user.users?.full_name || "User"}
                            size="lg"
                          />
                          <div>
                            <h3 className="font-semibold text-lg">
                              {user.users?.full_name}
                            </h3>
                            <p className="text-sm text-muted-foreground">
                              المستوى {user.level}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-3xl font-bold text-islamic-700">
                            {user.points}
                          </div>
                          <p className="text-sm text-muted-foreground">نقطة</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </Container>
    </Page>
  );
}
