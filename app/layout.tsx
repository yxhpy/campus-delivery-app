import type { Metadata } from "next";
import "./globals.css";
import { CartProvider } from "@/lib/cart-context";
import { UserProvider } from "@/lib/user-context";
import { CartSheet } from "@/components/CartSheet";
import { UserMenu } from "@/components/UserMenu";
import { Toaster } from "sonner";

export const metadata: Metadata = {
  title: "校园外卖",
  description: "校园外卖APP - 让校园生活更便捷",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN" className="scroll-smooth">
      <body className="min-h-screen bg-background font-sans antialiased">
        <UserProvider>
          <CartProvider>
            <div className="relative">
              <div className="fixed bottom-4 right-4 z-50 md:top-4 md:bottom-auto flex items-center space-x-2">
                <UserMenu />
                <CartSheet />
              </div>
              {children}
            </div>
            <Toaster position="top-center" richColors closeButton />
          </CartProvider>
        </UserProvider>
      </body>
    </html>
  );
} 