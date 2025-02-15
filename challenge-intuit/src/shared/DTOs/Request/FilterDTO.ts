import { SORTBY } from "../../enums/sortBy";

export interface FilterDTO {
    limit?: number;
    skip?: number;
    sortBy?: SORTBY;
    columnFilter?: string;
    searchValue?: string;
    includeInactive: boolean;
}
