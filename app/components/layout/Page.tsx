import React from "react";
import { cn } from "@/lib/utils/cn";

interface PageProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  rtl?: boolean;
}

const Page = React.forwardRef<HTMLDivElement, PageProps>(
  ({ className, children, rtl = true, ...props }, ref) => (
    <div
      ref={ref}
      dir={rtl ? "rtl" : "ltr"}
      className={cn("min-h-screen bg-background text-foreground", className)}
      {...props}
    >
      {children}
    </div>
  )
);

Page.displayName = "Page";

export default Page;
