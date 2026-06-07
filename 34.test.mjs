import { test } from 'node:test';
import assert from 'node:assert';
import http2 from 'node:http2';

test('http2.connect should establish session with an IP address when servername is empty (Runtime Parity)', () => {
  return new Promise((resolve, reject) => {
    let session;
    
    // Safety watchdog timeout - Bun will fail almost instantly, but if it hangs, we catch it here.
    const timeoutId = setTimeout(() => {
      if (session) session.destroy();
      reject(new Error('Test timed out: HTTP/2 session handshake hung indefinitely.'));
    }, 5000);

    try {
      // Connect directly to a known stable public HTTP/2 endpoint using its IP address
      session = http2.connect('https://1.1.1.1', { servername: '' });

      session.once('remoteSettings', () => {
        clearTimeout(timeoutId);
        
        try {
          const originSet = session.originSet;
          
          assert.ok(Array.isArray(originSet), 'session.originSet should be an array');
          assert.ok(
            originSet.includes('https://1.1.1.1'),
            `Expected originSet to populate target connection IP. Got: ${JSON.stringify(originSet)}`
          );
          
          session.close(() => resolve());
        } catch (assertionError) {
          session.destroy();
          reject(assertionError);
        }
      });

      session.on('error', (err) => {
        clearTimeout(timeoutId);
        session.destroy();
        
        // Intercept Bun's certificate validation failures here cleanly
        if (err.code === 'UNABLE_TO_VERIFY_LEAF_SIGNATURE' || err.message.includes('verify')) {
          reject(new assert.AssertionError({
            message: `BUG detected: Runtime failed certificate validation when servername is empty string.\nReason: ${err.message}`,
            expected: 'Successful TLS handshake via SAN IP routing',
            actual: err.code || err.message
          }));
        } else {
          reject(err);
        }
      });

    } catch (err) {
      clearTimeout(timeoutId);
      reject(err);
    }
  });
});