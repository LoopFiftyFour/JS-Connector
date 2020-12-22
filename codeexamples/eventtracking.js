// Multi Event Tracking Example
function createMultiEventsExample(client, productIds) {
    console.log("create-multi-events:");
    console.log(productIds);

    // CODE SAMPLE create-events BEGIN
    // click event (can be called on the product page)
    var clickedEntities = productIds.map(function (value, index, array) {
        return { type: "click", entity: { type: "Product", id: value } };
    });

    client.createEvents(clickedEntities, response => {
        console.log("click events response", response);
    });

    // addtocart event (call this when a customer adds a product to cart)
    var addToCartEntities = productIds.map(function (value, index, array) {
        return { type: "addtocart", entity: { type: "Product", id: value } };
    });
    client.createEvents(addToCartEntities, response => {
        console.log("add to cart response", response);
    });

    // purchase events (can be called when an order is processed, or on the "thank you" page)  
    // orderId is Optional but recommended
    // quantity is optional
    // revenue is optional
    var purchasedEntities = productIds.map(function (value, index, array) {
        return { type: "purchase", entity: { type: "Product", id: value }, orderId: "13t09j1g", quantity: 5, revenue: 249.0 };
    });

    //createEvent also works with promises
    var purchasePromise = client.createEvents(purchasedEntities).then(response => {
        console.log("purchase response", response);
    });
    // CODE SAMPLE END
    purchasePromise.then((r) => console.log("create-multi-events (end)"))

    // TODO : Add Custom Data Examples
};

// Single Event Tracking Example
function createSingleEventExample(client, productId) {
    console.log("create-sigle-event:");

    // CODE SAMPLE create-event BEGIN
    // click event (can be called on the product page)
    var clickedEntity = { type: "Product", id: productId };
    client.createEvent("click", clickedEntity, response => {
        console.log("click event response", response);
    });

    // addtocart event (call this when a customer adds a product to cart)
    var addToCartEntity = { type: "Product", id: productId };
    client.createEvent("addtocart", addToCartEntity, response => {
        console.log("add to cart response", response);
    });

    // purchase event (can be called when an order is processed, or on the "thank you" page)  
    var purchasedEntity = { type: "Product", id: productId };
    var orderId = "13t09j1g"; //Optional but recommended
    var quantity = 5; //Optional
    var revenue = 249.0; //Optional

    //createEvent also works with promises
    var purchasePromise = client.createEvent("purchase", purchasedEntity, orderId, quantity, revenue).then(response => {
        console.log("purchase response", response);
    });
    // CODE SAMPLE END
    purchasePromise.then((r) => console.log("create-single-event (end)"))


    // CODE SAMPLE create-event-customdata BEGIN
    var withCustomDataPromise = client.createEvent(
        "purchase",
        purchasedEntity,
        orderId,
        quantity,
        revenue,
        { customData: { someproperty: "somevalue" } }
    ).then(response => {
        console.log("purchase response with custom data", response);
    });
    // CODE SAMPLE END
    withCustomDataPromise.then((r) => console.log("create-event-customdata (end)"));


    // CODE SAMPLE create-event-custom-user-id BEGIN
    //create a client with a custom ID
    var clientWithCustomId = Loop54.getClient("http://helloworld.54proxy.com", "someCustomId");

    //use that client just like a normal client
    var clickedEntity = { type: "Product", id: productId };
    var customIdPromise = clientWithCustomId.createEvent("click", clickedEntity, response => {
        console.log("click event response with custom id", response);
    });
    // CODE SAMPLE END
    customIdPromise.then((r) => console.log("create-event-custom-user-id (end)"));
};
