import createEventsResponse from "./mocks/createEvents-response-ok";
import nock from "nock";
import chai, {
    assert,
    expect
} from "chai";
import common from "./common";

module.exports = function () {

    let client = Loop54.getClient(common.endpoint);

    //mock all calls to the /createEvents endpoint
    beforeEach(() => {
        nock(common.endpoint).post("/createEvents").reply(200, createEventsResponse);
    });
    
    var okFunc = function(response) {
        expect(response.status).to.equal(200);
    }
    
    //createEvent
    it("createEvent Returns 200 OK and a valid response, without callback", function () {
        return client.createEvent("click",{type:"test",id:"pest"}).then(okFunc);
    });
    
    it("createEvent Returns 200 OK and a valid response, with callback", function (done) {
        client.createEvent("click",{type:"test",id:"pest"},null,null,null, response => common.testCallBack(response,okFunc,done));
    });
    
    it("createEvent Returns 200 OK and a valid response, with callback as 3rd parameter", function (done) {
        client.createEvent("click",{type:"test",id:"pest"}, response => common.testCallBack(response,okFunc,done));
    });
    
    it("createEvent Returns 200 OK and a valid response, options, without callback", function () {
        return client.createEvent("click",{type:"test",id:"pest"}, {customData:{test:"pest"}}).then(okFunc);
    });
    
    it("createEvent Returns 200 OK and a valid response, options, with callback", function (done) {
        client.createEvent("click",{type:"test",id:"pest"},null,null,null, {customData:{test:"pest"}}, response => common.testCallBack(response,okFunc,done));
    });
    
    it("createEvent Returns 200 OK and a valid response, options as 3rd parameter, with callback", function (done) {
        client.createEvent("click",{type:"test",id:"pest"}, {customData:{test:"pest"}}, response => common.testCallBack(response,okFunc,done));
    });

    it("createEvent Returns error if it's missing all parameters", function () {
        return client.createEvent().catch(common.includesError);
    });
    
    it("createEvent Returns error for wrong typed event, without callback", function () {
        return client.createEvent([],{type:"test",id:"pest"}).catch(common.includesError);
    });
    
    it("createEvent Returns error for wrong typed event, with callback", function (done) {
        client.createEvent([],{type:"test",id:"pest"},null,null,null, response => common.testCallBack(response,common.includesError,done));
    });
    
    it("createEvent Returns error for wrong length event, without callback", function () {
        return client.createEvent("",{type:"test",id:"pest"}).catch(common.includesError);
    });
    
    it("createEvent Returns error for wrong length event, with callback", function (done) {
        client.createEvent("",{type:"test",id:"pest"},null,null,null, response => common.testCallBack(response,common.includesError,done));
    });
    
    it("createEvent Returns error for malformed entity, without callback", function () {
        return client.createEvent("click",{type:"test"}).catch(common.includesError);
    });
    
    it("createEvent Returns error for malformed entity, with callback", function (done) {
        client.createEvent("click",{id:"pest"},null,null,null, response => common.testCallBack(response,common.includesError,done));
    });
    
    //createEvents
    it("createEvents Returns 200 OK and a valid response, without callback", function () {
        return client.createEvents([{type:"click",entity:{type:"test",id:"pest"}},{type:"purchase",entity:{type:"test",id:"pest"}}]).then(okFunc);
    });
    
    it("createEvents Returns 200 OK and a valid response, with callback", function (done) {
        client.createEvents([{type:"click",entity:{type:"test",id:"pest"}},{type:"purchase",entity:{type:"test",id:"pest"}}], response => common.testCallBack(response,okFunc,done));
    });

    it("createEvents Returns 200 OK and a valid response, options, without callback", function () {
        return client.createEvents([{type:"click",entity:{type:"test",id:"pest"}},{type:"purchase",entity:{type:"test",id:"pest"}}], {customData:{test:"pest"}}).then(okFunc);
    });
    
    it("createEvents Returns 200 OK and a valid response, options, with callback", function (done) {
        client.createEvents([{type:"click",entity:{type:"test",id:"pest"}},{type:"purchase",entity:{type:"test",id:"pest"}}], {customData:{test:"pest"}}, response => common.testCallBack(response,okFunc,done));
    });

    it("createEvents Returns error if it's missing all parameters", function () {
        return client.createEvents().catch(common.includesError);
    });
    
    it("createEvents Returns error for an empty array", function () {
        return client.createEvents([]).catch(common.includesError);
    });
    
    it("createEvents Returns error for wrong type array", function () {
        return client.createEvents("boom").catch(common.includesError);
    });
    
    it("createEvents Returns error for wrong typed event, without callback", function () {
        return client.createEvents([{type:"click",entity:{type:"test",id:"pest"}},{type:[],entity:{type:"test",id:"pest"}}]).catch(common.includesError);
    });
    
    it("createEvents Returns error for wrong typed event, with callback", function (done) {
        client.createEvents([{type:"click",entity:{type:"test",id:"pest"}},{type:[],entity:{type:"test",id:"pest"}}], response => common.testCallBack(response,common.includesError,done));
    });
    
    it("createEvents Returns error for wrong length event, without callback", function () {
        return client.createEvents([{type:"click",entity:{type:"test",id:"pest"}},{type:"",entity:{type:"test",id:"pest"}}]).catch(common.includesError);
    });
    
    it("createEvents Returns error for wrong length event, with callback", function (done) {
        client.createEvents([{type:"click",entity:{type:"test",id:"pest"}},{type:"",entity:{type:"test",id:"pest"}}], response => common.testCallBack(response,common.includesError,done));
    });
    
    it("createEvents Returns error for malformed entity, without callback", function () {
        return client.createEvents([{type:"click",entity:{type:"test",id:"pest"}},{type:"click",entity:{id:"pest"}}]).catch(common.includesError);
    });
    
    it("createEvents Returns error for malformed entity, with callback", function (done) {
        client.createEvents([{type:"click",entity:{type:"test",id:"pest"}},{type:"click",entity:{id:"pest"}}], response => common.testCallBack(response,common.includesError,done));
    });
}
