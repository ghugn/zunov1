'use client';

import { getCalendarMonth, getHomeScreenData } from "@/lib/zunoApi";
import type { CalendarDay, HomeScreenData } from "@/types/zuno";
import { BarChart2, Bell, ChevronDown, Home, Plus, User, Wallet } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { bootstrapAuth } from "@/lib/api/auth";

const imgEllipse51 = "https://www.figma.com/api/mcp/asset/0b289e02-5d91-443b-aa39-1d5b73637f77";
const imgImage6 = "https://www.figma.com/api/mcp/asset/2083eb11-bec2-4ac4-9264-e08d594d3e1f";
const imgSvg = "https://www.figma.com/api/mcp/asset/dafe4463-257b-4ada-8dde-d89cdd7cb6d8";
const imgSvg1 = "https://www.figma.com/api/mcp/asset/59e5c6cd-e363-4a9e-9fe0-94b35b0b5b83";
const imgSvg2 = "https://www.figma.com/api/mcp/asset/ce5315d8-8f1d-4c67-97ad-8b63892d9b50";
const imgGroup20 = "https://www.figma.com/api/mcp/asset/7b342a7c-5c6e-4ac8-9b76-63bcac93f750";
const imgBudgetFoodDrinks = "https://www.figma.com/api/mcp/asset/1506c67e-a4ad-4fce-8a19-2a21af518702";
const imgBudgetExperience = "https://www.figma.com/api/mcp/asset/12200f7a-2f50-4ad0-a80a-a7415db1f6a6";
const imgVector1 = "https://www.figma.com/api/mcp/asset/a7853622-9497-4eb9-9a44-42f963d4e10d";
const imgVector2 = "https://www.figma.com/api/mcp/asset/0f5623a5-822e-4cec-a870-43e07323ccfa";
const imgVector3 = "https://www.figma.com/api/mcp/asset/a14b1554-1c9b-4552-8ef1-1e738ace811c";
const imgEllipse42 = "https://www.figma.com/api/mcp/asset/d578798b-7503-4140-8ce2-d539f51dd25a";
const imgVector6 = "https://www.figma.com/api/mcp/asset/04284c40-919a-40f2-af57-03f87d957284";
const imgVector7 = "https://www.figma.com/api/mcp/asset/a378de3f-536e-4d68-aae4-829191c5da72";
const imgVector8 = "https://www.figma.com/api/mcp/asset/dfafde6c-fd0f-485f-812c-33c7de17b3e1";
const imgVector9 = "https://www.figma.com/api/mcp/asset/e2148b51-bee1-42d9-852e-309ea2050643";
const imgVector10 = "https://www.figma.com/api/mcp/asset/5f034ce5-2ecb-407d-bf19-b73f1cd6de02";
const imgVector11 = "https://www.figma.com/api/mcp/asset/f650f993-df60-4b65-bd1f-c2828d79cbff";
const imgVector13 = "https://www.figma.com/api/mcp/asset/f5e10645-114d-4b8d-85f7-62632f802a87";
const imgVector14 = "https://www.figma.com/api/mcp/asset/9644f807-6df3-4305-88d2-494701b1fb6f";
const imgVector15 = "https://www.figma.com/api/mcp/asset/55ad5d26-345f-4ebe-a4a7-1bc5fcf7f707";
const imgVector16 = "https://www.figma.com/api/mcp/asset/7562b597-c19a-454f-8335-0673b3bbe16b";
const imgVector17 = "https://www.figma.com/api/mcp/asset/f16333ef-01f7-4487-9ec5-5a7922a2a796";
const imgVector18 = "https://www.figma.com/api/mcp/asset/38e529f8-40b4-45d7-aab4-b89b3687dece";
const imgVector19 = "https://www.figma.com/api/mcp/asset/7a2d85d7-c1f3-44ba-9dd9-bb5b1c99e0aa";
const imgXAxis = "https://www.figma.com/api/mcp/asset/2a42f02b-2064-428e-a481-d3f4c6eafa2b";
const imgFreeSampleVectorizerIoIstockphoto1323529010612X6121 = "https://www.figma.com/api/mcp/asset/3aa73147-cc27-4376-9067-d7f540d8edb9";
const imgGroup = "https://www.figma.com/api/mcp/asset/68c90d25-ece2-4d18-8d68-36f61f1cdadb";
const imgGroup1 = "https://www.figma.com/api/mcp/asset/2b61f866-6ee2-4fbf-9d09-a6fc1a13e58d";
const imgGroup2 = "https://www.figma.com/api/mcp/asset/132fa3a8-f72d-4320-ae69-54b6a411740d";
const imgGroup3 = "https://www.figma.com/api/mcp/asset/8af6c385-73e9-466e-9e59-95f17bba9882";

type CurrentAmountInfoProps = {
  className?: string;
  property1?: "Default";
};

function CurrentAmountInfo({ className }: CurrentAmountInfoProps) {
  return (
    <div className={className || "h-[15px] relative w-[14px]"} data-node-id="281:912">
      <div className="absolute inset-[0_0_6.67%_0]" data-node-id="281:905">
        <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgEllipse51} />
      </div>
      <p className="absolute font-['SF Compact Rounded',sans-serif] font-semibold inset-[13.33%_35.71%_0_35.71%] leading-[normal] not-italic text-[#c5c5c5] text-[8px] text-center whitespace-nowrap" data-node-id="281:906">
        i
      </p>
    </div>
  );
}

type Component5Props = {
  className?: string;
  property1?: "Folded";
  onStreakChange?: (streak: number) => void;
};

const weekdayLabels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
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

function formatSelectedWrapLabel(value: string) {
  const [year, month, day] = value.split("-");
  if (!year || !month || !day) {
    return "Today's wrap";
  }

  return `${day}/${month}/${year}'s wrap`;
}

function addDays(date: Date, days: number) {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
}

function getWeekStart(date: Date) {
  const dayIndex = (date.getDay() + 6) % 7;
  return addDays(date, -dayIndex);
}

function isSameDate(left: Date, right: Date) {
  return left.getFullYear() === right.getFullYear() && left.getMonth() === right.getMonth() && left.getDate() === right.getDate();
}

function getMonthCalendarDays(date: Date) {
  const firstOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
  const start = getWeekStart(firstOfMonth);
  return Array.from({ length: 35 }, (_, index) => addDays(start, index));
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

type HomeCalendarProps = {
  isMonthOpen: boolean;
  onMonthOpenChange: (isMonthOpen: boolean) => void;
  selectedDate: string;
  onSelectDate: (value: string) => void;
  calendarDays: Map<string, CalendarDay>;
};

function HomeCalendar({ isMonthOpen, onMonthOpenChange, selectedDate, onSelectDate, calendarDays }: HomeCalendarProps) {
  const selectedDateValue = parseDateValue(selectedDate);
  const todayValue = new Date();
  const dateInputRef = useRef<HTMLInputElement>(null);
  const weekStart = getWeekStart(selectedDateValue);
  const weekDates = Array.from({ length: 7 }, (_, index) => addDays(weekStart, index));
  const monthDates = getMonthCalendarDays(selectedDateValue);
  const highlightColorForDay = (date: Date) => {
    if (isSameDate(date, todayValue)) {
      return "bg-[#02577A] text-white";
    }

    const dayStatus = calendarDays.get(formatDateValue(date))?.status ?? "noData";
    if (dayStatus === "noData") {
      return "bg-white text-black";
    }
    if (dayStatus === "overspendLevel2" || dayStatus === "overspendLevel3") {
      return "bg-[#f6b1b1] text-black";
    }
    if (dayStatus === "overspendLevel1") {
      return "bg-[#f5d37a] text-black";
    }
    return "bg-[#bceac8] text-black";
  };
  const selectedRing = (date: Date) => (isSameDate(date, selectedDateValue) ? " ring-2 ring-[#42a959]" : "");

  return (
    <div className={`absolute left-[14px] top-0 z-20 w-[333px] ${isMonthOpen ? "h-[370px]" : "h-[110px]"}`}>
      <button
        aria-label="Choose dashboard date"
        className="absolute left-1/2 top-0 flex h-6 -translate-x-1/2 items-center justify-center rounded-[30px] border border-[#f7f8fa] px-[18px] text-[13px] font-medium text-[#f7f8fa]"
        onClick={() => openNativeDatePicker(dateInputRef.current)}
        type="button"
      >
        {formatDateDisplay(selectedDateValue)}
      </button>
      <input
        aria-hidden
        className="absolute left-1/2 top-0 h-0 w-0 opacity-0"
        onChange={(event) => onSelectDate(event.target.value)}
        ref={dateInputRef}
        tabIndex={-1}
        type="date"
        value={selectedDate}
      />

      <div className="absolute left-0 top-[33px] grid w-[333px] grid-cols-7 text-center font-['Inter',sans-serif] text-[12px] text-white">
        {weekdayLabels.map((label) => (
          <p key={label}>{label}</p>
        ))}
      </div>

      {isMonthOpen ? (
        <div className="absolute left-[-14px] top-[61px] grid w-[361px] grid-cols-7 place-items-center gap-y-[16px] px-[10px] pb-[18px] pt-[8px]">
          {monthDates.map((date) => {
            const isCurrentMonth = date.getMonth() === selectedDateValue.getMonth();
            return (
              <button
                aria-label={`Select ${formatDateDisplay(date)}`}
                className={`flex size-[28px] items-center justify-center rounded-full font-['Inter',sans-serif] text-[12px] font-bold ${
                  isCurrentMonth ? highlightColorForDay(date) : "bg-transparent text-black"
                }${selectedRing(date)}`}
                key={formatDateValue(date)}
                onClick={() => onSelectDate(formatDateValue(date))}
                type="button"
              >
                {date.getDate()}
              </button>
            );
          })}
        </div>
      ) : (
        <div className="absolute left-0 top-[61px] grid w-[333px] grid-cols-7 place-items-center">
          {weekDates.map((date) => (
            <button
              aria-label={`Select ${formatDateDisplay(date)}`}
              className={`flex size-7 items-center justify-center rounded-full font-['Inter',sans-serif] text-[12px] font-bold ${highlightColorForDay(date)}${selectedRing(date)}`}
              key={formatDateValue(date)}
              onClick={() => onSelectDate(formatDateValue(date))}
              type="button"
            >
              {date.getDate()}
            </button>
          ))}
        </div>
      )}

      <button
        aria-label={isMonthOpen ? "Collapse month calendar" : "Expand month calendar"}
        className={`absolute left-1/2 flex h-5 w-10 -translate-x-1/2 items-center justify-center rounded-full transition-colors ${
          isMonthOpen ? "top-[307px] bg-white/80 text-[#174f84] shadow-[0_2px_8px_rgba(17,41,69,0.16)]" : "top-[94px] text-white/90"
        }`}
        onClick={() => onMonthOpenChange(!isMonthOpen)}
        type="button"
      >
        <ChevronDown className={`size-4 transition-transform ${isMonthOpen ? "rotate-180" : ""}`} strokeWidth={2.5} />
      </button>
    </div>
  );
}

function Component5({ className, onStreakChange }: Component5Props) {
  const [isCalendarExpanded, setIsCalendarExpanded] = useState(false);
  const [selectedDate, setSelectedDate] = useState(() => {
    const now = new Date();
    const yyyy = now.getFullYear();
    const mm = String(now.getMonth() + 1).padStart(2, '0');
    const dd = String(now.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  });
  const [homeData, setHomeData] = useState<HomeScreenData | null>(null);
  const [calendarDays, setCalendarDays] = useState<CalendarDay[]>([]);
  const calendarOffset = isCalendarExpanded ? 215 : 0;
  const month = `${selectedDate.slice(0, 7)}-01`;

  useEffect(() => {
    let isMounted = true;

    async function loadHomeState() {
      try {
        const ok = await bootstrapAuth();
        if (!ok || !isMounted) return;

        const [homeSummary, calendarMonth] = await Promise.all([
          getHomeScreenData(selectedDate, month),
          getCalendarMonth(month),
        ]);

        if (isMounted) {
          setHomeData(homeSummary);
          setCalendarDays(calendarMonth.days);
          if (onStreakChange) {
            onStreakChange(homeSummary.rewardSummary?.streak ?? 0);
          }
        }
      } catch (error) {
        console.error('[loadHomeState] Error:', error);
        if (isMounted) {
          setHomeData(null);
          setCalendarDays([]);
        }
      }
    }

    loadHomeState();

    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        loadHomeState();
      }
    };

    window.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      isMounted = false;
      window.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [month, selectedDate]);

  const recentsForView = (homeData?.recentTransactions ?? []).slice(0, 6).map((transaction) => {
    const isIncome = transaction.type === "income";
    const date = new Date(transaction.timestamp);
    const amountText = `${isIncome ? "+" : "-"}${transaction.amount.toLocaleString("vi-VN")}đ`;
    const timeText = Number.isNaN(date.getTime())
      ? transaction.date
      : `${date.getDate().toString().padStart(2, "0")}/${(date.getMonth() + 1).toString().padStart(2, "0")}, ${date.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })}`;

    let icon = imgBudgetFoodDrinks;
    if (transaction.category.toLowerCase().includes("experience")) {
      icon = imgBudgetExperience;
    } else if (isIncome) {
      icon = imgGroup20;
    }

    return {
      title: isIncome ? "Income" : transaction.category,
      time: timeText,
      amount: amountText,
      icon,
      income: isIncome,
    };
  });
  const todayFood = homeData?.todayFood;
  const foodBudgetLeft = todayFood ? todayFood.remainingAmount.toLocaleString("vi-VN") : "0";
  const spentToday = todayFood ? (todayFood.spentMain + todayFood.spentSub).toLocaleString("vi-VN") : "0";
  const avgPerDay = todayFood ? (todayFood.budgetMain + todayFood.budgetSub).toLocaleString("vi-VN") : "0";
  const overBudgetPct = todayFood && todayFood.overflowAmount > 0
    ? `${Math.round((todayFood.overflowAmount / Math.max(todayFood.budgetMain + todayFood.budgetSub, 1)) * 100)}%`
    : "0%";
  const todayWrapLabel = formatSelectedWrapLabel(selectedDate);
  const wrapStatusLabel = todayFood?.overflowAmount ? "Overspent" : todayFood ? "Good" : "No data";
  const mainMealsBudget = todayFood?.budgetMain.toLocaleString("vi-VN") ?? "0";
  const snackBudget = todayFood?.budgetSub.toLocaleString("vi-VN") ?? "0";
  const daysLeftInMonth = Math.max(0, 30 - parseDateValue(selectedDate).getDate());
  const rewardSummary = homeData?.rewardSummary;
  const weeklyRewardCurrent = rewardSummary?.weeklySavings ?? 0;
  const weeklyRewardGoal = rewardSummary?.weeklyMilestone ? Number.parseInt(rewardSummary.weeklyMilestone.replace(/\D/g, ""), 10) * 1000 : 100000;
  const weeklyRewardProgress = Math.min(165.341, weeklyRewardGoal > 0 ? (weeklyRewardCurrent / weeklyRewardGoal) * 165.341 : 0);
  const calendarDayMap = new Map(calendarDays.map((day) => [day.date, day]));
  const selectedCalendarDay = calendarDayMap.get(selectedDate);
  const dailyBudget = todayFood ? Math.max(todayFood.budgetAmount, 1) : 1;
  const dailySpent = todayFood ? todayFood.spentMain + todayFood.spentSub : 0;
  const dailySpentPercent = todayFood ? Math.min(100, Math.max(0, (dailySpent / dailyBudget) * 100)) : 0;
  const wrapStatusTone = selectedCalendarDay?.status === "overspendLevel1"
    ? { background: "#F5D37A", text: "#6B4E00" }
    : selectedCalendarDay?.status === "overspendLevel2" || selectedCalendarDay?.status === "overspendLevel3"
      ? { background: "#F6B1B1", text: "#B4232E" }
      : todayFood
        ? { background: "#BCEAC8", text: "#237A3B" }
        : { background: "#E6E6E6", text: "#546982" };

  return (
    <div className={className || "h-[669px] relative w-[380px]"} data-node-id="545:1586">
      <div
        className="absolute inset-0 transition-transform duration-200 ease-out"
        style={{ transform: `translateY(${calendarOffset}px)` }}
      >
      <p className="absolute left-[18px] top-[119px] w-[245px] text-left font-['SF Compact Rounded',sans-serif] text-[22px] font-bold leading-[26px] not-italic text-black" data-node-id="545:1016">
        {todayWrapLabel}
      </p>
      <p className="-translate-x-1/2 absolute font-['SF Compact Rounded',sans-serif] font-bold leading-[normal] left-[50px] not-italic text-[20px] text-black text-center top-[828px] whitespace-nowrap" data-node-id="545:1017">
        Recents
      </p>
      <div className="absolute contents left-px top-[160px]" data-node-id="545:1018">
        <div className="absolute contents left-px top-[160px]" data-node-id="545:1019">
          <div className="absolute bg-[#f7f8fa] h-[184px] left-px rounded-[20px] shadow-[0px_10px_30px_0px_rgba(0,0,20,0.08)] top-[160px] w-[363px]" data-node-id="545:1020" />
          <div className="absolute h-[39px] left-[12px] top-[181px] w-[43px]" data-node-id="545:1021" data-name="svg">
            <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgSvg} />
          </div>
          <p className="-translate-x-1/2 absolute font-['SF Compact Rounded',sans-serif] font-normal h-[15px] leading-[normal] left-[143px] not-italic text-[13px] text-black text-center top-[179px] w-[158px] whitespace-nowrap" data-node-id="545:1028">
            Food and Drinks budget left
          </p>
          <p className="absolute left-[68px] font-['SF Compact Rounded',sans-serif] font-bold h-[27px] leading-[normal] not-italic text-[28px] text-black text-left top-[198px] w-[150px] whitespace-nowrap" data-node-id="545:1029">
            {foodBudgetLeft}đ
          </p>
          <div className="absolute left-[68px] top-[236px] flex h-[22px] min-w-[74px] items-center justify-center rounded-full px-[10px]" data-node-id="545:1030" style={{ backgroundColor: wrapStatusTone.background }}>
          </div>
          <p className="absolute left-[68px] top-[239px] min-w-[74px] px-[10px] text-center font-['SF Compact Rounded',sans-serif] text-[10px] font-medium leading-[normal] whitespace-nowrap" data-node-id="545:1031" style={{ color: wrapStatusTone.text }}>
            {wrapStatusLabel}
          </p>
          <div className="absolute left-[252px] top-[178px] flex size-[82px] items-center justify-center rounded-full" data-node-id="545:1032" data-name="Daily spending progress" style={{ background: `conic-gradient(${wrapStatusTone.text} 0deg ${dailySpentPercent * 3.6}deg, #e3e6eb ${dailySpentPercent * 3.6}deg 360deg)` }}>
            <div className="flex size-[62px] items-center justify-center rounded-full bg-[#f7f8fa] text-center font-['SF Compact Rounded',sans-serif] text-[13px] font-bold leading-[15px]" style={{ color: wrapStatusTone.text }}>
              {Math.round(dailySpentPercent)}%
            </div>
          </div>
          <div className="absolute content-stretch flex font-['SF Compact Rounded',sans-serif] font-normal gap-[55px] h-[20px] items-center leading-[normal] left-[45px] not-italic text-[12px] text-black text-right top-[286px] w-[292px] whitespace-nowrap" data-node-id="545:1033">
            <p className="relative shrink-0" data-node-id="545:1034">
              Spent today
            </p>
            <p className="relative shrink-0" data-node-id="545:1035">
              Avg / day
            </p>
            <p className="relative shrink-0" data-node-id="545:1036">
              Over budget
            </p>
          </div>
          <p className="-translate-x-1/2 absolute font-['SF Compact Rounded',sans-serif] font-semibold leading-[normal] left-[77px] not-italic text-[16px] text-black text-center top-[309px] whitespace-nowrap" data-node-id="545:1037">
            {spentToday}đ
          </p>
          <p className="-translate-x-1/2 absolute font-['SF Compact Rounded',sans-serif] font-semibold leading-[normal] left-[187px] not-italic text-[16px] text-black text-center top-[309px] whitespace-nowrap" data-node-id="545:1038">
            {avgPerDay}đ
          </p>
          <p className="-translate-x-1/2 absolute font-['SF Compact Rounded',sans-serif] font-semibold leading-[normal] left-[312px] not-italic text-[16px] text-black text-center top-[309px] whitespace-nowrap" data-node-id="545:1039">
            {overBudgetPct}
          </p>
        </div>
        <div className="absolute contents left-px top-[355px]" data-node-id="545:1040">
          <div className={`absolute h-[145px] left-px rounded-[20px] shadow-[0px_10px_30px_0px_rgba(0,0,20,0.08)] top-[355px] w-[363px] ${todayFood ? "border border-[#42a959] border-dashed bg-[#f7f8fa]" : "bg-white border border-[#e6e6e6]"}`} data-node-id="545:1041" />
          <p className="-translate-x-1/2 absolute font-['SF_Compact_Rounded',sans-serif] font-semibold h-[15px] leading-[normal] left-[95.5px] not-italic text-[14px] text-black text-center top-[364px] w-[163px] whitespace-nowrap" data-node-id="545:1042">
            Daily distribution for food
          </p>
          <div className="absolute contents left-[8px] top-[411px]" data-node-id="545:1043">
            <div className="absolute bg-gradient-to-b from-[28.824%] from-[rgba(191,230,195,0.5)] h-[67px] left-[11px] rounded-[20px] shadow-[3px_3px_10px_0px_rgba(0,0,0,0.25)] to-[120.59%] to-[var(--bubble,rgba(245,247,251,0.5))] top-[414px] w-[165px]" data-node-id="545:1044" />
            <p className="-translate-x-1/2 absolute font-['SF_Compact_Rounded',sans-serif] font-bold h-[27px] leading-[0] left-[113.5px] not-italic text-[0px] text-black text-center top-[443px] w-[99px] whitespace-nowrap" data-node-id="545:1045">
              <span className="leading-[normal] text-[18px]">{mainMealsBudget}đ</span>
              <span className="leading-[normal] text-[20px]">{` `}</span>
              <span className="font-['SF_Compact_Rounded',sans-serif] font-normal leading-[normal] text-[12px]">/ day</span>
            </p>
            <p className="-translate-x-1/2 absolute font-['SF_Compact_Rounded',sans-serif] font-semibold leading-[normal] left-[95px] not-italic text-[12px] text-black text-center top-[426px] whitespace-nowrap" data-node-id="545:1046">
              Main meals
            </p>
            <div className="absolute h-[66px] left-[8px] top-[411px] w-[60px]" data-node-id="545:1047" data-name="svg">
              <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgSvg1} />
            </div>
          </div>
          <div className="absolute contents left-[187px] top-[414px]" data-node-id="545:1052">
            <div className="absolute bg-gradient-to-b from-[28.358%] from-[rgba(244,213,140,0.5)] h-[67px] left-[187px] rounded-[20px] shadow-[3px_3px_10px_0px_rgba(0,0,0,0.25)] to-[138.06%] to-[rgba(255,255,255,0.5)] top-[414px] w-[165px]" data-node-id="545:1053" />
            <p className="-translate-x-1/2 absolute font-['SF_Compact_Rounded',sans-serif] font-bold h-[27px] leading-[0] left-[292.5px] not-italic text-[0px] text-black text-center top-[443px] w-[99px] whitespace-nowrap" data-node-id="545:1054">
              <span className="leading-[normal] text-[18px]">{snackBudget}đ</span>
              <span className="leading-[normal] text-[20px]">{` `}</span>
              <span className="font-['SF_Compact_Rounded',sans-serif] font-normal leading-[normal] text-[12px]">/ day</span>
            </p>
            <div className="absolute h-[34px] left-[192px] top-[428px] w-[44px]" data-node-id="545:1055" data-name="svg">
              <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgSvg2} />
            </div>
            <p className="-translate-x-1/2 absolute font-['SF_Compact_Rounded',sans-serif] font-semibold leading-[normal] left-[262px] not-italic text-[12px] text-black text-center top-[426px] whitespace-nowrap" data-node-id="545:1064">
              Snacks
            </p>
          </div>
          <div className="absolute contents left-[196px] top-[366px]" data-node-id="545:1065">
            <div className="absolute left-[196px] size-[14px] top-[366px]" data-node-id="545:1066">
              <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgEllipse51} />
            </div>
            <p className="-translate-x-1/2 absolute font-['SF_Compact_Rounded',sans-serif] font-semibold h-[13px] leading-[normal] left-[203px] not-italic text-[#c5c5c5] text-[8px] text-center top-[368px] w-[4px] whitespace-nowrap" data-node-id="545:1067">
              i
            </p>
          </div>
          <p className="-translate-x-full absolute font-['SF_Compact_Rounded',sans-serif] font-normal leading-[normal] left-[127px] not-italic text-[12px] text-black text-right top-[388px] whitespace-nowrap" data-node-id="545:1068">
            {daysLeftInMonth} days left this month
          </p>
        </div>
      </div>
      <p className="-translate-x-1/2 absolute font-['SF_Compact_Rounded',sans-serif] font-normal leading-[normal] left-[332px] not-italic text-[12px] text-black text-center top-[828px] whitespace-nowrap" data-node-id="545:1069">
        See all
      </p>
      <div className="absolute h-[400px] left-[12px] overflow-x-clip overflow-y-auto pb-[70px] top-[867px] w-[330px]" data-node-id="545:1070">
        {recentsForView.length === 0 ? (
          <div className="flex min-h-[250px] flex-col items-center justify-center px-4 pt-6 text-center">
            <div className="relative mb-4 h-[120px] w-[170px]">
              <div className="absolute left-[10px] top-[14px] h-[70px] w-[98px] rounded-[12px] border-2 border-[#1f2430] bg-[#b9c7d8]" />
              <div className="absolute left-0 top-[26px] h-[90px] w-[116px] rounded-[14px] border-2 border-[#1f2430] bg-[#f2f2f3]" />
              <div className="absolute left-[100px] top-[52px] flex h-[64px] w-[54px] flex-col items-center justify-end gap-[2px]">
                {[0, 1, 2, 3, 4].map((coin) => (
                  <div key={coin} className="h-[11px] w-[52px] rounded-full border-2 border-[#1f2430] bg-[#b9c7d8]" />
                ))}
              </div>
              <p className="absolute right-[2px] top-0 font-['SF_Compact_Rounded',sans-serif] text-[54px] font-semibold leading-[1] text-[#b9c7d8]">?</p>
            </div>
            <p className="font-['SF_Compact_Rounded',sans-serif] text-[16px] font-semibold leading-[22px] text-[#283241]">
              Looks like you have no records for this day yet.
            </p>
          </div>
        ) : (
          <div className="flex flex-col" data-node-id="545:1071">
            {recentsForView.map((transaction, index, items) => (
              <div key={`${transaction.title}-${transaction.time}-${transaction.amount}-${index}`} className="grid grid-cols-[33px_1fr_auto] gap-x-[23px] py-[7px]">
                <img alt="" className="row-span-2 size-[33px] object-contain" src={transaction.icon} />
                <p className="font-['SF_Compact_Rounded',sans-serif] text-[12px] font-semibold leading-[14px] text-black">
                  {transaction.title}
                </p>
                <p className={`font-['SF_Compact_Rounded',sans-serif] text-[13px] font-semibold leading-[15px] ${transaction.income ? "text-[#2e9b56]" : "text-[#111]"}`}>
                  {transaction.amount}
                </p>
                <p className="font-['SF_Compact_Rounded',sans-serif] text-[10px] leading-[12px] text-[#546982]">
                  {transaction.time}
                </p>
                {index < items.length - 1 ? <div className="col-span-2 col-start-2 mt-[10px] h-px bg-[#e3e3e3]" /> : null}
              </div>
            ))}
          </div>
        )}
      </div>
      <div className="absolute contents left-px top-[513px]" data-node-id="545:1169">
        <div className="absolute bg-[#f7f8fa] h-[85px] left-px rounded-[20px] shadow-[3px_3px_10px_0px_rgba(0,0,0,0.25)] top-[513px] w-[177px]" data-node-id="545:1170" />
        <div className="absolute contents left-[45.51px] top-[532px]" data-node-id="545:1171">
          <p className="-translate-x-1/2 absolute font-['SF_Compact_Rounded',sans-serif] font-semibold leading-[normal] left-[91.09px] not-italic text-[12px] text-black text-center top-[532px] w-[91.15px] whitespace-nowrap" data-node-id="545:1172">
            Weekly rewards
          </p>
        </div>
        <div className="absolute contents left-[7.36px] top-[573px]" data-node-id="545:1173">
          <div className="absolute bg-[#d9d9d9] h-[10px] left-[7.36px] rounded-[30px] top-[573px] w-[165.341px]" data-node-id="545:1174" />
          <div className="absolute bg-[#89e692] h-[10px] left-[7.36px] rounded-[30px] top-[573px]" data-node-id="545:1175" style={{ width: `${weeklyRewardProgress}px` }} />
        </div>
        <div className="absolute h-[25px] left-[10.54px] top-[533px] w-[26.497px]" data-node-id="545:1176" data-name="Vector">
          <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgVector1} />
        </div>
        <p className="-translate-x-1/2 absolute font-[350.52398681640625] h-[14px] leading-[0] left-[81.55px] text-[0px] text-black text-center top-[548px] w-[74.192px] whitespace-nowrap" data-node-id="545:1177">
          <span className="font-['SF_Compact_Rounded',sans-serif] font-semibold leading-[normal] not-italic text-[15px]">{`${(weeklyRewardCurrent / 1000).toFixed(weeklyRewardCurrent >= 100000 ? 0 : 1).replace(".0", "")}K `}</span>
          <span className="font-['SF_Compact_Rounded',sans-serif] font-normal leading-[normal] not-italic text-[#546982] text-[15px]">/</span>
          <span className="leading-[normal] text-[15px]">{` `}</span>
          <span className="font-['SF_Compact_Rounded',sans-serif] font-normal leading-[normal] not-italic text-[#546982] text-[15px]">{`${Math.round(weeklyRewardGoal / 1000)}K`}</span>
        </p>
      </div>
      <div className="absolute contents left-[187px] top-[513px]" data-node-id="545:1178">
        <div className="absolute bg-[#f7f8fa] h-[85px] left-[187px] rounded-[20px] shadow-[3px_3px_10px_0px_rgba(0,0,0,0.25)] top-[513px] w-[177px]" data-node-id="545:1179" />
        <div className="absolute contents left-[235px] top-[532px]" data-node-id="545:1180">
          <p className="-translate-x-1/2 absolute font-['SF_Compact_Rounded',sans-serif] font-semibold leading-[normal] left-[277.5px] not-italic text-[12px] text-black text-center top-[532px] w-[85px] whitespace-nowrap" data-node-id="545:1181">
            Long-term goal
          </p>
        </div>
        <div className="absolute contents left-[193px] top-[573px]" data-node-id="545:1182">
          <div className="absolute bg-[#d9d9d9] h-[10px] left-[193.36px] rounded-[30px] top-[573px] w-[165.341px]" data-node-id="545:1183" />
          <div className="absolute bg-[#89e692] h-[10px] left-[193px] rounded-[30px] top-[573px] w-[33px]" data-node-id="545:1184" />
        </div>
        <p className="-translate-x-1/2 absolute font-[350.52398681640625] h-[14px] leading-[0] left-[264px] not-italic text-[0px] text-black text-center top-[549px] w-[62px] whitespace-nowrap" data-node-id="545:1185">
          <span className="font-['SF_Compact_Rounded',sans-serif] font-semibold leading-[normal] text-[15px]">{`2M `}</span>
          <span className="font-['SF_Compact_Rounded',sans-serif] font-normal leading-[normal] text-[#546982] text-[15px]">/</span>
          <span className="font-['SF_Compact_Rounded',sans-serif] font-normal leading-[normal] text-[15px]">{` `}</span>
          <span className="font-['SF_Compact_Rounded',sans-serif] font-normal leading-[normal] text-[#546982] text-[15px]">16M</span>
        </p>
        <div className="absolute h-[11px] left-[203.96px] top-[544px] w-[6.359px]" data-node-id="545:1186" data-name="Vector">
          <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgVector2} />
        </div>
        <div className="absolute h-[26px] left-[197.6px] top-[533px] w-[19.078px]" data-node-id="545:1187" data-name="Vector">
          <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgVector3} />
        </div>
      </div>
      <div className="absolute contents left-0 top-[615px]" data-node-id="545:1188">
        <div className="absolute bg-[#f7f8fa] h-[194px] left-0 rounded-[20px] shadow-[3px_3px_10px_0px_rgba(0,0,0,0.25)] top-[615px] w-[363px]" data-node-id="545:1189" />
        <div className="absolute contents left-[114px] not-italic text-[12px] text-black top-[631px]" data-node-id="545:1190">
          <p className="absolute font-['SF_Compact_Rounded',sans-serif] font-semibold leading-[14px] left-[114px] top-[631px] w-[218px] whitespace-normal" data-node-id="545:1191">
            Investment type: Installment savings deposit
          </p>
          <p className="absolute font-['SF_Compact_Rounded',sans-serif] font-medium leading-[0] left-[114px] top-[670px] w-[225px] whitespace-nowrap" data-node-id="545:1192">
            <span className="leading-[normal]">{`Terms: `}</span>
            <span className="leading-[normal] text-[#546982]">6 months</span>
          </p>
          <p className="absolute font-['SF_Compact_Rounded',sans-serif] font-medium leading-[0] left-[114px] top-[687px] w-[225px] whitespace-nowrap" data-node-id="545:1193">
            <span className="leading-[normal]">{`Interest: `}</span>
            <span className="leading-[normal] text-[#546982]">6.2%/year</span>
          </p>
          <p className="absolute font-['SF_Compact_Rounded',sans-serif] font-medium leading-[0] left-[114px] top-[703px] w-[233px] whitespace-nowrap" data-node-id="545:1194">
            <span className="leading-[normal]">{`Monthly deposit: `}</span>
            <span className="leading-[normal] text-[#546982]">250.000 VNĐ (5% savings)</span>
          </p>
        </div>
        <p className="-translate-x-1/2 absolute font-['SF_Compact_Rounded',sans-serif] font-semibold h-[17px] leading-[normal] left-[40.5px] not-italic text-[12px] text-black text-center top-[718px] w-[49px] whitespace-nowrap" data-node-id="545:1195">
          Progress
        </p>
        <div className="absolute h-[46px] left-[4px] top-[641px] w-[106px]" data-node-id="545:1196" data-name="image 6">
          <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgImage6} />
        </div>
        <div className="absolute contents left-[16px] top-[740px]" data-node-id="545:1197">
          <div className="absolute bg-[#d9d9d9] h-[10px] left-[16px] rounded-[30px] top-[740px] w-[333px]" data-node-id="545:1198" />
          <div className="absolute bg-[#89e692] h-[10px] left-[16px] rounded-[30px] top-[740px] w-[103px]" data-node-id="545:1199" />
        </div>
        <p className="absolute font-[350.52398681640625] h-[14px] leading-[0] left-[255px] not-italic text-[0px] text-black text-right top-[718px] w-[94px] whitespace-nowrap" data-node-id="545:1200">
          <span className="font-['SF_Compact_Rounded',sans-serif] font-semibold leading-[normal] text-[12px]">55 days</span>
          <span className="font-['SF_Compact_Rounded',sans-serif] font-normal leading-[normal] text-[#546982] text-[12px]">/</span>
          <span className="font-['SF_Compact_Rounded',sans-serif] font-normal leading-[normal] text-[12px]">{` `}</span>
          <span className="font-['SF_Compact_Rounded',sans-serif] font-normal leading-[normal] text-[#546982] text-[12px]">180 days</span>
        </p>
        <p className="-translate-x-1/2 absolute font-['SF_Compact_Rounded',sans-serif] font-semibold h-[17px] leading-[normal] left-[60px] not-italic text-[12px] text-black text-center top-[761px] w-[88px] whitespace-nowrap" data-node-id="545:1201">
          Current amount
        </p>
        <div className="absolute contents left-[16px] top-[783px]" data-node-id="545:1202">
          <div className="absolute bg-[#d9d9d9] h-[10px] left-[16px] rounded-[30px] top-[783px] w-[333px]" data-node-id="545:1203" />
          <div className="absolute bg-[#89e692] h-[10px] left-[16px] rounded-[30px] top-[783px] w-[94px]" data-node-id="545:1204" />
        </div>
        <p className="absolute font-[350.52398681640625] h-[14px] leading-[0] left-[272px] not-italic text-[0px] text-black text-right top-[761px] w-[77px] whitespace-nowrap" data-node-id="545:1205">
          <span className="font-['SF_Compact_Rounded',sans-serif] font-semibold leading-[normal] text-[12px]">755.7K</span>
          <span className="font-['SF_Compact_Rounded',sans-serif] font-normal leading-[normal] text-[#546982] text-[12px]">/</span>
          <span className="font-['SF_Compact_Rounded',sans-serif] font-normal leading-[normal] text-[12px]">{` `}</span>
          <span className="font-['SF_Compact_Rounded',sans-serif] font-normal leading-[normal] text-[#546982] text-[12px]">1750K</span>
        </p>
        <CurrentAmountInfo className="absolute h-[15px] left-[110px] top-[761px] w-[14px]" />
      </div>
      <a className="absolute block cursor-pointer h-[15px] left-[160px] top-[646px] w-[14px]" data-node-id="545:1207" data-name="Current amount info">
        <div className="absolute inset-[0_0_6.67%_0]" data-node-id="545:1208">
          <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgEllipse51} />
        </div>
        <p className="absolute font-['SF_Compact_Rounded',sans-serif] font-semibold inset-[13.33%_35.71%_0_35.71%] leading-[normal] not-italic text-[#c5c5c5] text-[8px] text-center whitespace-nowrap" data-node-id="545:1209">
          i
        </p>
      </a>
      </div>
      <HomeCalendar
        isMonthOpen={isCalendarExpanded}
        onMonthOpenChange={setIsCalendarExpanded}
        selectedDate={selectedDate}
        onSelectDate={setSelectedDate}
        calendarDays={calendarDayMap}
      />
    </div>
  );
}

export default function IPhone1415Pro1() {
  const [streak, setStreak] = useState(0);
  return (
    <div className="relative mx-auto min-h-[1540px] w-full max-w-[393px] overflow-x-hidden bg-[#f7f8fa] pb-[88px]" data-node-id="1:2121" data-name="iPhone 14 & 15 Pro - 1">
      <div className="absolute bg-gradient-to-b from-[#112945] h-[457px] left-0 to-[#f7f8fa] top-[-3px] via-[#4d78a8] via-[37.5%] w-[393px]" data-node-id="1:2122" />
      <Link href="/notifications" aria-label="Notifications" className="absolute left-[326px] top-[52px] z-20 size-[43px]">
        <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgEllipse42} />
        <Bell className="absolute left-[11px] top-[10px] size-[21px] text-white" strokeWidth={2.1} />
      </Link>
      <div className="absolute left-[153.94px] size-[0.064px] top-[78.67px]" data-node-id="1:2124">
        <div className="absolute inset-[-780.28%]">
          <img alt="" className="block max-w-none size-full" src={imgVector6} />
        </div>
      </div>
      <div className="absolute h-[0.041px] left-[159.1px] top-[78.54px] w-0" data-node-id="1:2125">
        <div className="absolute inset-[-1207.41%_-0.5px]">
          <img alt="" className="block max-w-none size-full" src={imgVector7} />
        </div>
      </div>
      <div className="absolute h-0 left-[148.54px] top-[89.5px] w-[0.041px]" data-node-id="1:2126">
        <div className="absolute inset-[-0.5px_-1207.41%]">
          <img alt="" className="block max-w-none size-full" src={imgVector8} />
        </div>
      </div>
      <div className="absolute h-0 left-[163.37px] top-[87.63px] w-[0.043px]" data-node-id="1:2127">
        <div className="absolute inset-[-0.5px_-1169.68%]">
          <img alt="" className="block max-w-none size-full" src={imgVector9} />
        </div>
      </div>
      <div className="absolute h-[0.047px] left-[91.22px] top-[120.33px] w-[0.144px]" data-node-id="1:2128">
        <div className="absolute inset-[-1069.71%_-346.67%]">
          <img alt="" className="block max-w-none size-full" src={imgVector10} />
        </div>
      </div>
      <div className="absolute h-0 left-[92.45px] top-[123.29px] w-[0.04px]" data-node-id="1:2129">
        <div className="absolute inset-[-0.5px_-1247.66%]">
          <img alt="" className="block max-w-none size-full" src={imgVector11} />
        </div>
      </div>
      <div className="absolute h-0 left-[87.15px] top-[119.95px] w-[0.043px]" data-node-id="1:2130">
        <div className="absolute inset-[-0.5px_-1169.68%]">
          <img alt="" className="block max-w-none size-full" src={imgVector9} />
        </div>
      </div>
      <div className="absolute h-0 left-[83.49px] top-[127.67px] w-[0.041px]" data-node-id="1:2131">
        <div className="absolute inset-[-0.5px_-1207.41%]">
          <img alt="" className="block max-w-none size-full" src={imgVector13} />
        </div>
      </div>
      <div className="absolute h-[0.212px] left-[256.13px] top-[79.63px] w-[0.106px]" data-node-id="1:2132">
        <div className="absolute inset-[-236.39%_-472.78%]">
          <img alt="" className="block max-w-none size-full" src={imgVector14} />
        </div>
      </div>
      <div className="absolute h-0 left-[262.98px] top-[79.38px] w-[0.096px]" data-node-id="1:2133">
        <div className="absolute inset-[-0.5px_-518.42%]">
          <img alt="" className="block max-w-none size-full" src={imgVector15} />
        </div>
      </div>
      <div className="absolute h-[0.088px] left-[313.77px] top-[95.47px] w-0" data-node-id="1:2134">
        <div className="absolute inset-[-565.59%_-0.5px]">
          <img alt="" className="block max-w-none size-full" src={imgVector16} />
        </div>
      </div>
      <div className="absolute h-[0.061px] left-[323.31px] top-[80.06px] w-[0.06px]" data-node-id="1:2135">
        <div className="absolute inset-[-815.87%_-828.05%]">
          <img alt="" className="block max-w-none size-full" src={imgVector17} />
        </div>
      </div>
      <div className="absolute left-[313.89px] size-[0.029px] top-[84.25px]" data-node-id="1:2136">
        <div className="absolute inset-[-1733.73%]">
          <img alt="" className="block max-w-none size-full" src={imgVector18} />
        </div>
      </div>
      <p className="absolute font-['SF_Compact_Rounded',sans-serif] font-bold leading-[normal] left-[25px] not-italic text-[35px] text-white top-[51px] whitespace-nowrap" data-node-id="1:2137">
        Zuno
      </p>
      <p className="absolute font-['SF_Compact_Rounded',sans-serif] font-semibold leading-[normal] left-[269px] not-italic text-[30px] text-white top-[55px] whitespace-nowrap" data-node-id="1:2138">
        {streak}
      </p>
      <div className="absolute h-0 left-[38px] top-[398px] w-[317.5px]" data-node-id="1:2140">
        <div className="absolute inset-[-0.5px_0]">
          <img alt="" className="block max-w-none size-full" src={imgVector19} />
        </div>
      </div>
      <div className="absolute inset-[70.77%_5.09%_29.23%_4.83%]" data-node-id="1:2141" data-name="X Axis">
        <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgXAxis} />
      </div>
      <div className="absolute h-[50px] left-[218px] overflow-clip top-[46px] w-[56px]" data-node-id="1:2312" data-name="FreeSample-Vectorizer-io-istockphoto-1323529010-612x612 1">
        <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgFreeSampleVectorizerIoIstockphoto1323529010612X6121} />
        <div className="absolute inset-[17.24%_26.35%_18.23%_26.36%]" data-node-id="1:2315" data-name="Group">
          <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgGroup} />
        </div>
        <div className="absolute inset-[33.42%_31.38%_19.94%_31.9%]" data-node-id="1:2317" data-name="Group">
          <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgGroup1} />
        </div>
        <div className="absolute inset-[50.92%_39.25%_18.14%_38.88%]" data-node-id="1:2319" data-name="Group">
          <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgGroup2} />
        </div>
        <div className="absolute inset-[66.27%_44%_18.15%_44.62%]" data-node-id="1:2321" data-name="Group">
          <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgGroup3} />
        </div>
      </div>
      <nav className="fixed bottom-0 left-1/2 z-50 flex h-[58px] w-full max-w-[393px] -translate-x-1/2 items-center justify-around bg-white px-[25px] shadow-[-2px_-2px_20px_0px_rgba(0,0,0,0.18)]" data-node-id="1:2323">
        <Link href="/" aria-label="Home" className="flex size-[38px] items-center justify-center rounded-full bg-[#edf4ff] text-[#174f84] shadow-[-1px_-1px_1px_rgba(0,0,0,0.25)] transition-colors hover:bg-[#edf4ff] hover:text-[#174f84]">
          <Home className="size-[22px]" strokeWidth={2.25} />
        </Link>
        <button aria-label="Analytics" className="flex size-[38px] items-center justify-center rounded-full text-[#546982] drop-shadow-[-1px_-1px_1px_rgba(0,0,0,0.25)] transition-colors hover:bg-[#edf4ff] hover:text-[#174f84]">
          <BarChart2 className="size-[27px]" strokeWidth={3} />
        </button>
        <Link href="/add-transaction" aria-label="Add" className="flex size-[47px] items-center justify-center rounded-full bg-[#174f84] text-white shadow-[0_4px_10px_rgba(17,41,69,0.25)]">
          <Plus className="size-[29px]" strokeWidth={2.75} />
        </Link>
        <Link href="/budgets" aria-label="Budget" className="flex size-[38px] items-center justify-center rounded-full text-[#546982] drop-shadow-[-1px_-1px_1px_rgba(0,0,0,0.25)] transition-colors hover:bg-[#edf4ff] hover:text-[#174f84]">
          <Wallet className="size-[27px]" strokeWidth={2.25} />
        </Link>
        <Link href="/login" aria-label="Profile" className="flex size-[38px] items-center justify-center rounded-full text-[#546982] drop-shadow-[-1px_-1px_1px_rgba(0,0,0,0.25)] transition-colors hover:bg-[#edf4ff] hover:text-[#174f84]">
          <User className="size-[26px]" strokeWidth={2.4} />
        </Link>
      </nav>
      <Component5 className="absolute h-[1310px] left-[13px] overflow-visible top-[121px] w-[380px]" onStreakChange={setStreak} />
    </div>
  );
}
