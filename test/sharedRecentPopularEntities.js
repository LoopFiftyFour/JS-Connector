import nock from "nock";
import chai, { expect } from "chai";
import common from "./common";
import chaiAsPromised from "chai-as-promised";
import { spy, match } from "sinon";
import sinonChai from "sinon-chai";

export default (endpoint, functionName) => {
    chai.use(chaiAsPromised);
    chai.use(sinonChai);

    beforeEach(() => {
        // return the body so we can assert on it
        nock(common.endpoint)
            .post(endpoint)
            .reply(200, (_uri, body) => body);
    });

    const client = Loop54.getClient(common.endpoint);
    // arrow function to capture client
    const method = (...args) => client[functionName](...args);

    it("Check behaviorType required error", function () {
        return expect(method()).to.eventually.be.rejected.then((error) => {
            expect(error).to.be.deep.equal({
                data: { error: { title: "Expected at least 1 parameters." } },
            });
        });
    });

    // Sets of 3-tuples of name, parameters, and expected result
    const testCases = [
        [
            "behaviorType",
            ["click"],
            {
                behaviorType: "click",
                forUserId: null,
                entityType: null,
            },
        ],
        [
            "behaviorType and forUserId",
            ["click", "aghf"],
            {
                behaviorType: "click",
                forUserId: "aghf",
                entityType: null,
            },
        ],
        [
            "behaviorType, forUserId, and entityType",
            ["click", "aghf", ["product"]],
            {
                behaviorType: "click",
                forUserId: "aghf",
                entityType: ["product"],
            },
        ],
        [
            "behaviorType and entityType",
            ["click", null, ["product"]],
            {
                behaviorType: "click",
                forUserId: null,
                entityType: ["product"],
            },
        ],
        ,
        [
            "behaviorType and explicit nulls",
            ["click", null, null],
            {
                behaviorType: "click",
                forUserId: null,
                entityType: null,
            },
        ],
    ];

    testCases.forEach(([name, params, expected]) => {
        const resultsOptions = { take: 5 };

        async function withPromise(actual, expected) {
            const { data } = await expect(actual).to.eventually.be.fulfilled;
            expect(data).to.deep.equal(expected);
        }

        async function withCallback(actual, expected) {
            // The promise will resolve with a reference to the callback when it's called
            const onCallback = new Promise((resolve, _reject) => {
                const impl = spy(() => resolve(impl));
                actual(impl);
            });

            const cb = await expect(onCallback).to.eventually.be.fulfilled;
            expect(cb).have.been.calledOnceWith(match({ data: expected }));
        }

        it(`${name} as promise with options`, async function () {
            await withPromise(method(...params, resultsOptions), {
                ...expected,
                resultsOptions,
            });
        });

        it(`${name} as promise without options`, async function () {
            await withPromise(method(...params), {
                ...expected,
                resultsOptions: {},
            });
        });

        it(`${name} as callback with options`, async function () {
            await withCallback((cb) => method(...params, resultsOptions, cb), {
                ...expected,
                resultsOptions,
            });
        });

        it(`${name} as callback with options (callback before options)`, async function () {
            await withCallback((cb) => method(...params, cb, resultsOptions), {
                ...expected,
                resultsOptions,
            });
        });

        it(`${name} as callback without resultOptions`, async function () {
            await withCallback((cb) => method(...params, cb), {
                ...expected,
                resultsOptions: {},
            });
        });
    });
};
