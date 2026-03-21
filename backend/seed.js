require("dotenv").config();
const mongoose = require("mongoose");

const User = require("./models/userSchema");
const Feedback = require("./models/feedbackSchema");
const Achievement = require("./models/achievementSchema");
const { Skill, UserSkill } = require("./models/schema");
const Event = require("./models/eventSchema");
const PositionHolder = require("./models/positionHolderSchema");
const Position = require("./models/positionSchema");
const OrganizationalUnit = require("./models/organizationSchema");
const Template = require("./models/templateSchema");
const { CertificateBatch, Certificate } = require("./models/certificateSchema");

// --- Data for Seeding ---

// Original club/committee data.
const initialUnitsData = [
  {
    unit_id: "CLUB_OPENLAKE",
    name: "OpenLake",
    type: "Club",
    description: "Open Source Club of IIT Bhilai",
    hierarchy_level: 2,
    category: "scitech",
    contact_info: { email: "openlake@iitbhilai.ac.in", social_media: [] },
  },
  {
    unit_id: "CLUB_RENAISSANCE",
    name: "Renaissance",
    type: "Club",
    description: "Fine Arts Club under Cultural Council.",
    hierarchy_level: 2,
    category: "cultural",
    contact_info: {
      email: "renaissance@iitbhilai.ac.in",
      social_media: [
        {
          platform: "Instagram",
          url: "https://www.instagram.com/renaissance_iitbh?igsh=dzRqNmV5bncxZWp1",
        },
        {
          platform: "LinkedIn",
          url: "https://www.linkedin.com/in/renaissance-club-a76430331",
        },
      ],
    },
  },
  {
    unit_id: "CLUB_GOALS",
    name: "GOALS",
    type: "Club",
    description:
      "General Oratory and Literary Society handling Literature and Oration.",
    hierarchy_level: 2,
    category: "independent",
    contact_info: {
      email: "goals@iitbhilai.ac.in",
      social_media: [
        {
          platform: "Instagram",
          url: "https://www.instagram.com/goals_iitbhilai?igsh=ejF6NzVmM3lxMmky",
        },
        {
          platform: "LinkedIn",
          url: "https://www.linkedin.com/company/general-oratory-and-literary-society-goals/",
        },
      ],
    },
  },
  {
    unit_id: "CLUB_BEATHACKERS",
    name: "Beathackers",
    type: "Club",
    description: "The Dance Club of IIT Bhilai.",
    hierarchy_level: 2,
    category: "cultural",
    contact_info: {
      email: "beathackers@iitbhilai.ac.in",
      social_media: [
        {
          platform: "Instagram",
          url: "https://www.instagram.com/beathackers_iitbhilai?igsh=YnVmbGozZ2V3dWE=",
        },
        {
          platform: "YouTube",
          url: "https://youtube.com/@beathackersiitbhilai8247",
        },
      ],
    },
  },
  {
    unit_id: "CLUB_EPSILON",
    name: "The Epsilon Club",
    type: "Club",
    description: "Robotics Club of IIT Bhilai",
    hierarchy_level: 2,
    category: "scitech",
    contact_info: {
      email: "epsilon@iitbhilai.ac.in",
      social_media: [
        {
          platform: "Instagram",
          url: "https://www.instagram.com/roboticsclub_iitbhilai",
        },
        {
          platform: "LinkedIn",
          url: "https://www.linkedin.com/company/the-epsilon-club-iit-bhilai-robotics-club/",
        },
      ],
    },
  },
  {
    unit_id: "CLUB_INGENUITY",
    name: "Ingenuity",
    type: "Club",
    description: "Competitive programming club fostering problem-solving.",
    hierarchy_level: 2,
    category: "scitech",
    contact_info: {
      email: "ingenuity@iitbhilai.ac.in",
      social_media: [
        {
          platform: "Instagram",
          url: "https://www.instagram.com/ingenuity_iit_bh/",
        },
        {
          platform: "LinkedIn",
          url: "https://www.linkedin.com/company/74349589/admin/dashboard/",
        },
      ],
    },
  },
  {
    unit_id: "CLUB_DESIGNX",
    name: "DesignX",
    type: "Club",
    description: "Digital Arts club of IIT Bhilai.",
    hierarchy_level: 2,
    category: "cultural",
    contact_info: {
      email: "designx@iitbhilai.ac.in",
      social_media: [
        {
          platform: "Instagram",
          url: "https://www.instagram.com/designx_iitbhilai?igsh=NTc4MTIwNjQ2YQ==",
        },
        {
          platform: "LinkedIn",
          url: "https://www.linkedin.com/in/designx-iit-bhilai-612a7a371",
        },
      ],
    },
  },
  {
    unit_id: "CLUB_SPECTRE",
    name: "Spectre",
    type: "Club",
    description: "Cybersecurity Club of IIT Bhilai.",
    hierarchy_level: 2,
    category: "scitech",
    contact_info: {
      email: "spectre@iitbhilai.ac.in",
      social_media: [
        {
          platform: "Instagram",
          url: "https://www.instagram.com/spectre_iitbhilai?igsh=ZDlyaDlqeXllYjNk",
        },
        {
          platform: "LinkedIn",
          url: "https://www.linkedin.com/company/spectre-iit-bhilai/",
        },
      ],
    },
  },
  {
    unit_id: "COMMITTEE_EXTERNAL",
    name: "External Affairs",
    type: "Committee",
    description: "Handles sponsorship and PR opportunities of IIT Bhilai.",
    hierarchy_level: 1,
    category: "independent",
    contact_info: {
      email: "Outreach_cosa@iitbhilai.ac.in",
      social_media: [
        {
          platform: "LinkedIn",
          url: "https://www.linkedin.com/in/external-affairs-iit-bhilai-8246a737b",
        },
      ],
    },
  },
  {
    unit_id: "CLUB_YOGA",
    name: "Yoga Club",
    type: "Club",
    description: "Promotes physical and mental well-being through yoga.",
    hierarchy_level: 2,
    category: "sports",
    contact_info: { email: "sports_yoga@iitbhilai.ac.in", social_media: [] },
  },
  {
    unit_id: "CLUB_MOTORSPORTS",
    name: "Motorsports",
    type: "Club",
    description: "Promotes automotive culture in the institute.",
    hierarchy_level: 2,
    category: "scitech",
    contact_info: {
      email: "baja@iitbhilai.ac.in",
      social_media: [
        {
          platform: "Instagram",
          url: "https://www.instagram.com/iitbhilaimotorsports",
        },
        {
          platform: "LinkedIn",
          url: "https://www.linkedin.com/company/iit-bhilai-motorsports/",
        },
      ],
    },
  },
  {
    unit_id: "CLUB_FPS",
    name: "Film Production Society",
    type: "Club",
    description: "Film-making society of IIT Bhilai.",
    hierarchy_level: 2,
    category: "cultural",
    contact_info: {
      email: "fps@iitbhilai.ac.in",
      social_media: [
        { platform: "Instagram", url: "https://www.instagram.com/fps_iitbh" },
        { platform: "YouTube", url: "http://youtube.com/@fps-iitbhilai9282" },
      ],
    },
  },
  {
    unit_id: "CLUB_SWARA",
    name: "Swara",
    type: "Club",
    description: "Music Club of IIT Bhilai.",
    hierarchy_level: 2,
    category: "cultural",
    contact_info: {
      email: "swara@iitbhilai.ac.in",
      social_media: [
        { platform: "Instagram", url: "https://www.instagram.com/swara_iitbh" },
        { platform: "YouTube", url: "https://youtube.com/@swaraiitbhilai" },
      ],
    },
  },
];

/**
 * Clears all data from the relevant collections.
 */
const clearData = async () => {
  console.log("Clearing existing data...");
  await OrganizationalUnit.deleteMany({});
  await Position.deleteMany({});
  await User.deleteMany({});
  await PositionHolder.deleteMany({});
  await Event.deleteMany({});
  await Skill.deleteMany({});
  await UserSkill.deleteMany({});
  await Achievement.deleteMany({});
  await Feedback.deleteMany({});
  await Template.deleteMany({});
  await CertificateBatch.deleteMany({});
  await Certificate.deleteMany({});
  // Drop the stale legacy certificateId_1 unique index if it exists from a
  // previous schema version — it conflicts with Pending certs (null values).
  try {
    await Certificate.collection.dropIndex("certificateId_1");
    console.log("Dropped stale certificateId_1 index.");
  } catch (_) {
    // Index doesn't exist — nothing to do.
  }
  console.log("All collections cleared successfully!");
};

/**
 * Seeds the Organizational Units with a proper hierarchy.
 */
const seedOrganizationalUnits = async () => {
  console.log("Seeding Organizational Units...");

  // 1. Create the top-level President unit
  const presidentUnit = await OrganizationalUnit.create({
    unit_id: "PRESIDENT_GYMKHANA",
    name: "President, Student Gymkhana",
    type: "independent_position",
    description:
      "The highest student representative body in the Student Gymkhana.",
    parent_unit_id: null,
    hierarchy_level: 0,
    category: "independent",
    contact_info: {
      email: "president_gymkhana@iitbhilai.ac.in",
      social_media: [],
    },
  });
  console.log("Created President Unit.");

  // 2. Create the main councils (Gensecs) and link them to the President
  const mainCouncilsData = [
    {
      unit_id: "COUNCIL_CULTURAL",
      name: "Cultural Council",
      type: "Council",
      description: "Council for all cultural activities.",
      hierarchy_level: 1,
      category: "cultural",
      contact_info: {
        email: "gensec_cultural_gymkhana@iitbhilai.ac.in",
        social_media: [],
      },
      parent_unit_id: presidentUnit._id,
    },
    {
      unit_id: "COUNCIL_SCITECH",
      name: "Science and Technology Council",
      type: "Council",
      description: "Council for all science and technology activities.",
      hierarchy_level: 1,
      category: "scitech",
      contact_info: {
        email: "gensec_scitech_gymkhana@iitbhilai.ac.in",
        social_media: [],
      },
      parent_unit_id: presidentUnit._id,
    },
    {
      unit_id: "COUNCIL_SPORTS",
      name: "Sports Council",
      type: "Council",
      description: "Council for all sports activities.",
      hierarchy_level: 1,
      category: "sports",
      contact_info: {
        email: "gensec_sports_gymkhana@iitbhilai.ac.in",
        social_media: [],
      },
      parent_unit_id: presidentUnit._id,
    },
    {
      unit_id: "COUNCIL_ACADEMIC",
      name: "Academic Affairs Council",
      type: "Council",
      description: "Council for all academic affairs.",
      hierarchy_level: 1,
      category: "academic",
      contact_info: {
        email: "gensec_academic_gymkhana@iitbhilai.ac.in",
        social_media: [],
      },
      parent_unit_id: presidentUnit._id,
    },
  ];
  await OrganizationalUnit.insertMany(mainCouncilsData);
  console.log("Created Main Councils (Gensecs).");

  // 3. Link initial clubs and committees to their respective parent councils
  const councils = await OrganizationalUnit.find({ type: "Council" });
  const councilMap = councils.reduce((map, council) => {
    map[council.category] = council._id;
    return map;
  }, {});

  const linkedUnitsData = initialUnitsData.map((unit) => {
    return Object.assign({}, unit, {
      parent_unit_id: councilMap[unit.category] || presidentUnit._id,
    });
  });
  await OrganizationalUnit.insertMany(linkedUnitsData);
  console.log("Seeded and linked initial clubs and committees.");
  console.log("Organizational Units seeded successfully!");
};

/**
 * Seeds the User collection.
 * - One local-auth position-holder user per org unit (username = unit contact email).
 * - 10 google-auth student users (student1@iitbhilai.ac.in … student10@iitbhilai.ac.in).
 */
const seedUsers = async () => {
  console.log("Seeding Users...");
  const units = await OrganizationalUnit.find({});
  let localUserCount = 0;
  const googleAuthUsers = [];
  const password = "password123";
  const branches = ["CSE", "EE"];
  const batchYears = ["2026", "2027"];

  for (const unit of units) {
    let role;

    if (unit.unit_id.includes("PRESIDENT_GYMKHANA")) {
      role = "PRESIDENT";
    } else if (unit.unit_id.includes("COUNCIL_CULTURAL")) {
      role = "GENSEC_CULTURAL";
    } else if (unit.unit_id.includes("COUNCIL_SCITECH")) {
      role = "GENSEC_SCITECH";
    } else if (unit.unit_id.includes("COUNCIL_SPORTS")) {
      role = "GENSEC_SPORTS";
    } else if (
      unit.unit_id.includes("COUNCIL_ACADEMIC") ||
      unit.unit_id.includes("COUNCIL_ACAD")
    ) {
      role = "GENSEC_ACADEMIC";
    } else if (unit.type === "Club" || unit.type === "Committee") {
      role = "CLUB_COORDINATOR";
    } else {
      role = "STUDENT";
    }

    const batch_year =
      batchYears[Math.floor(Math.random() * batchYears.length)];
    // Assuming Sep 2025 as current time: 2026 grad year -> 4th year, 2027 grad year -> 3rd year
    const current_year = batch_year === "2026" ? "4" : "3";

    const academic_info = {
      program: "B.Tech",
      branch: branches[Math.floor(Math.random() * branches.length)],
      batch_year: batch_year,
      current_year: current_year,
      cgpa: parseFloat((Math.random() * (10.0 - 6.0) + 6.0).toFixed(2)),
    };

    await User.create({
      username: unit.contact_info.email,
      password: password,
      role: role,
      strategy: "local",
      onboardingComplete: true,
      personal_info: {
        name: `Student${localUserCount + 1}`,
        email: unit.contact_info.email,
      },
      academic_info: academic_info,
    });

    localUserCount++;
  }
  console.log(`Seeded ${localUserCount} local auth users.`);

  // Add 10 dummy student users with google auth
  for (let i = 1; i <= 10; i++) {
    const userEmail = `student${i}@iitbhilai.ac.in`;

    const batch_year =
      batchYears[Math.floor(Math.random() * batchYears.length)];
    const current_year = batch_year === "2026" ? "4" : "3";
    const academic_info = {
      program: "B.Tech",
      branch: branches[Math.floor(Math.random() * branches.length)],
      batch_year: batch_year,
      current_year: current_year,
      cgpa: parseFloat((Math.random() * (10.0 - 6.0) + 6.0).toFixed(2)),
    };

    googleAuthUsers.push({
      username: userEmail,
      role: "STUDENT",
      strategy: "google",
      onboardingComplete: true,
      personal_info: { name: `Student${i}`, email: userEmail },
      academic_info: academic_info,
    });
  }

  if (googleAuthUsers.length > 0) {
    await User.insertMany(googleAuthUsers);
    console.log(`Created ${googleAuthUsers.length} Google auth users.`);
  }
  console.log("Users seeded successfully!");
};

/**
 * Seeds the Position collection.
 * Creates exactly ONE valid position per unit, with a title that matches
 * the Position schema enum and corresponds to the role of that unit's user:
 *
 *   PRESIDENT_GYMKHANA unit   → "PRESIDENT"
 *   Council units             → "GENSEC_<CATEGORY>"   (only valid enum values)
 *   Club / Committee units    → "CLUB_COORDINATOR"
 *
 * Any unit type that does not map to a valid enum value is skipped.
 */
const seedPositions = async () => {
  console.log("Seeding Positions...");
  const units = await OrganizationalUnit.find({});

  // Valid Gensec titles as defined by the Position schema enum
  const validGensecTitles = new Set([
    "GENSEC_CULTURAL",
    "GENSEC_SCITECH",
    "GENSEC_SPORTS",
    "GENSEC_ACADEMIC",
  ]);

  const positionsToCreate = [];

  for (const unit of units) {
    let title;

    if (unit.unit_id === "PRESIDENT_GYMKHANA") {
      title = "PRESIDENT";
    } else if (unit.type === "Council") {
      const mapped = `GENSEC_${unit.category.toUpperCase()}`;
      if (!validGensecTitles.has(mapped)) continue;
      title = mapped;
    } else if (unit.type === "Club" || unit.type === "Committee") {
      title = "CLUB_COORDINATOR";
    } else {
      // e.g. "independent_position" type — no matching enum value, skip
      continue;
    }

    positionsToCreate.push({
      position_id: `POS_${unit.unit_id}`,
      title,
      unit_id: unit._id,
      position_type: "Leadership",
      description: `${title} position for ${unit.name}.`,
      position_count: 1,
      responsibilities: [`Fulfill the duties of ${title} for ${unit.name}.`],
      requirements: {
        min_cgpa: 6.0,
        min_year: 1,
        skills_required: [],
      },
    });
  }

  if (positionsToCreate.length > 0) {
    await Position.insertMany(positionsToCreate);
    console.log(`Created ${positionsToCreate.length} positions.`);
  } else {
    console.log("No valid positions to create.");
  }

  console.log("Positions seeded successfully!");
};

/**
 * Seeds the PositionHolder collection for auto-generated role users.
 * For every local-auth user that holds a named role (PRESIDENT, GENSEC_*, CLUB_COORDINATOR),
 * finds the org unit whose contact email matches the user's username,
 * then looks up the position for that unit and creates a PositionHolder record.
 */
const seedPositionHolders = async () => {
  console.log("Seeding Position Holders...");

  const namedRoles = [
    "PRESIDENT",
    "GENSEC_CULTURAL",
    "GENSEC_SCITECH",
    "GENSEC_SPORTS",
    "GENSEC_ACADEMIC",
    "CLUB_COORDINATOR",
  ];

  // Only auto-generated users (their username = their unit's contact email)
  const roleUsers = await User.find({
    strategy: "local",
    role: { $in: namedRoles },
  });

  if (roleUsers.length === 0) {
    console.log("No role users found. Skipping position holders.");
    return;
  }

  const positionHoldersToCreate = [];

  for (const user of roleUsers) {
    // Match the unit by its contact email
    const unit = await OrganizationalUnit.findOne({
      "contact_info.email": user.username,
    });
    if (!unit) continue;

    // Find the position for this unit with the matching role title
    const position = await Position.findOne({
      title: user.role,
      unit_id: unit._id,
    });
    if (!position) continue;

    positionHoldersToCreate.push({
      por_id: `POR_${user._id}_${position._id}`,
      user_id: user._id,
      position_id: position._id,
      tenure_year: "2024-2025",
      status: "active",
    });
  }

  if (positionHoldersToCreate.length > 0) {
    await PositionHolder.insertMany(positionHoldersToCreate);
    console.log(`Created ${positionHoldersToCreate.length} position holders.`);
  } else {
    console.log("Could not create any position holders.");
  }

  console.log("Position Holders seeded successfully!");
};

/**
 * Seeds named dev/test users with fixed credentials.
 * Each position-holding user is also wired to the correct Position and
 * PositionHolder documents so the full certificate-batch service flow works.
 *
 *   STUDENT          rahul.verma@iitbhilai.ac.in  / password123
 *   CLUB_COORDINATOR kaushik@iitbhilai.ac.in       / kaushik123  -> OpenLake
 *   PRESIDENT        kaushikks@iitbhilai.ac.in     / kaushik123  -> President Gymkhana
 *   GENSEC_CULTURAL  gensec_cult@iitbhilai.ac.in   / kaushik123  -> Cultural Council
 */
const seedNamedUsers = async () => {
  console.log("Seeding named dev users...");

  // -- 1. STUDENT - Rahul Verma --------------------------------------------------
  await User.create({
    username: "rahul.verma@iitbhilai.ac.in",
    password: "password123",
    role: "STUDENT",
    strategy: "local",
    onboardingComplete: true,
    personal_info: {
      name: "Rahul Verma",
      email: "rahul.verma@iitbhilai.ac.in",
    },
    academic_info: {
      program: "B.Tech",
      branch: "CSE",
      batch_year: "2026",
      current_year: "4",
      cgpa: 8.5,
    },
  });
  console.log("  Created student: Rahul Verma");

  // -- 2. CLUB_COORDINATOR - Kaushik -> OpenLake ---------------------------------
  const openLake = await OrganizationalUnit.findOne({
    unit_id: "CLUB_OPENLAKE",
  });
  if (!openLake) {
    console.log("  OpenLake unit not found - skipping named coordinator.");
  } else {
    const coordinatorPosition = await Position.findOne({
      title: "CLUB_COORDINATOR",
      unit_id: openLake._id,
    });
    if (!coordinatorPosition) {
      console.log(
        "  CLUB_COORDINATOR position for OpenLake not found - skipping.",
      );
    } else {
      const kaushikCoord = await User.create({
        username: "kaushik@iitbhilai.ac.in",
        password: "kaushik123",
        role: "CLUB_COORDINATOR",
        strategy: "local",
        onboardingComplete: true,
        personal_info: {
          name: "Kaushik",
          email: "kaushik@iitbhilai.ac.in",
        },
        academic_info: {
          program: "B.Tech",
          branch: "CSE",
          batch_year: "2026",
          current_year: "4",
          cgpa: 9.0,
        },
      });
      await PositionHolder.create({
        por_id: "POR_NAMED_KAUSHIK_COORD_" + kaushikCoord._id,
        user_id: kaushikCoord._id,
        position_id: coordinatorPosition._id,
        tenure_year: "2024-2025",
        status: "active",
      });
      console.log("  Created coordinator: Kaushik -> OpenLake");
    }
  }

  // -- 3. PRESIDENT - Kaushik KS -------------------------------------------------
  const presidentUnit = await OrganizationalUnit.findOne({
    unit_id: "PRESIDENT_GYMKHANA",
  });
  if (!presidentUnit) {
    console.log("  President unit not found - skipping named president.");
  } else {
    const presidentPosition = await Position.findOne({
      title: "PRESIDENT",
      unit_id: presidentUnit._id,
    });
    if (!presidentPosition) {
      console.log("  PRESIDENT position not found - skipping.");
    } else {
      const kaushikPres = await User.create({
        username: "kaushikks@iitbhilai.ac.in",
        password: "kaushik123",
        role: "PRESIDENT",
        strategy: "local",
        onboardingComplete: true,
        personal_info: {
          name: "Kaushik",
          email: "kaushikks@iitbhilai.ac.in",
        },
        academic_info: {
          program: "B.Tech",
          branch: "CSE",
          batch_year: "2026",
          current_year: "4",
          cgpa: 9.2,
        },
      });
      await PositionHolder.create({
        por_id: "POR_NAMED_KAUSHIK_PRES_" + kaushikPres._id,
        user_id: kaushikPres._id,

        position_id: presidentPosition._id,
        tenure_year: "2024-2025",
        status: "active",
      });
      console.log("  Created president: Kaushik KS -> President Gymkhana");
    }
  }

  // -- 4. GENSEC_CULTURAL - Test Cultural Council --------------------------------
  const culturalCouncil = await OrganizationalUnit.findOne({
    unit_id: "COUNCIL_CULTURAL",
  });
  if (!culturalCouncil) {
    console.log("  Cultural council not found - skipping named gensec.");
  } else {
    const gensecPosition = await Position.findOne({
      title: "GENSEC_CULTURAL",
      unit_id: culturalCouncil._id,
    });
    if (!gensecPosition) {
      console.log("  GENSEC_CULTURAL position not found - skipping.");
    } else {
      const gensecCultural = await User.create({
        username: "gensec_cult@iitbhilai.ac.in",
        password: "kaushik123",
        role: "GENSEC_CULTURAL",
        strategy: "local",
        onboardingComplete: true,
        personal_info: {
          name: "Test Cultural Council",
          email: "gensec_cult@iitbhilai.ac.in",
        },
        academic_info: {
          program: "B.Tech",
          branch: "CSE",
          batch_year: "2026",
          current_year: "4",
          cgpa: 8.8,
        },
      });
      await PositionHolder.create({
        por_id: "POR_NAMED_GENSEC_CULT_" + gensecCultural._id,
        user_id: gensecCultural._id,
        position_id: gensecPosition._id,
        tenure_year: "2024-2025",
        status: "active",
      });
      console.log(
        "  Created gensec cultural: Test Cultural Council -> Cultural Council",
      );
    }
  }

  console.log("Named dev users seeded successfully!");
};

/**
 * Seeds the Skill collection with a predefined list of skills.
 */
const seedSkills = async () => {
  console.log("Seeding Skills...");
  const skillsData = [
    {
      skill_id: "SKL_JS",
      name: "JavaScript",
      category: "Programming",
      type: "technical",
    },
    {
      skill_id: "SKL_PY",
      name: "Python",
      category: "Programming",
      type: "technical",
    },
    {
      skill_id: "SKL_REACT",
      name: "React",
      category: "Web Development",
      type: "technical",
    },
    {
      skill_id: "SKL_NODE",
      name: "Node.js",
      category: "Web Development",
      type: "technical",
    },
    {
      skill_id: "SKL_MONGO",
      name: "MongoDB",
      category: "Database",
      type: "technical",
    },
    {
      skill_id: "SKL_CYBER",
      name: "Cybersecurity",
      category: "Security",
      type: "technical",
    },
    {
      skill_id: "SKL_ROBO",
      name: "Robotics",
      category: "Hardware",
      type: "technical",
    },
    {
      skill_id: "SKL_DANCE",
      name: "Dancing",
      category: "Performing Arts",
      type: "cultural",
    },
    {
      skill_id: "SKL_SING",
      name: "Singing",
      category: "Performing Arts",
      type: "cultural",
    },
    {
      skill_id: "SKL_PAINT",
      name: "Painting",
      category: "Fine Arts",
      type: "cultural",
    },
    {
      skill_id: "SKL_DART",
      name: "Digital Art",
      category: "Fine Arts",
      type: "cultural",
    },
    {
      skill_id: "SKL_SPEAK",
      name: "Public Speaking",
      category: "Literary",
      type: "cultural",
    },
    {
      skill_id: "SKL_FILM",
      name: "Film Making",
      category: "Media",
      type: "cultural",
    },
    {
      skill_id: "SKL_CRIC",
      name: "Cricket",
      category: "Team Sport",
      type: "sports",
    },
    {
      skill_id: "SKL_FOOT",
      name: "Football",
      category: "Team Sport",
      type: "sports",
    },
    { skill_id: "SKL_YOGA", name: "Yoga", category: "Fitness", type: "sports" },
    {
      skill_id: "SKL_BASK",
      name: "Basketball",
      category: "Team Sport",
      type: "sports",
    },
  ];
  await Skill.insertMany(skillsData);
  console.log("Created " + skillsData.length + " skills.");
  console.log("Skills seeded successfully!");
};

/**
 * Assigns a random set of skills to each student user.
 */
const seedUserSkills = async () => {
  console.log("Assigning skills to users...");
  const skills = await Skill.find({});
  const students = await User.find({ role: "STUDENT" });

  if (skills.length === 0 || students.length === 0) {
    console.log("No skills or students found. Skipping user skills.");
    return;
  }

  const userSkillsToCreate = [];
  const proficiencyLevels = ["beginner", "intermediate", "advanced", "expert"];

  for (const student of students) {
    const count = Math.floor(Math.random() * 3) + 2;
    const shuffled = [...skills].sort(() => 0.5 - Math.random());
    const selectedSkills = shuffled.slice(0, count);

    for (const skill of selectedSkills) {
      userSkillsToCreate.push({
        user_id: student._id,
        skill_id: skill._id,
        proficiency_level:
          proficiencyLevels[
            Math.floor(Math.random() * proficiencyLevels.length)
          ],
        is_endorsed: false,
      });
    }
  }

  if (userSkillsToCreate.length > 0) {
    await UserSkill.insertMany(userSkillsToCreate);
    console.log(
      "Assigned " +
        userSkillsToCreate.length +
        " skills across " +
        students.length +
        " students.",
    );
  }
  console.log("User skills seeded successfully!");
};

/**
 * Seeds the Event collection - one completed and one planned event per club.
 */
const seedEvents = async () => {
  console.log("Seeding Events for clubs...");

  const clubs = await OrganizationalUnit.find({ type: "Club" });
  const students = await User.find({ role: "STUDENT" });

  if (clubs.length === 0 || students.length === 0) {
    console.log("No clubs or students found. Skipping events.");
    return;
  }

  const eventsToCreate = [];
  const now = new Date();

  for (const club of clubs) {
    const clubCategoryMap = { scitech: "technical", independent: "other" };
    const eventCategory = clubCategoryMap[club.category] || club.category;

    // Completed event
    const participants = [...students]
      .sort(() => 0.5 - Math.random())
      .slice(0, 5);
    if (participants.length === 0) continue;

    eventsToCreate.push({
      event_id: "EVENT_" + club.unit_id + "_COMPLETED",
      title: "Annual " + club.category + " Gala",
      description:
        "A look back at the amazing " +
        club.category +
        " events of the past year.",
      category: eventCategory,
      type: "Gala",
      organizing_unit_id: club._id,
      schedule: {
        start: new Date(now.getFullYear(), now.getMonth() - 1, 15),
        end: new Date(now.getFullYear(), now.getMonth() - 1, 15),
        venue: "Main Auditorium",
        mode: "offline",
      },
      status: "completed",
      participants: participants.map((p) => p._id),
      winners: [{ user: participants[0]._id, position: "1st Place" }],
    });

    // Planned event
    eventsToCreate.push({
      event_id: "EVENT_" + club.unit_id + "_PLANNED",
      title: "Introductory Workshop on " + club.category,
      description: "Join us for a fun and interactive workshop!",
      category: eventCategory,
      type: "Workshop",
      organizing_unit_id: club._id,
      schedule: {
        start: new Date(now.getFullYear(), now.getMonth() + 1, 10),
        end: new Date(now.getFullYear(), now.getMonth() + 1, 10),
        venue: "Room C101",
        mode: "offline",
      },
      registration: {
        required: true,
        start: new Date(now.getFullYear(), now.getMonth(), 1),
        end: new Date(now.getFullYear(), now.getMonth() + 1, 5),
        fees: 0,
        max_participants: 50,
      },
      status: "planned",
    });
  }

  if (eventsToCreate.length > 0) {
    await Event.insertMany(eventsToCreate);
    console.log("Created " + eventsToCreate.length + " events.");
  }
  console.log("Events seeded successfully!");
};

/**
 * Seeds the Achievement collection from event winners.
 */
const seedAchievements = async () => {
  console.log("Seeding Achievements from event winners...");

  const completedEvents = await Event.find({
    status: "completed",
    winners: { $exists: true, $not: { $size: 0 } },
  }).populate("organizing_unit_id");

  if (completedEvents.length === 0) {
    console.log(
      "No completed events with winners found. Skipping achievements.",
    );
    return;
  }

  const achievementsToCreate = [];

  for (const event of completedEvents) {
    for (const winner of event.winners) {
      const achievementCategory =
        event.category === "technical" ? "scitech" : event.category;
      achievementsToCreate.push({
        achievement_id: "ACH_" + event.event_id + "_" + winner.user,
        user_id: winner.user,
        title: "Winner of " + event.title,
        description:
          "Achieved " +
          winner.position +
          " in the " +
          event.title +
          " event organized by " +
          event.organizing_unit_id.name +
          ".",
        category: achievementCategory,
        type: "Competition",
        level: "Institute",
        date_achieved: event.schedule.end,
        position: winner.position,
        event_id: event._id,
        verified: true,
      });
    }
  }

  if (achievementsToCreate.length > 0) {
    await Achievement.insertMany(achievementsToCreate);
    console.log("Created " + achievementsToCreate.length + " achievements.");
  }
  console.log("Achievements seeded successfully!");
};

/**
 * Seeds the Feedback collection for events and clubs.
 */
const seedFeedbacks = async () => {
  console.log("Seeding Feedback...");

  const students = await User.find({ role: "STUDENT" });
  const completedEvents = await Event.find({ status: "completed" });
  const clubs = await OrganizationalUnit.find({ type: "Club" });

  if (
    students.length < 2 ||
    completedEvents.length === 0 ||
    clubs.length === 0
  ) {
    console.log("Not enough data for feedback. Skipping.");
    return;
  }

  const feedbacksToCreate = [];
  const eventToReview = completedEvents[0];
  const reviewer1 = students[0];
  const reviewer2 = students[1];

  feedbacksToCreate.push({
    feedback_id: "FDB_EVT_" + eventToReview._id + "_" + reviewer1._id,
    type: "Event Feedback",
    target_id: eventToReview._id,
    target_type: "Event",
    feedback_by: reviewer1._id,
    rating: 5,
    comments: "This was an amazing event! Well organized and very engaging.",
    is_anonymous: false,
  });

  feedbacksToCreate.push({
    feedback_id: "FDB_EVT_" + eventToReview._id + "_" + reviewer2._id,
    type: "Event Feedback",
    target_id: eventToReview._id,
    target_type: "Event",
    feedback_by: reviewer2._id,
    rating: 4,
    comments: "Good event, but the timings could have been better.",
    is_anonymous: true,
  });

  const clubToReview = clubs[0];
  feedbacksToCreate.push({
    feedback_id: "FDB_OU_" + clubToReview._id + "_" + reviewer1._id,
    type: "Unit Feedback",
    target_id: clubToReview._id,
    target_type: "Organizational_Unit",
    feedback_by: reviewer1._id,
    rating: 4,
    comments:
      "The " + clubToReview.name + " is doing a great job this semester.",
    is_anonymous: false,
  });

  if (feedbacksToCreate.length > 0) {
    await Feedback.insertMany(feedbacksToCreate);
    console.log("Created " + feedbacksToCreate.length + " feedback entries.");
  }
  console.log("Feedback seeded successfully!");
};

/**
 * Seeds the Template collection — one active template per certificate category.
 * All templates are authored by the President user.
 */
const seedTemplates = async () => {
  console.log("Seeding Templates...");

  const president = await User.findOne({ role: "PRESIDENT" });
  if (!president) {
    console.log("No president user found. Skipping templates.");
    return;
  }

  const templatesToCreate = [
    {
      title: "Cultural Events Participation Certificate",
      description:
        "Awarded to students who participated in cultural events organised by the Cultural Council.",
      design: "Default",
      createdBy: president._id,
      category: "CULTURAL",
      status: "Active",
    },
    {
      title: "Science & Technology Achievement Certificate",
      description:
        "Awarded to students who participated in science and technology events organised by the SciTech Council.",
      design: "Default",
      createdBy: president._id,
      category: "TECHNICAL",
      status: "Active",
    },
    {
      title: "Sports Excellence Certificate",
      description:
        "Awarded to students who demonstrated excellence in sports events organised by the Sports Council.",
      design: "Default",
      createdBy: president._id,
      category: "SPORTS",
      status: "Active",
    },
    {
      title: "Academic Achievement Certificate",
      description:
        "Awarded to students for outstanding academic contributions and participation.",
      design: "Default",
      createdBy: president._id,
      category: "ACADEMIC",
      status: "Active",
    },
    {
      title: "General Participation Certificate",
      description:
        "General-purpose certificate for participation in institute events and activities.",
      design: "Default",
      createdBy: president._id,
      category: "OTHER",
      status: "Active",
    },
  ];

  await Template.insertMany(templatesToCreate);
  console.log("Created " + templatesToCreate.length + " templates.");
  console.log("Templates seeded successfully!");
};

/**
 * Seeds the CertificateBatch collection.
 * Creates one batch per completed event, cycling through all four lifecycle
 * states (Draft, Submitted, Active, Archived) in round-robin for variety.
 *
 *   initiatedBy      - CLUB_COORDINATOR whose username matches the club email
 *   approverIds      - [matching Gensec, President]
 *   users            - event participants  (omitted for Draft)
 *   signatoryDetails - coordinator + gensec + president  (omitted for Draft)
 */
const seedCertificateBatches = async () => {
  console.log("Seeding Certificate Batches...");

  const completedEvents = await Event.find({ status: "completed" }).populate(
    "organizing_unit_id",
  );
  const templates = await Template.find({ status: "Active" });
  const president = await User.findOne({ role: "PRESIDENT" });

  if (completedEvents.length === 0) {
    console.log("No completed events. Skipping batches.");
    return;
  }
  if (templates.length === 0) {
    console.log("No active templates. Skipping batches.");
    return;
  }
  if (!president) {
    console.log("No president found. Skipping batches.");
    return;
  }

  // Template lookup: lowercase category key -> template doc
  const templateMap = templates.reduce((map, tpl) => {
    map[tpl.category.toLowerCase()] = tpl;
    return map;
  }, {});

  // Club category -> Template category key
  const categoryToTemplateKey = {
    cultural: "cultural",
    scitech: "technical",
    sports: "sports",
    academic: "academic",
  };

  // Lifecycle states cycled in round-robin across events
  const lifecycleStates = [
    { lifecycleStatus: "Draft", approvalStatus: null, currentApprovalLevel: 0 },
    {
      lifecycleStatus: "Submitted",
      approvalStatus: "Pending",
      currentApprovalLevel: 0,
    },
    {
      lifecycleStatus: "Active",
      approvalStatus: "Approved",
      currentApprovalLevel: 2,
    },
    {
      lifecycleStatus: "Archived",
      approvalStatus: "Approved",
      currentApprovalLevel: 2,
    },
  ];

  const batchesToCreate = [];

  for (let i = 0; i < completedEvents.length; i++) {
    const event = completedEvents[i];
    const club = event.organizing_unit_id;
    if (!club) continue;

    const coordinator = await User.findOne({
      username: club.contact_info.email,
      role: "CLUB_COORDINATOR",
    });
    if (!coordinator) continue;

    const gensec = await User.findOne({
      role: "GENSEC_" + club.category.toUpperCase(),
    });
    if (!gensec) continue;

    const templateKey = categoryToTemplateKey[club.category] || "other";
    const template = templateMap[templateKey];
    if (!template) continue;

    const { lifecycleStatus, approvalStatus, currentApprovalLevel } =
      lifecycleStates[i % lifecycleStates.length];
    const isDraft = lifecycleStatus === "Draft";
    const eventParticipants = event.participants || [];

    const signatoryDetails = [
      {
        name: coordinator.personal_info.name,
        signature:
          "https://signatures.iitbhilai.ac.in/" + coordinator._id + ".png",
        role: "Club Coordinator",
      },
      {
        name: gensec.personal_info.name,
        signature: "https://signatures.iitbhilai.ac.in/" + gensec._id + ".png",
        role: "General Secretary, " + club.name,
      },
      {
        name: president.personal_info.name,
        signature:
          "https://signatures.iitbhilai.ac.in/" + president._id + ".png",
        role: "President, Student Gymkhana",
      },
    ];

    const batchDoc = Object.assign(
      {
        title: "Annual " + club.category + " Gala - Participation Certificate",
        eventId: event._id,
        templateId: template._id,
        initiatedBy: coordinator._id,
        approverIds: [gensec._id, president._id],
        lifecycleStatus,
        currentApprovalLevel,
      },
      approvalStatus ? { approvalStatus } : {},
      { users: eventParticipants, signatoryDetails },
    );

    batchesToCreate.push(batchDoc);
  }

  if (batchesToCreate.length > 0) {
    await CertificateBatch.insertMany(batchesToCreate);
    console.log("Created " + batchesToCreate.length + " certificate batches.");
  } else {
    console.log("No certificate batches could be created.");
  }
  console.log("Certificate Batches seeded successfully!");
};

/**
 * Seeds the Certificate collection from existing batches.
 *   Submitted batches -> Pending  certificates (no URL / ID yet)
 *   Active / Archived -> Approved certificates (URL + zero-padded ID)
 *   Draft batches are skipped entirely.
 */
const seedCertificates = async () => {
  console.log("Seeding Certificates...");

  const actionableBatches = await CertificateBatch.find({
    lifecycleStatus: { $in: ["Submitted", "Active", "Archived"] },
  });

  if (actionableBatches.length === 0) {
    console.log("No actionable batches found. Skipping certificates.");
    return;
  }

  const certificatesToCreate = [];
  let certCounter = 1;

  for (const batch of actionableBatches) {
    if (!batch.users || batch.users.length === 0) continue;

    const isApproved =
      batch.lifecycleStatus === "Active" ||
      batch.lifecycleStatus === "Archived";

    for (const userId of batch.users) {
      const certDoc = Object.assign(
        {
          userId,
          batchId: batch._id,
          status: isApproved ? "Approved" : "Pending",
        },
        isApproved
          ? {
              certificateUrl:
                "https://certificates.iitbhilai.ac.in/" +
                batch._id +
                "/" +
                userId +
                ".pdf",
              certificateId: "CERT-" + String(certCounter++).padStart(5, "0"),
            }
          : {},
      );
      certificatesToCreate.push(certDoc);
    }
  }

  if (certificatesToCreate.length > 0) {
    await Certificate.insertMany(certificatesToCreate);
    console.log("Created " + certificatesToCreate.length + " certificates.");
  } else {
    console.log("No certificates to create.");
  }
  console.log("Certificates seeded successfully!");
};

/**
 * Main function to run the entire seeding process.
 */
async function seedDB() {
  try {
    console.log("Connecting to the database...");
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Database connected successfully.");

    await clearData();
    await seedOrganizationalUnits();
    await seedUsers();
    await seedPositions();
    await seedPositionHolders();
    await seedNamedUsers();
    await seedSkills();
    await seedUserSkills();
    await seedEvents();
    await seedAchievements();
    await seedFeedbacks();
    await seedTemplates();
    await seedCertificateBatches();
    await seedCertificates();

    console.log("\n Seeding completed successfully!");
  } catch (error) {
    console.error("\n An error occurred during the seeding process:", error);
  } finally {
    if (mongoose.connection.readyState === 1) {
      await mongoose.connection.close();
      console.log("Database connection closed.");
    }
  }
}

// Run the seeding function
seedDB();
