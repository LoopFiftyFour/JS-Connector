import chai, {
	assert,
	expect
} from "chai";
import common from "./common";

import getClient from "../src/client.js"

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
		
		it("Recieves and retains userID", function () {
			var id = "testUserId";
			var client = getClient(common.endpoint,id);
			expect(client.userId).to.equal(id);
		});
	});
}