import createError from "../utils/createError.js";
import Order from "../models/order.model.js";
import Gig from "../models/gig.model.js";

export const createOrder = async (req, res, next) => {
  try {
    const gig = await Gig.findById(req.params.gigId);
    if (!gig) {
      return next(createError(404, "Gig not found"));
    }

    const newOrder = new Order({
      gigId: gig._id,
      img: gig.cover,
      title: gig.title,
      buyerId: req.userId,
      sellerId: gig.userId,
      price: gig.price,
      payment_intent: "temporory",
    });

    await newOrder.save();

    res.status(200).send("successfull")
  } catch (error) {
    next(error);
  }
};

// Get Orders
export const getOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({
      ...(req.isSeller ? { sellerId: req.userId } : { buyerId: req.userId }),
      isCompleted: true,
    });
    console.log("Fetched Orders:", orders); // Debugging
    res.status(200).json(orders);
  } catch (err) {
    next(err);
  }
};
