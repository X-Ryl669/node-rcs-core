import test from 'ava';
import path from 'path';
import fs from 'fs';

import rcs from '../lib';

const fixturesCwd = 'test/files/fixtures';
const resultsCwd = 'test/files/results';

function replaceJsMacro(t, input, expected, fillLibrary = fs.readFileSync(path.join(fixturesCwd, '/css/style.css'), 'utf8')) {
  rcs.selectorLibrary.fillLibrary(fillLibrary);

  t.is(rcs.replace.js(input), expected);
  t.is(rcs.replace.js(new Buffer(input)), expected);
}

replaceJsMacro.title = (providedTitle, input) => (!providedTitle ? input.trim() : providedTitle);

test.beforeEach(() => {
  rcs.keyframesLibrary.reset();
  rcs.keyframesLibrary.nameGenerator.setAlphabet('#abcdefghijklmnopqrstuvwxyz');
  rcs.selectorLibrary.reset();
  rcs.selectorLibrary.nameGenerator.setAlphabet('#abcdefghijklmnopqrstuvwxyz');
});

test(replaceJsMacro,
  'var test = \' something \';\nconst myClass = "jp-block";',
  'var test = \' something \';\nconst myClass = "a";',
);

test(replaceJsMacro,
  "'\\-.0-9\\u00B7\\u0300-\\u036F\\u203F-\\u2040'",
  "'\\-.0-9\\u00B7\\u0300-\\u036F\\u203F-\\u2040'",
);

test('should fail to parse jsx', (t) => {
  t.plan(1);

  const input = fs.readFileSync(path.join(fixturesCwd, '/js/react.txt'), 'utf8');

  try {
    rcs.replace.js(input, { ecmaFeatures: { jsx: false } });

    t.fail();
  } catch (e) {
    t.pass();
  }
});

test('should replace although jsx is disabled', (t) => {
  const fillLibrary = fs.readFileSync(path.join(fixturesCwd, '/css/style.css'), 'utf8');
  const input = fs.readFileSync(path.join(fixturesCwd, '/js/complex.txt'), 'utf8');
  const expected = fs.readFileSync(path.join(resultsCwd, '/js/complex.txt'), 'utf8');

  rcs.selectorLibrary.fillLibrary(fillLibrary);

  t.is(rcs.replace.js(input, { ecmaFeatures: { jsx: false } }), expected);
  t.is(rcs.replace.js(new Buffer(input), { ecmaFeatures: { jsx: false } }), expected);
});

test('replace everything from file',
  replaceJsMacro,
  fs.readFileSync(path.join(fixturesCwd, '/js/complex.txt'), 'utf8'),
  fs.readFileSync(path.join(resultsCwd, '/js/complex.txt'), 'utf8'),
);

test('replace react components',
  replaceJsMacro,
  fs.readFileSync(path.join(fixturesCwd, '/js/react.txt'), 'utf8'),
  fs.readFileSync(path.join(resultsCwd, '/js/react.txt'), 'utf8'),
);

test('replace escaped prefixes | issue #67',
  replaceJsMacro,
  'var test = "something:withPrefix";\nconst myClass = "jp-block";',
  'var test = "a";\nconst myClass = "b";',
  '.something\\:withPrefix:after{} .jp-block{}',
);
