import axios from 'axios';
import config from './config';
import fs from 'fs';
import { CountryCovidData, CovidApiData, CovidData, MohApiData, StaticFileData } from './types';
import { convertFileStringData, getNumFromString } from './util/common.utils';

const apiUrl = config.dataApiUrl;
const apiTimeout = config.dataApiTimeOut;
const fileName = 'tmp/data.json';
const fileDataTTL = config.fileDataTTL;

const convertData = (mohData: MohApiData | null): CountryCovidData | null => {
    try {
        console.log('converting API data');
        if (!mohData) return null;

        let dataTime: number = new Date().getTime();
        if (mohData.headers['last-modified']) {
            dataTime = new Date(mohData.headers['last-modified'].toString()).getTime();
        }

        let stateData: CovidData[] = [];
        // @ts-ignore
        let countryData: CovidData = {};

        mohData.data.forEach((st: CovidApiData) => {
            const stateName = st.state_name;
            const stateCode = st.state_code;

            // active calculation
            const totalActive: number = getNumFromString(st.new_active);
            const prevActive: number = getNumFromString(st.active);
            const newActive: number = totalActive - prevActive;

            // positive calculation
            const totalPositive: number = getNumFromString(st.new_positive);
            const prevPositive: number = getNumFromString(st.positive);
            const newPositive: number = totalPositive - prevPositive;

            // cured calculation
            const totalCured: number = getNumFromString(st.new_cured);
            const prevCured: number = getNumFromString(st.cured);
            const newCured: number = totalCured - prevCured;

            // death calculation
            const totalDeath: number = getNumFromString(st.new_death);
            const prevDeath: number = getNumFromString(st.death);
            const deathReconsille: number = st.state_code === "00" ? 0 : getNumFromString(st.death_reconsille);
            const newDeath: number = totalDeath - prevDeath;

            const covidData: CovidData = {
                stateCode,
                stateName,
                total: {
                    active: totalActive,
                    positive: totalPositive,
                    cured: totalCured,
                    death: totalDeath
                },
                new: {
                    active: newActive,
                    positive: newPositive,
                    cured: newCured,
                    death: newDeath
                }
            }

            if (st.state_code === "00" || !st.state_name) {
                countryData = covidData;
            } else {
                stateData.push(covidData);
            }
        });

        return {
            timeOfData: dataTime,
            countryData: countryData,
            stateWideData: stateData
        }
    } catch (err) {
        console.error(`Covert Data Error`, err);
        return null;
    }
}

const getDataFromApi = async (): Promise<CountryCovidData | null> => {
    try {
        console.log('getting Covid data from API');
        const mohApiDataRes = await axios.get<CovidApiData[]>(apiUrl, {
            timeout: apiTimeout
        });
        const dataHeaders = mohApiDataRes.headers;
        const apiData = mohApiDataRes.data;
        const covidMohData: MohApiData = {
            data: apiData,
            headers: dataHeaders
        }
        const convertedData = convertData(covidMohData);
        return convertedData;
    } catch (err) {
        console.error(`Get Data From API Error`, err);
        return null;
    }
}

const getDataFromFile = async (): Promise<string | null> => {
    console.log('Getting covid data from file');
    return new Promise((res, _rej) => {
        try {
            fs.readFile(fileName, (err, data) => {
                if (err) {
                    console.error('Error reading file', err);
                    throw err;
                }
                if (data) {
                    res(data.toString());
                }
            });
        }
        catch (err) {
            console.error(`Get Data From File Error`, err);
            res(null);
        }
    });
}

const saveDataToFile = async (covidData: CountryCovidData): Promise<boolean> => {
    console.log('Saving covid data to file');
    return new Promise((res, _rej) => {
        try {
            const fileData: StaticFileData = {
                fileSaveTime: new Date().getTime(),
                covidData: covidData
            };
            const dataString = JSON.stringify(fileData);

            fs.writeFile(fileName, dataString, {}, (err) => {
                if (err) {
                    console.error('Error writing file', err);
                    throw err;
                }
                res(true);
            })
        } catch (err) {
            console.error(`Save Data to File Error`, err);
            res(false);
        }
    })
}

export const getCovidData = async (): Promise<CountryCovidData> => {
    try {
        console.log('Getting covid data started...');
        const fileData = await getDataFromFile();
        const parsedFileData = convertFileStringData(fileData);

        if (!parsedFileData) {
            const covidData = await getDataFromApi();
            if (!covidData) throw new Error('Failed to get covid data from API');
            saveDataToFile(covidData);
            return covidData;
        }

        const fileSaveTime = parsedFileData.fileSaveTime;
        const currentTime = new Date().getTime();
        if (currentTime - fileSaveTime < fileDataTTL) return parsedFileData.covidData;

        console.log('File Data TTL crossed');
        const covidData = await getDataFromApi();
        if (!covidData) return parsedFileData.covidData;

        saveDataToFile(covidData);
        return covidData;
    } catch (err) {
        console.error('Failed to get Covid Data', err);
        throw err;
    }
}