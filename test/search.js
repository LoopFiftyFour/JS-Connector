import searchResponse from "./mocks/search-response-ok";
import nock from "nock";
import { expect } from "chai";
import common from "./common";

module.exports = function () {

    let client = Loop54.getClient(common.endpoint);

    //mock all calls to the /search endpoint
    beforeEach(() => {
        nock(common.endpoint).post("/search").reply(200, searchResponse);
    });
    
    var searchOKFunc = function(response) {
        expect(response.status).to.equal(200);
        expect(response.data.results.count).to.equal(5);
    }
    
    it("Returns 200 OK and a valid response, without callback", function () {
        return client.search("meat").then(searchOKFunc);
    });
    
    it("Returns 200 OK and a valid response, with callback", function (done) {
        client.search("meat", response => common.testCallBack(response,searchOKFunc,done));
    });

    it("Accepts options as second argument, without a callback", function () {
        return client.search("meat", {}).then(searchOKFunc);
    });
    
    it("Accepts options as second argument, with a callback", function (done) {
        client.search("meat", {}, response => common.testCallBack(response,searchOKFunc,done));
    });
    
    it("Returns error if it has too few arguments", function () {
        return client.search().catch(common.includesError);
    });
    
    it("Returns error if it has too many arguments", function () {
        return client.search("meat",{},"asdasd","asasd","g42om4").catch(common.includesError);
    });
    
    it("Returns error if invalid search query, without callback", function () {
        return client.search("").catch(common.includesError);
    });
    
    it("Returns error if invalid search query, with callback", function (done) {
        client.search("",response => common.testCallBack(response,common.includesError,done));
    });

    describe("contentResultsOptions", function () {

        const contentResponse = {
            results: { count: 0, items: [], facets: [] },
            contentSearchResults: [
                { entityType: "Brand", results: { count: 1, items: [{ id: "b-1", type: "Brand" }], facets: [] } }
            ]
        };

        // Replaces the catch-all /search mock from beforeEach with one that only matches the given body
        function mockSearchWithBody(bodyMatcher, response) {
            nock.cleanAll();
            nock(common.endpoint).post("/search", bodyMatcher).reply(200, response);
        }

        // Fails the test if the promise resolves, passes it if it rejects with an error mentioning contentResultsOptions
        function expectValidationError(promise) {
            return promise.then(
                () => assert.fail("Expected a validation error"),
                response => {
                    common.includesError(response);
                    expect(response.data.error.title).to.include("contentResultsOptions");
                });
        }

        it("Sends contentResultsOptions and returns contentSearchResults", function () {
            mockSearchWithBody(body =>
                Array.isArray(body.contentResultsOptions)
                && body.contentResultsOptions.length === 2
                && body.contentResultsOptions[0].entityType === "Brand"
                && body.contentResultsOptions[0].take === 3
                && body.contentResultsOptions[1].entityType === "Article"
                && body.contentResultsOptions[1].skip === 5,
                contentResponse);

            return client.search("meat", {
                contentResultsOptions: [{ entityType: "Brand", take: 3 }, { entityType: "Article", skip: 5 }]
            }).then(response => {
                expect(response.status).to.equal(200);
                expect(response.data.contentSearchResults[0].entityType).to.equal("Brand");
                expect(response.data.contentSearchResults[0].results.items[0].id).to.equal("b-1");
            });
        });

        it("Does not send contentResultsOptions when not given", function () {
            mockSearchWithBody(body => !("contentResultsOptions" in body), searchResponse);
            return client.search("meat", {}).then(searchOKFunc);
        });

        it("Does not send contentResultsOptions when null", function () {
            mockSearchWithBody(body => !("contentResultsOptions" in body), searchResponse);
            return client.search("meat", { contentResultsOptions: null }).then(searchOKFunc);
        });

        it("Returns error if contentResultsOptions is not an array", function () {
            return expectValidationError(client.search("meat", { contentResultsOptions: { entityType: "Brand" } }));
        });

        it("Returns error if an entry has no entityType", function () {
            return expectValidationError(client.search("meat", { contentResultsOptions: [{ take: 3 }] }));
        });

        it("Returns error if an entry has an empty entityType", function () {
            return expectValidationError(client.search("meat", { contentResultsOptions: [{ entityType: "" }] }));
        });

        it("Returns error if an entry is null", function () {
            return expectValidationError(client.search("meat", { contentResultsOptions: [null] }));
        });
    });
}
