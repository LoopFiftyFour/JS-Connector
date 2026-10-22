import suggestResponse from "./mocks/suggest-response-ok";
import nock from "nock";
import { expect } from "chai";
import common from "./common";

module.exports = function () {

    let client = Loop54.getClient(common.endpoint);

    //mock all calls to the /suggest endpoint
    beforeEach(() => {
        nock(common.endpoint).post("/suggest").reply(200, suggestResponse);
    });
    
    var okFunc = function(response) {
        expect(response.status).to.equal(200);
        expect(response.data.queries.count).to.equal(1);
    }
    
    it("Returns 200 OK and a valid response, without callback", function () {
        return client.suggest("leg").then(okFunc);
    });
    
    it("Returns 200 OK and a valid response, with callback", function (done) {
        client.suggest("leg", response => common.testCallBack(response,okFunc,done));
    });

    it("Accepts options as second argument, without a callback", function () {
        return client.suggest("leg", {}).then(okFunc);
    });
    
    it("Accepts options as second argument, with a callback", function (done) {
        client.suggest("leg", {}, response => common.testCallBack(response,okFunc,done));
    });

    it("Returns error if it has too few arguments", function () {
        return client.suggest().catch(common.includesError);
    });
    
    it("Returns error if it has too many arguments", function () {
        return client.suggest("leg",{},"asdasd","asasd","g42om4").catch(common.includesError);
    });
    
    it("Returns error if invalid search query, without callback", function () {
        return client.suggest("").catch(common.includesError);
    });
    
    it("Returns error if invalid search query, with callback", function (done) {
        client.suggest("",response => common.testCallBack(response,common.includesError,done));
    });
}
