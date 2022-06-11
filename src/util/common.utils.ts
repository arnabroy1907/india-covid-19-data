import { StaticFileData } from "../types";

export const getNumFromString = (str?: string): number => {
    try {
        if (!str) return 0;
        return parseInt(str);
    } catch (err) {
        return 0;
    }
}

export const convertFileStringData = (fileStrData: string | null): StaticFileData | null => {
    if (!fileStrData) return null;

    const parsedData = JSON.parse(fileStrData);

    if (!parsedData) return null;

    if (!parsedData['fileSaveTime'] || !parsedData['covidData']) return null;

    if (!parsedData['covidData']['countryData'] ||
        !parsedData['covidData']['stateWideData'] ||
        !parsedData['covidData']['timeOfData']) return null;

    // @ts-ignore
    let staticData: StaticFileData = {};
    staticData['fileSaveTime'] = parsedData['fileSaveTime'];
    staticData['covidData'] = parsedData['covidData'];

    return staticData;
}