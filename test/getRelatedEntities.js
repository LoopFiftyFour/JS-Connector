import getRelatedEntitiesResponse from "./mocks/getRelatedEntities-response-ok";
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
		nock(common.endpoint).post("/getRelatedEntities").reply(200, getRelatedEntitiesResponse);
	});
	
	var okFunc = function(response) {
		expect(response.status).to.equal(200);
		expect(response.data.results.count).to.equal(15);
	}
	
	it("Returns 200 OK and a valid response, without callback", function () {
		return client.getRelatedEntities({type:"Product",id:"test"}).then(okFunc);
	});
	
	it("Returns 200 OK and a valid response, with callback", function (done) {
		return client.getRelatedEntities({type:"Product",id:"test"},response => common.testCallBack(response,okFunc,done));
	});

	it("Accepts options as second argument, without a callback", function () {
		return client.getRelatedEntities({type:"Product",id:"test"},{}).then(okFunc);
	});
	
	it("Accepts options as second argument, with a callback", function () {
		return client.getRelatedEntities({type:"Product",id:"test"},{}, response => common.testCallBack(response,okFunc,done));
	});
	
	var includesErrorFunc = function(response) {
		expect(response).to.include.keys("error");
	}
	
	it("Returns error if it has too few arguments", function () {
		return client.getRelatedEntities().catch(includesErrorFunc);
	});
	
	it("Returns error if it has too many arguments", function () {
		return client.getRelatedEntities({type:"Product",id:"test"},{},"asdasd","asasd","g42om4").catch(includesErrorFunc);
	});
	
	it("Returns error if invalid entity, without callback", function () {
		return client.getRelatedEntities("").catch(includesErrorFunc);
	});
	
	it("Returns error if invalid entity, with callback", function (done) {
		return client.getRelatedEntities("",response => common.testCallBack(response,includesErrorFunc,done));
	});
	
	it("Returns error if invalid entity, without callback", function () {
		return client.getRelatedEntities({type:"Test"}).catch(includesErrorFunc);
	});
	
	it("Returns error if invalid entity, with callback", function (done) {
		return client.getRelatedEntities({type:"Test"},response => common.testCallBack(response,includesErrorFunc,done));
	});
}