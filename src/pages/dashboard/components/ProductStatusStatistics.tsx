"use client";

import React, { FC } from "react";
import { ChevronRight } from "lucide-react";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/shared/helpers/utils";

const ProductStatusStatistics: FC = () => {
  const [date, setDate] = React.useState<Date>(new Date());

  const statusCards = [
    {
      title: "In Stock",
      count: 475,
      className: "bg-[#F1FDF2]",
      link: { text: "View All", color: "text-green-500" },
      icon: (
        <div className="w-12 h-12 rounded-full bg-green-500 flex items-center justify-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M20 7h-9.5L9 4H4C2.9 4 2 4.9 2 6v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V9c0-1.1-.9-2-2-2z" />
          </svg>
        </div>
      ),
    },
    {
      title: "Expired/faulty",
      count: 193,
      className: "bg-[#EEF4FF]",
      link: { text: "View All", color: "text-blue-500" },
      icon: (
        <div className="w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
      ),
    },
    {
      title: "Out of Stock",
      count: 70,
      className: "bg-[#FEF2F2]",
      link: { text: "View All", color: "text-red-500" },
      icon: (
        <div className="w-12 h-12 rounded-full bg-red-500 flex items-center justify-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="10" />
            <path d="M15 9l-6 6m0-6l6 6" />
          </svg>
        </div>
      ),
    },
    {
      title: "Low Stock",
      count: 118,
      className: "bg-[#FFFBEB]",
      link: { text: "View All", color: "text-yellow-500" },
      icon: (
        <div className="w-12 h-12 rounded-full bg-yellow-500 flex items-center justify-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
          </svg>
        </div>
      ),
    },
  ];

  return (
    <div className="bg-white shadow rounded-lg p-4 col-span-1">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold">Product Status</h2>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "w-[180px] justify-start text-left font-normal",
                !date && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {date ? format(date, "MMM d, yyyy") : "Select date"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="end">
            <Calendar
              required
              mode="single"
              selected={date}
              onSelect={setDate}
            />
          </PopoverContent>
        </Popover>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {statusCards.map((card, index) => (
          <div
            key={index}
            className={`${card.className} p-6 rounded-2xl min-h-[140px]`}
          >
            <div className="flex flex-col h-full">
              <div className="flex items-center space-x-3 mb-6">
                {card.icon}
                <p className="text-gray-600 text-sm">{card.title}</p>
              </div>

              <div className="mt-auto flex justify-between items-center">
                <h4 className="text-lg font-semibold">{card.count}</h4>
                <a
                  href="#"
                  className={`${card.link.color} text-sm font-medium hover:underline flex items-center gap-1`}
                >
                  {card.link.text}
                  <ChevronRight className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductStatusStatistics;
