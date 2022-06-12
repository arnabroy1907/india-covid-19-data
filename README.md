# india-covid-19-data

A Node Server application.
This fetches India's Covid-19 related information from the website: <https://www.mohfw.gov.in>
The data can be fetched by making a `GET` call at the `/api/covid-data` of the service.

This is a **Node**, **Express** service built with **Typescript**.
The data received form the api is stored temporarily in the server as a temp JSON data file.
This file is updated after a TTL. After this TTL the Covid website's API will be called again and the file will be updated with new data.
Subsequent calls will send data from file and not call the Covid API, thus improving performance.

This service is currently hosted on Heroku at <https://india-covid19-data.herokuapp.com>
Try calling the <https://india-covid19-data.herokuapp.com/api/covid-data> API to fetch the covid data.

## Installation

> Pre-requisites: Node V >= 14.x.x and yarn V >= 1.17.x

* clone this repo in your local using `git clone`
* go to local directory
* run `yarn` to install all packages
* run `yarn build` to create a build from the .ts files
* run `yarn start` to start the server. This is now accessible at <http://localhost:4000>
* the covid data would be available at <http://localhost:4000/api/covid-data> with a `GET` call

## Heroku

Heroku is a cloud hosting platform to easily host servers.
For this app, the Heroku free-tier is used.

### Problems of free tier

* Free tier clud provides a dyno (server machine) that goes to sleep after 30 mins of inactivity.
* After the dyno goes to sleep, when a new request comes, it takes a while to boot up
* As a result of this, the API will occasionally show slowness when hit for the first time.
* However, subsequent calls will be quicker

## CI/CD

Heroku has inbuilt integration with Github
Whenever code is pushed to main branch, Heroku will automatically start a pipeline and deploy the new changes.
