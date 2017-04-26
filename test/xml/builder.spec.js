// Generated by CoffeeScript 1.12.3
(function() {
  var AWS, helpers, matchXML;

  helpers = require('../helpers');

  AWS = helpers.AWS;

  matchXML = helpers.matchXML;

  describe('AWS.XML.Builder', function() {
    var api, toXML, xmlns;
    xmlns = 'http://mockservice.com/xmlns';
    api = null;
    beforeEach(function() {
      return api = new AWS.Model.Api({
        metadata: {
          xmlNamespace: xmlns
        }
      });
    });
    toXML = function(rules, params) {
      var builder, shape;
      rules.type = 'structure';
      shape = AWS.Model.Shape.create(rules, {
        api: api
      });
      builder = new AWS.XML.Builder();
      return builder.toXML(params, shape, 'Data');
    };
    describe('toXML', function() {
      it('wraps simple structures with location of body', function() {
        var params, rules, xml;
        rules = {
          members: {
            Name: {},
            State: {}
          }
        };
        params = {
          Name: 'abc',
          State: 'Enabled'
        };
        xml = "<Data xmlns=\"" + xmlns + "\">\n  <Name>abc</Name>\n  <State>Enabled</State>\n</Data>";
        return matchXML(toXML(rules, params), xml);
      });
      it('ignores null input', function() {
        var params, rules, xml;
        rules = {
          members: {
            Name: {},
            State: {}
          }
        };
        params = {
          Name: null,
          State: void 0
        };
        xml = '';
        return matchXML(toXML(rules, params), xml);
      });
      it('ignores nested null input', function() {
        var params, rules, xml;
        rules = {
          members: {
            Struct: {
              type: 'structure',
              members: {
                State: {}
              }
            }
          }
        };
        params = {
          Struct: {
            State: null
          }
        };
        xml = "<Data xmlns=\"" + xmlns + "\">\n  <Struct/>\n</Data>";
        return matchXML(toXML(rules, params), xml);
      });
      it('orders xml members by the order they appear in the rules', function() {
        var params, rules, xml;
        rules = {
          xmlOrder: ['Count', 'State'],
          members: {
            Count: {
              type: 'integer'
            },
            State: {}
          }
        };
        params = {
          State: 'Disabled',
          Count: 123
        };
        xml = "<Data xmlns=\"" + xmlns + "\">\n  <Count>123</Count>\n  <State>Disabled</State>\n</Data>";
        return matchXML(toXML(rules, params), xml);
      });
      it('can serializes structures into XML', function() {
        var params, rules, xml;
        rules = {
          members: {
            Name: {},
            Details: {
              type: 'structure',
              members: {
                Abc: {},
                Xyz: {}
              }
            }
          }
        };
        params = {
          Details: {
            Xyz: 'xyz',
            Abc: 'abc'
          },
          Name: 'john'
        };
        xml = "<Data xmlns=\"" + xmlns + "\">\n  <Name>john</Name>\n  <Details>\n    <Abc>abc</Abc>\n    <Xyz>xyz</Xyz>\n  </Details>\n</Data>";
        return matchXML(toXML(rules, params), xml);
      });
      it('serializes empty structures as empty element', function() {
        var params, rules, xml;
        rules = {
          members: {
            Config: {
              type: 'structure',
              members: {
                Foo: {},
                Bar: {}
              }
            }
          }
        };
        params = {
          Config: {}
        };
        xml = "<Data xmlns=\"" + xmlns + "\">\n  <Config/>\n</Data>";
        return matchXML(toXML(rules, params), xml);
      });
      return it('does not serialize missing members', function() {
        var params, rules, xml;
        rules = {
          members: {
            Config: {
              type: 'structure',
              members: {
                Foo: {},
                Bar: {}
              }
            }
          }
        };
        params = {
          Config: {
            Foo: 'abc'
          }
        };
        xml = "<Data xmlns=\"" + xmlns + "\">\n  <Config>\n    <Foo>abc</Foo>\n  </Config>\n</Data>";
        return matchXML(toXML(rules, params), xml);
      });
    });
    describe('lists', function() {
      it('serializes lists (default member names)', function() {
        var params, rules, xml;
        rules = {
          members: {
            Aliases: {
              type: 'list',
              member: {}
            }
          }
        };
        params = {
          Aliases: ['abc', 'mno', 'xyz']
        };
        xml = "<Data xmlns=\"" + xmlns + "\">\n  <Aliases>\n    <member>abc</member>\n    <member>mno</member>\n    <member>xyz</member>\n  </Aliases>\n</Data>";
        return matchXML(toXML(rules, params), xml);
      });
      it('serializes lists (custom member names)', function() {
        var params, rules, xml;
        rules = {
          members: {
            Aliases: {
              type: 'list',
              member: {
                locationName: 'Alias'
              }
            }
          }
        };
        params = {
          Aliases: ['abc', 'mno', 'xyz']
        };
        xml = "<Data xmlns=\"" + xmlns + "\">\n  <Aliases>\n    <Alias>abc</Alias>\n    <Alias>mno</Alias>\n    <Alias>xyz</Alias>\n  </Aliases>\n</Data>";
        return matchXML(toXML(rules, params), xml);
      });
      it('includes lists elements even if they have no members', function() {
        var params, rules, xml;
        rules = {
          members: {
            Aliases: {
              type: 'list',
              member: {
                locationName: 'Alias'
              }
            }
          }
        };
        params = {
          Aliases: []
        };
        xml = "<Data xmlns=\"" + xmlns + "\">\n  <Aliases/>\n</Data>";
        return matchXML(toXML(rules, params), xml);
      });
      return it('serializes lists of structures', function() {
        var params, rules, xml;
        rules = {
          members: {
            Points: {
              type: 'list',
              member: {
                type: 'structure',
                locationName: 'Point',
                members: {
                  X: {
                    type: 'float'
                  },
                  Y: {
                    type: 'float'
                  }
                }
              }
            }
          }
        };
        params = {
          Points: [
            {
              X: 1.2,
              Y: 2.1
            }, {
              X: 3.4,
              Y: 4.3
            }
          ]
        };
        xml = "<Data xmlns=\"" + xmlns + "\">\n  <Points>\n    <Point>\n      <X>1.2</X>\n      <Y>2.1</Y>\n    </Point>\n    <Point>\n      <X>3.4</X>\n      <Y>4.3</Y>\n    </Point>\n  </Points>\n</Data>";
        return matchXML(toXML(rules, params), xml);
      });
    });
    describe('flattened lists', function() {
      it('serializes lists without a base wrapper', function() {
        var params, rules, xml;
        rules = {
          members: {
            Aliases: {
              type: 'list',
              flattened: true,
              member: {}
            }
          }
        };
        params = {
          Aliases: ['abc', 'mno', 'xyz']
        };
        xml = "<Data xmlns=\"" + xmlns + "\">\n  <Aliases>abc</Aliases>\n  <Aliases>mno</Aliases>\n  <Aliases>xyz</Aliases>\n</Data>";
        return matchXML(toXML(rules, params), xml);
      });
      it('serializes lists (custom member names)', function() {
        var params, rules, xml;
        rules = {
          members: {
            Aliases: {
              type: 'list',
              flattened: true,
              member: {
                locationName: 'Alias'
              }
            }
          }
        };
        params = {
          Aliases: ['abc', 'mno', 'xyz']
        };
        xml = "<Data xmlns=\"" + xmlns + "\">\n  <Alias>abc</Alias>\n  <Alias>mno</Alias>\n  <Alias>xyz</Alias>\n</Data>";
        return matchXML(toXML(rules, params), xml);
      });
      it('omits lists elements when no members are given', function() {
        var params, rules, xml;
        rules = {
          members: {
            Aliases: {
              type: 'list',
              flattened: true,
              member: {
                locationName: 'Alias'
              }
            }
          }
        };
        params = {
          Aliases: []
        };
        xml = '';
        return matchXML(toXML(rules, params), xml);
      });
      return it('serializes lists of structures', function() {
        var params, rules, xml;
        rules = {
          members: {
            Points: {
              type: 'list',
              flattened: true,
              name: 'Point',
              member: {
                type: 'structure',
                locationName: 'Point',
                members: {
                  X: {
                    type: 'float'
                  },
                  Y: {
                    type: 'float'
                  }
                }
              }
            }
          }
        };
        params = {
          Points: [
            {
              X: 1.2,
              Y: 2.1
            }, {
              X: 3.4,
              Y: 4.3
            }
          ]
        };
        xml = "<Data xmlns=\"" + xmlns + "\">\n  <Point>\n    <X>1.2</X>\n    <Y>2.1</Y>\n  </Point>\n  <Point>\n    <X>3.4</X>\n    <Y>4.3</Y>\n  </Point>\n</Data>";
        return matchXML(toXML(rules, params), xml);
      });
    });
    describe('maps', function() {
      var rules;
      rules = {
        type: 'structure',
        members: {
          Items: {
            type: 'map',
            key: {
              type: 'string'
            },
            value: {
              type: 'string'
            }
          }
        }
      };
      it('translates maps', function() {
        var params, xml;
        params = {
          Items: {
            A: 'a',
            B: 'b'
          }
        };
        xml = "<Data xmlns=\"" + xmlns + "\">\n  <Items>\n    <entry>\n      <key>A</key>\n      <value>a</value>\n    </entry>\n    <entry>\n      <key>B</key>\n      <value>b</value>\n    </entry>\n  </Items>\n</Data>";
        return matchXML(toXML(rules, params), xml);
      });
      it('allows renamed map keys and values', function() {
        var otherRules, params, xml;
        params = {
          Items: {
            A: 'a',
            B: 'b'
          }
        };
        otherRules = {
          type: 'structure',
          members: {
            Items: {
              type: 'map',
              key: {
                type: 'string',
                locationName: 'MKEY'
              },
              value: {
                type: 'string',
                locationName: 'MVALUE'
              }
            }
          }
        };
        xml = "<Data xmlns=\"" + xmlns + "\">\n  <Items>\n    <entry>\n      <MKEY>A</MKEY>\n      <MVALUE>a</MVALUE>\n    </entry>\n    <entry>\n      <MKEY>B</MKEY>\n      <MVALUE>b</MVALUE>\n    </entry>\n  </Items>\n</Data>";
        return matchXML(toXML(otherRules, params), xml);
      });
      it('ignores null', function() {
        return expect(toXML(rules, {
          Items: null
        })).to.equal('');
      });
      return it('ignores undefined', function() {
        return expect(toXML(rules, {
          Items: void 0
        })).to.equal('');
      });
    });
    describe('flattened maps', function() {
      var rules;
      rules = {
        type: 'structure',
        members: {
          Items: {
            type: 'map',
            locationName: 'Item',
            flattened: true,
            key: {
              type: 'string'
            },
            value: {
              type: 'string'
            }
          }
        }
      };
      it('translates flattened maps', function() {
        var params, xml;
        params = {
          Items: {
            A: 'a',
            B: 'b'
          }
        };
        xml = "<Data xmlns=\"" + xmlns + "\">\n  <Item>\n    <key>A</key>\n    <value>a</value>\n  </Item>\n  <Item>\n    <key>B</key>\n    <value>b</value>\n  </Item>\n</Data>";
        return matchXML(toXML(rules, params), xml);
      });
      it('allows renamed map keys and values', function() {
        var otherRules, params, xml;
        params = {
          Items: {
            A: 'a',
            B: 'b'
          }
        };
        otherRules = {
          type: 'structure',
          members: {
            Items: {
              locationName: 'Item',
              flattened: true,
              type: 'map',
              key: {
                type: 'string',
                locationName: 'MKEY'
              },
              value: {
                type: 'string',
                locationName: 'MVALUE'
              }
            }
          }
        };
        xml = "<Data xmlns=\"" + xmlns + "\">\n  <Item>\n    <MKEY>A</MKEY>\n    <MVALUE>a</MVALUE>\n  </Item>\n  <Item>\n    <MKEY>B</MKEY>\n    <MVALUE>b</MVALUE>\n  </Item>\n</Data>";
        return matchXML(toXML(otherRules, params), xml);
      });
      it('ignores null', function() {
        return expect(toXML(rules, {
          Items: null
        })).to.equal('');
      });
      return it('ignores undefined', function() {
        return expect(toXML(rules, {
          Items: void 0
        })).to.equal('');
      });
    });
    describe('numbers', function() {
      it('integers', function() {
        var params, rules, xml;
        rules = {
          members: {
            Count: {
              type: 'integer'
            }
          }
        };
        params = {
          Count: 123.0
        };
        xml = "<Data xmlns=\"" + xmlns + "\">\n  <Count>123</Count>\n</Data>";
        return matchXML(toXML(rules, params), xml);
      });
      it('floats', function() {
        var params, rules, xml;
        rules = {
          members: {
            Count: {
              type: 'float'
            }
          }
        };
        params = {
          Count: 123.123
        };
        xml = "<Data xmlns=\"" + xmlns + "\">\n  <Count>123.123</Count>\n</Data>";
        return matchXML(toXML(rules, params), xml);
      });
      return it('ints and floats formatted as numbers', function() {
        var params, rules, xml;
        rules = {
          members: {
            CountI: {
              type: 'integer'
            },
            CountF: {
              type: 'float'
            }
          }
        };
        params = {
          CountI: '123',
          CountF: '1.23'
        };
        xml = "<Data xmlns=\"" + xmlns + "\">\n  <CountI>123</CountI>\n  <CountF>1.23</CountF>\n</Data>";
        return matchXML(toXML(rules, params), xml);
      });
    });
    describe('booleans', function() {
      it('true', function() {
        var params, rules, xml;
        rules = {
          members: {
            Enabled: {
              type: 'boolean'
            }
          }
        };
        params = {
          Enabled: true
        };
        xml = "<Data xmlns=\"" + xmlns + "\">\n  <Enabled>true</Enabled>\n</Data>";
        return matchXML(toXML(rules, params), xml);
      });
      return it('false', function() {
        var params, rules, xml;
        rules = {
          members: {
            Enabled: {
              type: 'boolean'
            }
          }
        };
        params = {
          Enabled: false
        };
        xml = "<Data xmlns=\"" + xmlns + "\">\n  <Enabled>false</Enabled>\n</Data>";
        return matchXML(toXML(rules, params), xml);
      });
    });
    describe('timestamps', function() {
      var time;
      time = new Date();
      time.setMilliseconds(0);
      it('iso8601', function() {
        var params, rules, xml;
        api.timestampFormat = 'iso8601';
        rules = {
          members: {
            Expires: {
              type: 'timestamp'
            }
          }
        };
        params = {
          Expires: time
        };
        xml = "<Data xmlns=\"" + xmlns + "\">\n  <Expires>" + (AWS.util.date.iso8601(time)) + "</Expires>\n</Data>";
        return matchXML(toXML(rules, params), xml);
      });
      it('rfc822', function() {
        var params, rules, xml;
        api.timestampFormat = 'rfc822';
        rules = {
          members: {
            Expires: {
              type: 'timestamp'
            }
          }
        };
        params = {
          Expires: time
        };
        xml = "<Data xmlns=\"" + xmlns + "\">\n  <Expires>" + (AWS.util.date.rfc822(time)) + "</Expires>\n</Data>";
        return matchXML(toXML(rules, params), xml);
      });
      it('unix timestamp', function() {
        var params, rules, xml;
        api.timestampFormat = 'unixTimestamp';
        rules = {
          members: {
            Expires: {
              type: 'timestamp'
            }
          }
        };
        params = {
          Expires: time
        };
        xml = "<Data xmlns=\"" + xmlns + "\">\n  <Expires>" + (AWS.util.date.unixTimestamp(time)) + "</Expires>\n</Data>";
        return matchXML(toXML(rules, params), xml);
      });
      return it('follows the forat given on the shape', function() {
        var params, rules, xml;
        api.timestampFormat = 'unixTimestamp';
        rules = {
          members: {
            Expires: {
              type: 'timestamp',
              timestampFormat: 'rfc822'
            }
          }
        };
        params = {
          Expires: time
        };
        xml = "<Data xmlns=\"" + xmlns + "\">\n  <Expires>" + (AWS.util.date.rfc822(time)) + "</Expires>\n</Data>";
        return matchXML(toXML(rules, params), xml);
      });
    });
    describe('xml attributes', function() {
      return it('can serialize xml attributes', function() {
        var params, rules, xml;
        rules = {
          members: {
            Config: {
              type: 'structure',
              members: {
                Foo: {
                  type: 'string'
                },
                Attr: {
                  type: 'string',
                  xmlAttribute: true,
                  locationName: 'attr:name'
                }
              }
            }
          }
        };
        params = {
          Config: {
            Foo: 'bar',
            Attr: 'abc'
          }
        };
        xml = "<Data xmlns=\"" + xmlns + "\">\n  <Config attr:name=\"abc\"><Foo>bar</Foo></Config>\n</Data>";
        return matchXML(toXML(rules, params), xml);
      });
    });
    return describe('xml namespaces', function() {
      it('can apply xml namespaces on structures', function() {
        var params, rules, xml;
        rules = {
          members: {
            Config: {
              type: 'structure',
              xmlNamespace: {
                uri: 'URI'
              },
              members: {
                Foo: {
                  type: 'string'
                }
              }
            }
          }
        };
        params = {
          Config: {
            Foo: 'bar'
          }
        };
        xml = "<Data xmlns=\"" + xmlns + "\">\n  <Config xmlns=\"URI\"><Foo>bar</Foo></Config>\n</Data>";
        return matchXML(toXML(rules, params), xml);
      });
      it('applies namespace prefixes to the xmlns attribute', function() {
        var params, rules, xml;
        rules = {
          members: {
            Config: {
              type: 'structure',
              xmlNamespace: {
                prefix: 'xsi',
                uri: 'URI'
              },
              members: {
                Foo: {
                  type: 'string'
                }
              }
            }
          }
        };
        params = {
          Config: {
            Foo: 'bar'
          }
        };
        xml = "<Data xmlns=\"" + xmlns + "\">\n  <Config xmlns:xsi=\"URI\"><Foo>bar</Foo></Config>\n</Data>";
        return matchXML(toXML(rules, params), xml);
      });
      return it('can apply namespaces to elements that have other attributes', function() {
        var params, rules, xml;
        rules = {
          members: {
            Config: {
              type: 'structure',
              xmlNamespace: {
                prefix: 'xsi',
                uri: 'URI'
              },
              members: {
                Foo: {
                  type: 'string'
                },
                Bar: {
                  type: 'string',
                  xmlAttribute: true,
                  locationName: 'xsi:label'
                }
              }
            }
          }
        };
        params = {
          Config: {
            Foo: 'abc',
            Bar: 'xyz'
          }
        };
        xml = "<Data xmlns=\"" + xmlns + "\">\n  <Config xmlns:xsi=\"URI\" xsi:label=\"xyz\"><Foo>abc</Foo></Config>\n</Data>";
        return matchXML(toXML(rules, params), xml);
      });
    });
  });

}).call(this);
