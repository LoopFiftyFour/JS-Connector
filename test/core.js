import { expect } from "chai";
import core from '../src/core';
import common from './common';

module.exports = () => {
    describe('ensureProtocol', () => {
        it('Prepends the protocol, if missing', () => {
            const endpointWithoutProtocol = common.endpoint.replace(/^https?:\/\//, '');
            expect(core.ensureProtocol(endpointWithoutProtocol)).to.equal(common.endpoint);
        });

        it('Preserves the protocol, if present', () => {
            const endpointWithHttp = common.endpoint.replace(/^https?:\/\//, 'http://');
            expect(core.ensureProtocol(endpointWithHttp)).to.equal(endpointWithHttp);
        });

        it('Removes trailing slashes, if present', () => {
            const endpointWithSlash = `${common.endpoint}/`;
            const endpointWithSlashes = `${common.endpoint}/////`;
            expect(core.ensureProtocol(endpointWithSlash)).to.equal(common.endpoint);
            expect(core.ensureProtocol(endpointWithSlashes)).to.equal(common.endpoint);
        });

        it('Preserves the url, if no trailing slashes', () => {
            const endpointFoo = `${common.endpoint}/foo`;
            const endpointBar = `${common.endpoint}/////bar`;
            expect(core.ensureProtocol(endpointFoo)).to.equal(endpointFoo);
            expect(core.ensureProtocol(endpointBar)).to.equal(endpointBar);
        });

        it('Removes trailing slashes if present and prepends the protocol if missing', () => {
            const endpointWithHttpAndSlash = common.endpoint.replace(/^https?:\/\//, '') + '/';
            expect(core.ensureProtocol(endpointWithHttpAndSlash)).to.equal(common.endpoint);
        });
    });
    describe('validateEvent', () => {
        it ('Checks for proper validation messages.', () => {
            expect(core.validateEvent('test')).to.equal('event needs to be an object.');
            expect(core.validateEvent({})).to.equal('type needs to be set, standard events are "click", "addtocart" and "purchase".');
            expect(core.validateEvent({type: 1})).to.equal('type needs to be set, standard events are "click", "addtocart" and "purchase".');
            expect(core.validateEvent({type: ""})).to.equal('type needs to be set, standard events are "click", "addtocart" and "purchase".');
            expect(core.validateEvent({type: "click"})).to.equal('entity needs to be set.');
            expect(core.validateEvent({type: "click", entity: {}})).to.equal('entity needs to have a "type" set, usually this is "Product".');
            expect(core.validateEvent({type: "click", entity: {type: "Product"}})).to.equal('entity needs to have an "id" provided, this is usually the productId.');
            expect(core.validateEvent({type: "click", entity: {type: "Product", id: 1}})).to.be.null;
        })
    })
}
