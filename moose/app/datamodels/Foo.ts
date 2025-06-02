import { IngestPipeline } from "@514labs/moose-lib";

export interface foo {
    id: number ;
    name: string;
}

export const FooPipeline = new IngestPipeline<foo>("foo", {
    table: true,
    stream: true,
    ingest: true,
});