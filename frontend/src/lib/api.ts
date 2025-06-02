export interface AircraftStats {
  aircraft_type: string;
  avg_altitude_ft: number;
  avg_ground_speed_kts: number;
  data_points: string;
}

export interface AircraftStatsParams {
  limit?: number;
  minDataPoints?: number;
}

export async function getAircraftStats(params?: AircraftStatsParams): Promise<AircraftStats[]> {
  const queryParams = new URLSearchParams();
  if (params?.limit) queryParams.set('limit', params.limit.toString());
  if (params?.minDataPoints) queryParams.set('minDataPoints', params.minDataPoints.toString());

  const response = await fetch(
    `http://localhost:4000/consumption/getAircraftTypeStats?${queryParams.toString()}`
  );

  if (!response.ok) {
    throw new Error('Failed to fetch aircraft statistics');
  }

  return response.json();
} 