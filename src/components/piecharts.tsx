"use client";

import { TrendingUp } from "lucide-react";
import { Pie, PieChart } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

interface PortfolioItem {
  _id?: string;
  Comp_name?: string;
  units: number;
  buyPrice: number;
  purchaseDate: Date;
}

type Props = {
  portfolio: PortfolioItem[];
};

export function PortfolioPieChart({ portfolio }: Props) {
  // Aggregate units by company
  const unitsMap: Record<string, number> = {};
  portfolio.forEach((item) => {
    if (unitsMap[item._id || ""]) {
      unitsMap[item._id || ""] += item.units;
    } else {
      unitsMap[item._id || ""] = item.units;
    }
  });

  const sortedCompanies = Object.entries(unitsMap).sort((a, b) => b[1] - a[1]);

  const top4 = sortedCompanies.slice(0, 4);
  const others = sortedCompanies.slice(4);
  const otherUnits = others.reduce((sum, [, units]) => sum + units, 0);

  const chartData = [
    ...top4.map(([Comp_name, units], i) => ({
      browser: Comp_name,
      visitors: units,
      fill: `var(--chart-${i + 1})`,
    })),
    ...(otherUnits > 0
      ? [
          {
            browser: "Other",
            visitors: otherUnits,
            fill: "var(--chart-5)",
          },
        ]
      : []),
  ];

  const chartConfig: ChartConfig = {
    visitors: { label: "Units" },
    ...chartData.reduce((acc, item) => {
      acc[item.browser] = {
        label: item.browser,
        color: item.fill,
      };
      return acc;
    }, {} as ChartConfig),
  };

  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>Portfolio Distribution</CardTitle>
        <CardDescription>Top holdings by units</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="[&_.recharts-pie-label-text]:fill-foreground mx-auto aspect-square max-h-[250px] pb-0"
        >
          <PieChart>
            <ChartTooltip content={<ChartTooltipContent hideLabel />} />
            <Pie data={chartData} dataKey="visitors" label nameKey="browser" />
          </PieChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 leading-none font-medium">
          Based on units of your holdings
          <TrendingUp className="h-4 w-4" />
        </div>
      </CardFooter>
    </Card>
  );
}
