![Swish payment module](https://i.ibb.co/ZKKgHwp/hero-small.png)

![NPM version](https://badge.fury.io/js/swish-module.svg)

This is a library to integrate the Swedish payment system Swish into your application. This library uses the Swish API to create and handle payments and refunds.

## Installation
With yarn
```bash
yarn add swish-module
```

With npm
```bash
npm install swish-module
```

## Usage
### Pre-requisites
Before using the Swish API in production, some steps have to be taken. You can follow [this guide](https://developer.swish.nu/explore/integration) that is provided by Swish.

You can still develop on this API without having to go through the steps above. You can use the test environment provided by Swish. You can find the test environment credentials [here](https://developer.swish.nu/documentation/environments#certificates).

#### The Swish flow
![Flow](https://images.ctfassets.net/4dca8u8ebqnn/7EbXDydaLjF2INjTz5N6e1/10aeb82592b946076376cd06f5cd4c49/Swish_E-Commerce_Payment_Flow__Happy_Case_.png?w=1600&fl=progressive)

### Initialize the API

To initialize the API, you need to have 3 files, a private key, a certificate and a CA certificate. You can find these files in the guide above. You can also find them in the test environment credentials.

To initialize the API, you can use the following code:
```javascript
const swish = new Swish({
    cert: "./certs/Swish_Merchant_TestCertificate_1234679304.pem",
    key: "./certs/Swish_Merchant_TestCertificate_1234679304.key",
    ca: "./certs/Swish_TLS_RootCA.pem",
  });
```

### Create a payment
To create a payment, you can use the following code:
```javascript
const req = await swish.createPaymentRequest(
    {
      payeePaymentReference: "1234567890",
      callbackUrl: "https://example.com/api/swishcb/paymentrequests",
      payeeAlias: "1234679304",
      currency: "SEK",
      payerAlias: "460721282737",
      amount: "100",
      message: "Test message",
    },
    true
);
```
Table of the function takes in 2 parameters, the options that are as following:
| Name | Type | Description | optional |
| --- | --- | --- | --- |
| payeePaymentReference | string | A unique reference to the payment. | true |
| callbackUrl | string | The URL that Swish will send a callback to when the payment status changes. | false |
| payeeAlias | string | The Swish number of the merchant. | true |
| currency | string | The currency of the payment. | false |
| payerAlias | string | The Swish phone number of the customer. | false |
| amount | string | The amount of the payment. | false |
| message | string | A message that will be shown to the customer. | true |

The function also takes in a boolean, which is if the payment is a test payment or not.

The function is going to return 3 things:
- uuid: the generated UUID of the payment, which is a 32 hexadecimal (16- based) digits.
- status: The status code of the request.
- location: The location of the payment.

### Get a payment
To get information about a payment, you can use the following code:
```javascript
const payment = await swish.retrievePaymentRequest(req.location); // we send in the location from the createPaymentRequest function
```
This function is going to return the payment information.

### Refund a payment
To refund a payment, you can use the following code:
```javascript
const paymentRefund = await paymentHandler.createRefundRequest(req.uuid, {
    originalPaymentReference: "1234567890",
    callbackUrl: "https://example.com/api/swishcb/refunds",
    payerAlias: "460721282737",
    payeeAlias: "1234679304",
    currency: "SEK",
    amount: "50",
    message: "Test message",
  }, true);
```

Table of the function takes in 3 parameters, the first one is the UUID of the payment, the second one is the options that are as following:
| Name | Type | Description | optional |
| --- | --- | --- | --- |
| originalPaymentReference | string | The original payment reference. | false |
| callbackUrl | string | The URL that Swish will send a callback to when the payment status changes. | false |
| payerAlias | string | The Swish phone number of the customer. | false |
| payeeAlias | string | The Swish number of the merchant. | false |
| currency | string | The currency of the payment. | false |
| amount | string | The amount of the payment. | false |
| message | string | A message that will be shown to the customer. | true |
| payerPaymentReference | string | Payment reference supplied by the merchant. This reference could be order id or similar. Allowed characters are a-z A-Z 0-9 and length must be between 1 and 35 characters. | true |


The function also takes in a boolean, which is if the payment is a test payment or not.

The function is going to return 3 things:
- uuid: the generated UUID of the payment, which is a 32 hexadecimal (16- based) digits.
- status: The status code of the request.
- location: The location of the payment.

### Generate a QR code
In Swish a user can use a QR code to issue a payment, you can use the following code to generate a QR code:
```javascript
const qr = await paymentHandler.generateQRCode({
    payee: "1234679304",
    amount: {
      value: 100,
    },
    message: {
      value: "Test message",
      editable: true,
    }
  })
```
The function takes in 1 parameter, which is the options that are as following:

| Name | Type | Description | parameters | optional
| --- | --- | --- | --- | --- |
| payee | string | The Swish number of the merchant. | false |
| amount | object | The amount of the payment. | `valu`, `editable (optional)`  | true |
| message | object | A message that will be shown to the customer. | `value`, `editable (optional)` | true |
| size | number | The size of the QR code. | true |
| border | number | The border of the QR code. | true |

## License
[MIT](https://choosealicense.com/licenses/mit/)

## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

I am also open to suggestions on how to improve this package, where I am a lone developer, so I am not the best at everything :)
