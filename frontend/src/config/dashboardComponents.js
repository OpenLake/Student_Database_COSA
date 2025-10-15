//import Dashboard from "../Components/Dashboard";
import Home from "../Components/Dashboard/Home"
import { CreateTenure, ViewTenure } from "../Components/Positions/TenureRecords";
import ViewFeedback from "../Components/Feedback/ViewFeedback";
import EventList from "../Components/Events/EventList";
import EventForm from "../Components/Events/EventForm";
import CreateOrgUnit from "../Components/CreateOrgUnit";
import GenSecEndorse from "../Components/GenSec/GenSecEndorse";
import AchievementsEndorsementTab from "../Components/GenSec/AchievementsEndorsementTab";
import StudentProfile from "../Components/Student/ProfilePage";
import FeedbackForm from "../Components/Feedback/FeedbackForm";
import AchievementForm from "../Components/Student/AddUserAchievements";
import ViewAchievements from "../Components/Student/ViewUserAchievements";
import UserSkillManagement from "../Components/Student/UserSkillManagement";
import ManagePositions from "../Components/ManagePosition";

export const DashboardComponents = {
  dashboard: Home,
  cosa: ViewTenure,
  "manage-positions": CreateTenure,
  "view-feedback": ViewFeedback,
  events: EventList,
  "add-event": EventForm,
  "add-org-unit": CreateOrgUnit,
  "gensec-endorse": GenSecEndorse,
  "endorse-achievements": AchievementsEndorsementTab,
  profile: StudentProfile,
  "give-feedback": FeedbackForm,
  "add-achievements": AchievementForm,
  "view-achievements": ViewAchievements,
  skills: UserSkillManagement,
  por: ManagePositions,
};