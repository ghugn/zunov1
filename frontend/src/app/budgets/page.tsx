'use client';

import { getBudgetScreenData } from "@/lib/zunoApi";
import type { BudgetAllocation, BudgetScreenData, FundType } from "@/types/zuno";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { bootstrapAuth } from "@/lib/api/auth";
import { AmountKeyboard } from "../../components/transaction/AddTransactionFigma";
import {
  BarChart2,
  BriefcaseBusiness,
  Building2,
  Calendar,
  CheckCircle2,
  Home,
  House,
  Landmark,
  Pencil,
  Plus,
  User,
  Wallet,
  X,
} from "lucide-react";

const imgFixedBill = "https://www.figma.com/api/mcp/asset/4ca32f54-53b9-4777-b3c5-6e58985a1438";
const imgDevelopment = "https://www.figma.com/api/mcp/asset/44a5385b-0036-4e38-a199-fd85479f47da";
const imgFoodDrinks = "https://www.figma.com/api/mcp/asset/1506c67e-a4ad-4fce-8a19-2a21af518702";
const imgExperience = "https://www.figma.com/api/mcp/asset/12200f7a-2f50-4ad0-a80a-a7415db1f6a6";
const imgSavings = "https://www.figma.com/api/mcp/asset/b779789a-c1fb-453e-ad8d-e2b8fba6bf7e";
const imgSavingsBg = "https://www.figma.com/api/mcp/asset/745b665e-3e07-4798-965b-c0d697b57a8e";
const imgLongTermGoals = "https://www.figma.com/api/mcp/asset/5819615b-a1b5-41f1-919c-2abfe1a420e4";
const imgMainMeals = "https://www.figma.com/api/mcp/asset/7bfe1948-8deb-4239-bde5-35b7de8d4099";
const imgSnacks = "https://www.figma.com/api/mcp/asset/139cf001-f91a-4655-abf6-19b5a3a94c0d";
const totalBudget = 5_000_000;

type BaseBudgetKey = "fixed" | "food" | "mainMeals" | "snacks" | "experience" | "development" | "savings";
type CustomBudgetKey = `custom-${number}`;
type BudgetKey = BaseBudgetKey | CustomBudgetKey;
type LifestyleKey = "dorm" | "renter" | "professional";
type SubBudgetCycle = "day" | "week";

type EditBudgetItem = {
  key: BudgetKey;
  label: string;
  description: string;
  color: string;
  icon?: string;
  bgIcon?: string;
  bgColor?: string;
  iconScale?: number;
  genericIcon?: boolean;
  largeIcon?: boolean;
  editableLabel?: boolean;
  subBudget?: boolean;
  nested?: boolean;
  unit: string;
  countsTowardTotal: boolean;
  presetPercent: number;
  presetAmount: number;
};

type LifestyleTemplate = {
  key: LifestyleKey;
  label: string;
  description: string;
  icon: typeof Building2;
  allocations: Record<BaseBudgetKey, number>;
};

const allocationItemStyles: Record<FundType, {
  label: string;
  color: string;
  icon: string;
  largeIcon?: boolean;
  bgIcon?: string;
}> = {
  living: {
    label: "Fixed bill",
    color: "#005bed",
    icon: imgFixedBill,
    largeIcon: true,
  },
  growth: {
    label: "Development",
    color: "#00607f",
    icon: imgDevelopment,
  },
  food: {
    label: "Food and Drinks",
    color: "#529100",
    icon: imgFoodDrinks,
  },
  future: {
    label: "Savings",
    color: "#038954",
    icon: imgSavings,
    bgIcon: imgSavingsBg,
  },
  experience: {
    label: "Experience",
    color: "#ff0048",
    icon: imgExperience,
  },
};

const DEFAULT_ALLOCATION_STYLE = {
  label: "Custom Category",
  color: "#6e97c8",
  icon: imgFixedBill,
};

type AllocationViewItem = {
  label: string;
  amount: string;
  percent: string;
  value: number;
  color: string;
  icon: string;
  largeIcon?: boolean;
  bgIcon?: string;
  spentAmount: number;
  remainingAmount: number;
  borrowAmount: number;
  fundType: FundType;
};

const lifestyleTemplates: LifestyleTemplate[] = [
  {
    key: "dorm",
    label: "Dorm Student",
    description: "Living in dorm",
    icon: Building2,
    allocations: {
      fixed: 7.5,
      food: 65,
      mainMeals: 60,
      snacks: 5,
      experience: 7.5,
      development: 10,
      savings: 10,
    },
  },
  {
    key: "renter",
    label: "Room Renter",
    description: "Living in rental",
    icon: House,
    allocations: {
      fixed: 20,
      food: 45,
      mainMeals: 35,
      snacks: 10,
      experience: 15,
      development: 10,
      savings: 10,
    },
  },
  {
    key: "professional",
    label: "Working Professional",
    description: "Full-time job",
    icon: BriefcaseBusiness,
    allocations: {
      fixed: 40,
      food: 25,
      mainMeals: 20,
      snacks: 5,
      experience: 15,
      development: 10,
      savings: 10,
    },
  },
];

const baseEditBudgetItems: EditBudgetItem[] = [
  {
    key: "fixed",
    label: "Fixed bill",
    description: "Rent, utility bill, service fee...",
    color: "#005bed",
    icon: imgFixedBill,
    iconScale: 1.35,
    unit: "/ month",
    countsTowardTotal: true,
    presetPercent: 7.5,
    presetAmount: 375_000,
  },
  {
    key: "food",
    label: "Food and Drinks",
    description: "Main meals + snacks",
    color: "#529100",
    icon: imgFoodDrinks,
    unit: "/ month",
    countsTowardTotal: true,
    presetPercent: 65,
    presetAmount: 3_250_000,
  },
  {
    key: "mainMeals",
    label: "Main meals",
    description: "",
    color: "#b54023",
    icon: imgMainMeals,
    bgColor: "#ffc4b5",
    iconScale: 0.76,
    subBudget: true,
    unit: "/ day",
    countsTowardTotal: false,
    presetPercent: 60,
    presetAmount: 100_000,
  },
  {
    key: "snacks",
    label: "Snacks",
    description: "",
    color: "#ab8922",
    icon: imgSnacks,
    bgColor: "#f6e37a",
    iconScale: 0.82,
    subBudget: true,
    unit: "/ day",
    countsTowardTotal: false,
    presetPercent: 5,
    presetAmount: 8_300,
  },
  {
    key: "experience",
    label: "Experience",
    description: "Films, cafe, games, travel...",
    color: "#ff0048",
    icon: imgExperience,
    unit: "/ month",
    countsTowardTotal: true,
    presetPercent: 10,
    presetAmount: 500_000,
  },
  {
    key: "development",
    label: "Development",
    description: "Books, courses, stationaries...",
    color: "#00607f",
    icon: imgDevelopment,
    unit: "/ month",
    countsTowardTotal: true,
    presetPercent: 7.5,
    presetAmount: 375_000,
  },
  {
    key: "savings",
    label: "Savings",
    description: "Saving for future plans",
    color: "#038954",
    icon: imgSavings,
    bgIcon: imgSavingsBg,
    unit: "/ month",
    countsTowardTotal: true,
    presetPercent: 10,
    presetAmount: 500_000,
  },
];

function formatVnd(amount: number) {
  return `${new Intl.NumberFormat("vi-VN").format(amount)} VNĐ`;
}

function formatInputAmount(amount: number) {
  return `${new Intl.NumberFormat("vi-VN").format(amount)}đ`;
}

function formatPercent(value: number) {
  return Number.isInteger(value) ? `${value}%` : `${value.toFixed(1)}%`;
}

function parseDateValue(value: string) {
  const [year, month, day] = value.split("-").map(Number);
  return new Date(year, month - 1, day);
}

function formatDateDisplay(date: Date) {
  return `${String(date.getDate()).padStart(2, "0")}/${String(date.getMonth() + 1).padStart(2, "0")}/${date.getFullYear()}`;
}

function formatDateValue(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

function openNativeDatePicker(input: HTMLInputElement | null) {
  if (!input) {
    return;
  }

  const inputWithPicker = input as HTMLInputElement & { showPicker?: () => void };
  if (inputWithPicker.showPicker) {
    inputWithPicker.showPicker();
    return;
  }

  input.click();
}

function BudgetNav() {
  const navItems = [
    { href: "/", label: "Home", icon: Home, active: false },
    { href: "/analytics", label: "Analytics", icon: BarChart2, active: false },
    { href: "/add-transaction", label: "Add", icon: Plus, active: false, action: true },
    { href: "/budgets", label: "Budget", icon: Wallet, active: true },
    { href: "/login", label: "Profile", icon: User, active: false },
  ];

  return (
    <nav className="fixed bottom-0 left-1/2 z-50 flex h-[58px] w-full max-w-[393px] -translate-x-1/2 items-center justify-around bg-white px-[25px] shadow-[-2px_-2px_20px_0px_rgba(0,0,0,0.18)]">
      {navItems.map((item) => {
        const Icon = item.icon;

        if (item.action) {
          return (
            <Link
              key={item.label}
              href={item.href}
              aria-label={item.label}
              className="flex size-[47px] items-center justify-center rounded-full bg-[#174f84] text-white shadow-[0_4px_10px_rgba(17,41,69,0.25)]"
            >
              <Icon className="size-[29px]" strokeWidth={2.75} />
            </Link>
          );
        }

        return (
          <Link
            key={item.label}
            href={item.href}
            aria-label={item.label}
            className={`flex size-[38px] items-center justify-center rounded-full drop-shadow-[-1px_-1px_1px_rgba(0,0,0,0.25)] transition-colors hover:bg-[#edf4ff] hover:text-[#174f84] ${
              item.active ? "bg-[#edf4ff] text-[#174f84]" : "text-[#546982]"
            }`}
          >
            <Icon className={item.active ? "size-[27px]" : "size-[26px]"} strokeWidth={item.active ? 2.5 : 2.25} />
          </Link>
        );
      })}
    </nav>
  );
}

function BudgetIcon({
  icon,
  bgIcon,
  bgColor,
  genericIcon,
  iconScale,
  largeIcon,
  size = 40,
}: {
  icon?: string;
  bgIcon?: string;
  bgColor?: string;
  genericIcon?: boolean;
  iconScale?: number;
  largeIcon?: boolean;
  size?: number;
}) {
  const scale = iconScale ?? (bgIcon ? 0.65 : largeIcon ? 1.3 : 1);
  const scaledSize = Math.round(size * scale);
  const imageSizeStyle = {
    width: scaledSize,
    height: scaledSize,
    ...(scale > 1 ? { maxWidth: "none" } : {}),
  };

  return (
    <div
      className="relative flex shrink-0 items-center justify-center rounded-full"
      style={{ width: size, height: size, backgroundColor: bgColor }}
    >
      {genericIcon ? <Wallet className="size-[18px] text-[#174f84]" strokeWidth={1.9} /> : null}
      {bgIcon ? <img alt="" className="absolute inset-0 object-contain" src={bgIcon} style={{ width: size, height: size }} /> : null}
      {icon ? (
        <img
          alt=""
          className={bgIcon ? "relative object-contain" : "object-contain"}
          src={icon}
          style={
            bgIcon
              ? imageSizeStyle
              : largeIcon
                ? imageSizeStyle
                : imageSizeStyle
          }
        />
      ) : null}
    </div>
  );
}

function AllocationItem({ item }: { item: AllocationViewItem }) {
  return (
    <div className="grid grid-cols-[40px_1fr] gap-3">
      <BudgetIcon icon={item.icon} bgIcon={item.bgIcon} largeIcon={item.largeIcon} />
      <div className="min-w-0 pt-[2px]">
        <div className="mb-[7px] flex items-start justify-between gap-2">
          <p className="max-w-[76px] text-[11px] leading-[13px] text-black">{item.label}</p>
          <p className="shrink-0 text-right text-[8px] leading-[12px] text-black">{item.amount}</p>
        </div>
        <div className="relative h-[12px]">
          <div className="absolute left-0 right-0 top-[3px] h-[7px] rounded-full bg-[#d9d9d9]" />
          <div
            className="absolute left-0 top-[3px] h-[7px] rounded-full"
            style={{ width: `${item.value}%`, backgroundColor: item.color }}
          />
          <p className="absolute right-0 top-1/2 -translate-y-1/2 text-[8px] leading-none" style={{ color: item.color }}>
            {item.percent}
          </p>
        </div>
      </div>
    </div>
  );
}

function EditBudgetRow({
  item,
  amount,
  percent,
  cycle,
  hint,
  onAmountFocus,
  onCycleChange,
  onLabelChange,
}: {
  item: EditBudgetItem;
  amount: number;
  percent: number;
  cycle?: SubBudgetCycle;
  hint?: string;
  onAmountFocus: () => void;
  onCycleChange?: () => void;
  onLabelChange?: (label: string) => void;
}) {
  return (
    <div className={`grid gap-x-3 ${item.subBudget || item.nested ? "grid-cols-[32px_1fr] pl-[56px]" : "grid-cols-[40px_1fr]"}`}>
      <BudgetIcon icon={item.icon} bgIcon={item.bgIcon} bgColor={item.bgColor} genericIcon={item.genericIcon} iconScale={item.iconScale} largeIcon={item.largeIcon} size={item.subBudget || item.nested ? 32 : 40} />
      <div className="min-w-0">
        <div className="flex items-start gap-2">
          <div className="min-w-0 flex-1">
            {item.editableLabel && onLabelChange ? (
              <input
                aria-label={`${item.label} name`}
                className="h-[18px] w-full rounded-[4px] border border-transparent bg-transparent px-0 text-[12px] leading-[15px] text-black outline-none focus:border-[#b8cbe4] focus:bg-white focus:px-[4px]"
                onChange={(event) => onLabelChange(event.target.value)}
                value={item.label}
              />
            ) : (
              <p className="text-[12px] leading-[15px] text-black">{item.label}</p>
            )}
            {item.description ? (
              <p
                className="mt-[1px] max-w-[95px] overflow-hidden text-[10px] leading-[11px] text-[#546982]"
                style={{ display: "-webkit-box", WebkitBoxOrient: "vertical", WebkitLineClamp: 2 }}
              >
                {item.description}
              </p>
            ) : null}
            {hint ? <p className="mt-[1px] text-[9px] leading-[11px] text-[#ab8922]">{hint}</p> : null}
          </div>
          <div className="flex shrink-0 items-center gap-[6px] pt-[2px] text-[12px] text-black">
            <input
              aria-label={`${item.label} amount`}
              className="h-5 w-[76px] rounded-[5px] border border-[#d1dceb] bg-[#f7f8fa] px-[6px] text-right text-[12px] outline-none focus:border-[#005bed]"
              inputMode="numeric"
              onClick={onAmountFocus}
              readOnly
              value={formatInputAmount(amount)}
            />
            {item.subBudget && cycle && onCycleChange ? (
              <button
                aria-label={`Switch ${item.label} cycle`}
                className="min-w-[51px] rounded-full border border-[#b8cbe4] bg-[#edf4ff] px-[6px] py-[2px] text-[11px] text-[#174f84]"
                onClick={onCycleChange}
                type="button"
              >
                / {cycle}
              </button>
            ) : (
              <span>{item.unit}</span>
            )}
          </div>
          <p className="w-[31px] shrink-0 pt-[3px] text-right text-[12px] leading-[15px] text-[#112945]">{formatPercent(percent)}</p>
        </div>
        <div className="mt-[11px] h-[5px] rounded-full bg-[#d9d9d9]">
          <div className="h-full rounded-full" style={{ width: `${Math.min(percent, 100)}%`, backgroundColor: item.color }} />
        </div>
      </div>
    </div>
  );
}

function EditBudgetScreen({
  allocations,
  budgetItems,
  selectedLifestyle,
  subBudgetCycles,
  onAddCategory,
  onAmountChange,
  onCategoryLabelChange,
  onLifestyleChange,
  onSubBudgetCycleChange,
  onClose,
  onSave,
}: {
  allocations: Record<string, number>;
  budgetItems: EditBudgetItem[];
  selectedLifestyle: LifestyleKey;
  subBudgetCycles: Record<"mainMeals" | "snacks", SubBudgetCycle>;
  onAddCategory: () => void;
  onAmountChange: (key: BudgetKey, amount: number) => void;
  onCategoryLabelChange: (key: BudgetKey, label: string) => void;
  onLifestyleChange: (lifestyle: LifestyleKey) => void;
  onSubBudgetCycleChange: (key: "mainMeals" | "snacks") => void;
  onClose: () => void;
  onSave: () => void;
}) {
  const totalAllocatedPercent = budgetItems
    .filter((item) => item.countsTowardTotal)
    .reduce((sum, item) => sum + (allocations[item.key] ?? 0), 0);
  const totalAllocatedAmount = Math.round((totalBudget * totalAllocatedPercent) / 100);
  const unallocatedAmount = Math.max(totalBudget - totalAllocatedAmount, 0);
  const isOverAllocated = totalAllocatedPercent > 100;
  const [selectedDate, setSelectedDate] = useState(() => parseDateValue("2026-04-26"));
  const [activeAmountKey, setActiveAmountKey] = useState<BudgetKey | null>(null);
  const [shouldReplaceActiveAmount, setShouldReplaceActiveAmount] = useState(false);
  const dateInputRef = useRef<HTMLInputElement>(null);
  const getAmount = (item: EditBudgetItem) => {
    const monthlyAmount = Math.round((totalBudget * (allocations[item.key] ?? 0)) / 100);
    if (!item.subBudget) {
      return monthlyAmount;
    }

    const cycle = subBudgetCycles[item.key as "mainMeals" | "snacks"];
    const dailyAmount = Math.round(monthlyAmount / 30);
    return cycle === "week" ? dailyAmount * 7 : dailyAmount;
  };
  const activeAmountItem = budgetItems.find((item) => item.key === activeAmountKey);
  const activeAmountValue = activeAmountItem ? String(getAmount(activeAmountItem)) : "";
  const updateActiveAmount = (nextAmountValue: string) => {
    if (!activeAmountKey) {
      return;
    }

    onAmountChange(activeAmountKey, Number(nextAmountValue) || 0);
  };

  return (
    <main className="mx-auto min-h-screen w-full max-w-[393px] overflow-x-hidden bg-[#f7f8fa] font-['SF_Compact_Rounded',sans-serif] text-black">
      <section className="relative min-h-screen bg-[linear-gradient(180deg,#112945_0%,#4d78a8_37.5%,#f7f8fa_100%)] px-[15px] pb-[22px] pt-[68px]">
        <div className="pointer-events-none absolute left-[172px] top-[28px] size-[2px] rounded-full bg-white/45" />
        <div className="pointer-events-none absolute right-[55px] top-[51px] size-[2px] rounded-full bg-white/45" />
        <button aria-label="Close edit budget" className="absolute left-[15px] top-[69px] text-white" onClick={onClose}>
          <X className="size-[25px]" strokeWidth={2.1} />
        </button>
        <button
          aria-label="Choose budget date"
          className="absolute left-[58px] top-[68px] flex h-7 items-center gap-[8px] rounded-full bg-white/20 px-[15px] text-white"
          onClick={() => openNativeDatePicker(dateInputRef.current)}
          type="button"
        >
          <Calendar className="size-[14px]" />
          <span className="text-[12px] font-medium">{formatDateDisplay(selectedDate)}</span>
        </button>
        <input
          aria-hidden
          className="absolute left-[58px] top-[68px] h-0 w-0 opacity-0"
          onChange={(event) => setSelectedDate(parseDateValue(event.target.value))}
          ref={dateInputRef}
          tabIndex={-1}
          type="date"
          value={formatDateValue(selectedDate)}
        />
        <button
          aria-label="Open bank fund setup"
          className="absolute right-[17px] top-[84px] flex size-[84px] items-center justify-center rounded-full border border-white/20 bg-white/10 text-white shadow-[0px_25px_50px_rgba(42,68,106,0.4)] backdrop-blur-[2px]"
          onClick={() => undefined}
          type="button"
        >
          <span className="absolute inset-[6px] rounded-full border border-white/10 bg-white/10" />
          <Landmark className="relative size-[42px]" strokeWidth={1.7} />
        </button>

        <header className="mt-[42px] text-white">
          <h1 className="text-[25px] font-medium leading-none">Edit budget allocation</h1>
          <p className="mt-[14px] text-[12px] leading-[15px]">Allocating budget by percentage.</p>
        </header>

        <section className="mt-[16px] flex h-[50px] items-center rounded-[20px] bg-[#f7f8fa] px-[20px] shadow-[0px_10px_30px_rgba(0,0,20,0.08)]">
          <Wallet className="mr-[28px] size-[22px] text-[#174f84]" strokeWidth={1.8} />
          <p className="flex-1 text-[12px] font-semibold text-[#174f84]">Total budget</p>
          <p className="text-[12px] font-semibold text-[#2e9b56]">{formatVnd(totalBudget)}</p>
        </section>

        <section className="mt-[11px] rounded-[20px] bg-[#f7f8fa] px-[10px] pb-[13px] pt-[14px] shadow-[0px_10px_30px_rgba(0,0,20,0.08)]">
          <div className="mb-[10px] flex items-center justify-between px-[5px]">
            <h2 className="text-[12px] font-semibold leading-[15px] text-[#174f84]">Choose your lifestyle</h2>
            <p className="text-[9px] leading-[12px] text-[#546982]">We&apos;ll suggest the best allocation.</p>
          </div>
          <div className="mb-[14px] grid grid-cols-3 gap-[5px]">
            {lifestyleTemplates.map((template) => {
              const Icon = template.icon;
              const isSelected = selectedLifestyle === template.key;
              return (
                <button
                  className={`relative flex min-h-[72px] flex-col items-center justify-center rounded-[8px] border px-[3px] py-[7px] text-center transition-colors ${
                    isSelected ? "border-[#005bed] bg-[#edf4ff]" : "border-[#d1dceb] bg-white"
                  }`}
                  key={template.key}
                  onClick={() => onLifestyleChange(template.key)}
                  type="button"
                >
                  {isSelected ? <CheckCircle2 className="absolute right-[4px] top-[4px] size-[14px] fill-[#005bed] text-white" /> : null}
                  <Icon className={`mb-[4px] size-[23px] ${isSelected ? "text-[#005bed]" : "text-[#174f84]"}`} strokeWidth={1.7} />
                  <span className={`text-[10px] font-semibold leading-[11px] ${isSelected ? "text-[#005bed]" : "text-[#174f84]"}`}>{template.label}</span>
                  <span className="mt-[2px] text-[8px] leading-[9px] text-[#546982]">{template.description}</span>
                </button>
              );
            })}
          </div>
          <div className="space-y-[17px] px-[7px] pb-[4px]">
            {budgetItems.map((item) => (
              <EditBudgetRow
                key={item.key}
                item={item}
                amount={getAmount(item)}
                percent={allocations[item.key] ?? 0}
                cycle={item.subBudget ? subBudgetCycles[item.key as "mainMeals" | "snacks"] : undefined}
                hint={item.key === "snacks" && selectedLifestyle === "renter" ? "~3 milk teas / week" : undefined}
                onAmountFocus={() => {
                  setActiveAmountKey(item.key);
                  setShouldReplaceActiveAmount(true);
                }}
                onCycleChange={item.subBudget ? () => onSubBudgetCycleChange(item.key as "mainMeals" | "snacks") : undefined}
                onLabelChange={item.editableLabel ? (label) => onCategoryLabelChange(item.key, label) : undefined}
              />
            ))}
            <button className="mx-auto flex h-[26px] w-[240px] items-center justify-center gap-2 rounded-[5px] border border-dashed border-[#6e97c8] bg-white text-[12px] text-[#112945]" onClick={onAddCategory} type="button">
              <Plus className="size-[14px]" />
              Add category
            </button>
          </div>
        </section>

        <section className="mt-[10px] rounded-[20px] border border-[#42a959] bg-gradient-to-b from-[rgba(191,230,195,0.5)] to-[rgba(245,247,251,0.5)] px-[20px] py-[17px] shadow-[0px_10px_30px_rgba(0,0,20,0.08)]">
          <div className="flex items-center justify-between">
            <p className="text-[16px] font-semibold">Total allocated</p>
            <p className={`text-[16px] font-bold ${isOverAllocated ? "text-[#d7373f]" : "text-[#2e9b56]"}`}>{formatPercent(totalAllocatedPercent)}</p>
          </div>
          <div className="mt-[9px] flex items-center justify-between">
            <p className="text-[14px] font-medium">Unallocated amount <span className="ml-1 inline-flex size-[14px] items-center justify-center rounded-full border border-[#c5c5c5] text-[8px] text-[#c5c5c5]">i</span></p>
            <p className={`text-[14px] font-medium ${isOverAllocated ? "text-[#d7373f]" : "text-[#2e9b56]"}`}>{isOverAllocated ? `-${formatVnd(totalAllocatedAmount - totalBudget)}` : formatVnd(unallocatedAmount)}</p>
          </div>
        </section>

        <button
          className={`mx-auto mt-[15px] flex h-[45px] w-[280px] items-center justify-center rounded-[20px] text-[20px] font-semibold text-white shadow-[2px_2px_10px_rgba(0,0,0,0.2)] ${isOverAllocated ? "cursor-not-allowed bg-[#a7adb7]" : "bg-[#174f84]"}`}
          disabled={isOverAllocated}
          onClick={onSave}
        >
          Save
        </button>
      </section>
      {activeAmountKey ? (
        <div className="fixed inset-0 z-50 mx-auto max-w-[393px]">
          <button aria-label="Close amount keyboard" className="absolute inset-0 cursor-default border-0 bg-transparent p-0" onClick={() => setActiveAmountKey(null)} type="button" />
          <div className="absolute bottom-0 left-0 right-0 z-10">
            <AmountKeyboard
              amountValue={activeAmountValue}
              onClose={() => setActiveAmountKey(null)}
              onDeletePress={() => {
                setShouldReplaceActiveAmount(false);
                updateActiveAmount(activeAmountValue.slice(0, -1));
              }}
              onDigitPress={(digit) => {
                setShouldReplaceActiveAmount(false);
                updateActiveAmount(shouldReplaceActiveAmount ? digit : `${activeAmountValue}${digit}`);
              }}
              onSuggestionPress={(nextAmountValue) => {
                setShouldReplaceActiveAmount(false);
                updateActiveAmount(nextAmountValue);
              }}
            />
          </div>
        </div>
      ) : null}
    </main>
  );
}

export default function BudgetControlPage() {
  const [isEditing, setIsEditing] = useState(false);
  const [budgetData, setBudgetData] = useState<BudgetScreenData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [selectedLifestyle, setSelectedLifestyle] = useState<LifestyleKey>("dorm");
  const [customBudgetItems, setCustomBudgetItems] = useState<EditBudgetItem[]>([]);
  const budgetItems = [...baseEditBudgetItems, ...customBudgetItems];
  const [editAllocations, setEditAllocations] = useState<Record<string, number>>(() => lifestyleTemplates[0].allocations);
  const [subBudgetCycles, setSubBudgetCycles] = useState<Record<"mainMeals" | "snacks", SubBudgetCycle>>({
    mainMeals: "day",
    snacks: "day",
  });
  useEffect(() => {
    let isMounted = true;

    async function loadBudgetOverview() {
      setIsLoading(true);
      setErrorMessage(null);

      try {
        const ok = await bootstrapAuth();
        if (!ok || !isMounted) return;

        const now = new Date();
        const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-01`;
        const nextBudgetData = await getBudgetScreenData(currentMonth);
        if (isMounted) {
          setBudgetData(nextBudgetData);
        }
      } catch (error) {
        if (isMounted) {
          setBudgetData(null);
          setErrorMessage(error instanceof Error ? error.message : "Unable to load budget overview");
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadBudgetOverview();

    return () => {
      isMounted = false;
    };
  }, []);

  const currentTotalBudget = budgetData?.totalBudget || totalBudget;
  const allocationItems = (budgetData?.allocations ?? []).map((allocation: BudgetAllocation) => {
    const style = allocationItemStyles[allocation.fundType] ?? DEFAULT_ALLOCATION_STYLE;
    const remainingPct = currentTotalBudget > 0 ? (allocation.remainingAmount / currentTotalBudget) * 100 : 0;
    return {
      ...style,
      amount: formatInputAmount(allocation.remainingAmount),
      percent: formatPercent(remainingPct),
      value: remainingPct,
      spentAmount: allocation.spentAmount,
      remainingAmount: allocation.remainingAmount,
      borrowAmount: allocation.borrowAmount,
      fundType: allocation.fundType,
    };
  });
  const overviewTotalBudget = budgetData?.totalBudget ?? 0;
  const overviewTotalSpent = budgetData?.totalSpent ?? 0;
  const overviewRemaining = budgetData?.totalRemaining ?? 0;
  const overviewSpentPercent = overviewTotalBudget > 0 ? Math.min(100, Math.max(0, (overviewTotalSpent / overviewTotalBudget) * 100)) : 0;
  const overviewRemainingPercent = overviewTotalBudget > 0 ? (overviewRemaining / overviewTotalBudget) * 100 : 0;
  const overviewIsOverBudget = overviewRemaining < 0;
  const overviewTone = overviewIsOverBudget ? "#d7373f" : "#2e9b56";
  const overviewStatus = overviewIsOverBudget ? `${Math.abs(overviewRemainingPercent).toFixed(0)}%` : `+${overviewRemainingPercent.toFixed(0)}%`;
  const overviewMessage = overviewIsOverBudget
    ? <>You&apos;re <span style={{ color: overviewTone }}>{Math.abs(overviewRemainingPercent).toFixed(0)}%</span> over budget.</>
    : <>You&apos;re <span style={{ color: overviewTone }}>{overviewRemainingPercent.toFixed(0)}%</span> under budget. Great job!</>;
  const addCustomCategory = () => {
    const nextIndex = customBudgetItems.length + 1;
    const nextKey: CustomBudgetKey = `custom-${Date.now()}`;
    setCustomBudgetItems((current) => [
      ...current,
      {
        key: nextKey,
        label: `New category ${nextIndex}`,
        description: "Custom budget category",
        color: "#6e97c8",
        bgColor: "#edf4ff",
        genericIcon: true,
        editableLabel: true,
        unit: "/ month",
        countsTowardTotal: true,
        presetPercent: 0,
        presetAmount: 0,
      },
    ]);
    setEditAllocations((current) => ({ ...current, [nextKey]: 0 }));
  };

  if (isEditing) {
    return (
      <EditBudgetScreen
        allocations={editAllocations}
        budgetItems={budgetItems}
        selectedLifestyle={selectedLifestyle}
        subBudgetCycles={subBudgetCycles}
        onAddCategory={addCustomCategory}
        onCategoryLabelChange={(key, label) => {
          setCustomBudgetItems((current) => current.map((item) => (item.key === key ? { ...item, label } : item)));
        }}
        onAmountChange={(key, amount) => {
          const item = budgetItems.find((candidate) => candidate.key === key);
          if (!item) {
            return;
          }

          setEditAllocations((current) => {
            if (item.subBudget) {
              const cycle = subBudgetCycles[key as "mainMeals" | "snacks"];
              const monthlyAmount = cycle === "week" ? (amount * 30) / 7 : amount * 30;
              const percent = (monthlyAmount / totalBudget) * 100;
              const next = { ...current, [key]: percent };
              return { ...next, food: next.mainMeals + next.snacks };
            }

            const percent = (amount / totalBudget) * 100;
            if (key !== "food") {
              return { ...current, [key]: percent };
            }

            const currentFood = current.mainMeals + current.snacks;
            if (currentFood === 0) {
              return { ...current, food: percent, mainMeals: percent, snacks: 0 };
            }

            const scale = percent / currentFood;
            return {
              ...current,
              food: percent,
              mainMeals: current.mainMeals * scale,
              snacks: current.snacks * scale,
            };
          });
        }}
        onLifestyleChange={(lifestyle) => {
          const template = lifestyleTemplates.find((item) => item.key === lifestyle);
          if (!template) {
            return;
          }
          setSelectedLifestyle(lifestyle);
          setEditAllocations((current) => {
            const customAllocations = Object.fromEntries(customBudgetItems.map((item) => [item.key, current[item.key] ?? 0]));
            return { ...template.allocations, ...customAllocations };
          });
          setSubBudgetCycles({
            mainMeals: lifestyle === "dorm" ? "day" : "week",
            snacks: lifestyle === "dorm" ? "day" : "week",
          });
        }}
        onSubBudgetCycleChange={(key) => {
          setSubBudgetCycles((current) => ({
            ...current,
            [key]: current[key] === "day" ? "week" : "day",
          }));
        }}
        onClose={() => setIsEditing(false)}
        onSave={() => setIsEditing(false)}
      />
    );
  }

  return (
    <main className="mx-auto min-h-screen w-full max-w-[393px] overflow-x-hidden bg-[#f7f8fa] pb-[82px] font-['SF_Compact_Rounded',sans-serif] text-black">
      <section className="relative min-h-screen bg-[linear-gradient(180deg,#112945_0%,#4d78a8_37.5%,#f7f8fa_100%)] px-[15px] pt-[64px]">
        <div className="pointer-events-none absolute left-[88px] top-[48px] size-[3px] rounded-full bg-white/45" />
        <div className="pointer-events-none absolute left-[172px] top-[28px] size-[2px] rounded-full bg-white/45" />
        <div className="pointer-events-none absolute right-[56px] top-[50px] size-[2px] rounded-full bg-white/45" />
        <div className="pointer-events-none absolute right-[78px] top-[34px] size-[1.5px] rounded-full bg-white/45" />

        <header className="px-[18px] text-white">
          <h1 className="text-[25px] font-medium leading-none">Budget Control</h1>
          <p className="mt-[17px] text-[12px] leading-[15px]">Set your budget allocation by percentage.</p>
        </header>

        {isLoading ? (
          <section className="mt-[24px] rounded-[20px] bg-[#f7f8fa] px-5 py-4 text-[14px] font-medium text-[#64748b] shadow-[0px_10px_30px_rgba(0,0,20,0.08)]">
            Loading budget overview...
          </section>
        ) : errorMessage ? (
          <section className="mt-[24px] rounded-[20px] border border-[#ffe4e4] bg-[#fff1f1] px-5 py-4 text-[14px] font-medium leading-[18px] text-[#e11d48] shadow-[0px_10px_30px_rgba(0,0,20,0.08)]">
            {errorMessage}
          </section>
        ) : (
        <>
        <section className="mt-[24px] rounded-[20px] bg-[#f7f8fa] px-[37px] py-[18px] shadow-[0px_10px_30px_rgba(0,0,20,0.08)]">
          <div className="grid grid-cols-[1fr_90px] items-center gap-5">
            <div>
              <p className="text-[12px] leading-[15px]">Overall status</p>
              <p className="mt-[14px] text-[45px] font-semibold leading-[45px]" style={{ color: overviewTone }}>{overviewStatus}</p>
              <p className="mt-[8px] text-[12px] leading-[15px]" style={{ color: overviewTone }}>{formatInputAmount(Math.abs(overviewRemaining))} {overviewIsOverBudget ? "over budget" : "remaining"}</p>
            </div>
            <div className="relative size-[90px] rounded-full" style={{ background: `conic-gradient(${overviewTone} 0deg ${overviewSpentPercent * 3.6}deg, #d9d9d9 ${overviewSpentPercent * 3.6}deg 360deg)` }}>
              <div className="absolute inset-[11px] flex items-center justify-center rounded-full bg-[#f7f8fa] text-center text-[12px] leading-[14px]">
                {Math.round(overviewSpentPercent)}% of<br />budget
              </div>
            </div>
          </div>
          <p className="mt-[13px] text-center text-[13px] leading-[21px] text-[#546982]">
            {overviewMessage}
          </p>
        </section>
        </>
        )}

        <section className="mt-[18px] rounded-[20px] bg-[#f7f8fa] px-[19px] pb-[24px] pt-[14px] shadow-[0px_10px_30px_rgba(0,0,20,0.08)]">
          <div className="mb-[17px] flex items-center justify-between">
            <h2 className="text-[12px] font-semibold leading-[15px]">Budget allocation</h2>
            <button className="flex items-center gap-[5px] text-[10px] leading-none text-[#546982]" onClick={() => {
              setIsEditing(true);
            }}>
              <Pencil className="size-[14px]" fill="currentColor" strokeWidth={0} />
              Edit
            </button>
          </div>
          <div className="grid grid-cols-2 gap-x-5 gap-y-[17px]">
            {allocationItems.map((item) => (
              <AllocationItem key={item.label} item={item} />
            ))}
          </div>
        </section>

        <section className="mt-[18px] rounded-[20px] bg-[#f7f8fa] px-[21px] pb-[10px] pt-[15px] shadow-[0px_10px_30px_rgba(0,0,20,0.08)]">
          <div className="mb-[10px] flex items-center justify-between">
            <h2 className="text-[12px] font-semibold leading-[15px]">Long-term goals</h2>
            <button className="flex h-[19px] items-center gap-[5px] rounded-[5px] border border-[#6e97c8] px-[6px] text-[10px] leading-none text-[#174f84]">
              <Plus className="size-[10px]" strokeWidth={2} />
              Add goals
            </button>
          </div>
          <div className="flex h-[135px] flex-col items-center justify-end rounded-[10px] bg-[rgba(233,235,244,0.64)] px-4 pb-[12px]">
            <img alt="" className="mb-[7px] h-[92px] w-[112px] object-contain" src={imgLongTermGoals} />
            <p className="text-center text-[12px] leading-[14px]">No long-term goals set yet. Add now!</p>
          </div>
        </section>
      </section>

      <BudgetNav />
    </main>
  );
}
