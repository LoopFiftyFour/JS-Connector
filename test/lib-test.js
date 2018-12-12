import "../src/loop54.js"
import loop54 from "./loop54"
import search from "./search"
import autoComplete from "./autoComplete"
import getEntities from "./getEntities"
import getRelatedEntities from "./getRelatedEntities"
import getEntitiesByAttribute from "./getEntitiesByAttribute"
import createEvents from "./createEvents"
import sync from "./sync"

describe("Loop54", function () {
	
	describe("Loop54", loop54);
	
	describe("client.search", search);
	describe("client.autoComplete", autoComplete);
	describe("client.getEntities", getEntities);
	describe("client.getRelatedEntities", getRelatedEntities);
	describe("client.getEntitiesByAttribute", getEntitiesByAttribute);
	describe("client.createEvents", createEvents);
	describe("client.sync", sync);
});
