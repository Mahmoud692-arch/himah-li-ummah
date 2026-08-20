import { supabase } from "@/lib/supabase/client";

export const notificationService = {
  // Create notification
  async createNotification(
    userId: string,
    type: string,
    title: string,
    message: string,
    relatedId?: string
  ) {
    const { error } = await supabase.from("notifications").insert([
      {
        user_id: userId,
        type,
        title,
        message,
        related_id: relatedId,
      },
    ]);

    if (error) throw error;
  },

  // Get user notifications
  async getNotifications(userId: string, unreadOnly: boolean = false) {
    let query = supabase
      .from("notifications")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (unreadOnly) {
      query = query.eq("read", false);
    }

    return query;
  },

  // Mark notification as read
  async markAsRead(notificationId: string) {
    const { error } = await supabase
      .from("notifications")
      .update({ read: true })
      .eq("id", notificationId);

    if (error) throw error;
  },

  // Mark all notifications as read
  async markAllAsRead(userId: string) {
    const { error } = await supabase
      .from("notifications")
      .update({ read: true })
      .eq("user_id", userId);

    if (error) throw error;
  },

  // Delete notification
  async deleteNotification(notificationId: string) {
    const { error } = await supabase
      .from("notifications")
      .delete()
      .eq("id", notificationId);

    if (error) throw error;
  },
};
