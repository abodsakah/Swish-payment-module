import axios, { Axios } from "axios";
import https from "https";
import fs from "fs";
import { v4 as uuidv4 } from "uuid";

interface agentCerificates {
  cert: string;
  key: string;
  ca: string;
}

interface paymentRequest {
  payeePaymentReference: string;
  callbackUrl: string;
  payeeAlias: string;
  currency: string;
  payerAlias: string;
  amount: string;
  message: string;
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

  private generateUUID() {
    const hexValues = "0123456789ABCDEF";
    let hexNumber = "";
    for (let i = 0; i < 32; i++) {
      hexNumber += hexValues[Math.floor(Math.random() * hexValues.length)];
    }
    return hexNumber;    
  }

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

    const url = development
      ? `https://mss.cpc.getswish.net/swish-cpcapi/api/v2/paymentrequests/${uuid}`
      : `https://cpc.getswish.net/swish-cpcapi/api/v1/paymentrequests${uuid}`;

    console.log("Sending request to: ", url);
    
    try {
      const res = await this.client.put(url, data);
      return {
        uuid: uuid,
        status: res.status,
        location: res.headers.location,
      }
    } catch (e: any) {
      console.log(e.message, "\n", e?.response?.data);
      return e?.response?.data;
    }
  }

  public async retrievePaymentRequest(location: string, development: boolean = true) { 
    try {
      const res = await this.client.get(location);
      
      return res;
    } catch (e: any) { 
      console.log(e.message, "\n", e?.response?.data);
      return e?.response?.data;
    }
  }
}
