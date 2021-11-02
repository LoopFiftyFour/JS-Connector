import getComplementaryEntitiesResponse from "./mocks/getComplementaryEntities-response-ok";
import nock from "nock";
import chai, {
    assert,
    expect
} from "chai";
import common from "./common";

module.exports = function () {

    let client = Loop54.getClient(common.endpoint);

    //mock all calls to the /getComplementaryEntities endpoint
    beforeEach(() => {
        nock(common.endpoint).post("/getComplementaryEntities").reply(200, getComplementaryEntitiesResponse);
    });
    
    var okFunc = function(response) {
        expect(response.status).to.equal(200);
        expect(response.data.results.count).to.equal(15);
    }
    
    it("Returns 200 OK and a valid response, without callback", function () {
        return client.getComplementaryEntities({type:"Product",id:"test"}).then(okFunc);
    });

    it("Returns 200 OK and a valid response, with callback", function (done) {
        client.getComplementaryEntities({type:"Product",id:"test"},response => common.testCallBack(response,okFunc,done));
    });

    it("Accepts options as second argument, without a callback", function () {
        return client.getComplementaryEntities({type:"Product",id:"test"},{}).then(okFunc);
    });

    it("Accepts options as second argument, with a callback", function (done) {
        client.getComplementaryEntities({type:"Product",id:"test"},{}, response => common.testCallBack(response,okFunc,done));
    });

    it("Returns error if it has too few arguments", function () {
        return client.getComplementaryEntities().catch(common.includesError);
    });

    it("Returns error if it has too many arguments", function () {
        return client.getComplementaryEntities({type:"Product",id:"test"},{},"asdasd","asasd","g42om4").catch(common.includesError);
    });

    it("Returns error if invalid entity, without callback", function () {
        return client.getComplementaryEntities("").catch(common.includesError);
    });

    it("Returns error if invalid entity, with callback", function (done) {
        client.getComplementaryEntities("",response => common.testCallBack(response,common.includesError,done));
    });

    it("Returns error if invalid entity, without callback", function () {
        return client.getComplementaryEntities({type:"Test"}).catch(common.includesError);
    });

    it("Returns error if invalid entity, with callback", function (done) {
        client.getComplementaryEntities({type:"Test"},response => common.testCallBack(response,common.includesError,done));
    });
    
    it("Accepts 'complementary' relation kind, without callback", function() {
        return client.getComplementaryEntities({type:"Product",id:"test"}, "complementary").then(okFunc);
    });

    it("Accepts 'complementary' relation kind, with callback", function (done) {
        client.getComplementaryEntities({type:"Product",id:"test"}, response => common.testCallBack(response,okFunc,done), "complementary");
    });

    it("Accepts options and relation kind, with a callback", function (done) {
        client.getComplementaryEntities({type:"Product",id:"test"},{}, "complementary", response => common.testCallBack(response,okFunc,done));
    });
}
