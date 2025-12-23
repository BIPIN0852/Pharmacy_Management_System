// // Example: routes/dashboard.js (Express)
// router.get("/stats", async (req, res) => {
//   const medicines = await Medicine.countDocuments();
//   const lowStock = await Medicine.countDocuments({ quantity: { $lt: 10 } });
//   const customers = await Customer.countDocuments();
//   const salesToday = await Sale.aggregate([
//     { $match: { date: { $gte: new Date().setHours(0, 0, 0, 0) } } },
//     { $group: { _id: null, total: { $sum: "$amount" } } },
//   ]);

//   res.json({
//     medicines,
//     salesToday: salesToday[0]?.total || 0,
//     lowStock,
//     customers,
//   });
// });
