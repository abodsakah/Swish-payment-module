import PaymentHandler from "./src/paymentHandler";
interface agentCerificates {
  cert: string;
  key: string;
  ca: string;
}
class SwishPaymentHandler extends PaymentHandler {
  constructor(certs: agentCerificates) {
    super(certs);
  }
}