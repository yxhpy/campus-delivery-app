// Component: mobile-navbar.tsx
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { MapPin, Menu, Search, ShoppingBag, User } from "lucide-react";
import Link from "next/link";
import { useUser } from "@/lib/user-context";

interface MobileNavbarProps {
  logo?: React.ReactNode;
  address?: string;
  onAddressClick?: () => void;
  onSearchClick?: () => void;
  cartItemCount?: number;
}

const MobileNavbar = ({
  logo = "校园外卖",
  address = "选择地址",
  onAddressClick,
  onSearchClick,
  cartItemCount = 0,
}: MobileNavbarProps) => {
  const [isOpen, setOpen] = useState(false);
  const { isAuthenticated } = useUser();

  return (
    <header className="w-full z-40 fixed top-0 left-0 bg-background border-b">
      <div className="container mx-auto px-4 h-14 flex items-center justify-between">
        <div className="flex items-center gap-2 relative z-10">
          {typeof logo === "string" ? (
            <Link href="/" className="font-semibold text-lg">
              {logo}
            </Link>
          ) : (
            logo
          )}
        </div>

        <div className="flex-1 mx-2 relative z-10">
          <button
            onClick={onAddressClick}
            className="flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors relative z-20"
            aria-label="地址选择"
          >
            <MapPin className="h-4 w-4 mr-1" />
            <span className="truncate max-w-[120px]">{address}</span>
          </button>
        </div>

        <div className="flex items-center gap-2 relative z-10">
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9"
            onClick={onSearchClick}
            aria-label="搜索"
          >
            <Search className="h-5 w-5" />
          </Button>
          
          <Link 
            href={isAuthenticated ? "/profile" : "/auth/login"}
            className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-9 w-9"
          >
            <User className="h-5 w-5" />
          </Link>
          
          <Link 
            href="/orders"
            className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-9 w-9 relative"
          >
            <ShoppingBag className="h-5 w-5" />
            {cartItemCount > 0 && (
              <span className="absolute top-0 right-0 h-4 w-4 text-[10px] font-medium flex items-center justify-center bg-primary text-primary-foreground rounded-full">
                {cartItemCount > 99 ? "99+" : cartItemCount}
              </span>
            )}
          </Link>

          <Sheet open={isOpen} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="h-9 w-9 lg:hidden">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[80%] sm:max-w-sm">
              <SheetHeader>
                <SheetTitle>菜单</SheetTitle>
              </SheetHeader>
              <div className="py-4">
                <nav className="flex flex-col gap-2">
                  <Link href="/" className="py-2 px-4 hover:bg-muted rounded-md">首页</Link>
                  <Link href="/orders" className="py-2 px-4 hover:bg-muted rounded-md">订单</Link>
                  <Link href={isAuthenticated ? "/profile" : "/auth/login"} className="py-2 px-4 hover:bg-muted rounded-md">我的</Link>
                </nav>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};

export { MobileNavbar }; 