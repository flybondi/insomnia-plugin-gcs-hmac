# @flybondi/insomnia-plugin-gcs-hmac

[![js-semistandard-style](https://img.shields.io/badge/code%20style-semistandard-brightgreen.svg?style=flat-square)](https://github.com/Flet/semistandard)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)

Simple plugin to add [Ingenico GCS][ingenico-gcs] HMAC authorization header template tag to [Insomnia][insomnia]. Largely based based on [insomnia-plugin-hash][plugin-hash].

## How to use

On a request to a GCS endpoint,

- Create a `Date` header and set its value to any date following the [RFC2822][rfc2822] (GMT) standard (e.g.: `Wed, 16 Oct 2019 16:18:47 GMT`).

> :bulb: The correct pattern for an RFC2822 date is `ddd, DD MMM YYYY HH:mm:ss [GMT]` for [`moment`][momentjs] and `ddd, dd MMM yyy HH:mm:ss 'GMT'` on [`date-fns`][date-fns].

- Create a `X-GCS-ServerMetaInfo` header and set its value to the `ServerMetaInfo` information sent by GCS Connect SDK. This is an invariant, `base64` encoded payload (i.e.: always the same value on a given environment). You can inspect this value from request logs (set `enableLogging: true` when initializing a [`connect-sdk-nodejs`][connect-sdk] instance). Alternative, you can create it yourself - see [here][connect-sdk-server-metainfo] for understanding what it contains and how it can be built.
- Create an `Authorization` header.
- Use `^` + `Space` (or `Ctrl` + `Space`) to create a tag on the `Authorization` header value and select _GCSHMAC_.
- Fill in requested plugin values.

## Known issues

Due to a current [Insomnia][insomnia] limitation, it is _not_ possible for tag plugins to **render other tags** - this means that the value of `Date` **cannot be set by another tag plugin**, such as _Timestamp_ and must be defined manually.

---

Made with 💛 by [Flybondi][flybondi].

[insomnia]: https://insomnia.rest
[ingenico-gcs]: https://epayments-api.developer-ingenico.com/s2sapi/v1/en_US/nodejs/authentication.html?paymentPlatform=ALL
[plugin-hash]: https://github.com/getinsomnia/insomnia/tree/develop/plugins/insomnia-plugin-hash
[rfc2822]: https://tools.ietf.org/html/rfc2822#section-4.3
[momentjs]: https://momentjscom.readthedocs.io/en/latest/moment/04-displaying/01-format/
[date-fns]: https://date-fns.org/v2.5.0/docs/format
[connect-sdk]: https://github.com/Ingenico-ePayments/connect-sdk-nodejs
[connect-sdk-server-metainfo]: https://github.com/Ingenico-ePayments/connect-sdk-nodejs/blob/master/utils/headers.js#L7
[flybondi]: https://flybondi.com
