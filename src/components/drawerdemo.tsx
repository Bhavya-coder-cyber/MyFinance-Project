"use client";

import * as React from "react";
import { Minus, Plus } from "lucide-react";
import { Bar, BarChart, ResponsiveContainer } from "recharts";

import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";

const data = [
  { goal: 40 },
  { goal: 30 },
  { goal: 20 },
  { goal: 30 },
  { goal: 20 },
  { goal: 27 },
  { goal: 18 },
  { goal: 23 },
  { goal: 30 },
  { goal: 20 },
  { goal: 27 },
  { goal: 18 },
  { goal: 34 },
];

interface DrawerDemoProps {
  method: "Buy" | "Sell";
  className?: string;
  units: number;
  onSubmit: (units: number) => void;
}

export function DrawerDemo({
  method,
  className,
  units,
  onSubmit,
}: DrawerDemoProps) {
  const [goal, setGoal] = React.useState(0);

  function onClick(adjustment: number) {
    setGoal(Math.max(1, goal + adjustment));
  }

  function handleSubmit() {
    if (goal > 0) {
      onSubmit(goal);
      setGoal(1);
    }
  }

  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button className={className}>{method}</Button>
      </DrawerTrigger>
      <DrawerContent>
        <div className="mx-auto w-full max-w-sm">
          <DrawerHeader>
            <DrawerTitle>
              Enter the Number of Units you want to {method}
            </DrawerTitle>
            <DrawerDescription>
              {" "}
              {method === "Sell"
                ? `Total Units: ${units}`
                : `Set how many units to buy. [Max is ${units} at a time]`}
            </DrawerDescription>
          </DrawerHeader>
          <div className="p-4 pb-0">
            <div className="flex items-center justify-center space-x-2">
              <Button
                size="icon"
                className="h-8 w-8 shrink-0 rounded-full"
                onClick={() => onClick(-1)}
                disabled={goal <= 1}
              >
                <Minus />
                <span className="sr-only">Decrease</span>
              </Button>
              <div className="flex-1 text-center">
                <div className="text-7xl font-bold tracking-tighter">
                  {goal}
                </div>
                <div className="text-muted-foreground text-[0.70rem] uppercase">
                  Units
                </div>
              </div>
              <Button
                size="icon"
                className="h-8 w-8 shrink-0 rounded-full"
                onClick={() => onClick(1)}
                disabled={goal >= units}
              >
                <Plus />
                <span className="sr-only">Increase</span>
              </Button>
            </div>
            <div className="mt-3 h-[120px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data}>
                  <Bar
                    dataKey="goal"
                    style={
                      {
                        fill: "hsl(var(--foreground))",
                        opacity: 0.9,
                      } as React.CSSProperties
                    }
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
          <DrawerFooter>
            <Button onClick={handleSubmit}>{method}</Button>
            <DrawerClose asChild>
              <Button variant="outline">Cancel</Button>
            </DrawerClose>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
