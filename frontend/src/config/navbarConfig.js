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

export const NavbarConfig = {
  PRESIDENT: [
    { key: "dashboard", label: "Dashboard", icon: Home },
    { key: "cosa", label: "CoSA", icon: Users },
    { key: "manage-positions", label: "Manage Positions", icon: UserPlus },
    { key: "view-feedback", label: "View Feedback", icon: ClipboardList },
    { key: "events", label: "Events", icon: Calendar },
    { key: "add-event", label: "Add Event", icon: Plus },
    { key: "add-org-unit", label: "Add Org Unit", icon: Users },
  ],

  GENSEC_COMMON: [
    { key: "dashboard", label: "Dashboard", icon: Home },
    { key: "cosa", label: "CoSA", icon: Users },
    { key: "events", label: "Events", icon: Calendar },
    { key: "gensec-endorse", label: "Endorsements", icon: Award },
    { key: "view-feedback", label: "View Feedback", icon: ClipboardList },
    { key: "add-event", label: "Add Event", icon: Plus },
    { key: "manage-positions", label: "Manage Positions", icon: UserPlus },
    { key: "add-org-unit", label: "Add Org Unit", icon: Users },
  ],

  CLUB_COORDINATOR: [
    { key: "dashboard", label: "Dashboard", icon: Home },
    { key: "cosa", label: "CoSA", icon: Users },
    { key: "manage-positions", label: "Manage Positions", icon: UserPlus },
    { key: "events", label: "Events", icon: Calendar },
    { key: "add-event", label: "Add Event", icon: Plus },
    { key: "view-feedback", label: "View Feedback", icon: ClipboardList },
    { key: "endorse-achievements", label: "Endorse Achievement", icon: Award },
  ],

  STUDENT: [
    { key: "dashboard", label: "Dashboard", icon: Home },
    { key: "profile", label: "Profile", icon: User },
    { key: "cosa", label: "CoSA", icon: Users },
    { key: "events", label: "Events", icon: Calendar },
    { key: "give-feedback", label: "Give Feedback", icon: MessageSquare },
    { key: "view-feedback", label: "View Feedback", icon: ClipboardList },
    { key: "add-achievements", label: "Achievements", icon: Star },
    { key: "view-achievements", label: "View Achievements", icon: Trophy },
    { key: "skills", label: "Skills", icon: Star },
    { key: "por", label: "PORs", icon: ClipboardList },
  ],
};
