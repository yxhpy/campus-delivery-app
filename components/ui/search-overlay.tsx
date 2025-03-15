"use client";

import React from "react";
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";

interface SearchOverlayProps {
  isOpen: boolean;
  searchQuery: string;
  onSearchChange: (value: string) => void;
  onClose: () => void;
}

export function SearchOverlay({
  isOpen,
  searchQuery,
  onSearchChange,
  onClose,
}: SearchOverlayProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm">
      <div className="container py-4">
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input
            placeholder="搜索商家、商品"
            className="pl-10 pr-10"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            autoFocus
          />
          <button
            className="absolute right-3 top-1/2 -translate-y-1/2"
            onClick={() => {
              onSearchChange("");
              onClose();
            }}
          >
            <X className="size-4 text-muted-foreground" />
          </button>
        </div>
        {/* 搜索结果将在这里显示 */}
      </div>
    </div>
  );
} 