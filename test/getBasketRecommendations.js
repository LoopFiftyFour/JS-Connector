import getBasketRecommendationsResponse from "./mocks/getBasketRecommendations-response-ok";
import nock from "nock";
import chai, {
    assert,
    expect
} from "chai";
import common from "./common";

module.exports = function () {

    let client = Loop54.getClient(common.endpoint);

    //mock all calls to the /getBasketRecommendations endpoint
    beforeEach(() => {
        nock(common.endpoint).post("/getBasketRecommendations").reply(200, getBasketRecommendationsResponse);
    });
    
    var okFunc = function(response) {
        expect(response.status).to.equal(200);
        expect(response.data.results.count).to.equal(15);
    }
    
    it("Returns 200 OK and a valid response, without callback", function () {
        return client.getBasketRecommendations([{type:"Product",id:"test"}]).then(okFunc);
    });

    it("Returns 200 OK and a valid response, with callback", function (done) {
        client.getBasketRecommendations([{type:"Product",id:"test"}],response => common.testCallBack(response,okFunc,done));
    });

    it("Accepts options as second argument, without a callback", function () {
        return client.getBasketRecommendations([{type:"Product",id:"test"}],{}).then(okFunc);
    });

    it("Accepts options as second argument, with a callback", function (done) {
        client.getBasketRecommendations([{type:"Product",id:"test"}],{}, response => common.testCallBack(response,okFunc,done));
    });

    it("Returns error if it has too few arguments", function () {
        return client.getBasketRecommendations().catch(common.includesError);
    });

    it("Returns error if it has too many arguments", function () {
        return client.getBasketRecommendations([{type:"Product",id:"test"}],{},"asdasd","asasd","g42om4").catch(common.includesError);
    });

    it("Returns error if not an array of entities, without callback", function () {
        return client.getBasketRecommendations("").catch(common.includesError);
    });

    it("Returns error if not an array of entities, with callback", function (done) {
        client.getBasketRecommendations("",response => common.testCallBack(response,common.includesError,done));
    });

    it("Returns error if invalid entity (missing type or id), without callback", function () {
        return client.getBasketRecommendations([{type:"Test"}]).catch(common.includesError);
    });

    it("Returns error if invalid entity (missing type or id), with callback", function (done) {
        client.getBasketRecommendations([{id:"Test"}],response => common.testCallBack(response,common.includesError,done));
    });

    it("Returns error if any item is an invalid entity (missing type or id), without callback", function () {
        return client.getBasketRecommendations([{type: "Product", id:"Test"}, {id: "No-type"}, {type: "Product", id:"Test2"}]).catch(common.includesError);
    });

    it("Returns error if any item is an invalid entity (missing type or id), with callback", function (done) {
        client.getBasketRecommendations([{type: "Product", id:"Test"}, {type: "Product"}, {type: "Product", id:"Test2"}],response => common.testCallBack(response,common.includesError,done));
    });
}
