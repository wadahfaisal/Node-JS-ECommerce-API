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
exports.updateOrder = exports.getCurrentUserOrders = exports.getSingleOrder = exports.getAllOrders = exports.createOrder = void 0;
const Order_1 = require("../models/Order");
const Product_1 = require("../models/Product");
const http_status_codes_1 = require("http-status-codes");
const errors_1 = require("../errors");
const utils_1 = require("../utils");
/* My Code Start */
const stripe_1 = __importDefault(require("stripe"));
const stripe = new stripe_1.default(process.env.STRIPE_SECRET_KEY);
const createOrder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { items: cartItems, tax, shippingFee } = req.body;
    if (!cartItems || cartItems.length < 1) {
        throw new errors_1.BadRequestError("No cart items provided");
    }
    if (!tax || !shippingFee) {
        throw new errors_1.BadRequestError("Please provide tax and shipping fee");
    }
    let orderItems = [];
    let subtotal = 0;
    for (const item of cartItems) {
        const dbProduct = yield Product_1.Product.findOne({ _id: item.id.split("#")[0] });
        if (!dbProduct) {
            throw new errors_1.NotFoundError(`No product with id : ${item.id}`);
        }
        const { name, price, images, _id } = dbProduct;
        const singleOrderItem = {
            amount: item.amount,
            name,
            price,
            images,
            product: _id,
        };
        // add item to order
        orderItems = [...orderItems, singleOrderItem];
        // calculate subtotal
        subtotal += item.amount * price;
    }
    // calculate total
    const total = tax + shippingFee + subtotal;
    // get client secret
    const paymentIntent = yield stripe.paymentIntents.create({
        amount: total,
        currency: "usd",
    });
    const order = yield Order_1.Order.create({
        orderItems,
        total,
        subtotal,
        tax,
        shippingFee,
        clientSecret: paymentIntent.client_secret,
        user: req.user.userId,
    });
    res
        .status(http_status_codes_1.StatusCodes.CREATED)
        .json({ order, clientSecret: order.clientSecret });
});
exports.createOrder = createOrder;
/* My Code End */
// export const fakeStripeAPI = async ({ amount, currency }) => {
//   // const client_secret = 'someRandomValue';
//   const client_secret = process.env.STRIPE_SECRET_KEY;
//   return { client_secret, amount };
// };
// export const createOrder = async (req, res) => {
//   // Check this link to create legit payment functionality: https://docs.stripe.com/payments/quickstart
//   const { items: cartItems, tax, shippingFee } = req.body;
//   if (!cartItems || cartItems.length < 1) {
//     throw new BadRequestError("No cart items provided");
//   }
//   if (!tax || !shippingFee) {
//     throw new BadRequestError(
//       "Please provide tax and shipping fee"
//     );
//   }
//   let orderItems = [];
//   let subtotal = 0;
//   for (const item of cartItems) {
//     const dbProduct = await Product.findOne({ _id: item.product });
//     if (!dbProduct) {
//       throw new NotFoundError(
//         `No product with id : ${item.product}`
//       );
//     }
//     const { name, price, images, _id } = dbProduct;
//     const singleOrderItem = {
//       amount: item.amount,
//       name,
//       price,
//       images,
//       product: _id,
//     };
//     // add item to order
//     orderItems = [...orderItems, singleOrderItem];
//     // calculate subtotal
//     subtotal += item.amount * price;
//   }
//   // calculate total
//   const total = tax + shippingFee + subtotal;
//   // get client secret
//   const paymentIntent = await fakeStripeAPI({
//     amount: total,
//     currency: "usd",
//   });
//   const order = await Order.create({
//     orderItems,
//     total,
//     subtotal,
//     tax,
//     shippingFee,
//     clientSecret: paymentIntent.client_secret,
//     user: req.user.userId,
//   });
//   res
//     .status(StatusCodes.CREATED)
//     .json({ order, clientSecret: order.clientSecret });
// };
const getAllOrders = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const orders = yield Order_1.Order.find({});
    res.status(http_status_codes_1.StatusCodes.OK).json({ orders, count: orders.length });
});
exports.getAllOrders = getAllOrders;
const getSingleOrder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id: orderId } = req.params;
    const order = yield Order_1.Order.findOne({ _id: orderId });
    if (!order) {
        throw new errors_1.NotFoundError(`No order with id : ${orderId}`);
    }
    (0, utils_1.checkPermissions)(req.user, order.user);
    res.status(http_status_codes_1.StatusCodes.OK).json({ order });
});
exports.getSingleOrder = getSingleOrder;
const getCurrentUserOrders = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const orders = yield Order_1.Order.find({ user: req.user.userId });
    res.status(http_status_codes_1.StatusCodes.OK).json({ orders, count: orders.length });
});
exports.getCurrentUserOrders = getCurrentUserOrders;
const updateOrder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id: orderId } = req.params;
    const { paymentIntentId } = req.body;
    const order = yield Order_1.Order.findOne({ _id: orderId });
    if (!order) {
        throw new errors_1.NotFoundError(`No order with id : ${orderId}`);
    }
    (0, utils_1.checkPermissions)(req.user, order.user);
    order.paymentIntentId = paymentIntentId;
    order.status = "paid";
    yield order.save();
    res.status(http_status_codes_1.StatusCodes.OK).json({ order });
});
exports.updateOrder = updateOrder;
