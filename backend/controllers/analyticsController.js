const {User, Achievement, UserSkill, Event, Position, PositionHolder,OrganizationalUnit}=require('../models/schema');
const mongoose = require("mongoose");
//helper function to get the current year
const getCurrentTenureRange= () => {
    const now=new Date();
    const current_year=now.getFullYear();
    const current_month=now.getMonth(); // months are 0-indexed

    let startDate, endDate, tenureYearString;
    if(current_month < 3){
        startDate=new Date(current_year-1,3,1);
        endDate=new Date(current_year,2,31,23,59,59);
        tenureYearString = `${current_year - 1}-${current_year}`;
    } else {
        startDate=new Date(current_year,3,1);
        endDate=new Date(current_year+1,2,31,23,59,59);
        tenureYearString = `${current_year}-${current_year + 1}`; 
    }
    return {startDate, endDate, tenureYearString};
};

exports.getPresidentAnalytics= async (req,res) => {
   try {
      const {startDate, endDate, tenureYearString} = getCurrentTenureRange();

      const [
      userStats,
      userDemographics,
      eventStats,
      orgStats,
      activePoRs,
      totalAchievements,
      achievementStatus,
      participationTrends,
      porDistribution,
      topClubs,
      ] = await Promise.all([
      // 1. User Analytics
      User.aggregate([
        { $group: { _id: "$status", count: { $sum: 1 } } },
        {
          $group: {
            _id: null,
            totalUsers: { $sum: "$count" },
            statusBreakdown: { $push: { status: "$_id", count: "$count" } },
          },
        },
      ]),
      // 2. User Demographics
      User.aggregate([
        {
          $facet: {
            byProgram: [
              { $group: { _id: "$academic_info.program", count: { $sum: 1 } } },
            ],
            byBranch: [
              { $group: { _id: "$academic_info.branch", count: { $sum: 1 } } },
            ],
            byBatchYear: [
              { $group: { _id: "$academic_info.batch_year", count: { $sum: 1 } } },
            ],
          },
        },
      ]),
      // 3. Event Analytics
      Event.aggregate([
        {
          $facet: {
            eventCounts: [
              {
                $match: {
                  "schedule.start": { $gte: startDate, $lte: endDate },
                },
              },
              { $group: { _id: "$status", count: { $sum: 1 } } },
            ],
            eventCategories: [
              {
                $match: {
                  "schedule.start": { $gte: startDate, $lte: endDate },
                },
              },
              { $group: { _id: "$category", count: { $sum: 1 } } },
            ],
          },
        },
      ]),
      // 4. Organizational Unit Analytics
      OrganizationalUnit.aggregate([
        {
          $facet: {
            unitTypes: [{ $group: { _id: "$type", count: { $sum: 1 } } }],
            unitCategories: [
              { $group: { _id: "$category", count: { $sum: 1 } } },
            ],
            budgetOverview: [
              {
                $group: {
                  _id: null,
                  totalAllocated: { $sum: "$budget_info.allocated_budget" },
                  totalSpent: { $sum: "$budget_info.spent_amount" },
                },
              },
            ],
          },
        },
      ]),
      // 5. PORs & Achievements Analytics
      PositionHolder.countDocuments({ status: "active", tenure_year: tenureYearString }), // activePoRs
      Achievement.countDocuments(), // totalAchievements
      Achievement.aggregate([
        { $group: { _id: "$verified", count: { $sum: 1 } } },
      ]), 
      // 6. Participation Trends Over Time (Last 12 Months)
      Event.aggregate([
        {
          $match: {
            status: "completed",
            "schedule.end": {
              $gte: new Date(new Date().setFullYear(new Date().getFullYear() - 1)),
            },
          },
        },
        { $unwind: "$participants" },
        {
          $group: {
            _id: {
              year: { $year: "$schedule.end" },
              month: { $month: "$schedule.end" },
              user: "$participants",
            },
          },
        },
        {
          $group: {
            _id: {
              year: "$_id.year",
              month: "$_id.month",
            },
            uniqueParticipants: { $sum: 1 },
          },
        },
        { $sort: { "_id.year": 1, "_id.month": 1 } },
      ]),
      // 7. Position (POR) Distribution per Unit
      PositionHolder.aggregate([
        { $match: { status: "active" , tenure_year: tenureYearString } },
        {
          $lookup: {
            from: "positions",
            localField: "position_id",
            foreignField: "_id",
            as: "position",
          },
        },
        { $unwind: "$position" },
        {
          $lookup: {
            from: "organizational_units",
            localField: "position.unit_id",
            foreignField: "_id",
            as: "unit",
          },
        },
        { $unwind: "$unit" },
        { $group: { _id: "$unit.name", count: { $sum: 1 } } },
        { $sort: { count: -1 } },
      ]),
      // 8. Top 5 Active Clubs (by Participation)
      Event.aggregate([
        { $match: { status: "completed", "schedule.end": { $gte: startDate, $lte: endDate }}, },
        {
          $group: {
            _id: "$organizing_unit_id",
            totalParticipants: { $sum: { $size: "$participants" } },
          },
        },
        { $sort: { totalParticipants: -1 } },
        { $limit: 5 },
        {
          $lookup: {
            from: "organizational_units",
            localField: "_id",
            foreignField: "_id",
            as: "unit",
          },
        },
        { $unwind: "$unit" },
        { $project: { name: "$unit.name", totalParticipants: 1 } },
      ]),
      ]);
      const completedEvent =
        eventStats && eventStats[0] && eventStats[0].eventCounts
          ? eventStats[0].eventCounts.find((e) => e._id === "completed")
          : null;
      const plannedEvent =
        eventStats && eventStats[0] && eventStats[0].eventCounts
          ? eventStats[0].eventCounts.find((e) => e._id === "planned")
          : null;
      const orgUnitTypes = orgStats && orgStats[0] && orgStats[0].unitTypes ? orgStats[0].unitTypes : [];
      const orgBudget =
        orgStats && orgStats[0] && orgStats[0].budgetOverview && orgStats[0].budgetOverview[0]
          ? orgStats[0].budgetOverview[0]
          : { totalAllocated: 0, totalSpent: 0 };

      const dashboardData = {
      summary: {
        userAnalytics: {
          totalUsers: (userStats && userStats[0] && userStats[0].totalUsers) || 0,
          userStatus: (userStats && userStats[0] && userStats[0].statusBreakdown) || [],
          demographics: (userDemographics && userDemographics[0]) || {},
        },
        eventAnalytics: {
          totalCompleted: (completedEvent && completedEvent.count) || 0,
          upcomingEvents: (plannedEvent && plannedEvent.count) || 0,
          eventCategories: (eventStats && eventStats[0] && eventStats[0].eventCategories) || [],
        },
        organizationalUnitAnalytics: {
          totalUnits: orgUnitTypes.reduce((a, b) => a + b.count, 0) || 0,
          unitTypes: orgUnitTypes,
          budgetOverview: orgBudget,
          unitCategories: (orgStats && orgStats[0] && orgStats[0].unitCategories) || [],
        },
        porAnalytics: {
          activePORs: activePoRs,
          totalAchievements: totalAchievements,
          achievementStatus: (achievementStatus || []).map((s) => ({
            verified: s._id,
            count: s.count,
          })),
        },
      },
      involvement: {
        participationTrends: participationTrends || [],
        porDistribution: porDistribution || [],
        topClubs: topClubs || [],
      },
    };

    res.json(dashboardData);
    
   } catch (error) {
        console.error("President Dashboard Analyltics Error:", error);
        res.status(500).json({ message: "Server error while fetching president analytics" });
   }
};

//club coordinator

exports.getClubCoordinatorAnalytics = async (req, res) => {
  try {
    // 1. Get org unit id from user's email
    const user = await User.findById(req.user._id, "personal_info.email").lean();
    if (!user || !user.personal_info || !user.personal_info.email) {
      return res.status(404).json({ message: "User not found or email is missing." });
    }
    const userEmail = user.personal_info.email;

    const unit = await OrganizationalUnit.findOne({ "contact_info.email": userEmail }).lean();

    if (!unit) {
      return res.status(403).json({
        message: "Your email is not registered as the contact for any organizational unit.",
      });
    }
    const unitId = unit._id;
    
    // Get current tenure info
    const { startDate, endDate, tenureYearString } = getCurrentTenureRange(); 

    // 2. Run all queries for this unit in parallel
    const [unitData, allTimeStats, currentStats, participantsPerEvent, upcomingEvents, team, openPositions] = await Promise.all([
      // 1. Club At-a-Glance 
      unit,

      // 2. Core Stats (All Time)
      Promise.all([
        Event.countDocuments({ organizing_unit_id: unitId, status: "completed" }),
        Position.find({ unit_id: unitId }).distinct("_id").then(ids => 
          PositionHolder.countDocuments({ position_id: { $in: ids }, status: "active" }) // All active members
        )
      ]),
      
      // 3. Core Stats (Current Tenure)
      Promise.all([
         Event.countDocuments({ 
           organizing_unit_id: unitId, 
           status: "completed",
           "schedule.end": { $gte: startDate, $lte: endDate }
         }),
         Position.find({ unit_id: unitId }).distinct("_id").then(ids => 
          PositionHolder.countDocuments({ 
            position_id: { $in: ids }, 
            status: "active", 
            tenure_year: tenureYearString // Active members THIS tenure
          })
        )
      ]),

      // 4. Event Performance: Participants per Event (all time)
      Event.find(
        { organizing_unit_id: unitId, status: "completed" },
        "title schedule.end participants"
      )
        .sort({ "schedule.end": -1 })
        .limit(10) // Get last 10 events
        .lean()
        .then((events) =>
          events.map((e) => ({
            title: e.title,
            date: e.schedule.end,
            participants: e.participants.length,
          }))
        ),
      
      // 5. Event Performance: Upcoming Events
      Event.find(
        { organizing_unit_id: unitId, status: "planned" },
        "title schedule.start status"
      ).sort({ "schedule.start": 1 }),

      // 6. Team Management: Current Position Holders
      Position.find({ unit_id: unitId }).distinct("_id").then(ids => 
        PositionHolder.find({ 
          position_id: { $in: ids }, 
          status: "active",
          tenure_year: tenureYearString // Only show current tenure team
        }) 
          .populate("user_id", "personal_info.name username")
          .populate("position_id", "title")
          .lean()
      ),

      // 7. Team Management: Open Positions Count
      Position.aggregate([
        { $match: { unit_id: new mongoose.Types.ObjectId(unitId) } },
        {
          $lookup: {
            from: "position_holders",
            let: { posId: "$_id" },
            pipeline: [
              { $match: { $expr: { $and: [ 
                  { $eq: ["$position_id", "$$posId"] }, 
                  { $eq: ["$status", "active"] },
                  { $eq: ["$tenure_year", tenureYearString] } // Only count holders from current tenure
                ] } } 
              },
              { $count: "activeCount" }
            ],
            as: "holders"
          }
        },
        { $unwind: { path: "$holders", preserveNullAndEmptyArrays: true } },
        {
          $project: {
            openSlots: { 
              $subtract: [ "$position_count", { $ifNull: ["$holders.activeCount", 0] } ]
            }
          }
        },
        { $group: { _id: null, totalOpen: { $sum: "$openSlots" } } }
      ])
    ]);
    
    res.json({
      clubName: unitData.name,
      atAGlance: {
        budget: {
          allocated: unitData.budget_info.allocated_budget,
          spent: unitData.budget_info.spent_amount,
          remaining: unitData.budget_info.allocated_budget - unitData.budget_info.spent_amount,
        },
        coreStats: {
          allTime: {
            totalEvents: allTimeStats[0],
            totalActiveMembers: allTimeStats[1], // All active members ever
          },
          currentTenure: {
            totalEvents: currentStats[0],
            totalActiveMembers: currentStats[1], // Active members this tenure
          }
        }
      },
      eventPerformance: {
        participantsPerEvent,
        upcomingEvents,
      },
      teamManagement: {
        currentPositionHolders: team.map(h => ({
          name: h.user_id.personal_info.name,
          username: h.user_id.username,
          position: h.position_id.title
        })),
        openPositions: (openPositions && openPositions[0] && openPositions[0].totalOpen) || 0,
      }
    });

  } catch (error) {
    console.error("Club Coordinator Error:", error);
    res.status(500).json({ message: "Server error generating dashboard." });
  }
};

//gensec analytics 

exports.getGensecAnalytics = async (req, res) => {
  try {
    // 1. Identify the Gensec's domain/category
    const role = req.user.role;
    const parts = role.split("_");
    const category = parts.length > 1 ? parts[1].toLowerCase() : null;

    if (!category || !["cultural", "scitech", "sports", "academic"].includes(category)) {
      return res.status(400).json({ message: "Invalid GENSEC role." });
    }
    
    // Get current tenure info
    const { startDate, endDate } = getCurrentTenureRange(); 

    // 2. Get all Unit IDs for this category
    const unitsInCategory = await OrganizationalUnit.find({ category: category }, "_id").lean();
    const unitIds = unitsInCategory.map((u) => u._id);
    
    if (unitIds.length === 0) {
      return res.json({ domain: category, message: `No organizational units found for category: ${category}` });
    }

    // 3. Run all queries for this category in parallel
    const [
      domainStats,
      budgetStats,
      topClubsByParticipation,
      topEvents,
      participationTrends,
      eventPipeline,
      topClubsByActivity,
    ] = await Promise.all([
      // 1. Domain At-a-Glance
      Promise.all([
        OrganizationalUnit.countDocuments({ category: category }), // Total Clubs
        Event.countDocuments({ // Total Events (Current Tenure)
          organizing_unit_id: { $in: unitIds }, 
          status: "completed",
          "schedule.end": { $gte: startDate, $lte: endDate }
        }),
        Event.aggregate([ // Total Participation (Current Tenure)
          { $match: { 
              organizing_unit_id: { $in: unitIds }, 
              status: "completed",
              "schedule.end": { $gte: startDate, $lte: endDate }
            }
          },
          { $group: { _id: null, total: { $sum: { $size: "$participants" } } } }
        ])
      ]),
      
      // 2. Budget Management (Overall & Club-wise)
      OrganizationalUnit.aggregate([
        { $match: { category: category } },
        {
          $facet: {
            overall: [
              { $group: { _id: null, totalAllocated: { $sum: "$budget_info.allocated_budget" }, totalSpent: { $sum: "$budget_info.spent_amount" } } },
            ],
            clubWise: [
              { $project: { name: 1, budget: "$budget_info" } }
            ]
          }
        }
      ]),
      
      // 3. Top 5 Clubs by Participation (Current Tenure)
      Event.aggregate([
        { $match: { 
            organizing_unit_id: { $in: unitIds }, 
            status: "completed",
            "schedule.end": { $gte: startDate, $lte: endDate }
          }
        },
        { $group: { _id: "$organizing_unit_id", totalParticipants: { $sum: { $size: "$participants" } } } },
        { $sort: { totalParticipants: -1 } },
        { $limit: 5 },
        { $lookup: { from: "organizational_units", localField: "_id", foreignField: "_id", as: "unit" } },
        { $unwind: "$unit" },
        { $project: { name: "$unit.name", totalParticipants: 1 } }
      ]),
      
      // 4. Top 5 Events by Participation (Current Tenure)
      Event.aggregate([
        { $match: { 
            organizing_unit_id: { $in: unitIds }, 
            status: "completed",
            "schedule.end": { $gte: startDate, $lte: endDate }
          }
        },
        { $project: { title: 1, participantCount: { $size: "$participants" } } },
        { $sort: { participantCount: -1 } },
        { $limit: 5 }
      ]),

      // 5. Domain Participation Trends
      Event.aggregate([
        {
          $match: {
            organizing_unit_id: { $in: unitIds }, // Filter for domain
            status: "completed",
            "schedule.end": { $gte: new Date(new Date().setFullYear(new Date().getFullYear() - 1)) },
          },
        },
        { $unwind: "$participants" },
        { $group: { _id: { year: { $year: "$schedule.end" }, month: { $month: "$schedule.end" }, user: "$participants" } } },
        { $group: { _id: { year: "$_id.year", month: "$_id.month" }, uniqueParticipants: { $sum: 1 } } },
        { $sort: { "_id.year": 1, "_id.month": 1 } },
      ]),

      // 6. Event Pipeline (Current Tenure)
      Event.aggregate([
        { $match: { 
            organizing_unit_id: { $in: unitIds },
            "schedule.start": { $gte: startDate, $lte: endDate }
          }
        },
        { $group: { _id: "$status", count: { $sum: 1 } } }
      ]),

      // 7. Top 5 Clubs by Events Organized (Current Tenure)
      Event.aggregate([
        { $match: { 
            organizing_unit_id: { $in: unitIds }, 
            status: "completed", // Or "ongoing" or "planned" depending on what you want to count
            "schedule.end": { $gte: startDate, $lte: endDate }
          }
        },
        { $group: { _id: "$organizing_unit_id", eventCount: { $sum: 1 } } },
        { $sort: { eventCount: -1 } },
        { $limit: 5 },
        { $lookup: { from: "organizational_units", localField: "_id", foreignField: "_id", as: "unit" } },
        { $unwind: "$unit" },
        { $project: { name: "$unit.name", eventCount: 1 } }
      ]),

    ]);
    
    // --- Consolidate Data ---
    res.json({
      domain: category,
      atAGlance: {
        totalClubs: domainStats[0],
        totalEventsCompleted: domainStats[1],
        totalParticipation: (domainStats[2] && domainStats[2][0] && domainStats[2][0].total) || 0,
      },
      budgetManagement: {
        overall: budgetStats[0].overall[0] || { totalAllocated: 0, totalSpent: 0 },
        clubWise: budgetStats[0].clubWise
      },
      engagement: {
        topClubsByParticipation,
        topClubsByActivity,
        topEventsByParticipation: topEvents,
      },
      trends: {
        participationOverTime: participationTrends, 
        eventPipeline, 
      },
    });

  } catch (error) {
    console.error("Gensec Dashboard Error:", error);
    res.status(500).json({ message: "Server error generating dashboard." });
  }
};

//student analytics

exports.getStudentAnalytics = async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.user._id); 
    const { startDate, endDate, tenureYearString } = getCurrentTenureRange();

    const [
      participationTrend,
      skillCategories,
      eventPreferences,
      achievementStatus,
      engagementScoreData,
    ] = await Promise.all([
      
      // 1.Event Participation Trend (Last 12 Months)
      Event.aggregate([
        {
          $match: {
            participants: userId,
            status: "completed",
            "schedule.end": { $gte: new Date(new Date().setFullYear(new Date().getFullYear() - 1)) },
          },
        },
        {
          $group: {
            _id: {
              year: { $year: "$schedule.end" },
              month: { $month: "$schedule.end" },
            },
            count: { $sum: 1 }, // Count of events participated in
          },
        },
        { $sort: { "_id.year": 1, "_id.month": 1 } },
        { $project: {
            year: "$_id.year",
            month: "$_id.month",
            count: 1,
            _id: 0
        }}
      ]),

      // 2. Skill Category Pie Chart
      UserSkill.aggregate([
        { $match: { user_id: userId } },
        {
          $lookup: {
            from: "skills",
            localField: "skill_id",
            foreignField: "_id",
            as: "skill",
          },
        },
        { $unwind: "$skill" },
        { $group: { _id: "$skill.category", count: { $sum: 1 } } },
        { $project: { category: "$_id", count: 1, _id: 0 } }
      ]),

      // 3. Event Category Preference Pie Chart
      Event.aggregate([
        { $match: { participants: userId, status: "completed" } },
        { $group: { _id: "$category", count: { $sum: 1 } } },
        { $project: { category: "$_id", count: 1, _id: 0 } }
      ]),

      // 4. Achievement Verification Status Pie Chart
      Achievement.aggregate([
        { $match: { user_id: userId } },
        { $group: { _id: "$verified", count: { $sum: 1 } } },
        { $project: {
            status: { $cond: [ "$_id", "Verified", "Pending" ] },
            count: 1,
            _id: 0
        }}
      ]),

      // 5. Personal Engagement Score (Current Tenure)
      Promise.all([
        PositionHolder.countDocuments({
          user_id: userId,
          status: "active",
          tenure_year: tenureYearString
        }),
        Event.countDocuments({
          organizers: userId,
          status: "completed",
          "schedule.end": { $gte: startDate, $lte: endDate }
        }),
        Event.countDocuments({
          participants: userId,
          status: "completed",
          "schedule.end": { $gte: startDate, $lte: endDate }
        })
      ])
    ]);

    // Calculate Engagement Score
    const porScore = engagementScoreData[0] * 10;
    const organizeScore = engagementScoreData[1] * 5;
    const participateScore = engagementScoreData[2] * 1;
    const totalScore = porScore + organizeScore + participateScore;
    
    res.json({
      analytics: {
        participationTrend,
        skillCategories,
        eventPreferences,
        achievementStatus,
        engagement: {
          totalScore: totalScore,
          breakdown: {
            positions: {
              count: engagementScoreData[0],
              score: porScore
            },
            organized: {
              count: engagementScoreData[1],
              score: organizeScore
            },
            participated: {
              count: engagementScoreData[2],
              score: participateScore
            }
          }
        }
      }
    });

  } catch (error) {
    console.error("Student Dashboard Error:", error);
    res.status(500).json({ message: "Server error generating dashboard." });
  }
};