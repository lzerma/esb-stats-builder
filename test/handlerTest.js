'use strict';

const expect = require('chai').expect;
const mocker = require('simple-mock');

let underTest = require("../handler");

let lambdaContextSpy = {};
describe("Load Purchase test", () => {

    it("Should get the purchases for specific reference", (done) => {
        let simple = require('simple-mock');
        lambdaContextSpy.fail = simple.spy((e) => {
            done(e);
        });
        lambdaContextSpy.succeed = simple.spy((data) => {
            let succeedResult = lambdaContextSpy.succeed.calls[0].arg;
            expect(lambdaContextSpy.succeed.callCount).to.be.equal(1);
            expect(succeedResult.totalStations).to.be.equal(succeedResult.totalSaved);
            console.log(succeedResult);
            done();
        });

        underTest.handler(require("./event.json"), lambdaContextSpy);
    });
});