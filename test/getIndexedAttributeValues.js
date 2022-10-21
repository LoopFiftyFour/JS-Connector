import getIndexedAttributeValuesResponse from "./mocks/getIndexedAttributeValues-response-ok";
import nock from "nock";
import chai, {
    assert,
    expect
} from "chai";
import common from "./common";

module.exports = function () {

    let client = Loop54.getClient(common.endpoint, null, "TestApiKey");

    //mock all calls to the /search endpoint
    beforeEach(() => {
        nock(common.endpoint).post("/getIndexedAttributeValues").reply(200, getIndexedAttributeValuesResponse);
    });
    
    var okFunc = function(response) {
        expect(response.status).to.equal(200);
        expect(response.data.values.length).to.equal(6);
    }
    
    it("Returns 200 OK and a valid response, without callback", function () {
        return client.getIndexedAttributeValues("Category").then(okFunc);
    });
    
    it("Returns 200 OK and a valid response, with callback", function (done) {
        client.getIndexedAttributeValues("Category", response => common.testCallBack(response,okFunc,done));
    });

    it("Accepts options as second argument, without a callback", function () {
        return client.getIndexedAttributeValues("Category", {}).then(okFunc);
    });
    
    it("Accepts options as second argument, with a callback", function (done) {
        client.getIndexedAttributeValues("Category", {}, response => common.testCallBack(response,okFunc,done));
    });
    
    it("Returns error if it has too many arguments", function () {
        return client.getIndexedAttributeValues("Category", {}, "asdasd","asasd","g42om4").catch(common.includesError);
    });
}
