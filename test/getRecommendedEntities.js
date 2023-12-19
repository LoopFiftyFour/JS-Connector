import getRecommendedEntities from "./mocks/generic-5-24-response-ok";
import nock from "nock";
import { expect } from "chai";
import common from "./common";

module.exports = function () {
    let client = Loop54.getClient(common.endpoint);

    //mock all calls to the /getRecommendedEntities endpoint
    beforeEach(() => {
        nock(common.endpoint).post("/getRecommendedEntities").reply(200, getRecommendedEntities);
    });

    var okFunc = function (response) {
        expect(response.status).to.equal(200);
        expect(response.data.results.count).to.equal(24);
    };

    it("Returns 200 OK and a valid response, without callback", function () {
        return client.getRecommendedEntities().then(okFunc);
    });

    it("Returns 200 OK and a valid response, with callback", function (done) {
        client.getRecommendedEntities((response) => common.testCallBack(response, okFunc, done));
    });

    it("Accepts options as second argument, without a callback", function () {
        return client.getRecommendedEntities({}).then(okFunc);
    });

    it("Accepts options as second argument, with a callback", function (done) {
        client.getRecommendedEntities({}, (response) => common.testCallBack(response, okFunc, done));
    });
};
