import getEntitiesByAttributeResponse from "./mocks/getEntitiesByAttribute-response-ok";
import nock from "nock";
import chai, {
    assert,
    expect
} from "chai";
import common from "./common";

module.exports = function () {

    let client = Loop54.getClient(common.endpoint);
    
    //mock all calls to the /getEntitiesByAttribute endpoint
    beforeEach(() => {
        nock(common.endpoint).post("/getEntitiesByAttribute").reply(200, getEntitiesByAttributeResponse);
    });
    
    var okFunc = function(response) {
        expect(response.status).to.equal(200);
        expect(response.data.results.count).to.equal(15);
    }
    
    it("Returns 200 OK and a valid response, without callback", function () {
        return client.getEntitiesByAttribute("title","test").then(okFunc);
    });
    
    it("Returns 200 OK and a valid response, with callback", function (done) {
        client.getEntitiesByAttribute("title","test",response => common.testCallBack(response,okFunc,done));
    });
    
    it("Returns 200 OK and a valid response, multiple values, without callback", function () {
        return client.getEntitiesByAttribute("title",["test", "west"]).then(okFunc);
    });
    
    it("Returns 200 OK and a valid response, multiple values, with callback", function (done) {
        client.getEntitiesByAttribute("title",["test", "west"],response => common.testCallBack(response,okFunc,done));
    });
    
    var alias = {
        name: "titleAlias",
        value: "valueAlias",
        details: "details"
    };
    
    it("Returns 200 OK and a valid response, with alias, without callback", function () {
        return client.getEntitiesByAttribute("title","test", {requestAlias:alias}).then(okFunc);
    });
    
    it("Returns 200 OK and a valid response, with alias, with callback", function (done) {
        client.getEntitiesByAttribute("title","test",{requestAlias:alias},response => common.testCallBack(response,okFunc,done));
    });

    it("Accepts options as third argument, without a callback", function () {
        return client.getEntitiesByAttribute("title","test",{}).then(okFunc);
    });
    
    it("Accepts options as third argument, with a callback", function (done) {
        client.getEntitiesByAttribute("title","test",{}, response => common.testCallBack(response,okFunc,done));
    });
    
    it("Returns error if it has too few arguments", function () {
        return client.getEntitiesByAttribute("title").catch(common.includesError);
    });
    
    it("Returns error if it has too many arguments", function () {
        return client.getEntitiesByAttribute("title","test",{},"asdasd","asasd","g42om4").catch(common.includesError);
    });
    
    it("Returns error if invalid attributeName, without callback", function () {
        return client.getEntitiesByAttribute([],"value").catch(common.includesError);
    });
    
    it("Returns error if invalid attributeName, with callback", function (done) {
        client.getEntitiesByAttribute([],"value",response => common.testCallBack(response,common.includesError,done));
    });
}
