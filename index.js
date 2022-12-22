"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const paymentHandler_1 = __importDefault(require("./src/paymentHandler"));
class SwishPaymentHandler extends paymentHandler_1.default {
    constructor(certs) {
        super(certs);
    }
}
