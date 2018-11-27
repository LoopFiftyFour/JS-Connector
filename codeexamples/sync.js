function syncExample() {
	console.log("sync:");
	
	// CODE SAMPLE sync BEGIN
	var client = Loop54.getClient("http://helloworld.54proxy.com", null, "TestApiKey");
	var response = client.sync();
	// CODE SAMPLE END
	return response.then((r)=>console.log("sync (end)"))
};