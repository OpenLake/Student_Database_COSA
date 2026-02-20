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
  Megaphone,
  Dock,
  LayoutTemplate,
  ClipboardPaste,
} from "lucide-react";

const GENSEC_COMMON_NAV = [
  { key: "dashboard", label: "Home", icon: Home },
  // { key: "cosa", label: "CoSA", icon: Users },
  { key: "announcements", label: "Announcements", icon: Megaphone },
  { key: "events", label: "Events", icon: Calendar },
  { key: "endorsement", label: "Endorsements", icon: Award },
  { key: "feedback", label: "Feedback", icon: ClipboardList },
  // { key: "add-event", label: "Add Event", icon: Plus },
  { key: "por", label: "PORs", icon: UserPlus },
  { key: "profile", label: "Profile", icon: User },
  { key: "organization", label: "Clubs", icon: Users },
  { key: "certificates", label: "Certificates", icon: Dock },
];

export const NavbarConfig = {
  PRESIDENT: [
    { key: "dashboard", label: "Home", icon: Home },
    // { key: "cosa", label: "CoSA", icon: Users },
    { key: "announcements", label: "Announcements", icon: Megaphone },

    { key: "por", label: "PORs", icon: UserPlus },
    { key: "feedback", label: "Feedback", icon: ClipboardList },
    { key: "events", label: "Events", icon: Calendar },
    // { key: "add-event", label: "Add Event", icon: Plus },
    { key: "profile", label: "Profile", icon: User },
    { key: "organization", label: "Clubs", icon: Users },
    { key: "requests", label: "Requests", icon: ClipboardPaste },
    { key: "templates", label: "Templates", icon: LayoutTemplate },
    { key: "certificates", label: "Certificates", icon: Dock },
  ],
  GENSEC_SCITECH: GENSEC_COMMON_NAV,
  GENSEC_ACADEMIC: GENSEC_COMMON_NAV,
  GENSEC_CULTURAL: GENSEC_COMMON_NAV,
  GENSEC_SPORTS: GENSEC_COMMON_NAV,

  CLUB_COORDINATOR: [
    { key: "dashboard", label: "Home", icon: Home },

    // { key: "cosa", label: "CoSA", icon: Users },
    { key: "announcements", label: "Announcements", icon: Megaphone },

    { key: "por", label: "PORs", icon: UserPlus },
    { key: "events", label: "Events", icon: Calendar },
    // { key: "add-event", label: "Add Event", icon: Plus },
    { key: "feedback", label: "Feedback", icon: ClipboardList },
    { key: "profile", label: "Profile", icon: User },
    { key: "endorsement", label: "Endorsements", icon: Award },
    { key: "certificates", label: "Certificates", icon: Dock },
  ],

  STUDENT: [
    { key: "dashboard", label: "Home", icon: Home },
    { key: "announcements", label: "Announcements", icon: Megaphone },

    { key: "profile", label: "Profile", icon: User },
    // { key: "cosa", label: "CoSA", icon: Users },
    { key: "events", label: "Events", icon: Calendar },
    { key: "feedback", label: "Feedback", icon: MessageSquare },
    // { key: "view-feedback", label: "Feedback", icon: ClipboardList },
    { key: "achievements", label: "Achieve", icon: Trophy },
    // { key: "view-achievements", label: "View Achievements", icon: Trophy },
    { key: "skills", label: "Skills", icon: Star },
    { key: "por", label: "PORs", icon: ClipboardList },
    { key: "certificates", label: "Certificates", icon: Dock },
  ],
};
