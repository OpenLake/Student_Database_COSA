//import Dashboard from "../Components/Dashboard";

import {
  CreateTenure,
  ViewTenure,
} from "../Components/Positions/TenureRecords";
import ViewFeedback from "../Components/Feedback/ViewFeedback";
import EventForm from "../Components/Events/EventForm";
import CreateOrgUnit from "../Components/organization/CreateOrgUnit";
import GenSecEndorse from "../Components/GenSec/GenSecEndorse";
import AchievementsEndorsementTab from "../Components/GenSec/AchievementsEndorsementTab";

import FeedbackForm from "../Components/Feedback/FeedbackForm";
import AchievementForm from "../Components/Achievements/AchievementForm";
import ViewAchievements from "../Components/Achievements/ViewAchievements";

import EventsPage from "../pages/eventsPage";
import PORsPage from "../pages/porsPage";
import FeedbackPage from "../pages/feedbackPage";
import OrganizationPage from "../pages/organizationsPage";
import AchievementsPage from "../pages/achievementsPage";
import SkillsPage from "../pages/skillsPage";
import EndorsementPage from "../pages/endorsementPage";
import { HomePage } from "../pages/homePage";
import ProfilePage from "../pages/profilePage";
import AnnouncementsPage from "../pages/announcementsPage";
import TenurePage from "../pages/TenurePage";

export const DashboardComponents = {
  dashboard: HomePage,
  events: EventsPage,
  skills: SkillsPage,
  por: PORsPage,
  feedback: FeedbackPage,
  organization: OrganizationPage,
  achievements: AchievementsPage,
  endorsement: EndorsementPage,
  profile: ProfilePage,
  cosa: ViewTenure,
  announcements: AnnouncementsPage,
  "manage-positions": CreateTenure,
  "view-feedback": ViewFeedback,
  "add-event": EventForm,
  "add-org-unit": CreateOrgUnit,
  "gensec-endorse": GenSecEndorse,
  "endorse-achievements": AchievementsEndorsementTab,
  "give-feedback": FeedbackForm,
  "add-achievements": AchievementForm,
  "view-achievements": ViewAchievements,
  tenure: TenurePage,
};
