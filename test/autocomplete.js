import autoCompleteResponse from "./mocks/autocomplete-response-ok";
import nock from "nock";
import chai, {
	assert,
	expect
} from "chai";
import common from "./common";

module.exports = function () {

	let client = Loop54.getClient(common.endpoint);

	//mock all calls to the /search endpoint
	beforeEach(() => {
		nock(common.endpoint).post("/autoComplete").reply(200, autoCompleteResponse);
	});
	
	var okFunc = function(response) {
		expect(response.status).to.equal(200);
		expect(response.data.queries.count).to.equal(1);
	}
	
	it("Returns 200 OK and a valid response, without callback", function () {
		return client.autoComplete("m").then(okFunc);
	});
	
	it("Returns 200 OK and a valid response, with callback", function (done) {
		return client.autoComplete("m", response => common.testCallBack(response,okFunc,done));
	});

	it("Accepts options as second argument, without a callback", function () {
		return client.autoComplete("m", {}).then(okFunc);
	});
	
	it("Accepts options as second argument, with a callback", function () {
		return client.autoComplete("m", {}, response => common.testCallBack(response,okFunc,done));
	});

	it("Returns error if it has too few arguments", function () {
		return client.autoComplete().catch(common.includesError);
	});
	
	it("Returns error if it has too many arguments", function () {
		return client.autoComplete("m",{},"asdasd","asasd","g42om4").catch(common.includesError);
	});
	
	it("Returns error if invalid search query, without callback", function () {
		return client.autoComplete("").catch(common.includesError);
	});
	
	it("Returns error if invalid search query, with callback", function (done) {
		return client.autoComplete("",response => common.testCallBack(response,common.includesError,done));
	});
}