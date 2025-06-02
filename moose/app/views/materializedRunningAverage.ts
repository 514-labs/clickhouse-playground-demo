import { MaterializedView, ClickHouseEngines, sql, ClickHouseInt } from "@514labs/moose-lib";
import { UkPricePaidPipeline } from "../datamodels/UKHousingPricing";

import { Aggregated
} from "@514labs/moose-lib/dist/dmv2";


const uk_price_paid_table = UkPricePaidPipeline.table!;
const uk_price_paid_column = uk_price_paid_table.columns;

interface UKAggregatedPricesSchema {
  district: string;
  avg_price: number & Aggregated<"avg", [number & ClickHouseInt<"uint32">]>;
  max_price: number & Aggregated<"max", [number & ClickHouseInt<"uint32">]>;
}

const query = sql`
  SELECT 
    ${uk_price_paid_column.district},
    avgState(${uk_price_paid_column.price}) as avg_price,
    maxState(${uk_price_paid_column.price}) as max_price
  FROM ${uk_price_paid_table}
  GROUP BY ${uk_price_paid_column.district}
`;

export const ukAggregatedPricesView = new MaterializedView<UKAggregatedPricesSchema>({
  selectStatement: query,
  selectTables: [uk_price_paid_table],
  tableName: "uk_aggregated_prices",
  materializedViewName: "uk_aggregated_prices_view",
  engine: ClickHouseEngines.AggregatingMergeTree,
  orderByFields: ["district"],
});
