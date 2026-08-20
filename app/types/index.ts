// User and Authentication Types
export type UserRole = "user" | "moderator" | "admin" | "editor";

export interface User {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  role: UserRole;
  bio: string | null;
  created_at: string;
  updated_at: string;
  is_active: boolean;
}

export interface UserProfile extends User {
  points: number;
  level: number;
  badges: string[];
  favorites_count: number;
  articles_read: number;
  last_login: string | null;
}

// Content Types
export type ContentType = "article" | "hadith" | "story" | "lesson" | "quiz" | "quranic";
export type PublishStatus = "draft" | "published" | "archived";

export interface Content {
  id: string;
  type: ContentType;
  title: string;
  slug: string;
  description: string;
  content: string;
  cover_image_url: string | null;
  author_id: string;
  status: PublishStatus;
  created_at: string;
  updated_at: string;
  published_at: string | null;
  view_count: number;
  reading_time_minutes: number;
}

export interface ContentWithMetadata extends Content {
  categories: Category[];
  tags: Tag[];
  comment_count: number;
  is_favorite: boolean;
  user_progress: number; // 0-100 for completion
}

// Categories and Tags
export interface Category {
  id: string;
  name: string;
  name_ar: string;
  slug: string;
  description: string | null;
  icon: string | null;
  order: number;
  created_at: string;
}

export interface Tag {
  id: string;
  name: string;
  slug: string;
  color: string;
  created_at: string;
}

// Interactions
export interface Comment {
  id: string;
  content_id: string;
  user_id: string;
  text: string;
  is_approved: boolean;
  created_at: string;
  updated_at: string;
  user?: User;
}

export interface Suggestion {
  id: string;
  content_id: string | null;
  user_id: string | null;
  title: string;
  text: string;
  status: "pending" | "approved" | "rejected";
  created_at: string;
  admin_response: string | null;
  user?: User;
}

export interface AnonymousMessage {
  id: string;
  text: string;
  is_published: boolean;
  admin_response: string | null;
  created_at: string;
  spam_score: number;
  verified: boolean;
}

// Gamification
export interface UserPoints {
  id: string;
  user_id: string;
  points: number;
  level: number;
  total_points_earned: number;
  last_activity_at: string;
}

export interface Badge {
  id: string;
  name: string;
  name_ar: string;
  description: string;
  icon_url: string;
  criteria: string;
  created_at: string;
}

export interface UserBadge {
  id: string;
  user_id: string;
  badge_id: string;
  earned_at: string;
  badge?: Badge;
}

export interface Leaderboard {
  user_id: string;
  user_name: string;
  avatar_url: string | null;
  points: number;
  level: number;
  rank: number;
}

// Notifications
export type NotificationType =
  | "comment_approved"
  | "new_content"
  | "badge_earned"
  | "suggestion_response"
  | "general";

export interface Notification {
  id: string;
  user_id: string;
  type: NotificationType;
  title: string;
  message: string;
  read: boolean;
  related_id: string | null;
  created_at: string;
}

// SEO and Site Settings
export interface SiteSettings {
  id: string;
  site_name: string;
  site_name_ar: string;
  description: string;
  description_ar: string;
  logo_url: string | null;
  favicon_url: string | null;
  primary_color: string;
  secondary_color: string;
  maintenance_mode: boolean;
  updated_at: string;
}

export interface SEOFields {
  meta_title: string;
  meta_description: string;
  og_image: string | null;
  og_type: string;
  canonical_url: string | null;
}

// Audit Log
export type AuditAction =
  | "create"
  | "update"
  | "delete"
  | "publish"
  | "approve"
  | "reject"
  | "ban_user"
  | "unban_user";

export interface AuditLog {
  id: string;
  admin_id: string;
  action: AuditAction;
  entity_type: string;
  entity_id: string;
  changes: Record<string, any>;
  ip_address: string | null;
  user_agent: string | null;
  created_at: string;
}

// API Responses
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  per_page: number;
  total_pages: number;
}
