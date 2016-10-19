import lib from '../lib/index.js';
import {assert, expect} from 'chai';

describe('Lib', function() {
  describe('Config', function() {
    it('should have pre-set config options at init', function() {
      assert.isDefined(lib.config);
    });

    it('should be possible change config options', function() {
      lib.setConfig({ test: 14 });
      expect(lib.config.test).to.equal(14);
    });
  });

  describe('Base utilities', function() {
    it('should generate a random userId', function() {
      expect(lib.getRandomUserId()).to.not.equal(lib.getRandomUserId());
    });

    it('should provide a userId', function() {
      expect(lib.getUserId()).to.be.ok;
    });

    it('should provide engine URL', function() {
      var url = 'http://www.testing.com/api/';
      var questName = 'AutoComplete';
      lib.setConfig({
        url,
        questName
      });
      expect(lib.getEngineUrl({ QuestName: questName })).to.equal(url + questName);
    });
  });
});
