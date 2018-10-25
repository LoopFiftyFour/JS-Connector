 
function createEventsExample(client, productId) {
	console.log("create-events:");
	
	// CODE SAMPLE create-events BEGIN
    // Code examples
	
	//click event (can be called on the product page)
	var clickedEntity = {type: "Product", id: productId};
	client.createEvent('click',clickedEntity,null,null,null,function(response){
			console.log("click event response", response);
		});
		
	//addtocart event (call this when a customer adds a product to cart)
	var addToCartEntity = {type: "Product", id: productId};
	client.createEvent('addtocart',addToCartEntity,null,null,null,function(response){
			console.log("add to cart response", response);
		});

	//purchase events (can be called when an order is processed, or on the "thank you" page)  
	var purchasedEntity = {type: "Product", id: productId};
	var orderId = "13t09j1g"; //Optional but recommended
	var quantity = 5; //Optional
	var revenue = 249.0; //Optional
		
	var response = client.createEvent('add',addToCartEntity,orderId,quantity,revenue,null);
	response = response.then((r) => {
										console.log("purchase response", r);
						});
	// CODE SAMPLE END
	return response.then((r)=>console.log("create-events (end)"))
};



      