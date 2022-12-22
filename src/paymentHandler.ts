import axios, { Axios } from "axios";
import https from "https";
import fs from "fs";

interface agentCerificates {
  cert: string;
  key: string;
  ca: string;
}

interface paymentRequest {
  payeePaymentReference?: string;
  callbackUrl: string;
  payeeAlias?: string;
  currency: string;
  payerAlias: string;
  amount: string;
  message?: string;
}

interface refundRequest {
  originalPaymentReference: string;
  payerAlias: string;
  amount: string;
  currency: string;
  callbackUrl: string;
  payeeAlias: string;
  message?: string;
  payerPaymentReference?: string;
}

interface QrRequest { 
  payee: string;
  amount?: {
    value: number;
    editable?: boolean;
  };
  message?: {
    value: string;
    editable?: boolean;
  };
  size?: number;
  border?: number;
}

export default class PaymentHandler {
  private _agent: https.Agent;
  private client: Axios;

  private certFile: string;
  private keyFile: string;
  private caFile: string;

  /**
   * Initialize a new PaymentHandler
   * @param certFile The path to the certificate file
   * @param keyFile The path to the key file
   * @param caFile The path to the ca file
   */
  constructor(certs: agentCerificates) {
    this.certFile = certs.cert;
    this.keyFile = certs.key;
    this.caFile = certs.ca;

    this._agent = new https.Agent({
      cert: fs.readFileSync(this.certFile, { encoding: "utf-8" }),
      key: fs.readFileSync(this.keyFile, { encoding: "utf-8" }),
      ca: fs.readFileSync(this.caFile, { encoding: "utf-8" }),
    });

    this.client = axios.create({
      httpsAgent: this._agent,
    });
  }

  private baseURL(developer: boolean = false) {
    return developer
      ? "https://mss.cpc.getswish.net/swish-cpcapi/api/v2"
      : "https://cpc.getswish.net/swish-cpcapi/api/v2";
  }

  private generateUUID() {
    const hexValues = "0123456789ABCDEF";
    let hexNumber = "";
    for (let i = 0; i < 32; i++) {
      hexNumber += hexValues[Math.floor(Math.random() * hexValues.length)];
    }
    return hexNumber;    
  }

  /**
   * 
   * @param options The options for the payment request
   * @param development If the request is for development or production
   * @returns The uuid, status and location of the payment request
   */
  public async createPaymentRequest(
    options: paymentRequest,
    development: boolean = true
  ) {
    const uuid = this.generateUUID();

    const data = {
      payeePaymentReference: options.payeePaymentReference,
      callbackUrl: options.callbackUrl,
      payeeAlias: options.payeeAlias,
      currency: options.currency,
      payerAlias: options.payerAlias,
      amount: options.amount,
      message: options.message,
    };

    const url = `${this.baseURL(development)}/paymentrequests/${uuid}`;
    
    try {
      const res = await this.client.put(url, data);
      return {
        uuid: uuid,
        status: res.status,
        location: res.headers.location,
      }
    } catch (e: any) {
      return {
        message: e.message,
        data : e?.response?.data
      };
    }
  }


  /**
   * 
   * @param location The location of the payment request
   * @returns the data of the payment request
   */
  public async retrievePaymentRequest(location: any) { 
    try {
      const res = await this.client.get(location);
      
      return res.data;
    } catch (e: any) { 
      return {
        message: e.message,
        data: e?.response?.data
      }
    }
  }

  /**
   * 
   * @param location 
   * @returns the data of the payment cancellation request
   */
  public async cancelPaymentRequest(location: any) { 
    try { 
      const res = await this.client.patch(location, [{
        op: "replace",
        path: "/status",
        value: "cancelled",
      }], {
        headers: {
          "Content-Type": "application/json-patch+json"
        }
      });
      return res.data;
    } catch (e: any) {
      return {
        message: e.message,
        data: e?.response?.data
      }
    }
  }

  public async createRefundRequest(paymentUUID: any, options: refundRequest, development: boolean = false) { 
    try { 
      // TODO: error: Callback URL is missing or does not use Https
      const data = {
        originalPaymentReference: options.originalPaymentReference,
        payerAlias: options.payerAlias,
        amount: options.amount,
        currency: options.currency,
        callbackUrl: options.callbackUrl,
        payeeAlias: options.payeeAlias,
        message: options.message,
        payerPaymentReference: options.payerPaymentReference
      }

      const url = `${this.baseURL(development)}/refunds/6E59BC1B1632424E874DDB219AD52357`;

      const res = await this.client.put(url, data);
      return res;
    } catch (e: any) {
      return {
        message: e.message,
        data: e?.response?.data
      }
    }
  }

  public async retrieveRefundRequest(location: any) { 
    try { 
      const res = await this.client.get(location);
      return res.data;
    } catch (e: any) {
      return {
        message: e.message,
        data: e?.response?.data
      }
    }
  }

  public async generateQRCode(options: QrRequest) {
    try {
      const res = await this.client.post("https://api.swish.nu/qr/v2/prefilled", options);
      return res.data;
    } catch (e: any) {
      return {
        message: e.message,
        data: e?.response?.data
      }
    }
  }
}


