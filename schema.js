const Joi = require("joi");

let listingSchema = Joi.object({
  title: Joi.string().required(),
  description: Joi.string().required(),
  image: Joi.string().allow("", null),
  price: Joi.number().required().min(0),
  country: Joi.string().required(),
  location: Joi.string().required(),
});

let reviewSchema = Joi.object({
  rating:Joi.number().required().min(1).max(5),
  comment:Joi.string().required(),
  created_at: Joi.date()
});

module.exports = {listingSchema, reviewSchema};
