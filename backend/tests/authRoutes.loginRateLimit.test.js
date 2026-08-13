const express = require("express");
const request = require("supertest");
const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");

process.env.JWT_SECRET_TOKEN = "test-jwt-secret";
process.env.FRONTEND_URL = "https://cosa.test";
process.env.BACKEND_URL = "https://api.cosa.test";
process.env.GOOGLE_CLIENT_ID = "test-google-client-id";
process.env.GOOGLE_CLIENT_SECRET = "test-google-client-secret";

describe("POST /auth/login rate limiting", () => {
  let mongod;
  let app;

  beforeAll(async () => {
    mongod = await MongoMemoryServer.create();
    await mongoose.connect(mongod.getUri());

    const passport = require("../models/passportConfig");
    const authRoutes = require("../routes/auth");

    app = express();
    app.use(express.json());
    app.use(passport.initialize());
    app.use("/auth", authRoutes);
  }, 60000);

  afterAll(async () => {
    await mongoose.disconnect();
    await mongod.stop();
  });

  it("blocks further login attempts after the configured limit, instead of allowing unlimited guesses", async () => {
    const attempt = () =>
      request(app)
        .post("/auth/login")
        .send({ email: "nonexistent@iitbhilai.ac.in", password: "wrong-password" });

    // The route's limiter is configured for 10 requests per window (see
    // routes/auth.js). Fire 11 and expect the last one to be throttled.
    const responses = [];
    for (let i = 0; i < 11; i++) {
      // eslint-disable-next-line no-await-in-loop
      responses.push(await attempt());
    }

    const statuses = responses.map((r) => r.status);
    const blocked = statuses.filter((s) => s === 429);

    expect(blocked.length).toBeGreaterThan(0);
    expect(statuses[statuses.length - 1]).toBe(429);
  }, 30000);
});
