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

    describe("contentResultsOptions", function () {

        const contentResponse = {
            results: { count: 0, items: [], facets: [] },
            contentSearchResults: [
                { entityType: "Brand", results: { count: 1, items: [{ id: "b-1", type: "Brand" }], facets: [] } }
            ]
        };

        // Replaces the catch-all /search mock from beforeEach with one that only matches the given body
        function mockSuggestWithBody(bodyMatcher, response) {
            nock.cleanAll();
            nock(common.endpoint).post("/suggest", bodyMatcher).reply(200, response);
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
            mockSuggestWithBody(body =>
                    Array.isArray(body.contentResultsOptions)
                    && body.contentResultsOptions.length === 2
                    && body.contentResultsOptions[0].entityType === "Brand"
                    && body.contentResultsOptions[0].take === 3
                    && body.contentResultsOptions[1].entityType === "Article"
                    && body.contentResultsOptions[1].skip === 5,
                contentResponse);

            return client.suggest("meat", {
                contentResultsOptions: [{ entityType: "Brand", take: 3 }, { entityType: "Article", skip: 5 }]
            }).then(response => {
                expect(response.status).to.equal(200);
                expect(response.data.contentSearchResults[0].entityType).to.equal("Brand");
                expect(response.data.contentSearchResults[0].results.items[0].id).to.equal("b-1");
            });
        });

        it("Does not send contentResultsOptions when not given", function () {
            mockSuggestWithBody(body => !("contentResultsOptions" in body), suggestResponse);
            return client.suggest("meat", {}).then(okFunc);
        });

        it("Does not send contentResultsOptions when null", function () {
            mockSuggestWithBody(body => !("contentResultsOptions" in body), suggestResponse);
            return client.suggest("meat", { contentResultsOptions: null }).then(okFunc);
        });

        it("Returns error if contentResultsOptions is not an array", function () {
            return expectValidationError(client.suggest("meat", { contentResultsOptions: { entityType: "Brand" } }));
        });

        it("Returns error if an entry has no entityType", function () {
            return expectValidationError(client.suggest("meat", { contentResultsOptions: [{ take: 3 }] }));
        });

        it("Returns error if an entry has an empty entityType", function () {
            return expectValidationError(client.suggest("meat", { contentResultsOptions: [{ entityType: "" }] }));
        });

        it("Returns error if an entry is null", function () {
            return expectValidationError(client.suggest("meat", { contentResultsOptions: [null] }));
        });
    });
}
