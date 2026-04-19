import type { Metadata } from "next";
import "./globals.css";
import { Geist } from "next/font/google";
import { cn } from "@/lib/utils";
import { Toaster } from "sonner";
import { TooltipProvider } from "@/components/ui/tooltip"
import PublicFooter from "@/components/PublicFooter";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

export const metadata: Metadata = {
  title: "KSKP - Youth",
  icons: {
    icon: "/LogoIconDark.svg"
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={cn("h-full", "antialiased", "font-sans", geist.variable, "scroll-smooth")}
    >
      <body className="min-h-full min-w-full flex flex-col bg-white">
        <TooltipProvider>
          {children}
          <PublicFooter />
        </TooltipProvider>
        <Toaster />
      </body>
    </html>
  );
}
