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
} from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";

interface Restaurant {
  id: number;
  name: string;
  image: string;
  rating: number;
  deliveryTime: string;
  deliveryFee: string;
  tags: string[];
}

interface Category {
  id: number;
  name: string;
  icon: React.ReactNode;
}

const CampusDeliveryApp: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<number>(1);

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
    },
    {
      id: 2,
      name: "奶茶店",
      image: "https://images.pexels.com/photos/3551717/pexels-photo-3551717.jpeg?auto=compress&cs=tinysrgb&w=800",
      rating: 4.6,
      deliveryTime: "10-15分钟",
      deliveryFee: "¥5",
      tags: ["奶茶", "甜品"],
    },
    {
      id: 3,
      name: "水果店",
      image: "https://images.pexels.com/photos/1132047/pexels-photo-1132047.jpeg?auto=compress&cs=tinysrgb&w=800",
      rating: 4.7,
      deliveryTime: "20-30分钟",
      deliveryFee: "¥4",
      tags: ["水果", "健康"],
    },
    {
      id: 4,
      name: "便利店",
      image: "https://images.pexels.com/photos/3962285/pexels-photo-3962285.jpeg?auto=compress&cs=tinysrgb&w=800",
      rating: 4.5,
      deliveryTime: "15-25分钟",
      deliveryFee: "¥3",
      tags: ["零食", "日用品"],
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-background border-b border-border">
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
              <Button variant="ghost" size="icon">
                <User className="size-5" />
              </Button>
              <Button variant="ghost" size="icon">
                <ShoppingBag className="size-5" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container py-4">
        {/* Location and Search */}
        <div className="mb-6">
          <div className="flex items-center gap-1 mb-3">
            <MapPin className="size-4 text-muted-foreground" />
            <span className="text-sm font-medium">校园大道1号</span>
            <ChevronRight className="size-4 text-muted-foreground" />
          </div>
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
        <div>
          <h2 className="text-lg font-bold mb-4">附近商家</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {restaurants.map((restaurant) => (
              <Link 
                key={restaurant.id} 
                href={`/merchant/${restaurant.id}`}
                className="block border border-border rounded-lg overflow-hidden hover:shadow-md transition-shadow"
              >
                <div className="aspect-video relative overflow-hidden">
                  <img
                    src={restaurant.image}
                    alt={restaurant.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-4">
                  <div className="flex justify-between items-start">
                    <h3 className="font-bold">{restaurant.name}</h3>
                    <div className="bg-primary/10 text-primary px-2 py-0.5 rounded text-sm">
                      {restaurant.rating}
                    </div>
                  </div>
                  <div className="flex gap-2 mt-2">
                    <span className="text-sm text-muted-foreground">
                      {restaurant.deliveryTime}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      配送费 {restaurant.deliveryFee}
                    </span>
                  </div>
                  <div className="flex gap-2 mt-2">
                    {restaurant.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="bg-muted text-muted-foreground text-xs px-2 py-0.5 rounded"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export { CampusDeliveryApp }; 