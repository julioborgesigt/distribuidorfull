// /utils/credenciaisCrypto.js
//
// Criptografia simétrica reversível (AES-256-GCM) para armazenar credenciais
// do PJe no banco. A chave NUNCA vai ao banco — fica em variável de ambiente.
//
// Variável de ambiente necessária:
//   PJE_CRED_ENC_KEY  chave base64 de 32 bytes (gere com: openssl rand -base64 32)
//
// Formato armazenado no banco: "<iv_hex>:<authTag_hex>:<ciphertext_hex>"
// AES-256-GCM garante confidencialidade + integridade (detecta adulteração).

const crypto = require('crypto');

const ALGO = 'aes-256-gcm';
const IV_LEN = 16;

function getKey() {
  const raw = process.env.PJE_CRED_ENC_KEY;
  if (!raw) {
    throw new Error(
      'PJE_CRED_ENC_KEY não configurada. ' +
      'Gere com "openssl rand -base64 32" e adicione ao backend/.env.'
    );
  }
  const key = Buffer.from(raw, 'base64');
  if (key.length !== 32) {
    throw new Error(
      `PJE_CRED_ENC_KEY deve decodificar para exatamente 32 bytes (AES-256), ` +
      `mas gerou ${key.length} bytes. Use "openssl rand -base64 32".`
    );
  }
  return key;
}

function encrypt(plaintext) {
  const key = getKey();
  const iv = crypto.randomBytes(IV_LEN);
  const cipher = crypto.createCipheriv(ALGO, key, iv);
  const ct = Buffer.concat([cipher.update(String(plaintext), 'utf8'), cipher.final()]);
  const tag = cipher.getAuthTag();
  return `${iv.toString('hex')}:${tag.toString('hex')}:${ct.toString('hex')}`;
}

function decrypt(stored) {
  const key = getKey();
  const parts = String(stored).split(':');
  if (parts.length !== 3) {
    throw new Error('Formato de dado criptografado inválido.');
  }
  const [ivHex, tagHex, ctHex] = parts;
  const iv = Buffer.from(ivHex, 'hex');
  const tag = Buffer.from(tagHex, 'hex');
  const ct = Buffer.from(ctHex, 'hex');
  const decipher = crypto.createDecipheriv(ALGO, key, iv);
  decipher.setAuthTag(tag);
  return Buffer.concat([decipher.update(ct), decipher.final()]).toString('utf8');
}

module.exports = { encrypt, decrypt };
