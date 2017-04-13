# BinaryJS Client

## BinaryJS client package for use in the browser with Webpack/Browserify

All credit goes to original authors of [BinaryJS](https://github.com/binaryjs/binaryjs). I have just modified it to be suitable as an npm package.

### Usage

Install using npm:

```
npm install binaryjs-client
```

Then import the package (ES6):

```
// app.js
import {BinaryClient} from 'binaryjs-client';

const client = new BinaryClient('ws://localhost:9000');
```

Or ES5:

```
// app.js
var BinaryClient = require('binaryjs-client').BinaryClient;

const client = new BinaryClient('ws://localhost:9000');
```

Built using BinaryJS version 0.2.2.
