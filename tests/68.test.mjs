// https://github.com/denoland/deno/issues/33291
// https://github.com/oven-sh/bun/issues/29370

import test from 'node:test';
import assert from 'node:assert/strict';
import crypto from 'node:crypto';

const data = Buffer.from([
  0, 2, 21, 48, 212, 249, 4, 188, 181, 150, 232, 200, 126, 175, 24, 20,
  29, 97, 3, 194, 77, 180, 245, 147, 214, 205, 145, 176, 225, 201, 20, 230,
  224, 176, 28, 169, 180, 174, 157, 147, 51, 161, 23, 133, 155, 19, 18, 168,
  182, 203, 81, 8, 135, 8, 87, 18, 118, 12, 92, 23, 251, 154, 229, 229, 40,
  151, 243, 129, 231, 13, 16, 38, 78, 38, 253, 234, 72, 118, 216, 237, 182,
  196, 51, 201, 123, 29, 187, 186, 15, 238, 255, 237, 240, 202, 103, 222,
  228, 240
]);

const pubkey = `-----BEGIN PUBLIC KEY-----
MIIBUjA9BgkqhkiG9w0BAQowMKANMAsGCWCGSAFlAwQCAqEaMBgGCSqGSIb3DQEBC
DALBglghkgBZQMEAgKiAwIBMAOCAQ8AMIIBCgKCAQEAo3iVbsT8MIiTUmehBFL2e
r8SwXqKkPCZMi1jw4zQ2Dzwrl8IyQpQS4NSbn0bdYHEkP+SU2V7GsAnnhXdIzWaH
QsvHE44vndDIxnmaTg2R5BUZaDdi5aX6xpYP39KC5Z6XlyehCSIFLSQUIyfgCxII
JhV+aHKK5zNBAgdAVjEWao687vtbqu6rng6VbKChW1I2aIIjBCCdkQsw1uxyVcNp
KWeqHhMCF0TIC90DiBTX+r1C3ASly906BTEqeonSNguClzz7oQukbZMncnWpxSnp
f8/Dr7qOL0AVMkOYCYHk7XR5WX+2zp2LqJwtcO87Dek5QOKcAwpOFTTuI2ZpN+3n
QIDAQAB
-----END PUBLIC KEY-----`;

const sig = Buffer.from([
  150, 107, 108, 113, 140, 93, 191, 104, 47, 48, 99, 122, 16, 242, 141, 19,
  171, 12, 7, 107, 110, 212, 229, 112, 194, 19, 70, 165, 26, 99, 213, 137,
  185, 85, 95, 15, 180, 172, 178, 198, 6, 67, 31, 184, 16, 93, 149, 41, 200,
  164, 75, 48, 9, 95, 24, 25, 140, 108, 156, 118, 66, 138, 226, 154, 83, 37,
  89, 199, 225, 126, 121, 197, 2, 242, 3, 114, 120, 107, 118, 120, 147, 221,
  157, 43, 80, 205, 67, 138, 201, 39, 241, 13, 155, 82, 191, 26, 8, 213, 64,
  105, 199, 69, 242, 20, 56, 108, 27, 218, 121, 1, 37, 200, 60, 251, 140,
  102, 53, 215, 87, 202, 223, 26, 136, 168, 99, 182, 1, 78, 128, 217, 24, 3,
  22, 147, 19, 151, 29, 17, 46, 170, 172, 97, 173, 25, 3, 31, 59, 95, 237,
  155, 72, 102, 184, 114, 212, 106, 212, 58, 211, 164, 148, 63, 108, 130,
  191, 240, 209, 6, 17, 36, 176, 117, 179, 228, 101, 218, 93, 6, 226, 196,
  158, 212, 202, 171, 126, 168, 246, 199, 131, 210, 114, 140, 61, 126, 0,
  239, 95, 73, 234, 93, 26, 52, 157, 19, 106, 95, 184, 186, 126, 127, 160,
  185, 168, 49, 15, 190, 158, 110, 238, 156, 211, 5, 146, 123, 147, 241, 227,
  4, 188, 4, 148, 34, 121, 251, 235, 95, 163, 169, 114, 47, 210, 178, 230,
  148, 63, 233, 103, 44, 147, 84, 249, 208, 248, 0, 251, 193
]);

test('crypto.verify accepts PEM public key and verifies signature', () => {
  const verified = crypto.verify(
    null,
    data,
    { key: pubkey },
    sig,
  );

  assert.equal(verified, true);
});