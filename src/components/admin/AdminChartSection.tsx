
import React from "react";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip
} from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { useIsMobile } from "@/hooks/use-mobile";

interface ChartProps {
  title: string;
  data: any[];
  height?: number;
  showTabs?: boolean;
  showLegend?: boolean;
  legendItems?: Array<{
    color: string;
    label: string;
  }>;
  children?: React.ReactNode;
}

export const AdminChartSection = ({
  title,
  data,
  height = 300,
  showTabs = false,
  showLegend = false,
  legendItems = [],
  children
}: ChartProps) => {
  const isMobile = useIsMobile();
  
  return (
    <Card className="shadow-sm h-full">
      <div className="p-4 md:p-6 flex flex-col h-full">
        <div className="flex items-center justify-between mb-4 md:mb-6 flex-wrap gap-2">
          <h3 className="text-base md:text-lg font-semibold">{title}</h3>
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
            {showLegend && legendItems.map((item, index) => (
              <div key={index} className="flex items-center ml-0 md:ml-4">
                <div 
                  className="h-3 w-3 rounded-full mr-1"
                  style={{ backgroundColor: item.color }}
                ></div>
                <span className="text-xs text-gray-500">{item.label}</span>
              </div>
            ))}
            {showTabs && (
              <Tabs defaultValue="2024" className="ml-0 md:ml-6 mt-2 md:mt-0">
                <TabsList className="bg-gray-100">
                  <TabsTrigger value="2024" className="text-xs">2024</TabsTrigger>
                  <TabsTrigger value="2023" className="text-xs">2023</TabsTrigger>
                  <TabsTrigger value="2022" className="text-xs">2022</TabsTrigger>
                </TabsList>
              </Tabs>
            )}
          </div>
        </div>
        <div className="flex-grow" style={{ height: `${isMobile ? height * 0.8 : height}px`, minHeight: "200px" }}>
          {children}
        </div>
      </div>
    </Card>
  );
};

interface AreaChartProps {
  data: any[];
  dataKey?: string;
  color?: string;
  fillOpacity?: number;
  showAxis?: boolean;
}

export const AreaChartComponent = ({ 
  data, 
  dataKey = "revenue", 
  color = "#3b82f6",
  fillOpacity = 0.5,
  showAxis = true
}: AreaChartProps) => {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <ChartContainer config={{ [dataKey]: { color } }}>
        <AreaChart data={data}>
          <Area
            type="monotone"
            dataKey={dataKey}
            stroke={color}
            fill={`${color}${Math.floor(fillOpacity * 255).toString(16)}`}
            strokeWidth={2}
            dot={{ r: 0 }}
            activeDot={{ r: 6, strokeWidth: 2, stroke: "#fff" }}
          />
          {showAxis && (
            <>
              <XAxis dataKey="month" tickLine={false} axisLine={false} />
              <YAxis
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `$${value}`}
              />
              <CartesianGrid vertical={false} stroke="#f5f5f5" />
            </>
          )}
          {!showAxis && (
            <>
              <XAxis dataKey="month" hide />
              <YAxis hide />
            </>
          )}
          <ChartTooltip content={<ChartTooltipContent />} />
        </AreaChart>
      </ChartContainer>
    </ResponsiveContainer>
  );
};
