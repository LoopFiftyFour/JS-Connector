import getIndexedAttributesResponse from "./mocks/getIndexedAttributes-response-ok";
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
        nock(common.endpoint).post("/getIndexedAttributes").reply(200, getIndexedAttributesResponse);
    });
    
    var okFunc = function(response) {
        expect(response.status).to.equal(200);
		expect(response.data.attributes.length).to.equal(13);
		expect(response.data.indexedAttributes.length).to.equal(4);
    }
    
    it("Returns 200 OK and a valid response, without callback", function () {
        return client.getIndexedAttributes().then(okFunc);
    });
    
    it("Returns 200 OK and a valid response, with callback", function (done) {
        client.getIndexedAttributes(response => common.testCallBack(response,okFunc,done));
    });

    it("Accepts options as argument, without a callback", function () {
        return client.getIndexedAttributes({}).then(okFunc);
    });
    
    it("Accepts options as argument, with a callback", function (done) {
        client.getIndexedAttributes({}, response => common.testCallBack(response,okFunc,done));
    });
    
    it("Returns error if it has too many arguments", function () {
        return client.getIndexedAttributes({},"asdasd","asasd","g42om4").catch(common.includesError);
    });
}
