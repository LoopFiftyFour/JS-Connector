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
		nock(common.endpoint).post("/search").delay(100).reply(200, searchResponse);
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
	
	[true,false].forEach(function(doCancel){
		it("Cancellation (doCancel=" + doCancel + ") works, without callback", function () {
			
			var wasRun = false;
			
			var req = client.search("meat");
			
			var promiseToReturn = req
				.then(function(response){ if(!response.cancelled) wasRun=true; })
				.then(function() { expect(wasRun).to.equal(!doCancel); })
			
			if(doCancel)
				req.cancel();
			
			return promiseToReturn;
		});
	
	
		it("Cancellation (doCancel=" + doCancel + ") works, with callback", function (done) {
			
			var wasRun = false;
			
			var req = client.search("meat",function(response){ if(!response.cancelled) wasRun = true; });
			
			if(doCancel)
				req.cancel();
			
			setTimeout(function(){
				expect(wasRun).to.equal(!doCancel);
				done();
			},1000);
		});
	
	});
}