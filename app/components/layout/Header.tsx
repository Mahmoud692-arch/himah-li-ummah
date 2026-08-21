"use client";

import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "@tanstack/react-router";
import Container from "@/components/layout/Container";
import Button from "@/components/ui/Button";
import Avatar from "@/components/ui/Avatar";
import { authService } from "@/lib/supabase/auth";
import { cn } from "@/lib/utils/cn";

const navItems = [
  { label: "🏠 الرئيسية", href: "/" },
  { label: "📚 المحتوى", href: "/articles" },
  { label: "🏆 المتصدرون", href: "/leaderboard" },
  { label: "💬 صراحني", href: "/sarrahni" },
];

export default function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState<any>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const currentUser = await authService.getUser();
        setUser(currentUser);
      } catch (error) {
        console.log("No user logged in");
      }
    };

    loadUser();

    const unsubscribe = authService.onAuthStateChange((session: any) => {
      setUser(session?.user || null);
    });

    return () => unsubscribe?.data?.subscription?.unsubscribe();
  }, []);

  return (
    <header className="border-b border-border bg-background sticky top-0 z-50">
      <Container>
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => navigate({ to: "/" })}
          >
            <div className="text-2xl">🌙</div>
            <h1 className="text-xl font-bold text-islamic-700">همة لأمة</h1>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <Button
                key={item.href}
                variant={location.pathname === item.href ? "default" : "ghost"}
                onClick={() => navigate({ to: item.href as any })}
                className="text-sm"
              >
                {item.label}
              </Button>
            ))}
          </nav>

          {/* User Menu */}
          <div className="flex items-center gap-2">
            {user ? (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate({ to: "/profile" })}
                  className="hidden sm:flex items-center gap-2"
                >
                  <Avatar
                    src=""
                    alt={user.email}
                    size="sm"
                  />
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => navigate({ to: "/profile" })}
                  className="md:hidden"
                >
                  👤
                </Button>
              </>
            ) : (
              <>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => navigate({ to: "/auth/login" })}
                  className="hidden sm:block"
                >
                  تسجيل دخول
                </Button>
                <Button
                  size="sm"
                  onClick={() => navigate({ to: "/auth/register" })}
                  className="hidden sm:block"
                >
                  إنشاء حساب
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => navigate({ to: "/auth/login" })}
                  className="sm:hidden"
                >
                  دخول
                </Button>
              </>
            )}

            {/* Mobile Menu Toggle */}
            <button
              className="md:hidden p-2"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              ☰
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <nav className="md:hidden border-t border-border py-4 space-y-2">
            {navItems.map((item) => (
              <Button
                key={item.href}
                variant={location.pathname === item.href ? "default" : "ghost"}
                onClick={() => {
                  navigate({ to: item.href as any });
                  setMobileMenuOpen(false);
                }}
                className="w-full justify-start text-sm"
              >
                {item.label}
              </Button>
            ))}
          </nav>
        )}
      </Container>
    </header>
  );
}
