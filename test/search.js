import searchResponse from "./mocks/search-response-ok";
import nock from "nock";
import chai, {
	assert,
	expect
} from "chai";
import sinon from "sinon";
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
	
	it("Check if cancel request is working", function (done) {
		// clear the previously nock setup,
		nock.cleanAll();
		// ... then setup nock to delay the response for 20ms, so we can cancel the request.
		nock(common.endpoint).post("/search").delay(20).reply(200, searchResponse);

		const callback = sinon.spy();
		const req = client.search("meat", callback);

		// cancel the request after 10ms.
		setTimeout(req.cancel, 10);

		// finally, check the result after 30ms, then finish the test.
		setTimeout(() => {
			// since the callback will be called anyway, we check if the `cancelled` response flag is set.
			expect(callback.firstCall.lastArg.cancelled).to.be.true;

			// signal async test is done.
			done();
		}, 30);
	});
}