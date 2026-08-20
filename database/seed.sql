-- Seed categories
INSERT INTO categories (name, name_ar, slug, description, "order") VALUES
  ('Articles', 'المقالات', 'articles', 'Educational and informative articles', 1),
  ('Hadith', 'الأحاديث', 'hadith', 'Prophetic traditions and sayings', 2),
  ('Stories', 'القصص', 'stories', 'Islamic historical and moral stories', 3),
  ('Lessons', 'الدروس', 'lessons', 'Educational lessons and courses', 4),
  ('Quizzes', 'الاختبارات', 'quizzes', 'Interactive assessments and quizzes', 5),
  ('Quranic', 'القرآن', 'quranic', 'Quranic content and studies', 6);

-- Seed tags
INSERT INTO tags (name, slug, color) VALUES
  ('Islam', 'islam', '#8b5cf6'),
  ('Learning', 'learning', '#6d28d9'),
  ('Spirituality', 'spirituality', '#3f0f7f'),
  ('Community', 'community', '#c4b5fd'),
  ('Beginner', 'beginner', '#a78bfa'),
  ('Advanced', 'advanced', '#7c3aed');

-- Seed badges
INSERT INTO badges (name, name_ar, description, icon_url, criteria) VALUES
  ('First Step', 'خطوتك الأولى', 'Read your first article', '/badges/first-step.svg', 'articles_read >= 1'),
  ('Knowledge Seeker', 'طالب العلم', 'Read 10 articles', '/badges/knowledge-seeker.svg', 'articles_read >= 10'),
  ('Devoted Reader', 'القارئ المجتهد', 'Read 50 articles', '/badges/devoted-reader.svg', 'articles_read >= 50'),
  ('Master Scholar', 'العالم الفاضل', 'Read 100 articles', '/badges/master-scholar.svg', 'articles_read >= 100'),
  ('Engaged Member', 'العضو النشيط', 'Post your first comment', '/badges/engaged-member.svg', 'comments_count >= 1'),
  ('Helpful Contributor', 'المساهم المفيد', 'Earn 100 points', '/badges/helpful-contributor.svg', 'points >= 100');

-- Seed default site settings
INSERT INTO site_settings (site_name, site_name_ar, description, description_ar) VALUES
  ('Himah Li Ummah', 'هِمّة لأمّة', 'A modern Islamic digital platform for learning and community engagement', 'منصة رقمية إسلامية حديثة للتعلم والمشاركة المجتمعية');
