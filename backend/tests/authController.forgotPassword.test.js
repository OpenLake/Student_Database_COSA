const express = require("express");
const request = require("supertest");
const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");

// Mock nodemailer so no real email is ever sent during tests.
jest.mock("nodemailer", () => ({
  createTransport: jest.fn(() => ({
    sendMail: jest.fn((mailOptions, callback) => callback(null, { response: "250 OK (mocked)" })),
  })),
}));

process.env.JWT_SECRET_TOKEN = "test-jwt-secret";
process.env.FRONTEND_URL = "https://cosa.test";

describe("authController.forgotPassword", () => {
  let mongod;
  let User;
  let app;

  beforeAll(async () => {
    mongod = await MongoMemoryServer.create();
    await mongoose.connect(mongod.getUri());

    ({ User } = require("../models/schema"));
    const authController = require("../controllers/authController");

    app = express();
    app.use(express.json());
    app.post("/auth/forgot-password", authController.forgotPassword);
  }, 60000);

  afterAll(async () => {
    await mongoose.disconnect();
    await mongod.stop();
  });

  afterEach(async () => {
    await User.deleteMany({});
    jest.restoreAllMocks();
  });

  it("returns 200 and does not leak the reset link/token to the server logs", async () => {
    await User.create({
      role: "STUDENT",
      strategy: "local",
      username: "student1@iitbhilai.ac.in",
      personal_info: { name: "Demo Student", email: "student1@iitbhilai.ac.in" },
    });

    const logSpy = jest.spyOn(console, "log").mockImplementation(() => {});
    const errorSpy = jest.spyOn(console, "error").mockImplementation(() => {});

    const res = await request(app)
      .post("/auth/forgot-password")
      .send({ email: "student1@iitbhilai.ac.in" });

    expect(res.status).toBe(200);

    // The reset link (and therefore the JWT reset token) must never be
    // printed to the server logs — that would let anyone with log access
    // hijack a password reset. See issue #264. Checking both console.log
    // and console.error so a future accidental console.error(link) would
    // still be caught, not just today's exact call site.
    const loggedSomethingWithLink = [...logSpy.mock.calls, ...errorSpy.mock.calls].some(
      (callArgs) =>
        callArgs.some(
          (arg) => typeof arg === "string" && arg.includes("/reset-password/"),
        ),
    );
    expect(loggedSomethingWithLink).toBe(false);
  });

  it("returns 404 for an email that has no account", async () => {
    const res = await request(app)
      .post("/auth/forgot-password")
      .send({ email: "nobody@iitbhilai.ac.in" });

    expect(res.status).toBe(404);
  });
});
