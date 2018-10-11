import "../src/loop54.js"
import axios from "axios"
import chai, {
	assert,
	expect
} from "chai"
import nock from "nock"
import search from "./search"
import loop54 from "./loop54"

import autocompleteResponse from "./mocks/autocomplete-response-ok"
import getRelatedEntitiesResponse from "./mocks/getRelatedEntities-response-ok"
import getEntitiesResponse from "./mocks/getEntities-response-ok"


describe("Loop54", function () {
	
	describe("Loop54", loop54);
	
	describe("client.search", search);
	
});
