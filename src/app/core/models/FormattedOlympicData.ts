import { Olympic } from "./Olympic";


export interface FormattedOlympicData {
    countries: string[];
    medals: number[];
    olympics: Olympic[];
    countJOs: number;
    countCountries: number;
    years: number[] ;
}
