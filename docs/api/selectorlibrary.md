# rcs.selectorLibrary

## Methods
- [fillLibrary](#filllibrary)
- [get](#get)
- [getAll](#getall)
- [set](#set)
- [generateMeta](#generatemeta)
- [setAttributeSelector](#setattributeselector)
- [isInAttributeSelector](#isinattributeselector)

Plus methods of [BaseLibrary](./baselibrary.md):
- [setMultiple](#setmultiple)
- [setExclude](#setexclude)
- [isExcluded](#isexcluded)

### fillLibrary

> Takes your CSS file (as a string) and fills the library with all necessary information

** rcs.selectorLibrary.fillLibrary(code[, options])**

Parameters:
- code `<String>`
- options `<Object>` (optional): same as `selectorLibrary.set()`
  - ignoreAttributeSelectors `<Boolean>`: If `true` it does ignore all setted attribute selectors such as `[class*=my]` so `.my_class` will be renamed.  Default: `false`
  - preventRandomName `<Boolean>`. Does not rename the given selector. Good for just pre- or suffix the selectors. Default: `false`

Example:

```js
const myCssFile = '.class { padding: 0; }; #id { margin: 0; }';

rcs.selectorLibrary.fillLibrary(myCssFile);
```

### get

> Get a specific minified selector

**rcs.selectorLibrary.get(selector[, options])**

Parameters:
- selector `<String>`
- options `<Object>`:
  - isOrigValue `<Boolean>`: If true the input is the original value. Default: `true`
  - addSelectorType `<Boolean>`: If true it will also add the ID or CLASS prefix (# or .). Default: `false`
  - extend `<Boolean>`: If true it will append more information given as object. Default: `false`

Example:

```js
const rcs = require('rcs-core');

rcs.selectorLibrary.set('#my-id'); // sets to 'a'

rcs.selectorLibrary.get('#my-id'); // a
rcs.selectorLibrary.get('#my-id', { addSelectorType: true }); // #a
```

### getAll

> Returns all setted values as array plus metadata

**rcs.selectorLibrary.getAll([options])**

Parameters:
- options `<Object>`:
  - getRenamedValues `<Boolean>`: If true it will return the renamed values. Default: `false`
  - regex `<Boolean>`: This will return a regex of all setted selectors in the selectorLibrary. Default: `false`
  - regexCss `<Boolean>`: This will return a regex of all setted selectors in the selectorLibrary, optimized for CSS files. Default: `false`
  - addSelectorType `<Boolean>`: If true it will also add the ID or CLASS prefix (# or .). Default: `false`
  - extend `<Boolean>`: If true it will append more information given as object. Has **no effect** in combination with the option REGEX. Default: `false`

Example:

```js
const rcs = require('rcs-core');

rcs.selectorLibrary.set('#my-id');
rcs.selectorLibrary.set('.a-class');

const allValues = rcs.selectorLibrary.getAll();
```

### set

> Sets a specific selector into the selectorLibrary

**rcs.selectorLibrary.set(selector[, [renamedSelector, ] options])**

Parameters:
- selector `<String>`
- renamedSelector `<String>` (optional)
- options `<Object>`:
  - ignoreAttributeSelectors `<Boolean>`: If `true` it does ignore all setted attribute selectors such as `[class*=my]` so `.my_class` will be renamed.  Default: `false`

  *plus options of `selectorLibrary.generateMeta()`*

  - preventRandomName `<Boolean>`. Does not rename the given selector. Good for just pre- or suffix the selectors. Default: `false`

Example:

```js
const rcs = require('rcs-core');

rcs.selectorLibrary.set('#my-id'); // sets to 'a'

rcs.selectorLibrary.get('#my-id'); // a
```

### generateMeta

> Returns the metainformation of the selector and generates a new name for the selector

**rcs.selectorLibrary.generateMeta(selector[, [renamedSelector, ] options])**

Parameters:
- selector `<String>`
- renamedSelector `<String>` (optional)
- options `<Object>`:
  - preventRandomName `<Boolean>`. Does not rename the given selector. Good for just pre- or suffix the selectors. Default: `false`

Example:

```js
const rcs = require('rcs-core');

const myClassMeta = rcs.selectorLibrary.generateMeta('.my-class');

// myClassMeta returns:
//
// {
//      type: 'class',
//      typeChar: '.',
//      selector: '.my-class',
//      modifiedSelector: 'my-class',
//      compressedSelector: 'a'
// }
```

### setAttributeSelector

> Sets the attribute selector into `this.attributeSelectors`

**rcs.selectorLibrary.setAttributeSelector(attributeSelector)**

Parameters:
- attributeSelector `<String>`. Attribute selector as in the [specs](https://developer.mozilla.org/en-US/docs/Web/CSS/Attribute_selectors)

Example:

```js
const rcs = require('rcs-core');

rcs.setAttributeSelector('[class$="selector"]');

// sets the following into this.attributeSelectors
//
// {
//      '.$selector': {
//          type: 'class',
//          typeChar: '.',
//          originalString: '[class$="selector"]',
//          regexType: $
//      }
// }
```

### isInAttributeSelector

> check wheter a selector is set by an CSS attribute selector or not

**rcs.selectorLibrary.isInAttributeSelector(selector)**

Parameters:
- selector `<String>`

Example:

```js
// first set some attribute selectors with `rcs.selectorLibrary.setAttributeSelectors`
rcs.setAttributeSelector('[class*="lect"]');

rcs.isInAttributeSelector('.select'); // true
rcs.isInAttributeSelector('.selct');  // false
rcs.isInAttributeSelector('#select'); // false
```
