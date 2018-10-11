import searchResponse from "./mocks/search-response-ok";
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
		return client.search("meat", response => common.testCallBack(response,searchOKFunc,done));
	});

	it("Accepts options as second argument, without a callback", function () {
		return client.search("meat", {}).then(searchOKFunc);
	});
	
	it("Accepts options as second argument, with a callback", function () {
		return client.search("meat", {}, response => common.testCallBack(response,searchOKFunc,done));
	});
	
	var includesErrorFunc = function(response) {
		expect(response).to.include.keys("error");
	}

	it("Returns error if it has too few arguments", function () {
		return client.search().catch(includesErrorFunc);
	});
	
	it("Returns error if it has too many arguments", function () {
		return client.search("meat",{},"asdasd","asasd","g42om4").catch(includesErrorFunc);
	});
	
	it("Returns error if invalid search query, without callback", function () {
		return client.search("").catch(includesErrorFunc);
	});
	
	it("Returns error if invalid search query, with callback", function (done) {
		return client.search("",response => common.testCallBack(response,includesErrorFunc,done));
	});
}