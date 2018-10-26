 
function searchExample(client, query) {
	console.log("search-full:");
	
	// CODE SAMPLE search-full BEGIN
	// The search field
	// initialize "Search" request and set search query
	
	//specify number of response items
	var options = {};
	options.skip = 0;
	options.take = 10;
	var relatedResultsOptions = {}
	relatedResultsOptions.skip = 0;
	relatedResultsOptions.take = 9;
	options.relatedResultOptions = relatedResultsOptions;
	
	//fetch response from engine
	var response = client.search(query, options); 
	response = response.then((r) => {
										var data = r.data;
										// INJECT SAMPLE search-check-results BEGIN
										checkResults(data);
										// INJECT SAMPLE END
										
										//render direct results
										var results = data["results"].items;
										if (!results || results.length == 0)
										{
											console.log("There were no items matching your search.");
										}
										else
										{
											console.log("Total number of items: " + data["results"].count);
											for (var i in results)
											{
												var productId = results[i].id;
												var productTitle = results[i].attributes ? results[i].attributes.find(function(a){return a.name=="Title"}).values[0] : "";
												console.log(productId + " " + productTitle); //render a product on the search results page
											}
										}

										//render recommended results
										var relatedResults = data["relatedResults"].items;
										if (relatedResults && relatedResults.length > 0)
										{
											console.log("Maybe you also want these?");
											console.log("Total number of related results: " + data["relatedResults"].count);
											for (var i in relatedResults)
											{
												var productId = relatedResults[i].id;
												var productTitle = relatedResults[i].attributes ? relatedResults[i].attributes.find(function(a){return a.name=="Title"}).values[0] : "";
												console.log(productId + " " + productTitle); //render a product on the search results page
											}
										}
									}
							);
	// CODE SAMPLE END
	return response.then((r)=>console.log("search-full (end)"))
};

function searchCheckResultExample(client, query) {
	console.log("search-check-result:");
	
	// initialize "Search" request and set search query
	
	//specify number of response items
	var options = {};
	options.skip = 0;
	options.take = 10;
	var relatedResultsOptions = {}
	relatedResultsOptions.skip = 0;
	relatedResultsOptions.take = 9;
	options.relatedResultOptions = relatedResultsOptions;
	
	//fetch response from engine
	var response = client.search(query, options); 
	response = response.then((r) => {
										var data = r.data;
										checkResults(data);
									}
							);
	return response.then((r)=>console.log("search-check-result (end)"))
};

function checkResults(data)
{
	// CODE SAMPLE search-check-results BEGIN
	// Check the search results
	// if the result does not make sense, show error message
	// (note that there may still be results!)
	if (!data["makesSense"])
		console.log("We did not understand your query.");

	//render spelling suggestions
	if (data["spellingSuggestions"] && data["spellingSuggestions"].count > 0)
	{
		var queries = data["spellingSuggestions"].items.map(o => o.query);
		console.log("Did you mean: " + queries.join() + "?");
	}
	// CODE SAMPLE END
};



        