// const mongoose = require("mongoose");

// const purchaseItemSchema = new mongoose.Schema(
//   {
//     medicine: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "Medicine",
//       required: true,
//     },
//     quantity: {
//       type: Number,
//       required: true,
//       min: 1,
//     },
//     costPrice: {
//       type: Number,
//       required: true,
//       min: 0,
//     },
//     batchNumber: {
//       type: String,
//       trim: true,
//     },
//     expiryDate: {
//       type: Date,
//     },
//   },
//   { _id: false }
// );

// const purchaseOrderSchema = new mongoose.Schema(
//   {
//     supplier: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "Supplier",
//       required: true,
//     },
//     items: {
//       type: [purchaseItemSchema],
//       validate: [(v) => v.length > 0, "At least one item is required"],
//     },
//     status: {
//       type: String,
//       enum: ["Pending", "Ordered", "Received", "Cancelled"],
//       default: "Pending",
//     },
//     totalCost: {
//       type: Number,
//       required: true,
//       min: 0,
//     },
//     orderedAt: {
//       type: Date,
//       default: Date.now,
//     },
//     receivedAt: {
//       type: Date,
//     },
//     createdBy: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "User",
//     },
//     notes: {
//       type: String,
//       trim: true,
//     },
//   },
//   {
//     timestamps: true, // createdAt, updatedAt
//   }
// );

// module.exports = mongoose.model("PurchaseOrder", purchaseOrderSchema);

// const mongoose = require("mongoose");

// const purchaseItemSchema = new mongoose.Schema(
//   {
//     // ✅ RENAMED: 'medicine' -> 'product' (Matches Order model consistency)
//     product: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "Medicine",
//       required: true,
//     },

//     quantity: {
//       type: Number,
//       required: true,
//       min: 1,
//     },

//     // ✅ RENAMED: 'costPrice' -> 'price' (Matches OrderItem structure)
//     price: {
//       type: Number,
//       required: true,
//       min: 0,
//     },

//     batchNumber: {
//       type: String,
//       trim: true,
//     },

//     expiryDate: {
//       type: Date,
//     },
//   },
//   { _id: false }
// );

// const purchaseOrderSchema = new mongoose.Schema(
//   {
//     supplier: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "Supplier",
//       required: true,
//     },

//     items: {
//       type: [purchaseItemSchema],
//       validate: [(v) => v.length > 0, "At least one item is required"],
//     },

//     status: {
//       type: String,
//       enum: ["Pending", "Ordered", "Received", "Cancelled"],
//       default: "Pending",
//     },

//     totalCost: {
//       type: Number,
//       required: true,
//       min: 0,
//     },

//     orderedAt: {
//       type: Date,
//       default: Date.now,
//     },

//     receivedAt: {
//       type: Date,
//     },

//     createdBy: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "User",
//     },

//     notes: {
//       type: String,
//       trim: true,
//     },
//   },
//   {
//     timestamps: true, // createdAt, updatedAt
//   }
// );

// module.exports = mongoose.model("PurchaseOrder", purchaseOrderSchema);

// const mongoose = require("mongoose");

// const purchaseItemSchema = new mongoose.Schema(
//   {
//     // ✅ Reference to the Medicine Stock
//     product: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "Medicine",
//       required: true,
//     },

//     // Quantity Ordered (e.g., 50)
//     quantity: {
//       type: Number,
//       required: true,
//       min: 1,
//     },

//     // Unit of Measurement (e.g., "Box", "Carton", "Strip")
//     // Helps calculate total stock added to inventory
//     unit: {
//       type: String,
//       default: "Unit",
//       trim: true,
//     },

//     // Cost Price per Unit
//     price: {
//       type: Number,
//       required: true,
//       min: 0,
//     },

//     // ✅ Batch Details (Usually filled when Status = Received)
//     batchNumber: {
//       type: String,
//       trim: true,
//     },
//     expiryDate: {
//       type: Date,
//     },
//   },
//   { _id: false }
// );

// const purchaseOrderSchema = new mongoose.Schema(
//   {
//     // Supplier Reference
//     supplier: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "Supplier",
//       required: true,
//       index: true,
//     },

//     // Unique Invoice/Bill Number from Supplier
//     invoiceNumber: {
//       type: String,
//       trim: true,
//       unique: true, // Prevents duplicate entry of same bill
//       sparse: true, // Allow nulls for Draft/Pending orders
//     },

//     items: {
//       type: [purchaseItemSchema],
//       validate: [(v) => v.length > 0, "At least one item is required"],
//     },

//     // Order Lifecycle Status
//     status: {
//       type: String,
//       enum: ["Pending", "Ordered", "Received", "Cancelled"],
//       default: "Pending",
//       index: true, // Optimizes "Pending Orders" filter in dashboard
//     },

//     // Financials
//     totalCost: {
//       type: Number,
//       required: true,
//       min: 0,
//     },

//     // Dates
//     orderedAt: {
//       type: Date,
//       default: Date.now,
//     },
//     receivedAt: {
//       type: Date,
//     },

//     // Admin/Pharmacist who created this order
//     createdBy: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "User",
//     },

//     notes: {
//       type: String,
//       trim: true,
//     },
//   },
//   {
//     timestamps: true,
//   }
// );

// // -------------------------------------------------------------------
// // ✅ INDEXES
// // -------------------------------------------------------------------

// // 1. Sort by date descending (Newest orders first)
// purchaseOrderSchema.index({ createdAt: -1 });

// // 2. Filter by Status + Supplier (e.g., "Pending orders from Cipla")
// purchaseOrderSchema.index({ status: 1, supplier: 1 });

// module.exports = mongoose.model("PurchaseOrder", purchaseOrderSchema);

const mongoose = require("mongoose");

const purchaseItemSchema = new mongoose.Schema(
  {
    // ✅ Renamed from 'product' to 'medicine' to match frontend state
    medicine: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Medicine",
      required: true,
    },

    // Quantity Ordered
    quantity: {
      type: Number,
      required: true,
      min: 1,
    },

    // Cost Price per Unit (Renamed from 'price' for clarity)
    costPrice: {
      type: Number,
      required: true,
      min: 0,
    },

    // Unit of Measurement (e.g., "Box", "Strip")
    unit: {
      type: String,
      default: "Unit",
      trim: true,
    },

    // ✅ Batch Details (Essential for Pharmacy Stock tracking)
    batchNumber: {
      type: String,
      trim: true,
    },
    expiryDate: {
      type: Date,
    },
  },
  { _id: false }
);

const purchaseOrderSchema = new mongoose.Schema(
  {
    // Supplier Reference
    supplier: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Supplier",
      required: true,
      index: true,
    },

    // Unique Invoice/Bill Number from Supplier
    invoiceNumber: {
      type: String,
      trim: true,
      unique: true,
      sparse: true,
    },

    items: {
      type: [purchaseItemSchema],
      validate: [(v) => v.length > 0, "At least one item is required"],
    },

    // Order Lifecycle Status
    status: {
      type: String,
      enum: ["Pending", "Ordered", "Received", "Cancelled"],
      default: "Pending",
      index: true,
    },

    // Financials
    totalCost: {
      type: Number,
      required: true,
      default: 0,
      min: 0,
    },

    // Dates
    orderedAt: {
      type: Date,
      default: Date.now,
    },
    receivedAt: {
      type: Date,
    },

    // Admin/Pharmacist who created this order
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    notes: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

// -------------------------------------------------------------------
// ✅ MIDDLEWARE: Auto-calculate Total Cost before saving
// -------------------------------------------------------------------
purchaseOrderSchema.pre("save", function (next) {
  if (this.items && this.items.length > 0) {
    this.totalCost = this.items.reduce((acc, item) => {
      return acc + item.quantity * item.costPrice;
    }, 0);
  }

  // Set receivedAt timestamp if status is changed to Received
  if (this.isModified("status") && this.status === "Received") {
    this.receivedAt = Date.now();
  }

  next();
});

// -------------------------------------------------------------------
// ✅ INDEXES
// -------------------------------------------------------------------

// Sort by date descending (Newest orders first)
purchaseOrderSchema.index({ createdAt: -1 });

// Filter by Status + Supplier
purchaseOrderSchema.index({ status: 1, supplier: 1 });

module.exports = mongoose.model("PurchaseOrder", purchaseOrderSchema);
