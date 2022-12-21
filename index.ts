import PaymentHandler from "./src/paymentHandler";

const paymentHandler = new PaymentHandler({
  cert: "./certs/Swish_Merchant_TestCertificate_1234679304.pem",
  key: "./certs/Swish_Merchant_TestCertificate_1234679304.key",
  ca: "./certs/Swish_TLS_RootCA.pem",
});

async function makeTestRequest() {
  console.log("Making test request...");

  let res = await paymentHandler.createPaymentRequest({
    payeePaymentReference: "1234567890",
    callbackUrl: "https://example.com/api/swishcb/paymentrequests",
    payeeAlias: "1234679304",
    currency: "SEK",
    payerAlias: "460721282737",
    amount: "100",
    message: "Test message",
  }, true);

  res = await paymentHandler.retrievePaymentRequest(res.location);

  console.log(res);
}

makeTestRequest();
