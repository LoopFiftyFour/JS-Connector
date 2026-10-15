import chai, { expect } from "chai";
import sinon from "sinon";
import sinonChai from "sinon-chai";
import common from "./common";
import core from '../src/core';
import getClient from "../src/client.js"

chai.use(sinonChai);

module.exports = function () {

    describe(".getClient", function () {

        it("Returns a client with an endpoint", function () {
            var client = getClient(common.endpoint);
            expect(client.endpoint).to.equal(common.endpoint);
        });
        
        it("Throws an error for too few parameters", function () {
            expect(function(){getClient();}).to.throw();
        });
        
        it("Throws an error for too short endpoint", function () {
            expect(function(){getClient("");}).to.throw();
        });
        
        it("Throws an error for non-string endpoint", function () {
            expect(function(){getClient({foo: 123});}).to.throw();
        });
        
        it("Recieves and retains userID", function () {
            var id = "testUserId";
            var client = getClient(common.endpoint,id);
            expect(client.userId).to.equal(id);
        });

        it("Recieves and retains CustomHeaders", function () {
            var header = { customHeaderKey: "customHeaderValue" };
            var client = getClient(common.endpoint, null, null, header);
            expect(client.customHeaders).to.eql(header);
        });

        describe("Changing properties after creation", () => {
            let callStub;

            before(() => {
                callStub = sinon.stub(core, 'call');
            });

            after(() => {
                callStub.restore();
            });

            afterEach(() => {
                callStub.resetHistory();
            });

            it("Uses the values passed on creation", function () {
                const client = getClient(common.endpoint, "initialUserId", "initialApiKey", { foo: "bar" });
                client.search("meat");
                expect(callStub).calledOnceWith(sinon.match.any, sinon.match.any, sinon.match.any, sinon.match.any, sinon.match.any,
                                                "initialUserId", "initialApiKey", { foo: "bar" });
            });

            it("Uses userId, apiKey and customHeaders assigned after creation", function () {
                const client = getClient(common.endpoint, "initialUserId", "initialApiKey", { foo: "bar" });
                client.userId = "newUserId";
                client.apiKey = "newApiKey";
                client.customHeaders = { baz: "qux" };
                client.search("meat");
                expect(callStub).calledOnceWith(sinon.match.any, sinon.match.any, sinon.match.any, sinon.match.any, sinon.match.any,
                                                "newUserId", "newApiKey", { baz: "qux" });
            });

            it("Falls back to cookie tracking when userId is cleared", function () {
                const client = getClient(common.endpoint, "initialUserId");
                client.userId = null;
                client.search("meat");
                expect(callStub).calledOnceWith(sinon.match.any, sinon.match.any, sinon.match.any, sinon.match.any, sinon.match.any,
                                                null);
            });
        });

        describe("createEvents", () => {
            let client, callStub, errStub;

            before(() => {
                client = getClient(common.endpoint);
                callStub = sinon.stub(core, 'call');
                errStub = sinon.stub(core, 'returnError');
            });

            after(() => {
                callStub.restore();
                errStub.restore();
            })

            afterEach(() => {
                callStub.resetHistory();
                errStub.resetHistory();
            });

            it ("Checks for wrong events argument type", function() {
                client.createEvents(42);
                expect(errStub).calledOnceWith('Events must be a non-empty array');
            });

            it ("Checks for non-empty events array", function() {
                client.createEvents([]);
                expect(errStub).calledOnceWith('Events must be a non-empty array');
            });

            it ("Invokes core.call() when validation passes", function() {
                client.createEvents([{type: "click", entity: {type: "Product", id: 1}}]);
                expect(errStub).not.called;
                expect(callStub).calledOnce;
            });
        })
    });
}
