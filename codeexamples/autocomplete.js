 
function autoCompleteExample(client, query) {
	console.log("autocomplete-full:");
	
	// CODE SAMPLE autocomplete-full BEGIN
    // Below is an example of a request - response cycle of an autocomplete request
	var options = {};
	options.skip = 0;
	options.take = 9;
	var response = client.autoComplete(query, options); 
	response = response.then((r) => { 
										var queries = r.data["queries"].items.map(i => i.query);
										//print out all suggested autocomplete queries
										console.log("queries: " + queries.join());
									}
							);
	// CODE SAMPLE END
	return response.then((r)=>console.log("autocomplete-full (end)"))
};

function scopedAutoCompleteExample(client, query) {
	console.log("autocomplete-scoped:");
	
	// CODE SAMPLE autocomplete-scoped BEGIN
	// Below is an example of a request - response cycle of an autocomplete request
	// where scopes are used to provide the user with more context
	var options = {};
	options.skip = 0;
	options.take = 9;
	var response = client.autoComplete(query, options); 
	response = response.then((r) => { 
										var scopedQuery = r.data["scopedQuery"];
										//prints out the scoped suggestions
										if(scopedQuery)
										{
											console.log("scoped query: " + scopedQuery.query);
											console.log("scopes based on: " + scopedQuery.scopeAttributeName);
											console.log("scopes: " + scopedQuery.scopes.join());
										}
									}
							);
	// CODE SAMPLE END
	return response.then((r)=>console.log("autocomplete-scoped (end)"))
};