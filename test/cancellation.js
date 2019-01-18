import searchResponse from "./mocks/search-response-ok";
import nock from "nock";
import { expect } from "chai";
import sinon from "sinon";
import common from "./common";

module.exports = function () {

	const client = Loop54.getClient(common.endpoint);
	let apiReplyCallback = null;

	const checkValidResponse = (response) => {
		// check for the `cancelled` response flag to not be set.
		expect(response.cancelled).to.be.undefined;
		// check for a 200 http response code.
		expect(response.status).to.equal(200);
		// check for the response body.
		expect(response.data).to.eql(searchResponse);
	}

	const checkCancelledResponse = (response) => {
		// check for the `cancelled` response body flag to be set.
		expect(response).to.eql({ cancelled: true });
	}

	const apiReply = (cb) => {
		// pass error, http response [code and body] back to nock interceptor.
		cb(null, [200, searchResponse]);
	};

	// mock all calls to the /search endpoint
	beforeEach(() => {
		// cleanup
		nock.cleanAll();

		// reset the `apiReplyCallback` handler.
		apiReplyCallback = null;

		// setup nock with response callback.
		nock(common.endpoint).post("/search").reply((uri, requestBody, cb) => {
			// trigger request cancel and api response via callback cb.
			apiReplyCallback(cb);
		});
	});

	it("Cancellation works when cancel() called on a request with callback", function (done) {
		// setup nock reply handler which also calls req.cancel()
		apiReplyCallback = (cb) => {
			req.cancel();
			apiReply(cb);
		}

		// setup a callback spy
		const callback = sinon.spy();

		// create a request
		const req = client.search("meat", callback);

		// check the response when finished.
		req.then(() => {
			// check if we have a cancelled response.
			checkCancelledResponse(callback.firstCall.lastArg);

			// signal async test is done.
			done();
		});
	});

	it("Cancellation works when cancel() called on a request without a callback", function (done) {
		// setup nock reply handler which also calls req.cancel()
		apiReplyCallback = (cb) => {
			req.cancel();
			apiReply(cb);
		}

		// create a request
		const req = client.search("meat");

		// check the response when finished.
		req.then((response) => {
			// check if we have a cancelled response.
			checkCancelledResponse(response);

			// signal async test is done.
			done();
		});
	});

	it("No cancellation when cancel() not called on a request with callback", function (done) {
		// setup a nock reply handler which does not call req.cancel().
		apiReplyCallback = apiReply;

		// setup a callback spy
		const callback = sinon.spy();

		// create a request
		const req = client.search("meat", callback);

		// check the response when finished.
		req.then(() => {
			// also check if the response is valid
			checkValidResponse(callback.firstCall.lastArg);

			// signal async test is done.
			done();
		});
	});

	it("No cancellation when cancel() not called on a request without a callback", function (done) {
		// setup a nock reply handler which does not call req.cancel().
		apiReplyCallback = apiReply;

		// trigger a request
		client.search("meat").then((response) => {
			// also check if the response is valid
			checkValidResponse(response);

			// signal async test is done.
			done();
		});
	});
}
