"use client";

import React from "react";
import { Home, BarChart2, Plus, Wallet, User } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function BottomNav() {
  const pathname = usePathname();

  const navItems = [
    { icon: Home, label: "Trang chủ", href: "/", id: "home" },
    { icon: BarChart2, label: "Thống kê", href: "/analytics", id: "analytics" },
    { icon: Plus, label: "Thêm", href: "/add-transaction", id: "add", isAction: true },
    { icon: Wallet, label: "Ngân sách", href: "/budgets", id: "budget" },
    { icon: User, label: "Cá nhân", href: "/profile", id: "profile" },
  ];

  return (
    <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] h-[58px] bg-white shadow-[0_-2px_10px_rgba(0,0,0,0.05)] z-50 flex items-center justify-around px-4">
      {navItems.map((item) => {
        const isActive = pathname === item.href;
        const Icon = item.icon;

        if (item.isAction) {
          return (
            <Link
              key={item.id}
              href={item.href}
              aria-label={item.label}
              className="relative -top-5 w-[47px] h-[47px] bg-[#112945] rounded-full shadow-lg flex items-center justify-center text-white active:scale-95 transition-transform cursor-pointer"
            >
              <Plus size={24} strokeWidth={2.5} />
            </Link>
          );
        }

        return (
          <Link
            key={item.id}
            href={item.href}
            className={`flex flex-col items-center justify-center space-y-0.5 transition-all cursor-pointer ${
              isActive ? "text-[#112945]" : "text-[#546982] opacity-60"
            }`}
          >
            {/* Đã đồng bộ dùng Icon component chuẩn, Home sẽ hiện ngay lập tức! */}
            <Icon size={24} strokeWidth={isActive ? 2.5 : 1.5} />
          </Link>
        );
      })}
    </nav>
  );
}
