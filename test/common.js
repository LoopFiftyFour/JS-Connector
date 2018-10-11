module.exports = {
	
	endpoint: "http://test.loop54.se",

	testCallBack: function(response,testFunc,done){
		setTimeout(function () {
			testFunc(response);
			done();
		}, 0)
	}
}