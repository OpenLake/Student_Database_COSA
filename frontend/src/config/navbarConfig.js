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
  Pencil,
  SquareCheck,
  FolderOpen
} from "lucide-react";

const GENSEC_COMMON_NAV = [
  { key: "dashboard", label: "Home", icon: Home },
  // { key: "cosa", label: "CoSA", icon: Users },
  { key: "announcements", label: "Announcements", icon: Megaphone },
  { key: "certificates", label: "Certificates", icon: Dock },
  { key: "events", label: "Events", icon: Calendar },
  { key: "endorsement", label: "Endorsements", icon: Award },
  { key: "feedback", label: "Feedback", icon: ClipboardList },
  // { key: "add-event", label: "Add Event", icon: Plus },
  { key: "organization", label: "Clubs", icon: Users },
  { key: "por", label: "PORs", icon: UserPlus },
  { key: "requests", label: "Requests", icon: ClipboardPaste },
  { key: "templates", label: "Templates", icon: LayoutTemplate },
  { key: "profile", label: "Profile", icon: User },


];

export const NavbarConfig = {
  PRESIDENT: [
    { key: "dashboard", label: "Home", icon: Home },
    // { key: "cosa", label: "CoSA", icon: Users },
    { key: "announcements", label: "Announcements", icon: Megaphone },
    { key: "certificates", label: "Certificates", icon: Dock },
    { key: "events", label: "Events", icon: Calendar },
    { key: "feedback", label: "Feedback", icon: ClipboardList },
    { key: "organization", label: "Clubs", icon: Users },
    { key: "por", label: "PORs", icon: UserPlus },
    // { key: "add-event", label: "Add Event", icon: Plus },
    { key: "requests", label: "Requests", icon: ClipboardPaste },
    { key: "templates", label: "Templates", icon: LayoutTemplate },
    { key: "profile", label: "Profile", icon: User },
    
  ],
  GENSEC_SCITECH: GENSEC_COMMON_NAV,
  GENSEC_ACADEMIC: GENSEC_COMMON_NAV,
  GENSEC_CULTURAL: GENSEC_COMMON_NAV,
  GENSEC_SPORTS: GENSEC_COMMON_NAV,

  CLUB_COORDINATOR: [
    { key: "dashboard", label: "Home", icon: Home },
    // { key: "cosa", label: "CoSA", icon: Users },
    { key: "announcements", label: "Announcements", icon: Megaphone },
    { key: "batches", label: "Batches", icon: FolderOpen },
    { key: "certificates", label: "Certificates", icon: Dock },
    { key: "drafts", label: "Draft", icon: Pencil },
    { key: "events", label: "Events", icon: Calendar },
    { key: "endorsements", label: "Endorsements", icon: Award },
    { key: "feedbacks", label: "Feedback", icon: ClipboardList },
    { key: "pors", label: "PORs", icon: UserPlus },
    // { key: "add-event", label: "Add Event", icon: Plus },
    { key: "requests", label: "Requests", icon: ClipboardPaste },
    { key: "submitted", label: "Submitted", icon: SquareCheck },
    { key: "templates", label: "Templates", icon: LayoutTemplate },
    { key: "profile", label: "Profile", icon: User },
    
  ],

  STUDENT: [
    { key: "dashboard", label: "Home", icon: Home },
    { key: "announcements", label: "Announcements", icon: Megaphone },
    { key: "achievements", label: "Achieve", icon: Trophy },
    { key: "certificates", label: "Certificates", icon: Dock },
    // { key: "cosa", label: "CoSA", icon: Users },
    { key: "events", label: "Events", icon: Calendar },
    { key: "feedback", label: "Feedback", icon: MessageSquare },
    // { key: "view-feedback", label: "Feedback", icon: ClipboardList },
    // { key: "view-achievements", label: "View Achievements", icon: Trophy },
    { key: "por", label: "PORs", icon: ClipboardList },
    { key: "skills", label: "Skills", icon: Star },
    { key: "profile", label: "Profile", icon: User },
  ],
};
