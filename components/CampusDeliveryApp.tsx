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
import { MobileNavbar } from "@/components/ui/mobile-navbar";
import { SearchOverlay } from "@/components/ui/search-overlay";

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
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

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
    { id: 1, name: "全部" },
    { id: 2, name: "快餐" },
    { id: 3, name: "奶茶" },
    { id: 4, name: "水果" },
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

  const filteredRestaurants = activeCategory === 1
    ? restaurants
    : restaurants.filter(restaurant => 
        restaurant.category === categories.find(c => c.id === activeCategory)?.name
      );

  return (
    <div className="min-h-screen bg-background">
      <SearchOverlay
        isOpen={isSearchOpen}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onClose={() => setIsSearchOpen(false)}
      />

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
        </div>

        {/* Categories */}
        <div className="mb-6 overflow-x-auto">
          <div className="flex gap-4 pb-2">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                  activeCategory === category.id
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted hover:bg-muted/80"
                }`}
              >
                {category.name}
              </button>
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

        {/* Restaurant List */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredRestaurants.map((restaurant) => (
            <Card key={restaurant.id} className="overflow-hidden">
              <CardContent className="p-0">
                <div className="aspect-video relative overflow-hidden">
                  <img
                    src={restaurant.image}
                    alt={restaurant.name}
                    className="w-full h-full object-cover transition-transform hover:scale-105"
                  />
                </div>
                <div className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold">{restaurant.name}</h3>
                    <div className="flex items-center">
                      <Star className="size-4 text-yellow-400 fill-yellow-400 mr-1" />
                      <span className="text-sm">{restaurant.rating}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                    <span>{restaurant.deliveryTime}</span>
                    <span>·</span>
                    <span>配送费 {restaurant.deliveryFee}</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {restaurant.tags.map((tag, index) => (
                      <Badge key={index} variant="secondary">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
};

export { CampusDeliveryApp }; 