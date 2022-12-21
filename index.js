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
const paymentHandler_1 = __importDefault(require("./src/paymentHandler"));
const paymentHandler = new paymentHandler_1.default({
    cert: "./certs/Swish_Merchant_TestCertificate_1234679304.pem",
    key: "./certs/Swish_Merchant_TestCertificate_1234679304.key",
    ca: "./certs/Swish_TLS_RootCA.pem",
});
function makeTestRequest() {
    return __awaiter(this, void 0, void 0, function* () {
        console.log("Making test request...");
        let payment = yield paymentHandler.createPaymentRequest({
            payeePaymentReference: "1234567890",
            callbackUrl: "https://example.com/api/swishcb/paymentrequests",
            payeeAlias: "1234679304",
            currency: "SEK",
            payerAlias: "460721282737",
            amount: "100",
            message: "Test message",
        }, true);
        const paymentVerification = yield paymentHandler.retrievePaymentRequest(payment.location);
        console.log(paymentVerification);
        // const paymentCancelation = await paymentHandler.cancelPaymentRequest(payment.location);
        // console.log(paymentCancelation);
        const uuid = payment.uuid;
        const paymentRefund = yield paymentHandler.createRefundRequest(uuid, {
            originalPaymentReference: "1234567890",
            callbackUrl: "https://example.com/api/swishcb/refunds",
            payerAlias: "460721282737",
            payeeAlias: "1234679304",
            currency: "SEK",
            amount: "50",
            message: "Test message",
        }, true);
        console.log(paymentRefund);
    });
}
makeTestRequest();
