const fs = require('fs');

try {
  fs.watch('does-not-exist');
} catch (e) {
  console.log("error caught")
}