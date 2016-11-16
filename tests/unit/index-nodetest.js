/* jshint node: true */
/* jshint jasmine: true */
'use strict';
var assert = require('chai').assert;

var stubProject = {
  name: function(){
    return 'my-project';
  }
};

describe('base plugin', function() {
  var Subject, mockUi;

  beforeEach(function() {
    Subject = require('../../index');
    mockUi = {
      verbose: false,
      messages: [],
      write: function() {
      },
      writeLine: function(message) {
        this.messages.push(message);
      }
    };
  });

  it('has a name', function() {
    var plugin = new Subject({
      name: 'test-plugin',
    });

    assert.equal(plugin.name, 'test-plugin');
  });

  describe('log', function() {

    it('logs raw', function() {
      var plugin = new Subject({
        name: 'test-plugin',
        ui: mockUi
      });
      plugin.logRaw('foo');
      assert.deepEqual(mockUi.messages, ['foo']);
    });

    it('logs with default blue color', function() {
      var plugin = new Subject({
        name: 'test-plugin',
        ui: mockUi
      });
      plugin.log('foo');
      assert.deepEqual(mockUi.messages, ['\u001b[34m- foo\u001b[39m']);
    });

    it('logs verbose', function() {
      var verboseUi = {
        verbose: true,
        messages: [],
        write: function(message) {
          this.messages.push(message);
        },
        writeLine: function() {
        }
      };
      var plugin = new Subject({
        name: 'test-plugin',
        ui: verboseUi
      });
      plugin.log('foo', {verbose: true});
      assert.deepEqual(verboseUi.messages, ['\u001b[34m|    \u001b[39m']);
    });
  });

  describe('plugin helper', function() {
    it('provides access to the oringal default values', function() {
      var Plugin = Subject.extend({
        defaultConfig: {
          distFiles: ['index.html', 'assets/logo.png']
        }
      });

      var plugin = new Plugin({
        name: 'build'
      });

      var context = {
        config: {
          build: {
            distFiles: function(context, pluginHelper) {
              var arr = pluginHelper.readConfigDefault('distFiles');
              arr.push('index.json');
              return arr;
            }
          }
        }
      };

      plugin.beforeHook(context);
      assert.deepEqual(plugin.defaultConfig.distFiles, ['index.html', 'assets/logo.png']);
      assert.deepEqual(plugin.readConfig('distFiles'), ['index.html', 'assets/logo.png', 'index.json']);
    });
  });
});
