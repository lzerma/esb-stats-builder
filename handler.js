"use strict";
const stationsInfo = require("./StationsInfo");

function init(event, context) {

    let StationsInfo = new stationsInfo();
    StationsInfo.getAll().then((stationsGeneralInfo, error) => {
        if (error) throw new Error(error);

        return StationsInfo.getAllWithStatus().then((stationsAvailInfo, error) => {
            if (error) throw new Error(error);
            let promises = [];
            for (let i in stationsGeneralInfo) {
                let station = stationsGeneralInfo[i];
                station.available = stationsAvailInfo.find(x => x.stationId == station.stationId);
                promises.push(StationsInfo.saveStation(station));
            }
            return Promise.all(promises).then((savedStations, error) => {
                if (error) reject(error);
                context.succeed({totalStations: stationsGeneralInfo.length, totalSaved: savedStations.length});
            });
        });
    }).catch((e) => {
        context.fail(e);
    });
}

module.exports.handler = init;