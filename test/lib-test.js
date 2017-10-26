import '../src/index.js'
import axios from 'axios'
import chai, {assert, expect} from 'chai'
import nock from 'nock'
import searchResponse from './mocks/search-response-ok'
import autocompleteResponse from './mocks/autocomplete-response-ok'
import relatedEntitiesResponse from './mocks/relatedEntities-response-ok'
import getEntitiesResponse from './mocks/getEntities-response-ok'

describe('Loop54', function() {
  describe('Config', function() {
    it('should have pre-set config options at init', function() {
      expect(Loop54.getConfig()).to.include({apiVersion: 'V26'})
    })
  })
  describe('.setConfig', function() {
    it('should return error if missing arguments', function() {
      expect(Loop54.setConfig()).to.include({type: 'ArgumentError'})
    })

    it('should be possible change config options', function() {
      Loop54.setConfig({ endpoint: 'https://api.test.com/' })
      expect(Loop54.getConfig().endpoint).to.equal('api.test.com')
    })
  })

  describe('.search', function() {
    let sandbox
    beforeEach(() => {
      Loop54.setConfig({ endpoint: 'test.loop54.se' })
      nock('https://test.loop54.se').post('/search').reply(200, searchResponse)
    })

    it('Returns a Promise when no callback is set', function() {
      Loop54.setConfig({ endpoint: 'test.loop54.se' })
      return Loop54.search('boll').then(response => {
        expect(response.status).to.equal(200)
        expect(response.data.results.count).to.equal(24)
      })
    })

    it('Accepts options as second argument without a callback', function() {
      Loop54.setConfig({ endpoint: 'test.loop54.se' })
      return Loop54.search('boll', {}).then(response => {
        expect(response.status).to.equal(200)
        expect(response.data.results.count).to.equal(24)
      })
    })

    it('Uses callback when given one', function(done) {
      Loop54.search('boll', function(response) {
        setTimeout(function() {
          expect(response.status).to.equal(200)
          expect(response.data.results.count).to.equal(24)
          done()
        }, 0)
      })
    })

    it('Returns error if arguments are wrongly formatted', function() {
      expect(Loop54.search('boll', [])).to.include.keys('error')
    })
  })

  describe('.autocomplete', function() {
    let sandbox
    beforeEach(() => {
      Loop54.setConfig({ endpoint: 'test.loop54.se' })
      nock('https://test.loop54.se').post('/autocomplete').reply(200, autocompleteResponse)
    })

    it('Returns a Promise when no callback is set', function() {
      Loop54.setConfig({ endpoint: 'test.loop54.se' })
      return Loop54.autocomplete('le').then(response => {
        expect(response.status).to.equal(200)
        expect(response.data.queries.count).to.equal(1)
      })
    })

    it('Accepts options as second argument without a callback', function() {
      Loop54.setConfig({ endpoint: 'test.loop54.se' })
      return Loop54.autocomplete('le', {}).then(response => {
        expect(response.status).to.equal(200)
        expect(response.data.queries.count).to.equal(1)
      })
    })

    it('Uses callback when given one', function(done) {
      Loop54.autocomplete('le', function(response) {
        setTimeout(function() {
          expect(response.status).to.equal(200)
          expect(response.data.queries.count).to.equal(1)
          done()
        }, 0)
      })
    })

    it('Returns error if arguments are wrongly formatted', function() {
      expect(Loop54.autocomplete('le', [])).to.include.keys('error')
    })
  })

  describe('.relatedEntities', function() {
    let sandbox
    beforeEach(() => {
      Loop54.setConfig({ endpoint: 'test.loop54.se' })
      nock('https://test.loop54.se').post('/getRelatedEntities').reply(200, relatedEntitiesResponse)
    })

    it('Returns a Promise when no callback is set', function() {
      Loop54.setConfig({ endpoint: 'test.loop54.se' })
      return Loop54.relatedEntities({type: "Product", id: "26707104"}).then(response => {
        expect(response.status).to.equal(200)
        expect(response.data.results.count).to.equal(15)
      })
    })

    it('Accepts options as second argument without a callback', function() {
      Loop54.setConfig({ endpoint: 'test.loop54.se' })
      return Loop54.relatedEntities({type: "Product", id: "26707104"}, {}).then(response => {
        expect(response.status).to.equal(200)
        expect(response.data.results.count).to.equal(15)
      })
    })

    it('Uses callback when given one', function(done) {
      Loop54.relatedEntities({type: "Product", id: "26707104"}, function(response) {
        setTimeout(function() {
          expect(response.status).to.equal(200)
          expect(response.data.results.count).to.equal(15)
          done()
        }, 0)
      })
    })

    it('Returns error if arguments are wrongly formatted', function() {
      expect(Loop54.relatedEntities({type: "Product", id: "26707104"}, [])).to.include.keys('error')
    })
  })

  describe('.getEntities', function() {
    let sandbox
    beforeEach(() => {
      Loop54.setConfig({ endpoint: 'test.loop54.se' })
      nock('https://test.loop54.se').post('/getEntities').reply(200, getEntitiesResponse)
    })

    it('Returns a Promise when no callback is set', function() {
      Loop54.setConfig({ endpoint: 'test.loop54.se' })
      return Loop54.getEntities({to: 10}).then(response => {
        expect(response.status).to.equal(200)
        expect(response.data.results.count).to.equal(1924)
      })
    })

    it('Accepts options as second argument without a callback', function() {
      Loop54.setConfig({ endpoint: 'test.loop54.se' })
      return Loop54.getEntities({to: 10}, {}).then(response => {
        expect(response.status).to.equal(200)
        expect(response.data.results.count).to.equal(1924)
      })
    })

    it('Uses callback when given one', function(done) {
      Loop54.getEntities({to: 10}, function(response) {
        setTimeout(function() {
          expect(response.status).to.equal(200)
          expect(response.data.results.count).to.equal(1924)
          done()
        }, 0)
      })
    })

    it('Returns error if arguments are wrongly formatted', function() {
      expect(Loop54.getEntities({to: 10}, [])).to.include.keys('error')
    })
  })

  describe('.trackEvent', function() {
    let sandbox
    beforeEach(() => {
      Loop54.setConfig({ endpoint: 'test.loop54.se' })
      nock('https://test.loop54.se').post('/createEvents').reply(204)
    })

    it('Returns error if arguments are wrongly formatted', function() {
      expect(Loop54.trackEvent()).to.include('eventType needs to be set')
    })
  })
})
