//import Dashboard from "../Components/Dashboard";
import Home, { DashboardContent } from "../Components/Dashboard/Home";
import {
  CreateTenure,
  ViewTenure,
} from "../Components/Positions/TenureRecords";
import ViewFeedback from "../Components/Feedback/ViewFeedback";
import EventList from "../Components/Events/EventList";
import EventForm from "../Components/Events/EventForm";
import CreateOrgUnit from "../Components/organization/CreateOrgUnit";
import GenSecEndorse from "../Components/GenSec/GenSecEndorse";
import AchievementsEndorsementTab from "../Components/GenSec/AchievementsEndorsementTab";
import StudentProfile from "../Components/Student/ProfilePage";
import FeedbackForm from "../Components/Feedback/FeedbackForm";
import AchievementForm from "../Components/Achievements/AddUserAchievements";
import ViewAchievements from "../Components/Achievements/ViewUserAchievements";
import UserSkillManagement from "../Components/Skills/UserSkillManagement";
import ManagePositions from "../Components/ManagePosition";
import EventsPage from "../pages/eventsPage";
import PORsPage from "../pages/porsPage";
import FeedbackPage from "../pages/feedbackPage";
import OrganizationPage from "../pages/organizationsPage";
import AchievementsPage from "../pages/achievementsPage";
import SkillsPage from "../pages/skillsPage";
import EndorsementPage from "../pages/endorsementPage";

export const DashboardComponents = {
  dashboard: DashboardContent,
  cosa: ViewTenure,
  "manage-positions": CreateTenure,
  "view-feedback": ViewFeedback,
  events: EventsPage,
  "add-event": EventForm,
  "add-org-unit": CreateOrgUnit,
  "gensec-endorse": GenSecEndorse,
  "endorse-achievements": AchievementsEndorsementTab,
  profile: StudentProfile,
  "give-feedback": FeedbackForm,
  "add-achievements": AchievementForm,
  "view-achievements": ViewAchievements,
  skills: SkillsPage,
  por: PORsPage,
  feedback: FeedbackPage,
  organization: OrganizationPage,
  achievements: AchievementsPage,
  endorsement: EndorsementPage,
};
