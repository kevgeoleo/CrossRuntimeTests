try {
  const crypto = require('crypto');

  console.log('About to call update with length = 2**31 - 1');

  crypto
    .createCipheriv('aes-128-gcm', Buffer.alloc(16), Buffer.alloc(12))
    .update(Buffer.allocUnsafeSlow(2 ** 31 - 1));

  console.log('Call completed without throwing');
} catch (error) {
  console.error('Caught error:', error);
}

console.log('Process still alive after try/catch');