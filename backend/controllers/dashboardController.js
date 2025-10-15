// controllers/dashboardController.js
const {
    Feedback,
    Achievement,
    UserSkill,
    Skill,
    Event,
    PositionHolder,
    Position,
    OrganizationalUnit,
} = require("../models/schema"); 

const ROLES = {
    PRESIDENT: "PRESIDENT",
    GENSEC_SCITECH: "GENSEC_SCITECH",
    GENSEC_ACADEMIC: "GENSEC_ACADEMIC",
    GENSEC_CULTURAL: "GENSEC_CULTURAL",
    GENSEC_SPORTS: "GENSEC_SPORTS",
    CLUB_COORDINATOR: "CLUB_COORDINATOR",
    STUDENT: "STUDENT",
};

const roleToCategoryMap = {
    [ROLES.GENSEC_SCITECH]: "scitech",
    [ROLES.GENSEC_ACADEMIC]: "academic",
    [ROLES.GENSEC_CULTURAL]: "cultural",
    [ROLES.GENSEC_SPORTS]: "sports",
};


exports.getDashboardStats = async (req, res) => {
    const { _id: userId, username, role } = req.user;
    const email =username;
    let stats = {};

    try {
        switch (role.toUpperCase()) {
            
            //  STUDENT
            case ROLES.STUDENT: {
                const [totalSkills, totalFeedbacksGiven, totalAchievements, totalPORs] =
                await Promise.all([
                    UserSkill.countDocuments({ user_id: userId }),
                    Feedback.countDocuments({ feedback_by: userId }),
                    Achievement.countDocuments({ user_id: userId }),
                    PositionHolder.countDocuments({ user_id: userId, status: "active" }),
                ]);

                stats = {
                    totalSkills,
                    totalFeedbacksGiven,
                    totalAchievements,
                    totalPORs,
                };
                break;
            }

            //  ALL GENSECS (SciTech, Cultural, etc.)
            case ROLES.GENSEC_SCITECH:
            case ROLES.GENSEC_ACADEMIC:
            case ROLES.GENSEC_CULTURAL:
            case ROLES.GENSEC_SPORTS: {
                const roleCategory = roleToCategoryMap[role];
                if (!roleCategory) {
                    return res.status(400).json({ msg: "Invalid GenSec role category." });
                }

                // Find the GenSec's organizational unit (Council) by their email
                const orgUnit = await OrganizationalUnit.findOne({ "contact_info.email": email });
                if (!orgUnit) {
                    console.error("Organizational Unit for GenSec not found.");
                    return res.status(404).json({ msg: "Organizational Unit for GenSec not found." });
                }

                // Query for pending user skills of the correct category using aggregation
                const pendingUserSkillsAggregation = await UserSkill.aggregate([
                    { $match: { is_endorsed: false } }, // Find un-endorsed user skills
                    {
                        $lookup: { 
                            from: "skills",
                            localField: "skill_id",
                            foreignField: "_id",
                            as: "skillDoc",
                        },
                    },
                    { $unwind: "$skillDoc" },
                    { $match: { "skillDoc.type": roleCategory } }, 
                    { $count: "count" }, 
                ]);

                const [childClubsCount, pendingSkills, pendingAchievements] =
                await Promise.all([
    
                    OrganizationalUnit.countDocuments({ parent_unit_id: orgUnit._id }),
                    Skill.countDocuments({ is_endorsed: false, type: roleCategory }),
                    Achievement.countDocuments({ verified: false }),
                ]);
                
                stats = {
                    budget: {
                        used: orgUnit.budget_info.spent_amount,
                        total: orgUnit.budget_info.allocated_budget,
                    },
                    parentOfClubs: childClubsCount,
                    pendingSkillsEndorsement: pendingSkills,
                    pendingUserSkillsEndorsement: (pendingUserSkillsAggregation.length > 0 ? pendingUserSkillsAggregation[0].count : 0),
                    pendingAchievementEndorsement: pendingAchievements,
                };
                break;
            }

            //  CLUB COORDINATOR
      
            case ROLES.CLUB_COORDINATOR: {
                const clubUnit = await OrganizationalUnit.findOne({ "contact_info.email": email });
                if (!clubUnit) {
                    console.error("Club unit for Coordinator not found.");
                    console.log(email);
                    return res.status(404).json({ msg: "Club unit for Coordinator not found." });
                }

                // Find all positions associated with this club
                const positionsInClub = await Position.find({ unit_id: clubUnit._id }).select('_id');
                const positionIds = positionsInClub.map(p => p._id);

                // Find all active members holding those positions
                const activeMembers = await PositionHolder.find({
                    position_id: { $in: positionIds },
                    status: 'active'
                });
                const memberUserIds = activeMembers.map(m => m.user_id);
                
                const [totalEvents, pendingReviews] = await Promise.all([
                     Event.countDocuments({ organizing_unit_id: clubUnit._id }),
                     Achievement.countDocuments({ user_id: { $in: memberUserIds }, verified: false }),
                ]);

                stats = {
                    budget: {
                        used: clubUnit.budget_info.spent_amount,
                        total: clubUnit.budget_info.allocated_budget,
                    },
                    totalEvents,
                    totalActiveMembers: activeMembers.length,
                    pendingReviews,
                };
                break;
            }


            //  PRESIDENT
            case ROLES.PRESIDENT: {
                const budgetAggregation = await OrganizationalUnit.aggregate([
                    { $group: {
                        _id: null,
                        totalBudget: { $sum: "$budget_info.allocated_budget" },
                        usedBudget: { $sum: "$budget_info.spent_amount" }
                    }}
                ]);
                
                const [pendingRoomRequests, totalOrgUnits] = await Promise.all([
                    Event.countDocuments({ "room_requests.status": "Pending" }),
                    OrganizationalUnit.countDocuments()
                ]);

                stats = {
                    pendingRoomRequests,
                    totalOrgUnits,
                    budget: {
                        used: (budgetAggregation[0] && budgetAggregation[0].usedBudget) || 0,
                        total: (budgetAggregation[0] && budgetAggregation[0].totalBudget) || 0,
                    }
                };
                break;
            }

            default:
                return res.status(400).json({ msg: "Invalid user role for stats." });
        }

        res.status(200).json(stats);

    } catch (error) {
        console.error("Error fetching dashboard stats:", error);
        res.status(500).send("Server Error");
    }
};