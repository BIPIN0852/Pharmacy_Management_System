// PUT /api/users/profile
const updateUserProfile = async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    // Update basic fields
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    user.phone = req.body.phone || user.phone;
    if (req.body.password) {
      user.password = req.body.password;
    }

    // Update Personal & Medical Fields
    user.gender = req.body.gender || user.gender;
    user.dob = req.body.dob || user.dob;
    user.address = req.body.address || user.address; // Expecting object or string based on your implementation

    user.bloodGroup = req.body.bloodGroup || user.bloodGroup;
    user.allergies = req.body.allergies || user.allergies;
    user.chronicConditions =
      req.body.chronicConditions || user.chronicConditions;
    user.emergencyContact = req.body.emergencyContact || user.emergencyContact;

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      role: updatedUser.role,
      token: generateToken(updatedUser._id), // Optional: Refresh token if needed
      // Return new fields so frontend updates immediately
      phone: updatedUser.phone,
      gender: updatedUser.gender,
      dob: updatedUser.dob,
      address: updatedUser.address,
      bloodGroup: updatedUser.bloodGroup,
      allergies: updatedUser.allergies,
      chronicConditions: updatedUser.chronicConditions,
      emergencyContact: updatedUser.emergencyContact,
    });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
};
