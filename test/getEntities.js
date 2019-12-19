import getEntitiesResponse from "./mocks/getEntities-response-ok";
import nock from "nock";
import chai, {
    assert,
    expect
} from "chai";
import common from "./common";

module.exports = function () {

    let client = Loop54.getClient(common.endpoint);

    //mock all calls to the /getEntities endpoint
    beforeEach(() => {
        nock(common.endpoint).post("/getEntities").reply(200, getEntitiesResponse);
    });
    
    var okFunc = function(response) {
        expect(response.status).to.equal(200);
        expect(response.data.results.count).to.equal(1924);
    }
    
    it("Returns 200 OK and a valid response, without callback", function () {
        return client.getEntities().then(okFunc);
    });
    
    it("Returns 200 OK and a valid response, with callback", function (done) {
        client.getEntities(response => common.testCallBack(response,okFunc,done));
    });

    it("Accepts options as second argument, without a callback", function () {
        return client.getEntities({}).then(okFunc);
    });
    
    it("Accepts options as second argument, with a callback", function (done) {
        client.getEntities({}, response => common.testCallBack(response,okFunc,done));
    });
    
    it("Returns error if it has too many arguments", function () {
        return client.getEntities({},"asdasd","asasd","g42om4").catch(common.includesError);
    });
}
