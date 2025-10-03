require("dotenv").config();
const mongoose = require("mongoose");

const {
  User,
  Feedback,
  Achievement,
  UserSkill,
  Skill,
  Event,
  PositionHolder,
  Position,
  OrganizationalUnit,
} = require("./models/schema");

// --- Data for Seeding ---

// Original club/committee data.
const initialUnitsData = [
    { unit_id: "CLUB_OPENLAKE", name: "OpenLake", type: "Club", description: "Open Source Club of IIT Bhilai", hierarchy_level: 2, category: "scitech", contact_info: { email: "openlake@iitbhilai.ac.in", social_media: [] } },
    { unit_id: "CLUB_RENAISSANCE", name: "Renaissance", type: "Club", description: "Fine Arts Club under Cultural Council.", hierarchy_level: 2, category: "cultural", contact_info: { email: "renaissance@iitbhilai.ac.in", social_media: [ { platform: "Instagram", url: "https://www.instagram.com/renaissance_iitbh?igsh=dzRqNmV5bncxZWp1" }, { platform: "LinkedIn", url: "https://www.linkedin.com/in/renaissance-club-a76430331" } ] } },
    { unit_id: "CLUB_GOALS", name: "GOALS", type: "Club", description: "General Oratory and Literary Society handling Literature and Oration.", hierarchy_level: 2, category: "independent", contact_info: { email: "goals@iitbhilai.ac.in", social_media: [ { platform: "Instagram", url: "https://www.instagram.com/goals_iitbhilai?igsh=ejF6NzVmM3lxMmky" }, { platform: "LinkedIn", url: "https://www.linkedin.com/company/general-oratory-and-literary-society-goals/" } ] } },
    { unit_id: "CLUB_BEATHACKERS", name: "Beathackers", type: "Club", description: "The Dance Club of IIT Bhilai.", hierarchy_level: 2, category: "cultural", contact_info: { email: "beathackers@iitbhilai.ac.in", social_media: [ { platform: "Instagram", url: "https://www.instagram.com/beathackers_iitbhilai?igsh=YnVmbGozZ2V3dWE=" }, { platform: "YouTube", url: "https://youtube.com/@beathackersiitbhilai8247" } ] } },
    { unit_id: "CLUB_EPSILON", name: "The Epsilon Club", type: "Club", description: "Robotics Club of IIT Bhilai", hierarchy_level: 2, category: "scitech", contact_info: { email: "epsilon@iitbhilai.ac.in", social_media: [ { platform: "Instagram", url: "https://www.instagram.com/roboticsclub_iitbhilai" }, { platform: "LinkedIn", url: "https://www.linkedin.com/company/the-epsilon-club-iit-bhilai-robotics-club/" } ] } },
    { unit_id: "CLUB_INGENUITY", name: "Ingenuity", type: "Club", description: "Competitive programming club fostering problem-solving.", hierarchy_level: 2, category: "scitech", contact_info: { email: "ingenuity@iitbhilai.ac.in", social_media: [ { platform: "Instagram", url: "https://www.instagram.com/ingenuity_iit_bh/" }, { platform: "LinkedIn", url: "https://www.linkedin.com/company/74349589/admin/dashboard/" } ] } },
    { unit_id: "CLUB_DESIGNX", name: "DesignX", type: "Club", description: "Digital Arts club of IIT Bhilai.", hierarchy_level: 2, category: "cultural", contact_info: { email: "designx@iitbhilai.ac.in", social_media: [ { platform: "Instagram", url: "https://www.instagram.com/designx_iitbhilai?igsh=NTc4MTIwNjQ2YQ==" }, { platform: "LinkedIn", url: "https://www.linkedin.com/in/designx-iit-bhilai-612a7a371" } ] } },
    { unit_id: "CLUB_SPECTRE", name: "Spectre", type: "Club", description: "Cybersecurity Club of IIT Bhilai.", hierarchy_level: 2, category: "scitech", contact_info: { email: "spectre@iitbhilai.ac.in", social_media: [ { platform: "Instagram", url: "https://www.instagram.com/spectre_iitbhilai?igsh=ZDlyaDlqeXllYjNk" }, { platform: "LinkedIn", url: "https://www.linkedin.com/company/spectre-iit-bhilai/" } ] } },
    { unit_id: "COMMITTEE_EXTERNAL", name: "External Affairs", type: "Committee", description: "Handles sponsorship and PR opportunities of IIT Bhilai.", hierarchy_level: 1, category: "independent", contact_info: { email: "Outreach_cosa@iitbhilai.ac.in", social_media: [ { platform: "LinkedIn", url: "https://www.linkedin.com/in/external-affairs-iit-bhilai-8246a737b" } ] } },
    { unit_id: "CLUB_YOGA", name: "Yoga Club", type: "Club", description: "Promotes physical and mental well-being through yoga.", hierarchy_level: 2, category: "sports", contact_info: { email: "sports_yoga@iitbhilai.ac.in", social_media: [] } },
    { unit_id: "CLUB_MOTORSPORTS", name: "Motorsports", type: "Club", description: "Promotes automotive culture in the institute.", hierarchy_level: 2, category: "scitech", contact_info: { email: "baja@iitbhilai.ac.in", social_media: [ { platform: "Instagram", url: "https://www.instagram.com/iitbhilaimotorsports" }, { platform: "LinkedIn", url: "https://www.linkedin.com/company/iit-bhilai-motorsports/" } ] } },
    { unit_id: "CLUB_FPS", name: "Film Production Society", type: "Club", description: "Film-making society of IIT Bhilai.", hierarchy_level: 2, category: "cultural", contact_info: { email: "fps@iitbhilai.ac.in", social_media: [ { platform: "Instagram", url: "https://www.instagram.com/fps_iitbh" }, { platform: "YouTube", url: "http://youtube.com/@fps-iitbhilai9282" } ] } },
    { unit_id: "CLUB_SWARA", name: "Swara", type: "Club", description: "Music Club of IIT Bhilai.", hierarchy_level: 2, category: "cultural", contact_info: { email: "swara@iitbhilai.ac.in", social_media: [ { platform: "Instagram", url: "https://www.instagram.com/swara_iitbh" }, { platform: "YouTube", url: "https://youtube.com/@swaraiitbhilai" } ] } },
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
    console.log("All collections cleared successfully!");
};


/**
 * Seeds the Organizational Units with a proper hierarchy.
 */
const seedOrganizationalUnits = async () => {
    console.log("Seeding Organizational Units...");

    // 1. Create the top-level President and Test President units
    const presidentUnit = new OrganizationalUnit({
        unit_id: "PRESIDENT_GYMKHANA",
        name: "President, Student Gymkhana",
        type: "independent_position",
        description: "The highest student representative body in the Student Gymkhana.",
        parent_unit_id: null,
        hierarchy_level: 0,
        category: "independent",
        contact_info: { email: "president_gymkhana@iitbhilai.ac.in", social_media: [] },
    });
    await presidentUnit.save();
    console.log("Created President Unit.");

    const testPresidentUnit = new OrganizationalUnit({
        unit_id: "PRESIDENT_GYMKHANA_TEST",
        name: "Test President, Student Gymkhana",
        type: "independent_position",
        description: "The test president for the Student Gymkhana.",
        parent_unit_id: null,
        hierarchy_level: 0,
        category: "independent",
        contact_info: { email: "test_president_gymkhana@iitbhilai.ac.in", social_media: [] },
    });
    await testPresidentUnit.save();
    console.log("Created Test President Unit.");

    // 2. Create the main councils (Gensecs) and link them to the President
    const mainCouncilsData = [
        { unit_id: "COUNCIL_CULTURAL", name: "Cultural Council", type: "Council", description: "Council for all cultural activities.", hierarchy_level: 1, category: "cultural", contact_info: { email: "gensec_cultural_gymkhana@iitbhilai.ac.in", social_media: [] }, parent_unit_id: presidentUnit._id },
        { unit_id: "COUNCIL_SCITECH", name: "Science and Technology Council", type: "Council", description: "Council for all science and technology activities.", hierarchy_level: 1, category: "scitech", contact_info: { email: "gensec_scitech_gymkhana@iitbhilai.ac.in", social_media: [] }, parent_unit_id: presidentUnit._id },
        { unit_id: "COUNCIL_SPORTS", name: "Sports Council", type: "Council", description: "Council for all sports activities.", hierarchy_level: 1, category: "sports", contact_info: { email: "gensec_sports_gymkhana@iitbhilai.ac.in", social_media: [] }, parent_unit_id: presidentUnit._id },
        { unit_id: "COUNCIL_ACADEMIC", name: "Academic Affairs Council", type: "Council", description: "Council for all academic affairs.", hierarchy_level: 1, category: "academic", contact_info: { email: "gensec_academic_gymkhana@iitbhilai.ac.in", social_media: [] }, parent_unit_id: presidentUnit._id },
    ];
    await OrganizationalUnit.insertMany(mainCouncilsData);
    console.log("Created Main Councils (Gensecs).");

    // 3. Link initial clubs and committees to their respective parent councils
    const councils = await OrganizationalUnit.find({ type: 'Council', unit_id: { $not: /_TEST/ } });
    const councilMap = councils.reduce((map, council) => {
        map[council.category] = council._id;
        return map;
    }, {});

    const linkedUnitsData = initialUnitsData.map(unit => {
        return Object.assign({}, unit, {
            parent_unit_id: councilMap[unit.category] || presidentUnit._id,
        });
    });
    await OrganizationalUnit.insertMany(linkedUnitsData);
    console.log("Seeded and linked initial clubs and committees.");

    // 4. Create and link the test councils and clubs
    const testCouncilsData = [
        { unit_id: "COUNCIL_CULTURAL_TEST", name: "Test Cultural Council", type: "Council", description: "Test council for cultural activities.", hierarchy_level: 1, category: "cultural", contact_info: { email: "test_gensec_cult@iitbhilai.ac.in", social_media: [] }, parent_unit_id: presidentUnit._id },
        { unit_id: "COUNCIL_SCITECH_TEST", name: "Test SciTech Council", type: "Council", description: "Test council for scitech activities.", hierarchy_level: 1, category: "scitech", contact_info: { email: "test_gensec_scitech@iitbhilai.ac.in", social_media: [] }, parent_unit_id: presidentUnit._id },
        { unit_id: "COUNCIL_SPORTS_TEST", name: "Test Sports Council", type: "Council", description: "Test council for sports activities.", hierarchy_level: 1, category: "sports", contact_info: { email: "test_gensec_sports@iitbhilai.ac.in", social_media: [] }, parent_unit_id: presidentUnit._id },
        { unit_id: "COUNCIL_ACAD_TEST", name: "Test Academic Council", type: "Council", description: "Test council for academic activities.", hierarchy_level: 1, category: "academic", contact_info: { email: "test_gensec_acad@iitbhilai.ac.in", social_media: [] }, parent_unit_id: presidentUnit._id },
    ];
    await OrganizationalUnit.insertMany(testCouncilsData);
    console.log("Created Test Councils.");

    const testCouncils = await OrganizationalUnit.find({ name: /Test/ });
    const testCouncilMap = testCouncils.reduce((map, council) => {
        map[council.category] = council._id;
        return map;
    }, {});

    const testClubsData = [
        { unit_id: "CLUB_CULTURAL_TEST", name: "Test Cultural Club", type: "Club", description: "A test club for cultural events.", hierarchy_level: 2, category: "cultural", contact_info: { email: "test_cultural_club@iitbhilai.ac.in", social_media: [] }, parent_unit_id: testCouncilMap.cultural },
        { unit_id: "CLUB_SCITECH_TEST", name: "Test SciTech Club", type: "Club", description: "A test club for scitech events.", hierarchy_level: 2, category: "scitech", contact_info: { email: "test_scitech_club@iitbhilai.ac.in", social_media: [] }, parent_unit_id: testCouncilMap.scitech },
        { unit_id: "CLUB_SPORTS_TEST", name: "Test Sports Club", type: "Club", description: "A test club for sports events.", hierarchy_level: 2, category: "sports", contact_info: { email: "test_sports_club@iitbhilai.ac.in", social_media: [] }, parent_unit_id: testCouncilMap.sports },
        { unit_id: "CLUB_ACAD_TEST", name: "Test Academic Club", type: "Club", description: "A test club for academic events.", hierarchy_level: 2, category: "academic", contact_info: { email: "test_acad_club@iitbhilai.ac.in", social_media: [] }, parent_unit_id: testCouncilMap.academic },
    ];
    await OrganizationalUnit.insertMany(testClubsData);
    console.log("Seeded and linked Test Clubs.");

    console.log("Organizational Units seeded successfully!");
};

/**
 * Seeds the User collection based on Organizational Units and adds test students.
 */
const seedUsers = async () => {
    console.log("Seeding Users...");
    const units = await OrganizationalUnit.find({});
    const localAuthUsers = [];
    const googleAuthUsers = [];
    const password = "password";

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
        } else if (unit.unit_id.includes("COUNCIL_ACADEMIC") || unit.unit_id.includes("COUNCIL_ACAD")) {
            role = "GENSEC_ACADEMIC";
        } else if (unit.type === 'Club' || unit.type === 'Committee') {
            role = "CLUB_COORDINATOR";
        } else {
            role = "STUDENT";
        }

        const userData = {
            username: unit.contact_info.email,
            role: role,
            onboardingComplete: true,
            personal_info: {
                name: unit.name,
                email: unit.contact_info.email,
            },
        };

        if (unit.unit_id.includes("_TEST") || unit.name.includes("Test")) {
            userData.strategy = "local";
            localAuthUsers.push(userData);
        } else {
            userData.strategy = "google";
            googleAuthUsers.push(userData);
        }
    }

    // Add 10 dummy student users with local auth and correct email domain
    for (let i = 1; i <= 10; i++) {
        const userEmail = `student${i}@iitbhilai.ac.in`;
        
        // --- Add dummy academic info ---
        const branches = ["CSE", "EE"];
        const batchYears = ["2026", "2027"];
        
        const batch_year = batchYears[Math.floor(Math.random() * batchYears.length)];
        // Assuming Sep 2025 as current time: 2026 grad year -> 4th year, 2027 grad year -> 3rd year
        const current_year = batch_year === "2026" ? "4" : "3";

        const academic_info = {
            program: "B.Tech",
            branch: branches[Math.floor(Math.random() * branches.length)],
            batch_year: batch_year,
            current_year: current_year,
            cgpa: parseFloat((Math.random() * (10.0 - 6.0) + 6.0).toFixed(2))
        };
        
        localAuthUsers.push({
            username: userEmail,
            role: "STUDENT",
            strategy: "local",
            onboardingComplete: true,
            personal_info: { name: `Demo Student ${i}`, email: userEmail },
            academic_info: academic_info, // Add academic info to user data
        });
    }

    // Create Google auth users (no password needed)
    if (googleAuthUsers.length > 0) {
        await User.insertMany(googleAuthUsers);
        console.log(`Created ${googleAuthUsers.length} Google auth users.`);
    }

    // Create Local auth users (requires password hashing)
    for (const userData of localAuthUsers) {
        const user = new User(userData);
        await User.register(user, password);
    }
    console.log(`Created and registered ${localAuthUsers.length} local auth users.`);

    console.log("Users seeded successfully!");
};

/**
 * Seeds the Position collection for all test units.
 */
const seedPositions = async () => {
    console.log("Seeding Positions for test units...");
    const testUnits = await OrganizationalUnit.find({
        $or: [{ unit_id: /_TEST/ }, { name: /Test/ }],
    });

    const positionsToCreate = [];

    for (const unit of testUnits) {
        const positions = [
            { title: "Coordinator", count: 1, type: "Leadership" },
            { title: "Core Member", count: 5, type: "CoreTeam" },
            { title: "Member", count: 10, type: "General" },
        ];

        for (const pos of positions) {
            const positionData = {
                position_id: `${unit.unit_id}_${pos.title.toUpperCase().replace(' ', '_')}`,
                title: pos.title,
                unit_id: unit._id,
                position_type: pos.type,
                description: `The ${pos.title} position for ${unit.name}.`,
                position_count: pos.count,
                responsibilities: [`Fulfill the duties of a ${pos.title}.`],
                requirements: {
                    min_cgpa: 6.0,
                    min_year: 1,
                    skills_required: ["Teamwork", "Communication"],
                },
            };
            positionsToCreate.push(positionData);
        }
    }

    if (positionsToCreate.length > 0) {
        await Position.insertMany(positionsToCreate);
        console.log(`Created ${positionsToCreate.length} positions for test units.`);
    } else {
        console.log("No test units found to create positions for.");
    }

    console.log("Positions seeded successfully!");
};

/**
 * Seeds the PositionHolder collection by assigning test students to test positions.
 */
const seedPositionHolders = async () => {
    console.log("Seeding Position Holders for test units...");

    const students = await User.find({ role: 'STUDENT', strategy: 'local' });
    const testClubs = await OrganizationalUnit.find({ type: 'Club', name: /Test/ });
    const testPositions = await Position.find({}).populate('unit_id');

    if (students.length === 0) {
        console.log("No student users found to assign positions to.");
        return;
    }

    const positionHoldersToCreate = [];
    let studentIndex = 0;

    for (const club of testClubs) {
        if (studentIndex >= students.length) { break;}

        const clubPositions = testPositions.filter(p => p.unit_id._id.equals(club._id));
        const coordinatorPos = clubPositions.find(p => p.title === 'Coordinator');
        const coreMemberPos = clubPositions.find(p => p.title === 'Core Member');
        
        if (coordinatorPos && studentIndex < students.length) {
            const student = students[studentIndex++];
            positionHoldersToCreate.push({
                por_id: `POR_${student._id}_${coordinatorPos._id}`,
                user_id: student._id,
                position_id: coordinatorPos._id,
                tenure_year: "2024-2025",
                status: "active",
            });
        }
        
        if (coreMemberPos && studentIndex < students.length) {
            const coreMemberCount = Math.floor(Math.random() * 2) + 1;
            for (let i = 0; i < coreMemberCount && studentIndex < students.length; i++) {
                const student = students[studentIndex++];
                positionHoldersToCreate.push({
                    por_id: `POR_${student._id}_${coreMemberPos._id}_${i}`,
                    user_id: student._id,
                    position_id: coreMemberPos._id,
                    tenure_year: "2024-2025",
                    status: "active",
                });
            }
        }
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
 * Seeds the Skill collection with a predefined list of skills.
 */
const seedSkills = async () => {
    console.log("Seeding Skills...");
    const skillsData = [
        { skill_id: "SKL_JS", name: "JavaScript", category: "Programming", type: "technical" },
        { skill_id: "SKL_PY", name: "Python", category: "Programming", type: "technical" },
        { skill_id: "SKL_REACT", name: "React", category: "Web Development", type: "technical" },
        { skill_id: "SKL_NODE", name: "Node.js", category: "Web Development", type: "technical" },
        { skill_id: "SKL_MONGO", name: "MongoDB", category: "Database", type: "technical" },
        { skill_id: "SKL_CYBER", name: "Cybersecurity", category: "Security", type: "technical" },
        { skill_id: "SKL_ROBO", name: "Robotics", category: "Hardware", type: "technical" },
        { skill_id: "SKL_DANCE", name: "Dancing", category: "Performing Arts", type: "cultural" },
        { skill_id: "SKL_SING", name: "Singing", category: "Performing Arts", type: "cultural" },
        { skill_id: "SKL_PAINT", name: "Painting", category: "Fine Arts", type: "cultural" },
        { skill_id: "SKL_DART", name: "Digital Art", category: "Fine Arts", type: "cultural" },
        { skill_id: "SKL_SPEAK", name: "Public Speaking", category: "Literary", type: "cultural" },
        { skill_id: "SKL_FILM", name: "Film Making", category: "Media", type: "cultural" },
        { skill_id: "SKL_CRIC", name: "Cricket", category: "Team Sport", type: "sports" },
        { skill_id: "SKL_FOOT", name: "Football", category: "Team Sport", type: "sports" },
        { skill_id: "SKL_YOGA", name: "Yoga", category: "Fitness", type: "sports" },
        { skill_id: "SKL_BASK", name: "Basketball", category: "Team Sport", type: "sports" },
    ];
    await Skill.insertMany(skillsData);
    console.log(`Created ${skillsData.length} skills.`);
};

/**
 * Assigns a random set of skills to each dummy student.
 */
const seedUserSkills = async () => {
    console.log("Assigning skills to users...");
    const skills = await Skill.find({});
    const students = await User.find({ role: 'STUDENT', strategy: 'local' });

    if (skills.length === 0 || students.length === 0) {
        console.log("No skills or students found to create user-skill links.");
        return;
    }

    const userSkillsToCreate = [];
    const proficiencyLevels = ["beginner", "intermediate", "advanced", "expert"];

    for (const student of students) {
        const skillsToAssignCount = Math.floor(Math.random() * 3) + 2;
        const shuffledSkills = [...skills].sort(() => 0.5 - Math.random());
        const selectedSkills = shuffledSkills.slice(0, skillsToAssignCount);

        for (const skill of selectedSkills) {
            userSkillsToCreate.push({
                user_id: student._id,
                skill_id: skill._id,
                proficiency_level: proficiencyLevels[Math.floor(Math.random() * proficiencyLevels.length)],
                is_endorsed: false,
            });
        }
    }
    
    if (userSkillsToCreate.length > 0) {
        await UserSkill.insertMany(userSkillsToCreate);
        console.log(`Assigned ${userSkillsToCreate.length} skills across ${students.length} students.`);
    }
    console.log("User skills seeded successfully!");
};

/**
 * Seeds the Event collection with dummy events for test clubs.
 */
const seedEvents = async () => {
    console.log("Seeding Events for test clubs...");

    const testClubs = await OrganizationalUnit.find({ type: 'Club', name: /Test/ });
    const students = await User.find({ role: 'STUDENT', strategy: 'local' });

    if (testClubs.length === 0 || students.length === 0) {
        console.log("No test clubs or students found to create events for.");
        return;
    }

    const eventsToCreate = [];
    const now = new Date();

    for (const club of testClubs) {
        const eventCategory = club.category === 'scitech' ? 'technical' : club.category;

        // --- Completed Event ---
        const completedEventParticipants = [...students].sort(() => 0.5 - Math.random()).slice(0, 5);
        if (completedEventParticipants.length === 0) { continue;}
        const completedEvent = {
            event_id: `EVENT_${club.unit_id}_COMPLETED`,
            title: `Annual ${club.category} Gala`,
            description: `A look back at the amazing ${club.category} events of the past year.`,
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
            participants: completedEventParticipants.map(p => p._id),
            winners: [{ user: completedEventParticipants[0]._id, position: "1st Place" }],
        };
        eventsToCreate.push(completedEvent);

        // --- Planned Event ---
        const plannedEvent = {
            event_id: `EVENT_${club.unit_id}_PLANNED`,
            title: `Introductory Workshop on ${club.category}`,
            description: `Join us for a fun and interactive workshop!`,
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
        };
        eventsToCreate.push(plannedEvent);
    }
    
    if (eventsToCreate.length > 0) {
        await Event.insertMany(eventsToCreate);
        console.log(`Created ${eventsToCreate.length} dummy events.`);
    }

    console.log("Events seeded successfully!");
};

/**
 * Seeds the Achievement collection based on winners of completed events.
 */
const seedAchievements = async () => {
    console.log("Seeding Achievements from event winners...");
    
    const completedEventsWithWinners = await Event.find({ 
        status: 'completed', 
        winners: { $exists: true, $not: { $size: 0 } } 
    }).populate('organizing_unit_id');

    if (completedEventsWithWinners.length === 0) {
        console.log("No completed events with winners found to create achievements from.");
        return;
    }

    const achievementsToCreate = [];
    for (const event of completedEventsWithWinners) {
        for (const winner of event.winners) {
            const achievementCategory = event.category === 'technical' ? 'scitech' : event.category;
            const achievementData = {
                achievement_id: `ACH_${event.event_id}_${winner.user}`,
                user_id: winner.user,
                title: `Winner of ${event.title}`,
                description: `Achieved ${winner.position} in the ${event.title} event organized by ${event.organizing_unit_id.name}.`,
                category: achievementCategory,
                type: 'Competition',
                level: 'Institute',
                date_achieved: event.schedule.end,
                position: winner.position,
                event_id: event._id,
                verified: true,
            };
            achievementsToCreate.push(achievementData);
        }
    }

    if (achievementsToCreate.length > 0) {
        await Achievement.insertMany(achievementsToCreate);
        console.log(`Created ${achievementsToCreate.length} achievements for event winners.`);
    }
};

/**
 * Seeds the Feedback collection for events and organizational units.
 */
const seedFeedbacks = async () => {
    console.log("Seeding Feedback...");

    const students = await User.find({ role: 'STUDENT', strategy: 'local' });
    const completedEvents = await Event.find({ status: 'completed' });
    const testClubs = await OrganizationalUnit.find({ type: 'Club', name: /Test/ });

    if (students.length < 2 || completedEvents.length === 0 || testClubs.length === 0) {
        console.log("Not enough data to create meaningful feedback.");
        return;
    }
    
    const feedbacksToCreate = [];

    // 1. Create feedback for an event
    const eventToReview = completedEvents[0];
    const studentReviewer1 = students[0];
    const studentReviewer2 = students[1];

    feedbacksToCreate.push({
        feedback_id: `FDB_EVT_${eventToReview._id}_${studentReviewer1._id}`,
        type: 'Event Feedback',
        target_id: eventToReview._id,
        target_type: 'Event',
        feedback_by: studentReviewer1._id,
        rating: 5,
        comments: 'This was an amazing event! Well organized and very engaging.',
        is_anonymous: false,
    });

    feedbacksToCreate.push({
        feedback_id: `FDB_EVT_${eventToReview._id}_${studentReviewer2._id}`,
        type: 'Event Feedback',
        target_id: eventToReview._id,
        target_type: 'Event',
        feedback_by: studentReviewer2._id,
        rating: 4,
        comments: 'Good event, but the timings could have been better.',
        is_anonymous: true,
    });

    // 2. Create feedback for an organizational unit
    const clubToReview = testClubs[0];
    feedbacksToCreate.push({
        feedback_id: `FDB_OU_${clubToReview._id}_${studentReviewer1._id}`,
        type: 'Unit Feedback',
        target_id: clubToReview._id,
        target_type: 'Organizational_Unit',
        feedback_by: studentReviewer1._id,
        rating: 4,
        comments: `The ${clubToReview.name} is doing a great job this semester.`,
        is_anonymous: false,
    });

    if (feedbacksToCreate.length > 0) {
        await Feedback.insertMany(feedbacksToCreate);
        console.log(`Created ${feedbacksToCreate.length} feedback entries.`);
    }
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
    await seedSkills();
    await seedUserSkills();
    await seedEvents();
    await seedAchievements();
    await seedFeedbacks();

    console.log("\n✅ Seeding completed successfully!");

  } catch (error) {
    console.error("\n❌ An error occurred during the seeding process:", error);
  } finally {
    if (mongoose.connection.readyState === 1) {
        await mongoose.connection.close();
        console.log("Database connection closed.");
    }
  }
}

// Run the seeding function
seedDB();

