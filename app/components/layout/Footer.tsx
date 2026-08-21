"use client";

import Container from "@/components/layout/Container";
import { cn } from "@/lib/utils/cn";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-muted mt-12" dir="rtl">
      <Container>
        <div className="py-12 space-y-8">
          {/* Footer Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* About */}
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">🌙 همة لأمة</h3>
              <p className="text-sm text-muted-foreground">
                منصة رقمية إسلامية حديثة تجمع بين العلم والتعليم والمجتمع في بيئة آمنة وموثوقة.
              </p>
            </div>

            {/* Links */}
            <div className="space-y-4">
              <h3 className="font-semibold">الروابط</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="/" className="hover:text-foreground transition-colors">الرئيسية</a></li>
                <li><a href="/articles" className="hover:text-foreground transition-colors">المحتوى</a></li>
                <li><a href="/leaderboard" className="hover:text-foreground transition-colors">المتصدرون</a></li>
                <li><a href="/sarrahni" className="hover:text-foreground transition-colors">صراحني</a></li>
              </ul>
            </div>

            {/* Resources */}
            <div className="space-y-4">
              <h3 className="font-semibold">الموارد</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground transition-colors">من نحن</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">اتصل بنا</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">سياسة الخصوصية</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">شروط الاستخدام</a></li>
              </ul>
            </div>

            {/* Social */}
            <div className="space-y-4">
              <h3 className="font-semibold">تابعنا</h3>
              <div className="flex gap-4 text-sm">
                <a href="#" className="hover:text-primary transition-colors">فيسبوك</a>
                <a href="#" className="hover:text-primary transition-colors">تويتر</a>
                <a href="#" className="hover:text-primary transition-colors">انستجرام</a>
              </div>
            </div>
          </div>

          {/* Bottom */}
          <div className="border-t border-border pt-8 text-center text-sm text-muted-foreground">
            <p>
              © {currentYear} همة لأمة. جميع الحقوق محفوظة 🙏
            </p>
          </div>
        </div>
      </Container>
    </footer>
  );
}
