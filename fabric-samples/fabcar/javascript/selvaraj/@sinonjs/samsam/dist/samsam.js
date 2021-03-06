(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@sinonjs/commons'), require('lodash.get')) :
    typeof define === 'function' && define.amd ? define(['exports', '@sinonjs/commons', 'lodash.get'], factory) :
    (factory((global.samsam = {}),global.require$$0,global.lodash));
}(this, (function (exports,require$$0,lodash) { 'use strict';

    require$$0 = require$$0 && require$$0.hasOwnProperty('default') ? require$$0['default'] : require$$0;
    lodash = lodash && lodash.hasOwnProperty('default') ? lodash['default'] : lodash;

    function isNaN(value) {
        // Unlike global isNaN, this avoids type coercion
        // typeof check avoids IE host object issues, hat tip to
        // lodash
        var val = value; // JsLint thinks value !== value is "weird"
        return typeof value === "number" && value !== val;
    }

    var isNan = isNaN;

    /**
     * @name samsam.isNegZero
     * @param Object value
     *
     * Returns ``true`` if ``value`` is ``-0``.
     */
    function isNegZero(value) {
        return value === 0 && 1 / value === -Infinity;
    }

    var isNegZero_1 = isNegZero;

    /**
     * @name samsam.equal
     * @param Object obj1
     * @param Object obj2
     *
     * Returns ``true`` if two objects are strictly equal. Compared to
     * ``===`` there are two exceptions:
     *
     *   - NaN is considered equal to NaN
     *   - -0 and +0 are not considered equal
     */
    function identical(obj1, obj2) {
        if (obj1 === obj2 || (isNan(obj1) && isNan(obj2))) {
            return obj1 !== 0 || isNegZero_1(obj1) === isNegZero_1(obj2);
        }

        return false;
    }

    var identical_1 = identical;

    var o = Object.prototype;

    function getClass(value) {
        // Returns the internal [[Class]] by calling Object.prototype.toString
        // with the provided value as this. Return value is a string, naming the
        // internal class, e.g. "Array"
        return o.toString.call(value).split(/[ \]]/)[1];
    }

    var getClass_1 = getClass;

    /**
     * @name samsam.isArguments
     * @param Object object
     *
     * Returns ``true`` if ``object`` is an ``arguments`` object,
     * ``false`` otherwise.
     */
    function isArguments(object) {
        if (getClass_1(object) === "Arguments") {
            return true;
        }
        if (
            typeof object !== "object" ||
            typeof object.length !== "number" ||
            getClass_1(object) === "Array"
        ) {
            return false;
        }
        if (typeof object.callee === "function") {
            return true;
        }
        try {
            object[object.length] = 6;
            delete object[object.length];
        } catch (e) {
            return true;
        }
        return false;
    }

    var isArguments_1 = isArguments;

    var div = typeof document !== "undefined" && document.createElement("div");

    /**
     * @name samsam.isElement
     * @param Object object
     *
     * Returns ``true`` if ``object`` is a DOM element node. Unlike
     * Underscore.js/lodash, this function will return ``false`` if ``object``
     * is an *element-like* object, i.e. a regular object with a ``nodeType``
     * property that holds the value ``1``.
     */
    function isElement(object) {
        if (!object || object.nodeType !== 1 || !div) {
            return false;
        }
        try {
            object.appendChild(div);
            object.removeChild(div);
        } catch (e) {
            return false;
        }
        return true;
    }

    var isElement_1 = isElement;

    function isSet(val) {
        return (typeof Set !== "undefined" && val instanceof Set) || false;
    }

    var isSet_1 = isSet;

    function isDate(value) {
        return value instanceof Date;
    }

    var isDate_1 = isDate;

    // Returns true when the value is a regular Object and not a specialized Object
    //
    // This helps speeding up deepEqual cyclic checks
    // The premise is that only Objects are stored in the visited array.
    // So if this function returns false, we don't have to do the
    // expensive operation of searching for the value in the the array of already
    // visited objects
    function isObject(value) {
        return (
            typeof value === "object" &&
            value !== null &&
            // none of these are collection objects, so we can return false
            !(value instanceof Boolean) &&
            !(value instanceof Date) &&
            !(value instanceof Error) &&
            !(value instanceof Number) &&
            !(value instanceof RegExp) &&
            !(value instanceof String)
        );
    }

    var isObject_1 = isObject;

    function isSubset(s1, s2, compare) {
        var allContained = true;
        s1.forEach(function(v1) {
            var includes = false;
            s2.forEach(function(v2) {
                if (compare(v2, v1)) {
                    includes = true;
                }
            });
            allContained = allContained && includes;
        });

        return allContained;
    }

    var isSubset_1 = isSubset;

    var valueToString = require$$0.valueToString;

    var re = /function (\w+)\s*\(/;

    function getClassName(value) {
        if (value.constructor && "name" in value.constructor) {
            return value.constructor.name;
        }

        if (typeof value.constructor === "function") {
            var match = valueToString(value.constructor).match(re);
            if (match.length > 1) {
                return match[1];
            }
        }

        return null;
    }

    var getClassName_1 = getClassName;

    var valueToString$1 = require$$0.valueToString;












    var every = Array.prototype.every;
    var getTime = Date.prototype.getTime;
    var hasOwnProperty = Object.prototype.hasOwnProperty;
    var indexOf = Array.prototype.indexOf;
    var keys = Object.keys;

    /**
     * @name samsam.deepEqual
     * @param Object first
     * @param Object second
     *
     * Deep equal comparison. Two values are "deep equal" if:
     *
     *   - They are equal, according to samsam.identical
     *   - They are both date objects representing the same time
     *   - They are both arrays containing elements that are all deepEqual
     *   - They are objects with the same set of properties, and each property
     *     in ``first`` is deepEqual to the corresponding property in ``second``
     *
     * Supports cyclic objects.
     */
    function deepEqualCyclic(first, second, match) {
        // used for cyclic comparison
        // contain already visited objects
        var objects1 = [];
        var objects2 = [];
        // contain pathes (position in the object structure)
        // of the already visited objects
        // indexes same as in objects arrays
        var paths1 = [];
        var paths2 = [];
        // contains combinations of already compared objects
        // in the manner: { "$1['ref']$2['ref']": true }
        var compared = {};

        // does the recursion for the deep equal check
        return (function deepEqual(obj1, obj2, path1, path2) {
            // If both are matchers they must be the same instance in order to be
            // considered equal If we didn't do that we would end up running one
            // matcher against the other
            if (match && match.isMatcher(obj2)) {
                if (match.isMatcher(obj1)) {
                    return obj1 === obj2;
                }
                return obj2.test(obj1);
            }

            var type1 = typeof obj1;
            var type2 = typeof obj2;

            // == null also matches undefined
            if (
                obj1 === obj2 ||
                isNan(obj1) ||
                isNan(obj2) ||
                obj1 == null ||
                obj2 == null ||
                type1 !== "object" ||
                type2 !== "object"
            ) {
                return identical_1(obj1, obj2);
            }

            // Elements are only equal if identical(expected, actual)
            if (isElement_1(obj1) || isElement_1(obj2)) {
                return false;
            }

            var isDate1 = isDate_1(obj1);
            var isDate2 = isDate_1(obj2);
            if (isDate1 || isDate2) {
                if (
                    !isDate1 ||
                    !isDate2 ||
                    getTime.call(obj1) !== getTime.call(obj2)
                ) {
                    return false;
                }
            }

            if (obj1 instanceof RegExp && obj2 instanceof RegExp) {
                if (valueToString$1(obj1) !== valueToString$1(obj2)) {
                    return false;
                }
            }

            if (obj1 instanceof Error && obj2 instanceof Error) {
                return obj1 === obj2;
            }

            var class1 = getClass_1(obj1);
            var class2 = getClass_1(obj2);
            var keys1 = keys(obj1);
            var keys2 = keys(obj2);
            var name1 = getClassName_1(obj1);
            var name2 = getClassName_1(obj2);

            if (isArguments_1(obj1) || isArguments_1(obj2)) {
                if (obj1.length !== obj2.length) {
                    return false;
                }
            } else {
                if (
                    type1 !== type2 ||
                    class1 !== class2 ||
                    keys1.length !== keys2.length ||
                    (name1 && name2 && name1 !== name2)
                ) {
                    return false;
                }
            }

            if (isSet_1(obj1) || isSet_1(obj2)) {
                if (!isSet_1(obj1) || !isSet_1(obj2) || obj1.size !== obj2.size) {
                    return false;
                }

                return isSubset_1(obj1, obj2, deepEqual);
            }

            return every.call(keys1, function(key) {
                if (!hasOwnProperty.call(obj2, key)) {
                    return false;
                }

                var value1 = obj1[key];
                var value2 = obj2[key];
                var isObject1 = isObject_1(value1);
                var isObject2 = isObject_1(value2);
                // determines, if the objects were already visited
                // (it's faster to check for isObject first, than to
                // get -1 from getIndex for non objects)
                var index1 = isObject1 ? indexOf.call(objects1, value1) : -1;
                var index2 = isObject2 ? indexOf.call(objects2, value2) : -1;
                // determines the new paths of the objects
                // - for non cyclic objects the current path will be extended
                //   by current property name
                // - for cyclic objects the stored path is taken
                var newPath1 =
                    index1 !== -1
                        ? paths1[index1]
                        : path1 + "[" + JSON.stringify(key) + "]";
                var newPath2 =
                    index2 !== -1
                        ? paths2[index2]
                        : path2 + "[" + JSON.stringify(key) + "]";
                var combinedPath = newPath1 + newPath2;

                // stop recursion if current objects are already compared
                if (compared[combinedPath]) {
                    return true;
                }

                // remember the current objects and their paths
                if (index1 === -1 && isObject1) {
                    objects1.push(value1);
                    paths1.push(newPath1);
                }
                if (index2 === -1 && isObject2) {
                    objects2.push(value2);
                    paths2.push(newPath2);
                }

                // remember that the current objects are already compared
                if (isObject1 && isObject2) {
                    compared[combinedPath] = true;
                }

                // End of cyclic logic

                // neither value1 nor value2 is a cycle
                // continue with next level
                return deepEqual(value1, value2, newPath1, newPath2);
            });
        })(first, second, "$1", "$2");
    }

    deepEqualCyclic.use = function(match) {
        return function(a, b) {
            return deepEqualCyclic(a, b, match);
        };
    };

    var deepEqual = deepEqualCyclic;

    var slice = require$$0.prototypes.string.slice;
    var typeOf = require$$0.typeOf;
    var valueToString$2 = require$$0.valueToString;

    var iterableToString = function iterableToString(obj) {
        var representation = "";

        function stringify(item) {
            return typeof item === "string"
                ? "'" + item + "'"
                : valueToString$2(item);
        }

        function mapToString(map) {
            /* eslint-disable-next-line local-rules/no-prototype-methods */
            map.forEach(function(value, key) {
                representation +=
                    "[" + stringify(key) + "," + stringify(value) + "],";
            });

            representation = slice(representation, 0, -1);
            return representation;
        }

        function genericIterableToString(iterable) {
            /* eslint-disable-next-line local-rules/no-prototype-methods */
            iterable.forEach(function(value) {
                representation += stringify(value) + ",";
            });

            representation = slice(representation, 0, -1);
            return representation;
        }

        if (typeOf(obj) === "map") {
            return mapToString(obj);
        }

        return genericIterableToString(obj);
    };

    var arrayProto = require$$0.prototypes.array;
    var deepEqual$1 = deepEqual.use(match); // eslint-disable-line no-use-before-define
    var every$1 = require$$0.every;
    var functionName = require$$0.functionName;


    var objectProto = require$$0.prototypes.object;
    var stringProto = require$$0.prototypes.string;
    var typeOf$1 = require$$0.typeOf;
    var valueToString$3 = require$$0.valueToString;

    var arrayIndexOf = arrayProto.indexOf;
    var arrayEvery = arrayProto.every;
    var join = arrayProto.join;
    var map = arrayProto.map;
    var some = arrayProto.some;

    var hasOwnProperty$1 = objectProto.hasOwnProperty;
    var isPrototypeOf = objectProto.isPrototypeOf;

    var stringIndexOf = stringProto.indexOf;

    function assertType(value, type, name) {
        var actual = typeOf$1(value);
        if (actual !== type) {
            throw new TypeError(
                "Expected type of " +
                    name +
                    " to be " +
                    type +
                    ", but was " +
                    actual
            );
        }
    }

    function assertMethodExists(value, method, name, methodPath) {
        if (value[method] == null) {
            throw new TypeError(
                "Expected " + name + " to have method " + methodPath
            );
        }
    }

    var matcher = {
        toString: function() {
            return this.message;
        }
    };

    function isMatcher(object) {
        return isPrototypeOf(matcher, object);
    }

    function matchObject(actual, expectation) {
        if (actual === null || actual === undefined) {
            return false;
        }

        return arrayEvery(Object.keys(expectation), function(key) {
            var exp = expectation[key];
            var act = actual[key];

            if (isMatcher(exp)) {
                if (!exp.test(act)) {
                    return false;
                }
            } else if (typeOf$1(exp) === "object") {
                if (!matchObject(act, exp)) {
                    return false;
                }
            } else if (!deepEqual$1(act, exp)) {
                return false;
            }

            return true;
        });
    }

    var TYPE_MAP = {
        function: function(m, expectation, message) {
            m.test = expectation;
            m.message = message || "match(" + functionName(expectation) + ")";
        },
        number: function(m, expectation) {
            m.test = function(actual) {
                // we need type coercion here
                return expectation == actual; // eslint-disable-line eqeqeq
            };
        },
        object: function(m, expectation) {
            var array = [];

            if (typeof expectation.test === "function") {
                m.test = function(actual) {
                    return expectation.test(actual) === true;
                };
                m.message = "match(" + functionName(expectation.test) + ")";
                return m;
            }

            array = map(Object.keys(expectation), function(key) {
                return key + ": " + valueToString$3(expectation[key]);
            });

            m.test = function(actual) {
                return matchObject(actual, expectation);
            };
            m.message = "match(" + join(array, ", ") + ")";

            return m;
        },
        regexp: function(m, expectation) {
            m.test = function(actual) {
                return typeof actual === "string" && expectation.test(actual);
            };
        },
        string: function(m, expectation) {
            m.test = function(actual) {
                return (
                    typeof actual === "string" &&
                    stringIndexOf(actual, expectation) !== -1
                );
            };
            m.message = 'match("' + expectation + '")';
        }
    };

    function match(expectation, message) {
        var m = Object.create(matcher);
        var type = typeOf$1(expectation);

        if (type in TYPE_MAP) {
            TYPE_MAP[type](m, expectation, message);
        } else {
            m.test = function(actual) {
                return deepEqual$1(actual, expectation);
            };
        }

        if (!m.message) {
            m.message = "match(" + valueToString$3(expectation) + ")";
        }

        return m;
    }

    matcher.or = function(m2) {
        if (!arguments.length) {
            throw new TypeError("Matcher expected");
        } else if (!isMatcher(m2)) {
            m2 = match(m2);
        }
        var m1 = this;
        var or = Object.create(matcher);
        or.test = function(actual) {
            return m1.test(actual) || m2.test(actual);
        };
        or.message = m1.message + ".or(" + m2.message + ")";
        return or;
    };

    matcher.and = function(m2) {
        if (!arguments.length) {
            throw new TypeError("Matcher expected");
        } else if (!isMatcher(m2)) {
            m2 = match(m2);
        }
        var m1 = this;
        var and = Object.create(matcher);
        and.test = function(actual) {
            return m1.test(actual) && m2.test(actual);
        };
        and.message = m1.message + ".and(" + m2.message + ")";
        return and;
    };

    match.isMatcher = isMatcher;

    match.any = match(function() {
        return true;
    }, "any");

    match.defined = match(function(actual) {
        return actual !== null && actual !== undefined;
    }, "defined");

    match.truthy = match(function(actual) {
        return !!actual;
    }, "truthy");

    match.falsy = match(function(actual) {
        return !actual;
    }, "falsy");

    match.same = function(expectation) {
        return match(function(actual) {
            return expectation === actual;
        }, "same(" + valueToString$3(expectation) + ")");
    };

    match.in = function(arrayOfExpectations) {
        if (typeOf$1(arrayOfExpectations) !== "array") {
            throw new TypeError("array expected");
        }

        return match(function(actual) {
            return some(arrayOfExpectations, function(expectation) {
                return expectation === actual;
            });
        }, "in(" + valueToString$3(arrayOfExpectations) + ")");
    };

    match.typeOf = function(type) {
        assertType(type, "string", "type");
        return match(function(actual) {
            return typeOf$1(actual) === type;
        }, 'typeOf("' + type + '")');
    };

    match.instanceOf = function(type) {
        if (
            typeof Symbol === "undefined" ||
            typeof Symbol.hasInstance === "undefined"
        ) {
            assertType(type, "function", "type");
        } else {
            assertMethodExists(
                type,
                Symbol.hasInstance,
                "type",
                "[Symbol.hasInstance]"
            );
        }
        return match(function(actual) {
            return actual instanceof type;
        }, "instanceOf(" +
            (functionName(type) || Object.prototype.toString.call(type)) +
            ")");
    };

    function createPropertyMatcher(propertyTest, messagePrefix) {
        return function(property, value) {
            assertType(property, "string", "property");
            var onlyProperty = arguments.length === 1;
            var message = messagePrefix + '("' + property + '"';
            if (!onlyProperty) {
                message += ", " + valueToString$3(value);
            }
            message += ")";
            return match(function(actual) {
                if (
                    actual === undefined ||
                    actual === null ||
                    !propertyTest(actual, property)
                ) {
                    return false;
                }
                return onlyProperty || deepEqual$1(actual[property], value);
            }, message);
        };
    }

    match.has = createPropertyMatcher(function(actual, property) {
        if (typeof actual === "object") {
            return property in actual;
        }
        return actual[property] !== undefined;
    }, "has");

    match.hasOwn = createPropertyMatcher(function(actual, property) {
        return hasOwnProperty$1(actual, property);
    }, "hasOwn");

    match.hasNested = function(property, value) {
        assertType(property, "string", "property");
        var onlyProperty = arguments.length === 1;
        var message = 'hasNested("' + property + '"';
        if (!onlyProperty) {
            message += ", " + valueToString$3(value);
        }
        message += ")";
        return match(function(actual) {
            if (
                actual === undefined ||
                actual === null ||
                lodash(actual, property) === undefined
            ) {
                return false;
            }
            return onlyProperty || deepEqual$1(lodash(actual, property), value);
        }, message);
    };

    match.every = function(predicate) {
        if (!isMatcher(predicate)) {
            throw new TypeError("Matcher expected");
        }

        return match(function(actual) {
            if (typeOf$1(actual) === "object") {
                return every$1(Object.keys(actual), function(key) {
                    return predicate.test(actual[key]);
                });
            }

            return (
                !!actual &&
                typeOf$1(actual.forEach) === "function" &&
                every$1(actual, function(element) {
                    return predicate.test(element);
                })
            );
        }, "every(" + predicate.message + ")");
    };

    match.some = function(predicate) {
        if (!isMatcher(predicate)) {
            throw new TypeError("Matcher expected");
        }

        return match(function(actual) {
            if (typeOf$1(actual) === "object") {
                return !every$1(Object.keys(actual), function(key) {
                    return !predicate.test(actual[key]);
                });
            }

            return (
                !!actual &&
                typeOf$1(actual.forEach) === "function" &&
                !every$1(actual, function(element) {
                    return !predicate.test(element);
                })
            );
        }, "some(" + predicate.message + ")");
    };

    match.array = match.typeOf("array");

    match.array.deepEquals = function(expectation) {
        return match(function(actual) {
            // Comparing lengths is the fastest way to spot a difference before iterating through every item
            var sameLength = actual.length === expectation.length;
            return (
                typeOf$1(actual) === "array" &&
                sameLength &&
                every$1(actual, function(element, index) {
                    var expected = expectation[index];
                    return typeOf$1(expected) === "array" &&
                        typeOf$1(element) === "array"
                        ? match.array.deepEquals(expected).test(element)
                        : deepEqual$1(expected, element);
                })
            );
        }, "deepEquals([" + iterableToString(expectation) + "])");
    };

    match.array.startsWith = function(expectation) {
        return match(function(actual) {
            return (
                typeOf$1(actual) === "array" &&
                every$1(expectation, function(expectedElement, index) {
                    return actual[index] === expectedElement;
                })
            );
        }, "startsWith([" + iterableToString(expectation) + "])");
    };

    match.array.endsWith = function(expectation) {
        return match(function(actual) {
            // This indicates the index in which we should start matching
            var offset = actual.length - expectation.length;

            return (
                typeOf$1(actual) === "array" &&
                every$1(expectation, function(expectedElement, index) {
                    return actual[offset + index] === expectedElement;
                })
            );
        }, "endsWith([" + iterableToString(expectation) + "])");
    };

    match.array.contains = function(expectation) {
        return match(function(actual) {
            return (
                typeOf$1(actual) === "array" &&
                every$1(expectation, function(expectedElement) {
                    return arrayIndexOf(actual, expectedElement) !== -1;
                })
            );
        }, "contains([" + iterableToString(expectation) + "])");
    };

    match.map = match.typeOf("map");

    match.map.deepEquals = function mapDeepEquals(expectation) {
        return match(function(actual) {
            // Comparing lengths is the fastest way to spot a difference before iterating through every item
            var sameLength = actual.size === expectation.size;
            return (
                typeOf$1(actual) === "map" &&
                sameLength &&
                every$1(actual, function(element, key) {
                    return expectation.has(key) && expectation.get(key) === element;
                })
            );
        }, "deepEquals(Map[" + iterableToString(expectation) + "])");
    };

    match.map.contains = function mapContains(expectation) {
        return match(function(actual) {
            return (
                typeOf$1(actual) === "map" &&
                every$1(expectation, function(element, key) {
                    return actual.has(key) && actual.get(key) === element;
                })
            );
        }, "contains(Map[" + iterableToString(expectation) + "])");
    };

    match.set = match.typeOf("set");

    match.set.deepEquals = function setDeepEquals(expectation) {
        return match(function(actual) {
            // Comparing lengths is the fastest way to spot a difference before iterating through every item
            var sameLength = actual.size === expectation.size;
            return (
                typeOf$1(actual) === "set" &&
                sameLength &&
                every$1(actual, function(element) {
                    return expectation.has(element);
                })
            );
        }, "deepEquals(Set[" + iterableToString(expectation) + "])");
    };

    match.set.contains = function setContains(expectation) {
        return match(function(actual) {
            return (
                typeOf$1(actual) === "set" &&
                every$1(expectation, function(element) {
                    return actual.has(element);
                })
            );
        }, "contains(Set[" + iterableToString(expectation) + "])");
    };

    match.bool = match.typeOf("boolean");
    match.number = match.typeOf("number");
    match.string = match.typeOf("string");
    match.object = match.typeOf("object");
    match.func = match.typeOf("function");
    match.regexp = match.typeOf("regexp");
    match.date = match.typeOf("date");
    match.symbol = match.typeOf("symbol");

    var matcher_1 = match;

    var valueToString$4 = require$$0.valueToString;

    var deepEqual$2 = deepEqual.use(match$1); // eslint-disable-line no-use-before-define






    function arrayContains(array, subset, compare) {
        if (subset.length === 0) {
            return true;
        }
        var i, l, j, k;
        for (i = 0, l = array.length; i < l; ++i) {
            if (compare(array[i], subset[0])) {
                for (j = 0, k = subset.length; j < k; ++j) {
                    if (i + j >= l) {
                        return false;
                    }
                    if (!compare(array[i + j], subset[j])) {
                        return false;
                    }
                }
                return true;
            }
        }
        return false;
    }

    /**
     * @name samsam.match
     * @param Object object
     * @param Object matcher
     *
     * Compare arbitrary value ``object`` with matcher.
     */
    function match$1(object, matcher) {
        if (matcher && typeof matcher.test === "function") {
            return matcher.test(object);
        }

        if (typeof matcher === "function") {
            return matcher(object) === true;
        }

        if (typeof matcher === "string") {
            matcher = matcher.toLowerCase();
            var notNull = typeof object === "string" || !!object;
            return (
                notNull &&
                valueToString$4(object)
                    .toLowerCase()
                    .indexOf(matcher) >= 0
            );
        }

        if (typeof matcher === "number") {
            return matcher === object;
        }

        if (typeof matcher === "boolean") {
            return matcher === object;
        }

        if (typeof matcher === "undefined") {
            return typeof object === "undefined";
        }

        if (matcher === null) {
            return object === null;
        }

        if (object === null) {
            return false;
        }

        if (isSet_1(object)) {
            return isSubset_1(matcher, object, match$1);
        }

        if (getClass_1(object) === "Array" && getClass_1(matcher) === "Array") {
            return arrayContains(object, matcher, match$1);
        }

        if (isDate_1(matcher)) {
            return isDate_1(object) && object.getTime() === matcher.getTime();
        }

        if (matcher && typeof matcher === "object") {
            if (matcher === object) {
                return true;
            }
            if (typeof object !== "object") {
                return false;
            }
            var prop;
            // eslint-disable-next-line guard-for-in
            for (prop in matcher) {
                var value = object[prop];
                if (
                    typeof value === "undefined" &&
                    typeof object.getAttribute === "function"
                ) {
                    value = object.getAttribute(prop);
                }
                if (
                    matcher[prop] === null ||
                    typeof matcher[prop] === "undefined"
                ) {
                    if (value !== matcher[prop]) {
                        return false;
                    }
                } else if (
                    typeof value === "undefined" ||
                    !deepEqual$2(value, matcher[prop])
                ) {
                    return false;
                }
            }
            return true;
        }

        throw new Error(
            "Matcher was not a string, a number, a " +
                "function, a boolean or an object"
        );
    }

    Object.keys(matcher_1).forEach(function(key) {
        match$1[key] = matcher_1[key];
    });

    var match_1 = match$1;

    var deepEqualCyclic$1 = deepEqual.use(match_1);


    var samsam = {
        createMatcher: matcher_1,
        deepEqual: deepEqualCyclic$1,
        identical: identical_1,
        isArguments: isArguments_1,
        isElement: isElement_1,
        isNegZero: isNegZero_1,
        isSet: isSet_1,
        match: match_1
    };
    var samsam_1 = samsam.createMatcher;
    var samsam_2 = samsam.deepEqual;
    var samsam_3 = samsam.identical;
    var samsam_4 = samsam.isArguments;
    var samsam_5 = samsam.isElement;
    var samsam_6 = samsam.isNegZero;
    var samsam_7 = samsam.isSet;
    var samsam_8 = samsam.match;

    exports.default = samsam;
    exports.createMatcher = samsam_1;
    exports.deepEqual = samsam_2;
    exports.identical = samsam_3;
    exports.isArguments = samsam_4;
    exports.isElement = samsam_5;
    exports.isNegZero = samsam_6;
    exports.isSet = samsam_7;
    exports.match = samsam_8;

    Object.defineProperty(exports, '__esModule', { value: true });

})));
