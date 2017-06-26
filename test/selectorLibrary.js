import test from 'ava';

import rcs from '../lib/rcs';

test.beforeEach((t) => {
  // reset counter and selectors for tests
  rcs.selectorLibrary.excludes = [];
  rcs.selectorLibrary.selectors = {};
  rcs.selectorLibrary.attributeSelectors = {};
  rcs.selectorLibrary.compressedSelectors = {};

  rcs.nameGenerator.setAlphabet('#abcdefghijklmnopqrstuvwxyz');
  rcs.nameGenerator.reset();

  t.context.setSelectors = () => {
    rcs.selectorLibrary.set([
      '.test',
      '#id',
      '.jp-selector',
    ]);
  };
});

/* *** *
 * GET *
 * *** */
test('get | should not get any', (t) => {
  t.context.setSelectors();

  const selector = rcs.selectorLibrary.get('.nothing-to-get');

  t.is(selector, '.nothing-to-get');
});

test('get | should get every single selectors', (t) => {
  t.context.setSelectors();

  const dotTestSelector = rcs.selectorLibrary.get('.test');
  const testSelector = rcs.selectorLibrary.get('test');

  t.is(dotTestSelector, 'a');
  t.is(testSelector, 'a');
});

test('get | should not get excluded selector', (t) => {
  t.context.setSelectors();

  rcs.selectorLibrary.excludes = ['test'];

  const dotTestSelector = rcs.selectorLibrary.get('.test');
  const testSelector = rcs.selectorLibrary.get('test');

  t.is(dotTestSelector, '.test');
  t.is(testSelector, 'test');
});


/* ****** *
 * GETALL *
 * ****** */
test.skip('getall | should return a regex of compressed with classes', (t) => {
  t.context.setSelectors();

  const regex = rcs.selectorLibrary.getAll({
    origValues: false,
    regex: true,
    isSelectors: true,
  });

  t.is(regex, /\.a|#b|\.c/g);
});

test('getall | should return an array with selectors', (t) => {
  t.context.setSelectors();

  const array = rcs.selectorLibrary.getAll({
    origValues: true,
    isSelectors: true,
  });

  t.truthy(array['.test']);
  t.truthy(array['#id']);
  t.truthy(array['.jp-selector']);

  t.falsy(array['.a']);
  t.falsy(array['#b']);
  t.falsy(array['.c']);

  t.is(array['.test'], 'a');
  t.is(array['#id'], 'b');
});

test('getall | should return an array with compressed selectors', (t) => {
  t.context.setSelectors();

  const array = rcs.selectorLibrary.getAll({
    origValues: false,
    isSelectors: true,
  });

  t.falsy(array['.test']);
  t.falsy(array['#id']);
  t.falsy(array['.jp-selector']);

  t.truthy(array['.a']);
  t.truthy(array['#b']);
  t.truthy(array['.c']);

  t.is(array['.a'], 'test');
  t.is(array['#b'], 'id');
});

test.skip('getall | should return a regex of non compressed with classes', (t) => {
  t.context.setSelectors();

  const regex = rcs.selectorLibrary.getAll({
    origValues: true,
    regex: true,
    isSelectors: true,
  });

  t.is(regex, /\.test|#id|\.jp-selector/g);
});

test.skip('getall | should return a regex of non compressed selecotrs', (t) => {
  t.context.setSelectors();

  const regex = rcs.selectorLibrary.getAll({
    origValues: false,
    regex: true,
  });

  t.is(regex, /a|b|c/g);
});

test.skip('getall | should return a regex of compressed selectors', (t) => {
  t.context.setSelectors();

  const regex = rcs.selectorLibrary.getAll({
    origValues: true,
    regex: true,
  });

  t.is(regex, /test|id|jp-selector/g);
});

test('getall | should get all extended', (t) => {
  t.context.setSelectors();

  const cssObject = rcs.selectorLibrary.getAll({
    extended: true,
  });

  t.is(typeof cssObject.test, 'object');
  t.is(cssObject.test.type, 'class');
  t.is(cssObject.test.compressedSelector, 'a');

  t.is(typeof cssObject.id, 'object');
  t.is(cssObject.id.type, 'id');
  t.is(cssObject.id.compressedSelector, 'b');
});

test('getall | should get all extended with selectors', (t) => {
  t.context.setSelectors();

  const cssObject = rcs.selectorLibrary.getAll({
    isSelectors: true,
    extended: true,
  });

  t.is(typeof cssObject['.test'], 'object');
  t.is(cssObject['.test'].type, 'class');
  t.is(cssObject['.test'].compressedSelector, 'a');

  t.is(typeof cssObject['#id'], 'object');
  t.is(cssObject['#id'].type, 'id');
  t.is(cssObject['#id'].compressedSelector, 'b');
});

test('getall | should get all normal with selectors', (t) => {
  t.context.setSelectors();

  const cssObject = rcs.selectorLibrary.getAll({
    origValues: false,
    isSelectors: true,
    extended: true,
  });

  t.is(typeof cssObject['.a'], 'object');
  t.is(cssObject['.a'].type, 'class');
  t.is(cssObject['.a'].modifiedSelector, 'test');

  t.is(typeof cssObject['#b'], 'object');
  t.is(cssObject['#b'].type, 'id');
  t.is(cssObject['#b'].modifiedSelector, 'id');
});

test('getall | should get all setted classes', (t) => {
  t.context.setSelectors();

  const array = rcs.selectorLibrary.getAll();

  t.is(typeof array, 'object');
  t.is(array.test, 'a');
  t.is(array.id, 'b');
  t.is(array['jp-selector'], 'c');
});

test('getall | should get all setted compressed classes', (t) => {
  t.context.setSelectors();

  const array = rcs.selectorLibrary.getAll({
    origValues: false,
  });

  t.is(typeof array, 'object');
  t.is(array.a, 'test');
  t.is(array.b, 'id');
  t.is(array.c, 'jp-selector');
});

test('getall | should get the right values with the option plainCompressed', (t) => {
  t.context.setSelectors();

  rcs.selectorLibrary.set([
    '.testme',
  ], {
    prefix: 'prefix-',
  });

  const plainArray = rcs.selectorLibrary.getAll({
    plainCompressed: true,
  });

  const array = rcs.selectorLibrary.getAll();

  t.is(typeof plainArray, 'object');
  t.is(typeof array, 'object');
  t.is(plainArray.test, 'a');
  t.is(plainArray.testme, 'd');
  t.is(array.test, 'a');
  t.is(array.testme, 'prefix-d');
});

/* *** *
 * SET *
 * *** */
test('set | should set nothing', (t) => {
  rcs.selectorLibrary.set();

  t.deepEqual(rcs.selectorLibrary.selectors, {});
});

test('set | should set a new value and get this value', (t) => {
  rcs.selectorLibrary.set('.test');

  t.is(rcs.selectorLibrary.selectors.test.compressedSelector, 'a');
});

test('set | should set a new custom value', (t) => {
  rcs.selectorLibrary.set('.test', 'random-name');

  t.is(rcs.selectorLibrary.selectors.test.compressedSelector, 'random-name');
});

test('set | should set a new custom value', (t) => {
  rcs.selectorLibrary.set('.test', 'random-name');
  rcs.selectorLibrary.set('.test2', 'random-name');
  rcs.selectorLibrary.set('.test3', 'random-name');

  t.is(rcs.selectorLibrary.selectors.test.compressedSelector, 'random-name');
  t.is(rcs.selectorLibrary.selectors.test2.compressedSelector, 'a');
  t.is(rcs.selectorLibrary.selectors.test3.compressedSelector, 'b');
});

test('set | should set a new custom value with selector type', (t) => {
  rcs.selectorLibrary.set('.test', '.random-name');

  t.is(rcs.selectorLibrary.selectors.test.compressedSelector, 'random-name');
});

test('set | should set values out of an array', (t) => {
  rcs.selectorLibrary.set([
    '.test',
    '#id',
    '.jp-selector',
  ]);

  // should be set
  t.is(rcs.selectorLibrary.selectors.test.compressedSelector, 'a');
  t.is(rcs.selectorLibrary.selectors.id.compressedSelector, 'b');
  t.is(rcs.selectorLibrary.selectors['jp-selector'].compressedSelector, 'c');

  // should not be set
  t.falsy(rcs.selectorLibrary.selectors['not-set']);
});

/* ********** *
 * SETEXCLUDE *
 * ********** */
test('setExclude | should avoid adding more of the same exludes | should enable array', (t) => {
  const excludes = [
    'one-value',
    'one-value',
    'another-value',
  ];

  rcs.selectorLibrary.setExclude(excludes);

  t.is(rcs.selectorLibrary.excludes.length, 2);
});

test('setExclude | should enable array', (t) => {
  const excludes = [
    'one-value',
    'another-value',
  ];

  rcs.selectorLibrary.setExclude(excludes);

  t.is(rcs.selectorLibrary.excludes.length, 2);
});

test('setExclude | should enable excludes', (t) => {
  rcs.selectorLibrary.setExclude('one-value');
  rcs.selectorLibrary.setExclude('second-value');

  t.is(rcs.selectorLibrary.excludes.length, 2);
});

/* ******** *
 * SETVALUE *
 * ******** */
test('setValue | should set an object value', (t) => {
  const setValueObject = rcs.selectorLibrary.setValue('.test');

  t.is(setValueObject.type, 'class');
  t.is(setValueObject.selector, '.test');
  t.is(setValueObject.compressedSelector, 'a');
});

/* ********* *
 * SETVALUES *
 * ********* */
test('setValues | should set multiple values', (t) => {
  rcs.selectorLibrary.setValues({
    '.test': 'a',
    '.class': '.b',
    '.selector': 'c',
  });

  t.is(rcs.selectorLibrary.selectors.test.compressedSelector, 'a');
  t.is(rcs.selectorLibrary.selectors.class.compressedSelector, 'b');
  t.is(rcs.selectorLibrary.selectors.selector.compressedSelector, 'c');
});

/* ******************** *
 * SETATTRIBUTESELECTOR *
 * ******************** */
test('setAttributeSelector | should set attribute selectors correctly', (t) => {
  rcs.selectorLibrary.setAttributeSelector('[class*="test"]');
  rcs.selectorLibrary.setAttributeSelector([
    '[id^="header"]',
  ]);

  t.is(typeof rcs.selectorLibrary.attributeSelectors['.*test'], 'object');
  t.is(rcs.selectorLibrary.attributeSelectors['.*test'].originalString, '[class*="test"]');
  t.is(typeof rcs.selectorLibrary.attributeSelectors['#^header'], 'object');
  t.is(rcs.selectorLibrary.attributeSelectors['#^header'].originalString, '[id^="header"]');
});