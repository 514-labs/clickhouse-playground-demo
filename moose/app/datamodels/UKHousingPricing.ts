import { IngestPipeline, Key, ClickHouseInt, ClickHouseDecimal, ClickHousePrecision, ClickHouseByteSize } from "@514labs/moose-lib";
import typia from "typia";

export enum Duration {
    "unknown" = 0,
    "freehold" = 1,
    "leasehold" = 2,
}

export enum Type2 {
    "other" = 0,
    "terraced" = 1,
    "semi-detached" = 2,
    "detached" = 3,
    "flat" = 4,
}


export interface uk_price_paid {
    price: number & ClickHouseInt<"uint32">;
    date: string & typia.tags.Format<"date"> & ClickHouseByteSize<2>;
    postcode1: Key<string>;
    postcode2: Key<string>;
    type: Type2;
    is_new: number & ClickHouseInt<"uint8">;
    duration: Duration;
    addr1: Key<string>;
    addr2: Key<string>;
    street: string;
    locality: string;
    town: string;
    district: string;
    county: string;
}


export const UkPricePaidPipeline = new IngestPipeline<uk_price_paid>("uk_price_paid", {
    table: true,
    stream: true,
    ingest: true,
});