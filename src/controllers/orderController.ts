import { Request, Response } from "express-serve-static-core";
import { Order } from "../models/Order";
import { Product } from "../models/Product";
import { StatusCodes } from "http-status-codes";
import { BadRequestError, NotFoundError } from "../errors";
import { checkPermissions } from "../utils";

/* My Code Start */
import Stripe from "stripe";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export const createOrder = async (req: Request, res: Response) => {
  const { items: cartItems, tax, shippingFee } = req.body;

  if (!cartItems || cartItems.length < 1) {
    throw new BadRequestError("No cart items provided");
  }
  if (!tax || !shippingFee) {
    throw new BadRequestError("Please provide tax and shipping fee");
  }

  let orderItems = [] as unknown[];
  let subtotal = 0;

  for (const item of cartItems) {
    const dbProduct = await Product.findOne({ _id: item.id.split("#")[0] });

    if (!dbProduct) {
      throw new NotFoundError(`No product with id : ${item.id}`);
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
  const paymentIntent = await stripe.paymentIntents.create({
    amount: total,
    currency: "usd",
  });

  const order = await Order.create({
    orderItems,
    total,
    subtotal,
    tax,
    shippingFee,
    clientSecret: paymentIntent.client_secret,
    user: req.user!.userId,
  });

  res
    .status(StatusCodes.CREATED)
    .json({ order, clientSecret: order.clientSecret });
};
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

export const getAllOrders = async (req: Request, res: Response) => {
  const orders = await Order.find({});
  res.status(StatusCodes.OK).json({ orders, count: orders.length });
};

export const getSingleOrder = async (req: Request, res: Response) => {
  const { id: orderId } = req.params;
  const order = await Order.findOne({ _id: orderId });
  if (!order) {
    throw new NotFoundError(`No order with id : ${orderId}`);
  }
  checkPermissions(req.user!, order.user);
  res.status(StatusCodes.OK).json({ order });
};

export const getCurrentUserOrders = async (req: Request, res: Response) => {
  const orders = await Order.find({ user: req.user!.userId });
  res.status(StatusCodes.OK).json({ orders, count: orders.length });
};

export const updateOrder = async (req: Request, res: Response) => {
  const { id: orderId } = req.params;
  const { paymentIntentId } = req.body;

  const order = await Order.findOne({ _id: orderId });
  if (!order) {
    throw new NotFoundError(`No order with id : ${orderId}`);
  }
  checkPermissions(req.user!, order.user);

  order.paymentIntentId = paymentIntentId;
  order.status = "paid";
  await order.save();

  res.status(StatusCodes.OK).json({ order });
};
