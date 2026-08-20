import { supabase } from "@/lib/supabase/client";

export const interactionService = {
  // Add comment
  async addComment(
    contentId: string,
    userId: string,
    text: string
  ) {
    const { data, error } = await supabase.from("comments").insert([
      {
        content_id: contentId,
        user_id: userId,
        text,
        is_approved: false, // Comments require moderation by default
      },
    ]);

    if (error) throw error;
    return data;
  },

  // Get comments for content
  async getComments(contentId: string, approvedOnly: boolean = true) {
    let query = supabase
      .from("comments")
      .select(
        `
        *,
        users(id, full_name, avatar_url)
      `
      )
      .eq("content_id", contentId)
      .order("created_at", { ascending: false });

    if (approvedOnly) {
      query = query.eq("is_approved", true);
    }

    return query;
  },

  // Submit suggestion
  async submitSuggestion(
    title: string,
    text: string,
    contentId?: string,
    userId?: string
  ) {
    const { data, error } = await supabase.from("suggestions").insert([
      {
        title,
        text,
        content_id: contentId,
        user_id: userId,
      },
    ]);

    if (error) throw error;
    return data;
  },

  // Submit anonymous message (Sarrahni)
  async submitAnonymousMessage(text: string) {
    const { data, error } = await supabase
      .from("anonymous_messages")
      .insert([
        {
          text,
          verified: false,
          spam_score: 0,
        },
      ]);

    if (error) throw error;
    return data;
  },
};
