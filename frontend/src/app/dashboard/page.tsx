'use client';

import { Suspense } from "react";
import { Plane, Ruler, Gauge } from "lucide-react";
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ScatterChart,
  Scatter,
  ZAxis
} from "recharts";

import { StatsCard } from "@/components/dashboard/stats-card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getAircraftStats } from "@/lib/api";
import { useEffect, useState } from "react";
import type { AircraftStats } from "@/lib/api";

// Custom tooltip component for better styling
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-4 border rounded-lg shadow-lg">
        <p className="font-semibold">{label}</p>
        {payload.map((entry: any, index: number) => (
          <p key={index} className="text-emerald-600">
            {entry.name}: {entry.value.toLocaleString()} {entry.unit || ''}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

function AircraftDashboard() {
  const [data, setData] = useState<AircraftStats[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const stats = await getAircraftStats({ limit: 10, minDataPoints: 100 });
        setData(stats);
      } catch (error) {
        console.error('Failed to fetch aircraft stats:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  // Calculate summary statistics
  const avgAltitude =
    data.reduce((sum, item) => sum + item.avg_altitude_ft, 0) / data.length;
  const avgSpeed =
    data.reduce((sum, item) => sum + item.avg_ground_speed_kts, 0) / data.length;
  const totalDataPoints = data.reduce(
    (sum, item) => sum + parseInt(item.data_points),
    0
  );

  // Prepare data for scatter plot
  const scatterData = data.map((item) => ({
    name: item.aircraft_type,
    altitude: item.avg_altitude_ft,
    speed: item.avg_ground_speed_kts,
    size: parseInt(item.data_points),
  }));

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Aircraft Statistics</h2>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <StatsCard
          title="Average Altitude"
          value={`${Math.round(avgAltitude).toLocaleString()} ft`}
          icon={<Plane className="h-4 w-4" />}
        />
        <StatsCard
          title="Average Speed"
          value={`${Math.round(avgSpeed)} kts`}
          icon={<Gauge className="h-4 w-4" />}
        />
        <StatsCard
          title="Total Data Points"
          value={totalDataPoints.toLocaleString()}
          icon={<Ruler className="h-4 w-4" />}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-lg border bg-card p-4">
          <h3 className="text-lg font-semibold mb-4">Average Altitudes by Aircraft Type</h3>
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={data}>
              <XAxis
                dataKey="aircraft_type"
                tickLine={false}
                fontSize={12}
                stroke="#64748b"
              />
              <YAxis
                tickFormatter={(value) => `${value.toLocaleString()} ft`}
                fontSize={12}
                stroke="#64748b"
              />
              <Tooltip content={<CustomTooltip />} />
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <Bar
                dataKey="avg_altitude_ft"
                fill="#10b981"
                radius={[4, 4, 0, 0]}
                name="Altitude"
                unit=" ft"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="rounded-lg border bg-card p-4">
          <h3 className="text-lg font-semibold mb-4">Altitude vs Speed Correlation</h3>
          <ResponsiveContainer width="100%" height={350}>
            <ScatterChart>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis
                dataKey="speed"
                name="Speed"
                unit=" kts"
                type="number"
                fontSize={12}
                stroke="#64748b"
              />
              <YAxis
                dataKey="altitude"
                name="Altitude"
                unit=" ft"
                type="number"
                fontSize={12}
                stroke="#64748b"
              />
              <ZAxis
                dataKey="size"
                range={[50, 400]}
                name="Data Points"
              />
              <Tooltip content={<CustomTooltip />} cursor={{ strokeDasharray: '3 3' }} />
              <Scatter
                name="Aircraft"
                data={scatterData}
                fill="#10b981"
                fillOpacity={0.6}
              />
            </ScatterChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Aircraft Type</TableHead>
              <TableHead className="text-right">Avg. Altitude</TableHead>
              <TableHead className="text-right">Avg. Speed</TableHead>
              <TableHead className="text-right">Data Points</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((item) => (
              <TableRow key={item.aircraft_type}>
                <TableCell className="font-medium">
                  {item.aircraft_type}
                </TableCell>
                <TableCell className="text-right">
                  {Math.round(item.avg_altitude_ft).toLocaleString()} ft
                </TableCell>
                <TableCell className="text-right">
                  {Math.round(item.avg_ground_speed_kts)} kts
                </TableCell>
                <TableCell className="text-right">
                  {parseInt(item.data_points).toLocaleString()}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  return <AircraftDashboard />;
} 