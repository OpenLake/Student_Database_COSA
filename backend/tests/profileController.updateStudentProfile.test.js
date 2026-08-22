const express = require("express");
const request = require("supertest");
const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");

describe("profileController.updateStudentProfile — object-level authorization", () => {
  let mongod;
  let User;
  let app;
  let attacker;
  let victim;

  beforeAll(async () => {
    mongod = await MongoMemoryServer.create();
    await mongoose.connect(mongod.getUri());

    ({ User } = require("../models/schema"));
    const profileController = require("../controllers/profileController");

    app = express();
    app.use(express.json());
    // Simulates isAuthenticated + passport attaching req.user for whichever
    // account is logged in — the "attacker" account in these tests.
    app.use((req, res, next) => {
      req.user = attacker;
      next();
    });
    app.put("/profile/updateStudentProfile", profileController.updateStudentProfile);
  }, 60000);

  afterAll(async () => {
    await mongoose.disconnect();
    await mongod.stop();
  });

  beforeEach(async () => {
    await User.deleteMany({});
    attacker = await User.create({
      role: "STUDENT",
      strategy: "local",
      username: "attacker@iitbhilai.ac.in",
      user_id: "B24CS001",
      personal_info: { name: "Attacker", email: "attacker@iitbhilai.ac.in" },
      academic_info: { cgpa: 6.0 },
    });
    victim = await User.create({
      role: "STUDENT",
      strategy: "local",
      username: "victim@iitbhilai.ac.in",
      user_id: "B24CS002",
      personal_info: { name: "Victim", email: "victim@iitbhilai.ac.in" },
      academic_info: { cgpa: 9.5 },
    });
  });

  it("does NOT let a logged-in user edit another user's profile by supplying their userId", async () => {
    const res = await request(app)
      .put("/profile/updateStudentProfile")
      .send({
        userId: victim.user_id, // attacker tries to target the victim's record
        updatedDetails: {
          personal_info: { name: "Hacked Name" },
          academic_info: { cgpa: 10 },
        },
      });

    expect(res.status).toBe(200);

    const victimAfter = await User.findById(victim._id);
    expect(victimAfter.personal_info.name).toBe("Victim");
    expect(victimAfter.academic_info.cgpa).toBe(9.5);
  });

  it("does update the caller's own profile", async () => {
    const res = await request(app)
      .put("/profile/updateStudentProfile")
      .send({
        userId: attacker.user_id,
        updatedDetails: {
          personal_info: { name: "Updated Own Name" },
        },
      });

    expect(res.status).toBe(200);

    const attackerAfter = await User.findById(attacker._id);
    expect(attackerAfter.personal_info.name).toBe("Updated Own Name");
  });
});
