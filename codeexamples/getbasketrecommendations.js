var client = Loop54.getClient("http://helloworld.54proxy.com");
// CODE SAMPLE get-basket-recommendations-full BEGIN
//specify number of response items
var options = {
    skip: 0,
    take:10
};

//fetch response from engine
var response = client
    .getBasketRecommendations([{type: "Product", id: "13"}], options)
    .then((response) => {
        var data = response.data;
        var results = data["results"].items;

        console.log("Total number of items: " + data["results"].count);
        
        for (var i in results)
        {
            var productId = results[i].id;
            var productTitle = results[i].attributes ? results[i].attributes.find(function(a){return a.name=="Title"}).values[0] : "";
            console.log(productId + " " + productTitle); //render a product on the search results page
        }
    }
);
// CODE SAMPLE END