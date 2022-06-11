import { AxiosResponseHeaders } from "axios";

export type CovidApiData = {
    sno: string;
    state_name: string;
    active: string;
    positive: string;
    cured: string;
    death: string;
    new_active: string;
    new_positive: string;
    new_cured: string;
    new_death: string;
    death_reconsille: string;
    total: string;
    state_code: string;
}

export type MohApiData = {
    data: CovidApiData[];
    headers: AxiosResponseHeaders;
}

export type CovidNumberStat = {
    active: number;
    positive: number;
    cured: number;
    death: number;
}

export type CovidData = {
    stateCode: string;
    stateName: string;
    total: CovidNumberStat;
    new: CovidNumberStat;
}

export type CountryCovidData = {
    stateWideData: CovidData[];
    countryData: CovidData;
    timeOfData: number;
}

export type StaticFileData = {
    fileSaveTime: number;
    covidData: CountryCovidData;
}