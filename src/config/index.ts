const appPort = process.env.PORT || 4000;
const fileDataTTL = 2 * 60 * 60 * 1000; // 2 hours

export default {
    port: appPort,
    fileDataTTL: fileDataTTL,
    dataApiUrl: 'https://www.mohfw.gov.in/data/datanew.json',
    dataApiTimeOut: 5000
}