import { ConsumptionApi } from "@514labs/moose-lib";
import { UkPricePaidPipeline } from "../datamodels/UKHousingPricing";
import { ukAggregatedPricesView } from "../views/materializedRunningAverage";

// Define the query parameters
interface QueryParams {
  limit?: number;
}

// Model the query result type
interface UKPriceResult {
  district: string;
  avg_price: number;
  max_price: number;
}

const uk_aggregated_prices_table = ukAggregatedPricesView.targetTable;
const uk_aggregated_prices_column = uk_aggregated_prices_table.columns;
// Define the API
export const ukAggregatedPricesApi = new ConsumptionApi<QueryParams, UKPriceResult[]>(
  "uk_aggregated_prices",
  async ({ limit = 100 }: QueryParams, { client, sql }) => {
    
    // Query for a specific district
    const query = sql`
    SELECT 
        ${uk_aggregated_prices_column.district},
        ${uk_aggregated_prices_column.avg_price} as avg_price,
        ${uk_aggregated_prices_column.max_price} as max_price
    FROM ${uk_aggregated_prices_table}
    GROUP BY ${uk_aggregated_prices_column.district}
    LIMIT ${limit}
    `;

    const resultSet = await client.query.execute<UKPriceResult>(query);
    return await resultSet.json();
  }
); 