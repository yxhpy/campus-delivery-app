"use client";

import React, { useState } from "react";
import {
  Search,
  ShoppingBag,
  User,
  Home,
  Clock,
  Heart,
  Menu,
  ChevronRight,
  MapPin,
  X,
  Star,
} from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { useUser } from "@/lib/user-context";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface Location {
  id: number;
  name: string;
  address: string;
}

interface Restaurant {
  id: number;
  name: string;
  image: string;
  rating: number;
  deliveryTime: string;
  deliveryFee: string;
  tags: string[];
  category: string;
}

interface Category {
  id: number;
  name: string;
  icon: React.ReactNode;
}

const CampusDeliveryApp: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<number>(1);
  const { isAuthenticated } = useUser();
  const [isLocationSheetOpen, setIsLocationSheetOpen] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<Location>({
    id: 1,
    name: "校园大道1号",
    address: "广东省广州市天河区校园大道1号"
  });
  const [searchLocation, setSearchLocation] = useState("");

  const locations: Location[] = [
    { id: 1, name: "校园大道1号", address: "广东省广州市天河区校园大道1号" },
    { id: 2, name: "学生宿舍", address: "广东省广州市天河区校园大道1号学生宿舍" },
    { id: 3, name: "教学楼", address: "广东省广州市天河区校园大道1号教学楼" },
    { id: 4, name: "图书馆", address: "广东省广州市天河区校园大道1号图书馆" },
    { id: 5, name: "体育馆", address: "广东省广州市天河区校园大道1号体育馆" },
  ];

  const filteredLocations = locations.filter(
    location => 
      location.name.toLowerCase().includes(searchLocation.toLowerCase()) ||
      location.address.toLowerCase().includes(searchLocation.toLowerCase())
  );

  const categories: Category[] = [
    { id: 1, name: "全部", icon: <Home className="size-5" /> },
    { id: 2, name: "快餐", icon: <ShoppingBag className="size-5" /> },
    { id: 3, name: "奶茶", icon: <Clock className="size-5" /> },
    { id: 4, name: "水果", icon: <Heart className="size-5" /> },
  ];

  const restaurants: Restaurant[] = [
    {
      id: 1,
      name: "学生食堂",
      image: "https://images.pexels.com/photos/1640774/pexels-photo-1640774.jpeg?auto=compress&cs=tinysrgb&w=800",
      rating: 4.8,
      deliveryTime: "15-20分钟",
      deliveryFee: "¥3",
      tags: ["快餐", "米饭", "面食"],
      category: "快餐"
    },
    {
      id: 2,
      name: "奶茶店",
      image: "https://images.pexels.com/photos/3551717/pexels-photo-3551717.jpeg?auto=compress&cs=tinysrgb&w=800",
      rating: 4.6,
      deliveryTime: "10-15分钟",
      deliveryFee: "¥5",
      tags: ["奶茶", "甜品"],
      category: "奶茶"
    },
    {
      id: 3,
      name: "水果店",
      image: "https://images.pexels.com/photos/1132047/pexels-photo-1132047.jpeg?auto=compress&cs=tinysrgb&w=800",
      rating: 4.7,
      deliveryTime: "20-30分钟",
      deliveryFee: "¥4",
      tags: ["水果", "健康"],
      category: "水果"
    },
    {
      id: 4,
      name: "便利店",
      image: "https://images.pexels.com/photos/3962285/pexels-photo-3962285.jpeg?auto=compress&cs=tinysrgb&w=800",
      rating: 4.5,
      deliveryTime: "15-25分钟",
      deliveryFee: "¥3",
      tags: ["零食", "日用品"],
      category: "快餐"
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background border-b border-border">
        <div className="container py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" size="icon" className="lg:hidden">
                    <Menu className="size-4" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="left">
                  <SheetHeader>
                    <SheetTitle>校园外卖</SheetTitle>
                  </SheetHeader>
                  <div className="mt-6 flex flex-col gap-4">
                    {categories.map((category) => (
                      <Button
                        key={category.id}
                        variant="ghost"
                        className="justify-start"
                        onClick={() => setActiveCategory(category.id)}
                      >
                        {category.icon}
                        <span className="ml-2">{category.name}</span>
                      </Button>
                    ))}
                  </div>
                </SheetContent>
              </Sheet>
              <div className="flex items-center">
                <Link href="/">
                  <h1 className="text-xl font-bold">校园外卖</h1>
                </Link>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Link 
                href={isAuthenticated ? "/profile" : "/auth/login"}
                className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-9 w-9"
              >
                <User className="size-5" />
              </Link>
              <Link 
                href="/orders"
                className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-9 w-9"
              >
                <ShoppingBag className="size-5" />
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container py-4">
        {/* Location and Search */}
        <div className="mb-6">
          <Sheet open={isLocationSheetOpen} onOpenChange={setIsLocationSheetOpen}>
            <SheetTrigger asChild>
              <button className="flex items-center gap-1 mb-3 hover:text-primary transition-colors">
                <MapPin className="size-4 text-muted-foreground" />
                <span className="text-sm font-medium">{selectedLocation.name}</span>
                <ChevronRight className="size-4 text-muted-foreground" />
              </button>
            </SheetTrigger>
            <SheetContent side="bottom" className="h-[80vh]">
              <SheetHeader>
                <SheetTitle>选择收货地址</SheetTitle>
              </SheetHeader>
              <div className="mt-4">
                <div className="relative mb-4">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                  <Input
                    placeholder="搜索地址"
                    className="pl-10"
                    value={searchLocation}
                    onChange={(e) => setSearchLocation(e.target.value)}
                  />
                  {searchLocation && (
                    <button
                      className="absolute right-3 top-1/2 -translate-y-1/2"
                      onClick={() => setSearchLocation("")}
                    >
                      <X className="size-4 text-muted-foreground" />
                    </button>
                  )}
                </div>
                <div className="space-y-2">
                  {filteredLocations.map((location) => (
                    <button
                      key={location.id}
                      className="w-full p-3 text-left rounded-lg hover:bg-accent transition-colors"
                      onClick={() => {
                        setSelectedLocation(location);
                        setIsLocationSheetOpen(false);
                      }}
                    >
                      <div className="font-medium">{location.name}</div>
                      <div className="text-sm text-muted-foreground">{location.address}</div>
                    </button>
                  ))}
                </div>
              </div>
            </SheetContent>
          </Sheet>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <Input
              placeholder="搜索商家、商品"
              className="pl-10"
            />
          </div>
        </div>

        {/* Categories */}
        <div className="mb-6 overflow-x-auto">
          <div className="flex gap-4 pb-2">
            {categories.map((category) => (
              <Button
                key={category.id}
                variant={activeCategory === category.id ? "default" : "outline"}
                className="flex-shrink-0"
                onClick={() => setActiveCategory(category.id)}
              >
                {category.icon}
                <span className="ml-2">{category.name}</span>
              </Button>
            ))}
          </div>
        </div>

        {/* Promotions */}
        <div className="mb-6">
          <div className="rounded-lg bg-muted h-40 flex items-center justify-center overflow-hidden">
            <img
              src="https://images.pexels.com/photos/4393021/pexels-photo-4393021.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
              alt="Promotion"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Restaurants */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {restaurants
            .filter(restaurant => activeCategory === 1 || restaurant.category === categories[activeCategory - 1].name)
            .map((restaurant) => (
            <Link key={restaurant.id} href={`/merchant/${restaurant.id}`}>
              <Card className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="aspect-video relative">
                  <img
                    src={restaurant.image}
                    alt={restaurant.name}
                    className="object-cover w-full h-full"
                  />
                </div>
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold">{restaurant.name}</h3>
                    <div className="flex items-center">
                      <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                      <span className="ml-1 text-sm">{restaurant.rating}</span>
                    </div>
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Clock className="w-4 h-4 mr-1" />
                    <span>{restaurant.deliveryTime}</span>
                    <span className="mx-2">•</span>
                    <span>{restaurant.deliveryFee}</span>
                  </div>
                  <div className="mt-2 flex flex-wrap gap-1">
                    {restaurant.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
};

export { CampusDeliveryApp }; 