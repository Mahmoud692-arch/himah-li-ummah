import { supabase } from "@/lib/supabase/client";
import type { ContentWithMetadata, Content } from "@/types";

export const contentService = {
  // Get published content with metadata
  async getPublishedContent(
    type?: string,
    page: number = 1,
    limit: number = 10
  ) {
    let query = supabase
      .from("content")
      .select(
        `
        *,
        author_id,
        content_categories(
          category_id,
          categories(id, name, name_ar, slug)
        ),
        content_tags(
          tag_id,
          tags(id, name, slug, color)
        )
      `
      )
      .eq("status", "published")
      .order("published_at", { ascending: false })
      .range((page - 1) * limit, page * limit - 1);

    if (type) {
      query = query.eq("type", type);
    }

    return query;
  },

  // Get single content by slug
  async getContentBySlug(slug: string) {
    const { data, error } = await supabase
      .from("content")
      .select(
        `
        *,
        author_id,
        content_categories(
          category_id,
          categories(id, name, name_ar, slug)
        ),
        content_tags(
          tag_id,
          tags(id, name, slug, color)
        )
      `
      )
      .eq("slug", slug)
      .single();

    if (error) throw error;
    return data;
  },

  // Create new content (admin/editor only)
  async createContent(content: Partial<Content>) {
    const { data, error } = await supabase.from("content").insert([content]);
    if (error) throw error;
    return data;
  },

  // Update content
  async updateContent(id: string, updates: Partial<Content>) {
    const { data, error } = await supabase
      .from("content")
      .update(updates)
      .eq("id", id);
    if (error) throw error;
    return data;
  },

  // Search content
  async searchContent(query: string, limit: number = 20) {
    const { data, error } = await supabase.rpc("search_content", {
      query,
      limit,
    });
    if (error) throw error;
    return data;
  },

  // Increment view count
  async incrementViewCount(contentId: string) {
    const { error } = await supabase.rpc("increment_view_count", {
      content_id: contentId,
    });
    if (error) console.error("Error incrementing view count:", error);
  },
};
