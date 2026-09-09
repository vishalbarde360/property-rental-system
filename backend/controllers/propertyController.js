const Property = require("../models/Property");
const User = require("../models/User");

exports.create = async (req, res) => {
  try {
    const property = await Property.create({
      ...req.body,
      ownerId: req.user._id,
    });

    res.status(201).json(property);
  } catch (error) {
    res
      .status(400)
      .json({
        message: "Invalid property data",
        error: error.message,
      });
  }
};

exports.list = async (req, res) => {
  try {
    const {
      city,
      type,
      minRent,
      maxRent,
      bedrooms,
      available,
      page = 1,
      limit = 10,
    } = req.query;

    const filter = {
      status: "published",
    };

    if (city) filter.city = new RegExp(city, "i");
    if (type) filter.type = type;

    if (minRent) {
      filter.rent = {
        ...filter.rent,
        $gte: Number(minRent),
      };
    }

    if (maxRent) {
      filter.rent = {
        ...filter.rent,
        $lte: Number(maxRent),
      };
    }

    if (bedrooms) {
      filter.bedrooms = Number(bedrooms);
    }

    if (available !== undefined) {
      filter.availability = available === "true";
    }

    const skip = (Number(page) - 1) * Number(limit);

    const [properties, total] = await Promise.all([
      Property.find(filter)
        .populate("ownerId", "name email phone")
        .skip(skip)
        .limit(Number(limit)),

      Property.countDocuments(filter),
    ]);

    res.json({
      total,
      page: Number(page),
      limit: Number(limit),
      properties,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

exports.getOne = async (req, res) => {
  const property = await Property.findById(req.params.id).populate(
    "ownerId",
    "name email phone",
  );

  if (!property) {
    return res.status(404).json({
      message: "Property not found",
    });
  }

  res.json(property);
};

/*
|--------------------------------------------------------------------------
| UPDATE PROPERTY
|--------------------------------------------------------------------------
| Owner  -> स्वतःची property edit करू शकतो
| Admin  -> कोणतीही property edit करू शकतो
| Tenant -> edit करू शकत नाही
|--------------------------------------------------------------------------
*/

exports.update = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);

    if (!property) {
      return res.status(404).json({
        message: "Property not found",
      });
    }

    const isOwner =
      property.ownerId.toString() === req.user._id.toString();

    const isAdmin = req.user.role === "admin";

    if (!isOwner && !isAdmin) {
      return res.status(403).json({
        message: "You are not authorized to update this property",
      });
    }

    /*
     * ownerId ला req.body मधून update होऊ देत नाही.
     * त्यामुळे Admin/Owner accidentally ownership बदलू शकत नाही.
     */

    const allowedFields = [
      "title",
      "description",
      "type",
      "address",
      "city",
      "rent",
      "deposit",
      "bedrooms",
      "bathrooms",
      "amenities",
      "images",
      "availability",
      "status",
    ];

    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        property[field] = req.body[field];
      }
    });

    await property.save();

    const updatedProperty = await Property.findById(
      property._id,
    ).populate("ownerId", "name email phone");

    res.json(updatedProperty);
  } catch (error) {
    res.status(400).json({
      message: "Invalid property data",
      error: error.message,
    });
  }
};

exports.remove = async (req, res) => {
  const property = await Property.findOneAndDelete({
    _id: req.params.id,
    ownerId: req.user._id,
  });

  if (!property) {
    return res.status(404).json({
      message: "Property not found or not owned by you",
    });
  }

  res.json({
    message: "Property deleted",
  });
};

exports.myProperties = async (req, res) =>
  res.json(
    await Property.find({
      ownerId: req.user._id,
    }).sort({
      createdAt: -1,
    }),
  );

/*
|--------------------------------------------------------------------------
| SAVED PROPERTIES (tenant favourites)
|--------------------------------------------------------------------------
*/

exports.saveProperty = async (req, res) => {
  const property = await Property.findById(req.params.id);
  if (!property) {
    return res.status(404).json({ message: "Property not found" });
  }

  await User.findByIdAndUpdate(req.user._id, {
    $addToSet: { savedProperties: property._id },
  });

  res.json({ message: "Property saved" });
};

exports.unsaveProperty = async (req, res) => {
  await User.findByIdAndUpdate(req.user._id, {
    $pull: { savedProperties: req.params.id },
  });

  res.json({ message: "Property removed from saved list" });
};

exports.mySavedProperties = async (req, res) => {
  const user = await User.findById(req.user._id).populate({
    path: "savedProperties",
    populate: { path: "ownerId", select: "name email phone" },
  });

  res.json(user?.savedProperties || []);
};