import PaymentHandler from "./src/paymentHandler";
interface agentCerificates {
  cert: string;
  key: string;
  ca: string;
}
export class Swish extends PaymentHandler {
  constructor(certs: agentCerificates) {
    super(certs);
  }
}