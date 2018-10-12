import chai, {
	assert,
	expect
} from "chai";

module.exports = {
	
	endpoint: "http://test.loop54.se",

	testCallBack: function(response,testFunc,done){
		setTimeout(function () {
			testFunc(response);
			done();
		}, 0)
	},
	
	includesError: function(response) {
		expect(response.data.error).to.include.keys("title");
	}
}