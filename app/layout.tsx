import type { Metadata } from "next";
import "./globals.css";
import { CartProvider } from "@/lib/cart-context";
import { UserProvider } from "@/lib/user-context";
import { CartSheet } from "@/components/CartSheet";
import { UserMenu } from "@/components/UserMenu";
import { Toaster } from "sonner";
import { WishlistProvider } from "@/lib/wishlist-context";
import { Navbar } from "@/components/Navbar";

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
        <WishlistProvider>
          <UserProvider>
            <CartProvider>
              <div className="relative flex min-h-screen flex-col">
                <Navbar />
                <main className="flex-1">
                  {children}
                </main>
              </div>
              <Toaster position="top-center" richColors closeButton />
            </CartProvider>
          </UserProvider>
        </WishlistProvider>
      </body>
    </html>
  );
} 