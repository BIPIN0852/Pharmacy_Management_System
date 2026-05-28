const asyncHandler = require("express-async-handler");
const Supplier = require("../models/Supplier");
const Medicine = require("../models/Medicine");

// @desc    Get all suppliers
// @route   GET /api/admin/suppliers
// @access  Private/Admin
const getSuppliers = asyncHandler(async (req, res) => {
  try {
    // Check if Medicine model loaded correctly
    if (!Medicine) {
      throw new Error(
        "Medicine model not loaded. Check '../models/Medicine.js' path.",
      );
    }

    // Fetch ALL suppliers (Active & Inactive)
    const suppliers = await Supplier.find({})
      .populate({
        path: "suppliedMedicines.medicine",
        select: "name manufacturer",
        model: Medicine,
      })
      .sort({ createdAt: -1 });

    res.json(suppliers);
  } catch (error) {
    console.error("Fetch Suppliers Error:", error);

    // 1. Handle Schema Mismatch (Old Data)
    if (
      error.name === "CastError" ||
      error.message.includes("Cast to embedded")
    ) {
      return res.status(500).json({
        message:
          "Database Schema Mismatch: Please delete old supplier records from MongoDB Compass.",
      });
    }

    // 2. Handle Missing Model Registry
    if (error.name === "MissingSchemaError") {
      return res.status(500).json({
        message:
          "Server Error: Medicine Schema not registered. Restart the server.",
      });
    }

    res
      .status(500)
      .json({ message: "Server Error: Could not fetch suppliers" });
  }
});

// @desc    Create a supplier
// @route   POST /api/admin/suppliers
// @access  Private/Admin
const createSupplier = asyncHandler(async (req, res) => {
  const {
    name,
    contactPerson,
    phone,
    email,
    address,
    gstOrPan,
    notes,
    isActive,
    paymentTerms,
    suppliedMedicines,
  } = req.body;

  if (!name) {
    res.status(400);
    throw new Error("Supplier Name is required");
  }

  // Check if supplier exists
  const supplierExists = await Supplier.findOne({ name });
  if (supplierExists) {
    res.status(400);
    throw new Error("Supplier already exists");
  }

  const supplier = await Supplier.create({
    name,
    contactPerson,
    phone,
    email,
    address,
    gstOrPan,
    notes,
    isActive: isActive === undefined ? true : isActive,
    paymentTerms,
    suppliedMedicines,
  });

  res.status(201).json(supplier);
});

// @desc    Update a supplier
// @route   PUT /api/admin/suppliers/:id
// @access  Private/Admin
const updateSupplier = asyncHandler(async (req, res) => {
  const supplier = await Supplier.findById(req.params.id);

  if (supplier) {
    supplier.name = req.body.name || supplier.name;
    supplier.contactPerson = req.body.contactPerson || supplier.contactPerson;
    supplier.phone = req.body.phone || supplier.phone;
    supplier.email = req.body.email || supplier.email;
    supplier.address = req.body.address || supplier.address;
    supplier.gstOrPan = req.body.gstOrPan || supplier.gstOrPan;
    supplier.notes = req.body.notes || supplier.notes;
    supplier.paymentTerms = req.body.paymentTerms || supplier.paymentTerms;
    supplier.suppliedMedicines =
      req.body.suppliedMedicines || supplier.suppliedMedicines;

    if (req.body.isActive !== undefined) {
      supplier.isActive = req.body.isActive;
    }

    const updatedSupplier = await supplier.save();
    res.json(updatedSupplier);
  } else {
    res.status(404);
    throw new Error("Supplier not found");
  }
});

// @desc    Soft Delete a supplier (Deactivate)
// @route   DELETE /api/admin/suppliers/:id
// @access  Private/Admin
const deleteSupplier = asyncHandler(async (req, res) => {
  const supplier = await Supplier.findById(req.params.id);

  if (supplier) {
    supplier.isActive = false;
    await supplier.save();
    res.json({ message: "Supplier marked as inactive" });
  } else {
    res.status(404);
    throw new Error("Supplier not found");
  }
});

module.exports = {
  getSuppliers,
  createSupplier,
  updateSupplier,
  deleteSupplier,
};
