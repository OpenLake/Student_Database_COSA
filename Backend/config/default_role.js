const { User } = require("../models/user.model");
require("dotenv").config();

async function seedDefaultRoles() {
  try {
    console.log("Starting to seed default user roles...");

    // Define default users from environment variables
    const defaultUsers = [
      {
        username: process.env.PRESIDENT_USERNAME,
        password: process.env.PRESIDENT_PASSWORD || "president",
        name: "President",
        ID_No: 1,
        role: "president",
        strategy: "local",
      },
      {
        username: process.env.SCITECH_USERNAME,
        password: process.env.SCITECH_PASSWORD || "scitech",
        name: "General Secretary Sci-Tech",
        ID_No: 2,
        role: "gensec-scitech",
        strategy: "local",
      },
      {
        username: process.env.CULT_USERNAME,
        password: process.env.CULT_PASSWORD || "cult",
        name: "General Secretary Cultural",
        ID_No: 3,
        role: "gensec-cult",
        strategy: "local",
      },
      {
        username: process.env.SPORT_USERNAME,
        password: process.env.SPORT_PASSWORD || "sport",
        name: "General Secretary Sports",
        ID_No: 4,
        role: "gensec-sports",
        strategy: "local",
      },
      {
        username: process.env.ACAD_USERNAME,
        password: process.env.ACAD_PASSWORD || "acad",
        name: "General Secretary Academic",
        ID_No: 5,
        role: "gensec-acad",
        strategy: "local",
      },
    ];

    // Create or update each default user
    for (const userData of defaultUsers) {
      // Check if user already exists
      const existingUser = await User.findOne({ username: userData.username });

      if (existingUser) {
        console.log(`User ${userData.username} already exists, skipping...`);
        continue;
      }

      const newUser = await User.register(
        new User({
          username: userData.username,
          name: userData.name,
          ID_No: userData.ID_No,
          role: userData.role,
          strategy: userData.strategy,
        }),
        userData.password,
      );

      await newUser.save();
      console.log(
        `Created default user: ${userData.username} with role: ${userData.role}`,
      );
    }

    console.log("Default user roles seeding completed!");
    return true;
  } catch (error) {
    console.error("Error seeding default roles:", error);
    return false;
  }
}

module.exports = seedDefaultRoles;
