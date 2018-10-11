import chai, {
	assert,
	expect
} from "chai";
import common from "./common";

module.exports = function () {

	describe(".getClient", function () {

		it("Returns a client with an endpoint", function () {
			var client = Loop54.getClient(common.endpoint);
			expect(client.endpoint).to.equal(common.endpoint);
		});
		
		it("Throws an error for too few parameters", function () {
			expect(function(){Loop54.getClient();}).to.throw();
		});
		
		it("Throws an error for too short endpoint", function () {
			expect(function(){Loop54.getClient("");}).to.throw();
		});
	});
}