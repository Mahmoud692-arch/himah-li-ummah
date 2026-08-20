import { supabase } from "@/lib/supabase/client";

export const gamificationService = {
  // Add points to user
  async addPoints(userId: string, points: number, reason: string) {
    // Log the points change
    const { error: ledgerError } = await supabase
      .from("points_ledger")
      .insert([
        {
          user_id: userId,
          points_change: points,
          reason,
        },
      ]);

    if (ledgerError) throw ledgerError;

    // Update user points
    const { data: currentPoints } = await supabase
      .from("user_points")
      .select("points, total_points_earned")
      .eq("user_id", userId)
      .single();

    const newPoints = (currentPoints?.points || 0) + points;
    const newTotalPoints = (currentPoints?.total_points_earned || 0) + points;
    const newLevel = Math.floor(newPoints / 500) + 1;

    const { error: updateError } = await supabase
      .from("user_points")
      .update({
        points: newPoints,
        level: newLevel,
        total_points_earned: newTotalPoints,
        last_activity_at: new Date().toISOString(),
      })
      .eq("user_id", userId);

    if (updateError) throw updateError;
  },

  // Award badge to user
  async awardBadge(userId: string, badgeId: string) {
    const { error } = await supabase.from("user_badges").insert([
      {
        user_id: userId,
        badge_id: badgeId,
      },
    ]);

    if (error && error.code !== "23505") throw error; // 23505 is unique constraint violation
  },

  // Get user leaderboard position
  async getLeaderboard(limit: number = 100) {
    const { data, error } = await supabase
      .from("user_points")
      .select(
        `
        *,
        users(id, full_name, avatar_url)
      `
      )
      .order("points", { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data;
  },

  // Get user badges
  async getUserBadges(userId: string) {
    const { data, error } = await supabase
      .from("user_badges")
      .select(
        `
        *,
        badges(*)
      `
      )
      .eq("user_id", userId);

    if (error) throw error;
    return data;
  },
};
