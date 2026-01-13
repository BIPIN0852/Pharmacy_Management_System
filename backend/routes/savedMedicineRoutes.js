// const express = require("express");
// const authenticateToken = require("../middleware/auth");
// const FavouriteMedicine = require("../models/FavouriteMedicine");
// const Medicine = require("../models/Medicine");

// const router = express.Router();

// // GET all favourites for the logged-in customer
// router.get("/", authenticateToken, async (req, res) => {
//   try {
//     if (req.user.role !== "customer") {
//       return res.status(403).json({ message: "Access denied" });
//     }

//     const favourites = await FavouriteMedicine.find({
//       user: req.user.id,
//       isActive: true,
//     })
//       .populate("medicine", "name price image")
//       .sort({ createdAt: -1 })
//       .lean();

//     res.json(favourites);
//   } catch (err) {
//     console.error("Favourites fetch error:", err);
//     res.status(500).json({ message: "Server error" });
//   }
// });

// // POST add a new favourite medicine
// router.post("/", authenticateToken, async (req, res) => {
//   try {
//     if (req.user.role !== "customer") {
//       return res.status(403).json({ message: "Access denied" });
//     }

//     const { medicineId, dosage } = req.body;
//     const medicine = await Medicine.findById(medicineId).lean();

//     if (!medicine) {
//       return res.status(404).json({ message: "Medicine not found" });
//     }

//     const existing = await FavouriteMedicine.findOne({
//       user: req.user.id,
//       medicine: medicineId,
//     });

//     if (existing) {
//       return res.status(400).json({ message: "Already in favourites" });
//     }

//     const favourite = new FavouriteMedicine({
//       user: req.user.id,
//       medicine: medicineId,
//       medicineName: medicine.name,
//       medicineImage: medicine.image,
//       dosage: dosage || "As prescribed",
//       nextRefillDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // Default 30 days later
//     });

//     await favourite.save();
//     res.status(201).json(favourite);
//   } catch (err) {
//     console.error("Add favourite error:", err);
//     res.status(500).json({ message: "Server error" });
//   }
// });

// // DELETE (soft) favourite medicine
// router.delete("/:id", authenticateToken, async (req, res) => {
//   try {
//     const favourite = await FavouriteMedicine.findOneAndUpdate(
//       { _id: req.params.id, user: req.user.id },
//       { isActive: false },
//       { new: true }
//     );

//     if (!favourite) {
//       return res.status(404).json({ message: "Favourite not found" });
//     }

//     res.json({ message: "Removed from favourites" });
//   } catch (err) {
//     console.error("Delete favourite error:", err);
//     res.status(500).json({ message: "Server error" });
//   }
// });

// module.exports = router;

// const express = require("express");
// const authenticateToken = require("../middleware/auth"); // Or '../middleware/authMiddleware'
// const FavouriteMedicine = require("../models/FavouriteMedicine");
// const Medicine = require("../models/Medicine");

// const router = express.Router();

// // @route   GET /api/customer/saved-medicines
// // @desc    Get list of saved medicines (Formatted for Dashboard)
// // @access  Private (Customer)
// router.get("/", authenticateToken, async (req, res) => {
//   try {
//     if (req.user.role !== "customer") {
//       return res.status(403).json({ message: "Access denied" });
//     }

//     // Find all favourites for this user
//     const favourites = await FavouriteMedicine.find({ user: req.user.id })
//       .populate("medicine", "name price image description") // Get actual medicine details
//       .sort({ createdAt: -1 });

//     // Filter out any entries where the medicine might have been deleted from DB
//     // And map it to return just the medicine object (Dashboard expects [ {name, price...}, {name, price...} ])
//     const medicines = favourites
//       .filter((fav) => fav.medicine !== null)
//       .map((fav) => fav.medicine);

//     res.json(medicines);
//   } catch (err) {
//     console.error("Favourites fetch error:", err);
//     res.status(500).json({ message: "Server error" });
//   }
// });

// // @route   POST /api/customer/saved-medicines/:id
// // @desc    Toggle Favourite (Add if missing, Remove if present)
// // @access  Private (Customer)
// router.post("/:id", authenticateToken, async (req, res) => {
//   try {
//     if (req.user.role !== "customer") {
//       return res.status(403).json({ message: "Access denied" });
//     }

//     const medicineId = req.params.id;

//     // Check if the medicine actually exists (Optional safety check)
//     const medicine = await Medicine.findById(medicineId);
//     if (!medicine) {
//       return res.status(404).json({ message: "Medicine not found" });
//     }

//     // Check if currently saved
//     const existing = await FavouriteMedicine.findOne({
//       user: req.user.id,
//       medicine: medicineId,
//     });

//     if (existing) {
//       // --- LOGIC: REMOVE (Toggle Off) ---
//       await FavouriteMedicine.findByIdAndDelete(existing._id);
//       return res.json({
//         success: true,
//         action: "removed",
//         message: "Removed from saved medicines"
//       });
//     } else {
//       // --- LOGIC: ADD (Toggle On) ---
//       // We create a new entry. We populate redundant fields if your model requires them,
//       // otherwise just the reference is enough.
//       const newFav = new FavouriteMedicine({
//         user: req.user.id,
//         medicine: medicineId,
//         // Fallback fields in case your schema requires them based on your previous code:
//         medicineName: medicine.name,
//         medicineImage: medicine.image,
//         isActive: true
//       });

//       await newFav.save();
//       return res.json({
//         success: true,
//         action: "added",
//         message: "Added to saved medicines"
//       });
//     }
//   } catch (err) {
//     console.error("Toggle favourite error:", err);
//     res.status(500).json({ message: "Server error" });
//   }
// });

// module.exports = router;

const express = require("express");
const router = express.Router();

// Models
const FavouriteMedicine = require("../models/FavouriteMedicine");
const Medicine = require("../models/Medicine");

// Middleware
const { protect } = require("../middleware/authMiddleware");

// @route   GET /api/customer/saved-medicines
// @desc    Get list of saved medicines (Formatted for Dashboard)
// @access  Private (Customer)
router.get("/", protect, async (req, res) => {
  try {
    // Find all favourites for this user
    // ✅ Updated to use 'user: req.user._id'
    const favourites = await FavouriteMedicine.find({ user: req.user._id })
      .populate("medicine", "name price image description brand baseUnit") // Get actual medicine details
      .sort({ createdAt: -1 });

    // Format for Dashboard: Return the populated medicine object + the favourite ID
    const formattedMedicines = favourites
      .filter((fav) => fav.medicine !== null) // Filter out deleted medicines
      .map((fav) => ({
        _id: fav.medicine._id, // The Medicine ID (for linking)
        favId: fav._id, // The Favourite Record ID (for deletion)
        name: fav.medicine.name,
        price: fav.medicine.price,
        image: fav.medicine.image,
        brand: fav.medicine.brand,
        description: fav.medicine.description,
        addedAt: fav.createdAt,
      }));

    res.json(formattedMedicines);
  } catch (err) {
    console.error("Favourites fetch error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// @route   POST /api/customer/saved-medicines/:id
// @desc    Toggle Favourite (Add if missing, Remove if present)
// @access  Private (Customer)
router.post("/:id", protect, async (req, res) => {
  try {
    const medicineId = req.params.id;

    // 1. Verify Medicine Exists
    const medicine = await Medicine.findById(medicineId);
    if (!medicine) {
      return res.status(404).json({ message: "Medicine not found" });
    }

    // 2. Check if currently saved
    const existing = await FavouriteMedicine.findOne({
      user: req.user._id,
      medicine: medicineId,
    });

    if (existing) {
      // --- REMOVE (Toggle Off) ---
      await FavouriteMedicine.findByIdAndDelete(existing._id);

      return res.json({
        success: true,
        action: "removed",
        message: "Removed from saved medicines",
      });
    } else {
      // --- ADD (Toggle On) ---
      const newFav = new FavouriteMedicine({
        user: req.user._id,
        medicine: medicineId,
        // ✅ Snapshot fields (Updated to match new Schema)
        name: medicine.name,
        image: medicine.image,
        isActive: true,
        // Optional: Set default reminder logic
        nextRefillDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // Default 30 days
      });

      await newFav.save();

      return res.json({
        success: true,
        action: "added",
        message: "Added to saved medicines",
      });
    }
  } catch (err) {
    console.error("Toggle favourite error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
