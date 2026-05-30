"use client";

import React from "react";
import { Bell } from "lucide-react"; // Import chuông chuẩn của thư viện

export default function Header() {
  return (
    <div className="w-full h-[120px] relative px-[25px] pt-[51px] flex justify-between items-start z-20">
      <h1 className="font-['SF_Compact_Rounded',sans-serif] font-bold text-[35px] text-white leading-none tracking-tight">
        Zuno
      </h1>
      
      <div className="flex items-center gap-3 mt-[4px]">
        {/* Flame Icon + Points */}
        <div className="flex items-center gap-1">
          <span className="text-[24px]">🔥</span>
          <span className="font-['SF_Compact_Rounded',sans-serif] font-semibold text-[30px] text-white leading-none">
            50
          </span>
        </div>

        {/* Bell Button dùng component Bell thay vì SVG thô */}
        <button className="w-[43px] h-[43px] rounded-full bg-[#738BA5] flex items-center justify-center text-white hover:bg-[#6B7A96] transition-all active:scale-95 cursor-pointer">
          <Bell size={22} strokeWidth={2} fill="currentColor" />
        </button>
      </div>
    </div>
  );
}