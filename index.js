'use strict';
/**
 * An Insomnia REST client plugin to add Ingenico GCS
 * authorization header to their payments gateway.
 *
 * @see https://epayments-api.developer-ingenico.com/s2sapi/v1/en_US/nodejs/authentication.html
 * @module @flybondi/insomnia-plugin-gcs-hmac
 */
const crypto = require('crypto');
const { URL } = require('url');

const templateTags = [
  {
    name: 'gcshmac',
    displayName: 'GCSHMAC',
    description: 'Create GCS HMAC authorization header',
    args: [
      {
        displayName: 'Algorithm',
        type: 'enum',
        defaultValue: 'sha256',
        options: [
          { displayName: 'MD5', value: 'md5' },
          { displayName: 'SHA1', value: 'sha1' },
          { displayName: 'SHA256', value: 'sha256' },
          { displayName: 'SHA512', value: 'sha512' }
        ]
      },
      {
        displayName: 'Digest Encoding',
        description: 'The encoding of the output',
        type: 'enum',
        defaultValue: 'base64',
        options: [
          { displayName: 'Hexadecimal', value: 'hex' },
          { displayName: 'Latin', value: 'latin1' },
          { displayName: 'Base64', value: 'base64' }
        ]
      },
      {
        displayName: 'Authorization type',
        type: 'string',
        defaultValue: 'v1HMAC',
        placeholder: 'v1HMAC'
      },
      {
        displayName: 'GCS Secret API Key',
        type: 'string',
        placeholder: 'HMAC Secret Key'
      },
      {
        displayName: 'GCS API Key Id',
        type: 'string',
        placeholder: 'GCS API Key'
      }
    ],
    async run(context, algorithm, encoding, authorizationType, secret = '', apiKey = '') {
      if (encoding !== 'hex' && encoding !== 'latin1' && encoding !== 'base64') {
        throw new Error(`Invalid encoding ${encoding}. Choices are hex, latin1 or base64`);
      }

      const request = await context.util.models.request.getById(context.meta.requestId);
      const extraHeaders = request.headers.filter(h =>
        h.name
          .trim()
          .toLowerCase()
          .startsWith('x-gcs-')
      );

      const dateHeader = request.headers.find(
        h => h.name.trim().toLowerCase() === 'date' && !h.disabled
      );

      const value = [
        request.method,
        request.body.mimeType,
        dateHeader ? new Date(dateHeader.value).toGMTString() : new Date().toGMTString(),
        extraHeaders
          .map(h => `${h.name.trim().toLowerCase()}:${h.value.trim()}`)
          .sort()
          .join('\n'),
        new URL(request.url).pathname
      ].join('\n');

      const signature = crypto
        .createHmac(algorithm, secret)
        .update(value + '\n', 'utf8')
        .digest(encoding);

      return `GCS ${authorizationType || 'v1HMAC'}:${apiKey}:${signature}`;
    }
  }
];

module.exports = { templateTags };
