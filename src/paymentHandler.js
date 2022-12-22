"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
const https_1 = __importDefault(require("https"));
const fs_1 = __importDefault(require("fs"));
class PaymentHandler {
    /**
     * Initialize a new PaymentHandler
     * @param certFile The path to the certificate file
     * @param keyFile The path to the key file
     * @param caFile The path to the ca file
     */
    constructor(certs) {
        this.certFile = certs.cert;
        this.keyFile = certs.key;
        this.caFile = certs.ca;
        this._agent = new https_1.default.Agent({
            cert: fs_1.default.readFileSync(this.certFile, { encoding: "utf-8" }),
            key: fs_1.default.readFileSync(this.keyFile, { encoding: "utf-8" }),
            ca: fs_1.default.readFileSync(this.caFile, { encoding: "utf-8" }),
        });
        this.client = axios_1.default.create({
            httpsAgent: this._agent,
        });
    }
    baseURL(developer = false) {
        return developer
            ? "https://mss.cpc.getswish.net/swish-cpcapi/api/v2"
            : "https://cpc.getswish.net/swish-cpcapi/api/v2";
    }
    generateUUID() {
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
    createPaymentRequest(options, development = true) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
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
                const res = yield this.client.put(url, data);
                return {
                    uuid: uuid,
                    status: res.status,
                    location: res.headers.location,
                };
            }
            catch (e) {
                return {
                    message: e.message,
                    data: (_a = e === null || e === void 0 ? void 0 : e.response) === null || _a === void 0 ? void 0 : _a.data
                };
            }
        });
    }
    /**
     *
     * @param location The location of the payment request
     * @returns the data of the payment request
     */
    retrievePaymentRequest(location) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const res = yield this.client.get(location);
                return res.data;
            }
            catch (e) {
                return {
                    message: e.message,
                    data: (_a = e === null || e === void 0 ? void 0 : e.response) === null || _a === void 0 ? void 0 : _a.data
                };
            }
        });
    }
    /**
     *
     * @param location
     * @returns the data of the payment cancellation request
     */
    cancelPaymentRequest(location) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const res = yield this.client.patch(location, [{
                        op: "replace",
                        path: "/status",
                        value: "cancelled",
                    }], {
                    headers: {
                        "Content-Type": "application/json-patch+json"
                    }
                });
                return res.data;
            }
            catch (e) {
                return {
                    message: e.message,
                    data: (_a = e === null || e === void 0 ? void 0 : e.response) === null || _a === void 0 ? void 0 : _a.data
                };
            }
        });
    }
    createRefundRequest(paymentUUID, options, development = false) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
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
                };
                console.log("data", data);
                const url = `${this.baseURL(development)}/refunds/6E59BC1B1632424E874DDB219AD52357`;
                console.log("url", url);
                const res = yield this.client.put(url, data);
                return res;
            }
            catch (e) {
                return {
                    message: e.message,
                    data: (_a = e === null || e === void 0 ? void 0 : e.response) === null || _a === void 0 ? void 0 : _a.data
                };
            }
        });
    }
    retrieveRefundRequest(location) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const res = yield this.client.get(location);
                return res.data;
            }
            catch (e) {
                return {
                    message: e.message,
                    data: (_a = e === null || e === void 0 ? void 0 : e.response) === null || _a === void 0 ? void 0 : _a.data
                };
            }
        });
    }
    generateQRCode(options) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const res = yield this.client.post("https://api.swish.nu/qr/v2/prefilled", options);
                return res.data;
            }
            catch (e) {
                return {
                    message: e.message,
                    data: (_a = e === null || e === void 0 ? void 0 : e.response) === null || _a === void 0 ? void 0 : _a.data
                };
            }
        });
    }
}
exports.default = PaymentHandler;
