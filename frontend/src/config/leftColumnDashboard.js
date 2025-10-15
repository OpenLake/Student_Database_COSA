
import {TotalSkillsCard, TotalFeedbackCard, TotalAchievementsCard, TotalPositionsCard } from "../Components/Dashboard/Cards/Students/index";
import { BudgetCard as GensecBudgetCard, PendingEndorsementsCard, ChildClubsCard } from "../Components/Dashboard/Cards/Gensec/index";
import { BudgetCard as CoordinatorBudgetCard, TotalEventsCard, ActiveMembersCard, PendingReviewsCard } from "../Components/Dashboard/Cards/Coordinator/index";
import { BudgetCard as PresidentBudgetCard, PendingRoomRequestsCard, TotalOrgUnitsCard } from "../Components/Dashboard/Cards/President/index";

export const DashboardCardsConfig = {
  STUDENT: [
    { Component: TotalSkillsCard, props: { count: (stats) => stats.totalSkills } },
    { Component: TotalFeedbackCard, props: { count: (stats) => stats.totalFeedbacksGiven } },
    { Component: TotalAchievementsCard, props: { count: (stats) => stats.totalAchievements } },
    { Component: TotalPositionsCard, props: { count: (stats) => stats.totalPORs } },
  ],
  
  // A generic config for all GenSec roles
  GENSEC: [
    { Component: GensecBudgetCard, props: { budget: (stats) => stats.budget } },
    { Component: ChildClubsCard, props: { count: (stats) => stats.parentOfClubs } },
    { Component: PendingEndorsementsCard, props: {
        skills: (stats) => stats.pendingSkillsEndorsement,
        userSkills: (stats) => stats.pendingUserSkillsEndorsement,
        achievements: (stats) => stats.pendingAchievementEndorsement,
      }},
  ],

  CLUB_COORDINATOR: [
    { Component: CoordinatorBudgetCard, props: { budget: (stats) => stats.budget } },
    { Component: TotalEventsCard, props: { count: (stats) => stats.totalEvents } },
    { Component: ActiveMembersCard, props: { count: (stats) => stats.totalActiveMembers } },
    { Component: PendingReviewsCard, props: { count: (stats) => stats.pendingReviews } },
  ],

  PRESIDENT: [
    { Component: PresidentBudgetCard, props: { budget: (stats) => stats.budget } },
    { Component: PendingRoomRequestsCard, props: { count: (stats) => stats.pendingRoomRequests } },
    { Component: TotalOrgUnitsCard, props: { count: (stats) => stats.totalOrgUnits } },
  ],
};