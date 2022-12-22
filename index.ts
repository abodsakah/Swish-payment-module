import PaymentHandler from "./src/paymentHandler";

const paymentHandler = new PaymentHandler({
  cert: "./certs/Swish_Merchant_TestCertificate_1234679304.pem",
  key: "./certs/Swish_Merchant_TestCertificate_1234679304.key",
  ca: "./certs/Swish_TLS_RootCA.pem",
});

async function makeTestRequest() {
  console.log("Making test request...");

  let payment = await paymentHandler.createPaymentRequest({
    payeePaymentReference: "1234567890",
    callbackUrl: "https://example.com/api/swishcb/paymentrequests",
    payeeAlias: "1234679304",
    currency: "SEK",
    payerAlias: "460721282737",
    amount: "100",
    message: "Test message",
  }, true);


  const paymentVerification = await paymentHandler.retrievePaymentRequest(payment.location);

  console.log(paymentVerification);

  // const paymentCancelation = await paymentHandler.cancelPaymentRequest(payment.location);
  // console.log(paymentCancelation);

  const uuid = payment.uuid;

  const paymentRefund = await paymentHandler.createRefundRequest(uuid, {
    originalPaymentReference: "1234567890",
    callbackUrl: "https://example.com/api/swishcb/refunds",
    payerAlias: "460721282737",
    payeeAlias: "1234679304",
    currency: "SEK",
    amount: "50",
    message: "Test message",
  }, true);

  console.log(paymentRefund);

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

  console.log(qr);
}

makeTestRequest();
