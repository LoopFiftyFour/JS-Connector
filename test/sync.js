import createEventsResponse from "./mocks/createEvents-response-ok";
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
		nock(common.endpoint).post("/sync").reply(200, createEventsResponse);
	});
	
	var syncOKFunc = function(response) {
		expect(response.status).to.equal(200);
	}
	
	it("Returns 200 OK and a valid response, without callback", function () {
		return client.sync().then(syncOKFunc);
	});
	
	it("Returns 200 OK and a valid response, with callback", function (done) {
		return client.sync(response => common.testCallBack(response,syncOKFunc,done));
	});

	it("Accepts options as argument, without a callback", function () {
		return client.sync({}).then(syncOKFunc);
	});
	
	it("Accepts options as argument, with a callback", function (done) {
		return client.sync({}, response => common.testCallBack(response,syncOKFunc,done));
	});
	
	it("Returns error if it has too many arguments", function () {
		return client.sync({},"asdasd","asasd","g42om4").catch(common.includesError);
	});
}