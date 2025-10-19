import {
  Home,
  Users,
  Calendar,
  Trophy,
  ClipboardList,
  Star,
  User,
  MessageSquare,
  UserPlus,
  Plus,
  Award,
} from "lucide-react";

const GENSEC_COMMON_NAV = [
  { key: "dashboard", label: "Home", icon: Home },
  // { key: "cosa", label: "CoSA", icon: Users },
  { key: "events", label: "Events", icon: Calendar },
  { key: "gensec-endorse", label: "Endorsements", icon: Award },
  { key: "feedback", label: "Feedback", icon: ClipboardList },
  // { key: "add-event", label: "Add Event", icon: Plus },
  { key: "por", label: "PORs", icon: UserPlus },
  { key: "organization", label: "Clubs", icon: Users },
];

export const NavbarConfig = {
  PRESIDENT: [
    { key: "dashboard", label: "Home", icon: Home },
    // { key: "cosa", label: "CoSA", icon: Users },
    { key: "por", label: "PORs", icon: UserPlus },
    { key: "feedback", label: "Feedback", icon: ClipboardList },
    { key: "events", label: "Events", icon: Calendar },
    // { key: "add-event", label: "Add Event", icon: Plus },
    { key: "organization", label: "Clubs", icon: Users },
  ],
  GENSEC_SCITECH: GENSEC_COMMON_NAV,
  GENSEC_ACADEMIC: GENSEC_COMMON_NAV,
  GENSEC_CULTURAL: GENSEC_COMMON_NAV,
  GENSEC_SPORTS: GENSEC_COMMON_NAV,

  CLUB_COORDINATOR: [
    { key: "dashboard", label: "Home", icon: Home },
    // { key: "cosa", label: "CoSA", icon: Users },
    { key: "por", label: "PORs", icon: UserPlus },
    { key: "events", label: "Events", icon: Calendar },
    // { key: "add-event", label: "Add Event", icon: Plus },
    { key: "feedback", label: "Feedback", icon: ClipboardList },
    { key: "achievements", label: "Achievements", icon: Award },
  ],

  STUDENT: [
    { key: "dashboard", label: "Home", icon: Home },
    { key: "profile", label: "Profile", icon: User },
    // { key: "cosa", label: "CoSA", icon: Users },
    { key: "events", label: "Events", icon: Calendar },
    { key: "feedback", label: "Feedback", icon: MessageSquare },
    // { key: "view-feedback", label: "Feedback", icon: ClipboardList },
    { key: "achievements", label: "Achieve", icon: Trophy },
    // { key: "view-achievements", label: "View Achievements", icon: Trophy },
    { key: "skills", label: "Skills", icon: Star },
    { key: "por", label: "PORs", icon: ClipboardList },
  ],
};
