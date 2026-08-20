import { supabase } from "@/lib/supabase/client";

export const userService = {
  // Get user profile
  async getUserProfile(userId: string) {
    const { data, error } = await supabase
      .from("users")
      .select(
        `
        *,
        user_points(*),
        user_badges(
          *,
          badges(*)
        )
      `
      )
      .eq("id", userId)
      .single();

    if (error) throw error;
    return data;
  },

  // Update user profile
  async updateUserProfile(
    userId: string,
    updates: {
      full_name?: string;
      bio?: string;
      avatar_url?: string;
    }
  ) {
    const { error } = await supabase
      .from("users")
      .update(updates)
      .eq("id", userId);

    if (error) throw error;
  },

  // Get user favorites
  async getUserFavorites(userId: string) {
    const { data, error } = await supabase
      .from("favorites")
      .select(
        `
        *,
        content(*)
      `
      )
      .eq("user_id", userId);

    if (error) throw error;
    return data;
  },

  // Add to favorites
  async addToFavorites(userId: string, contentId: string) {
    const { error } = await supabase.from("favorites").insert([
      {
        user_id: userId,
        content_id: contentId,
      },
    ]);

    if (error) throw error;
  },

  // Remove from favorites
  async removeFromFavorites(userId: string, contentId: string) {
    const { error } = await supabase
      .from("favorites")
      .delete()
      .eq("user_id", userId)
      .eq("content_id", contentId);

    if (error) throw error;
  },

  // Track reading progress
  async updateReadingProgress(
    userId: string,
    contentId: string,
    progressPercentage: number
  ) {
    const { error } = await supabase
      .from("reading_progress")
      .upsert([
        {
          user_id: userId,
          content_id: contentId,
          progress_percentage: progressPercentage,
          completed: progressPercentage >= 100,
          last_read_at: new Date().toISOString(),
        },
      ])
      .eq("user_id", userId)
      .eq("content_id", contentId);

    if (error) throw error;
  },
};
