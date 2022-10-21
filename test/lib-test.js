import "../src/loop54.js"

import loop54global from "./loop54global"
import loop54client from "./loop54client"
import search from "./search"
import autoComplete from "./autoComplete"
import getEntities from "./getEntities"
import getRelatedEntities from "./getRelatedEntities"
import getEntitiesByAttribute from "./getEntitiesByAttribute"
import getComplementaryEntities from "./getComplementaryEntities"
import getBasketRecommendations from "./getBasketRecommendations"
import createEvents from "./createEvents"
import sync from "./sync"
import getIndexedAttributes from "./getIndexedAttributes"
import cancellation from "./cancellation";
import core from "./core";

describe("Loop54", function () {
    
    describe("Loop54Global", loop54global);
    describe("Loop54Client", loop54client);
    
    describe("client.search", search);
    describe("client.autoComplete", autoComplete);
    describe("client.getEntities", getEntities);
    describe("client.getRelatedEntities", getRelatedEntities);
    describe("client.getComplementaryEntities", getComplementaryEntities);
    describe("client.getBasketRecommendations", getBasketRecommendations);
    describe("client.getEntitiesByAttribute", getEntitiesByAttribute);
    describe("client.createEvents", createEvents);
    describe("client.sync", sync);
    describe("client.getIndexedAttributes", getIndexedAttributes);

    describe("request.cancel", cancellation);

    describe("core", core);
});
