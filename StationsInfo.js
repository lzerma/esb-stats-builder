"use strict";
const parser = require('xml2json');
const firebase = require("firebase");

// Initialize Firebase
// TODO: Replace with your project's customized code snippet
// Initialize Firebase
var config = {
    apiKey: "AIzaSyCqNxCAUowSWQvg_7ztQn3sqLefqApxRes",
    authDomain: "ebshackathon.firebaseapp.com",
    databaseURL: "https://ebshackathon.firebaseio.com",
    storageBucket: "ebshackathon.appspot.com",
    messagingSenderId: "880443146203"
};

firebase.initializeApp(config);
firebase.auth().signInWithEmailAndPassword("lzerma@gmail.com", "123456").catch(function (error) {
    var errorCode = error.code;
    var errorMessage = error.message;

    console.log("AUTH ERROR", error);
});

class StationsInfo {

    constructor() {
        this.db = firebase.database();
        this.ref = this.db.ref("/esb/");
    }

    saveStation(station) {
        return new Promise((resolve, reject) => {
            this.ref.child("historic-data/stations").push().set(station, (error) => {
                if (error) reject(error);
                resolve(station);
            });
        });
    }

    getAll() {
        let body = '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:ns="http://driivz.com/stationinfo/2016/05/"><soapenv:Header/><soapenv:Body>    <ns:getChargingStationInfoRequest>        <!--Zero or more repetitions:-->        <!--Optional:-->        <!--<timestamp>?</timestamp>--></ns:getChargingStationInfoRequest></soapenv:Body>\n</soapenv:Envelope>';
        return new Promise((resolve, reject) => {
            this.doRequest(body).then((data, error) => {
                try {
                    if (error) reject(error);
                    let json = JSON.parse(parser.toJson(data));
                    let stations = json["soap:Envelope"]["soap:Body"]["ns2:getChargingStationInfoResponse"]["chargingStationInfo"];
                    resolve(stations);
                }
                catch (e) {
                    reject(e);
                }
            });
        });
    }

    getAllWithStatus() {
        let body = '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:ns="http://driivz.com/stationinfo/2016/05/">\r\n   <soapenv:Header/>\r\n   <soapenv:Body>\r\n      <ns:getChargingStationStatusRequest>\r\n         <!--Zero or more repetitions:-->\r\n         <!--<stationId>C256J</stationId>-->\r\n         <!--Optional:-->\r\n         <!--<connectorId>?</connectorId>-->\r\n         <!--Optional:-->\r\n         <!--<timestamp>?</timestamp>-->\r\n      </ns:getChargingStationStatusRequest>\r\n   </soapenv:Body>\r\n</soapenv:Envelope>';
        return new Promise((resolve, reject) => {
            this.doRequest(body).then((data, error) => {
                try {
                    if (error) reject(error);
                    let json = JSON.parse(parser.toJson(data));
                    let stations = json["soap:Envelope"]["soap:Body"]["ns2:getChargingStationStatusResponse"]["connectorStatus"];
                    resolve(stations);
                }
                catch (e) {
                    reject(e);
                }
            });
        });
    }

    doRequest(body) {

        return new Promise((resolve, reject) => {

            let request = require("request");
            let options = {
                method: 'POST',
                url: 'https://ecars.esb.ie/externalIncoming/services/StationInfoService',
                headers: {
                    'content-type': 'application/xml',
                    authorization: 'Basic YmlnZW5lcmd5aGFjazU6UTJxQ2lkZ1Q='
                },
                body: body
            };

            try {
                request(options, function (error, response, body) {
                    // console.log("AEAEAE", error, response);
                    if (error) reject(error);
                    resolve(body);
                    // console.log(body);
                });
            }
            catch (e) {
                console.log(e);
            }
        });
    }
}

module.exports = StationsInfo;