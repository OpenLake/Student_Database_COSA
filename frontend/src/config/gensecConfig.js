// src/config/gensecConfig.js
import {
  Award,
  DoorClosed,
  MessageSquare,
  Calendar,
  PlusCircle,
  FileText,
  Layers,
  Users,
  Grid,
  Book,
} from "lucide-react";

export const GENSEC_CONFIGS = {
  GENSEC_ACADEMIC: {
    title: "Academic Portal",
    displayName: "Academic",
    theme: "from-green-600 to-teal-700",
    avatar: "GA",
    icon: <Book className="h-8 w-8" />,
    categories: [
      { id: "all", name: "All Modules", icon: <Grid className="w-4 h-4" /> },
      {
        id: "admin",
        name: "Administration",
        icon: <Users className="w-4 h-4" />,
      },
      {
        id: "endorsement",
        name: "Endorsements",
        icon: <Award className="w-4 h-4" />,
      },
      {
        id: "booking",
        name: "Bookings",
        icon: <DoorClosed className="w-4 h-4" />,
      },
      {
        id: "feedback",
        name: "Feedback",
        icon: <MessageSquare className="w-4 h-4" />,
      },
      { id: "events", name: "Events", icon: <Calendar className="w-4 h-4" /> },
      { id: "cosa", name: "COSA", icon: <FileText className="w-4 h-4" /> },
    ],
    menuItems: [
      {
        title: "GenSec Acad Endorsement",
        path: "/gensec-endorse",
        icon: <Award className="w-5 h-5" />,
        category: "endorsement",
        color: "from-green-500 to-teal-600",
      },
      {
        title: "Room Booking",
        path: "/roombooking",
        icon: <DoorClosed className="w-5 h-5" />,
        category: "booking",
        color: "from-blue-500 to-indigo-600",
      },
      {
        title: "View Feedback",
        path: "/viewfeedback",
        icon: <MessageSquare className="w-5 h-5" />,
        category: "feedback",
        color: "from-orange-500 to-red-600",
      },
      {
        title: "Events",
        path: "/events",
        icon: <Calendar className="w-5 h-5" />,
        category: "events",
        color: "from-purple-500 to-indigo-600",
      },
      {
        title: "Add Event",
        path: "/add-event",
        icon: <PlusCircle className="w-5 h-5" />,
        category: "events",
        color: "from-purple-500 to-indigo-600",
      },
      {
        title: "COSA Create",
        path: "/cosa/create",
        icon: <FileText className="w-5 h-5" />,
        category: "cosa",
        color: "from-yellow-500 to-amber-600",
      },
      {
        title: "COSA View",
        path: "/cosa",
        icon: <Layers className="w-5 h-5" />,
        category: "cosa",
        color: "from-yellow-500 to-amber-600",
      },
    ],
  },
  GENSEC_CULTURAL: {
    title: "Cultural Portal",
    displayName: "Cultural",
    theme: "from-purple-600 to-pink-700",
    avatar: "GC",
    icon: <Award className="h-8 w-8" />,
    categories: [
      { id: "all", name: "All Modules", icon: <Grid className="w-4 h-4" /> },
      {
        id: "admin",
        name: "Administration",
        icon: <Users className="w-4 h-4" />,
      },
      {
        id: "endorsement",
        name: "Endorsements",
        icon: <Award className="w-4 h-4" />,
      },
      {
        id: "booking",
        name: "Bookings",
        icon: <DoorClosed className="w-4 h-4" />,
      },
      {
        id: "feedback",
        name: "Feedback",
        icon: <MessageSquare className="w-4 h-4" />,
      },
      { id: "events", name: "Events", icon: <Calendar className="w-4 h-4" /> },
      { id: "cosa", name: "COSA", icon: <FileText className="w-4 h-4" /> },
    ],
    menuItems: [
      {
        title: "GenSec Cult Endorsement",
        path: "/gensec-endorse",
        icon: <Award className="w-5 h-5" />,
        category: "endorsement",
        color: "from-purple-500 to-pink-600",
      },
      {
        title: "Room Booking",
        path: "/roombooking",
        icon: <DoorClosed className="w-5 h-5" />,
        category: "booking",
        color: "from-green-500 to-teal-600",
      },
      {
        title: "View Feedback",
        path: "/viewfeedback",
        icon: <MessageSquare className="w-5 h-5" />,
        category: "feedback",
        color: "from-orange-500 to-red-600",
      },
      {
        title: "Events",
        path: "/events",
        icon: <Calendar className="w-5 h-5" />,
        category: "events",
        color: "from-purple-500 to-indigo-600",
      },
      {
        title: "Add Event",
        path: "/add-event",
        icon: <PlusCircle className="w-5 h-5" />,
        category: "events",
        color: "from-purple-500 to-indigo-600",
      },
      {
        title: "COSA Create",
        path: "/cosa/create",
        icon: <FileText className="w-5 h-5" />,
        category: "cosa",
        color: "from-yellow-500 to-amber-600",
      },
      {
        title: "COSA View",
        path: "/cosa",
        icon: <Layers className="w-5 h-5" />,
        category: "cosa",
        color: "from-yellow-500 to-amber-600",
      },
    ],
  },
  GENSEC_SPORTS: {
    title: "Sports Portal",
    displayName: "Sports",
    theme: "from-amber-600 to-orange-700",
    avatar: "GS",
    icon: <Award className="h-8 w-8" />,
    categories: [
      { id: "all", name: "All Modules", icon: <Grid className="w-4 h-4" /> },
      {
        id: "admin",
        name: "Administration",
        icon: <Users className="w-4 h-4" />,
      },
      {
        id: "endorsement",
        name: "Endorsements",
        icon: <Award className="w-4 h-4" />,
      },
      {
        id: "booking",
        name: "Bookings",
        icon: <DoorClosed className="w-4 h-4" />,
      },
      {
        id: "feedback",
        name: "Feedback",
        icon: <MessageSquare className="w-4 h-4" />,
      },
      { id: "events", name: "Events", icon: <Calendar className="w-4 h-4" /> },
      { id: "cosa", name: "COSA", icon: <FileText className="w-4 h-4" /> },
    ],
    menuItems: [
      {
        title: "GenSec Sports Endorsement",
        path: "/gensec-endorse",
        icon: <Award className="w-5 h-5" />,
        category: "endorsement",
        color: "from-red-500 to-pink-600",
      },
      {
        title: "Room Booking",
        path: "/roombooking",
        icon: <DoorClosed className="w-5 h-5" />,
        category: "booking",
        color: "from-green-500 to-teal-600",
      },
      {
        title: "View Feedback",
        path: "/viewfeedback",
        icon: <MessageSquare className="w-5 h-5" />,
        category: "feedback",
        color: "from-orange-500 to-red-600",
      },
      {
        title: "Events",
        path: "/events",
        icon: <Calendar className="w-5 h-5" />,
        category: "events",
        color: "from-purple-500 to-indigo-600",
      },
      {
        title: "Add Event",
        path: "/add-event",
        icon: <PlusCircle className="w-5 h-5" />,
        category: "events",
        color: "from-purple-500 to-indigo-600",
      },
      {
        title: "COSA Create",
        path: "/cosa/create",
        icon: <FileText className="w-5 h-5" />,
        category: "cosa",
        color: "from-yellow-500 to-amber-600",
      },
      {
        title: "COSA View",
        path: "/cosa",
        icon: <Layers className="w-5 h-5" />,
        category: "cosa",
        color: "from-yellow-500 to-amber-600",
      },
    ],
  },
  GENSEC_SCITECH: {
    title: "SciTech Portal",
    displayName: "SciTech",
    theme: "from-indigo-600 to-purple-700",
    avatar: "GT",
    icon: <Award className="h-8 w-8" />,
    categories: [
      { id: "all", name: "All Modules", icon: <Grid className="w-4 h-4" /> },
      {
        id: "admin",
        name: "Administration",
        icon: <Users className="w-4 h-4" />,
      },
      {
        id: "endorsement",
        name: "Endorsements",
        icon: <Award className="w-4 h-4" />,
      },
      {
        id: "booking",
        name: "Bookings",
        icon: <DoorClosed className="w-4 h-4" />,
      },
      {
        id: "feedback",
        name: "Feedback",
        icon: <MessageSquare className="w-4 h-4" />,
      },
      { id: "events", name: "Events", icon: <Calendar className="w-4 h-4" /> },
      { id: "cosa", name: "COSA", icon: <FileText className="w-4 h-4" /> },
    ],
    menuItems: [
      {
        title: "GenSec Tech Endorsement",
        path: "/gensec-endorse",
        icon: <Award className="w-5 h-5" />,
        category: "endorsement",
        color: "from-teal-500 to-blue-600",
      },
      {
        title: "Room Booking",
        path: "/roombooking",
        icon: <DoorClosed className="w-5 h-5" />,
        category: "booking",
        color: "from-green-500 to-teal-600",
      },
      {
        title: "View Feedback",
        path: "/viewfeedback",
        icon: <MessageSquare className="w-5 h-5" />,
        category: "feedback",
        color: "from-orange-500 to-red-600",
      },
      {
        title: "Events",
        path: "/events",
        icon: <Calendar className="w-5 h-5" />,
        category: "events",
        color: "from-purple-500 to-indigo-600",
      },
      {
        title: "Add Event",
        path: "/add-event",
        icon: <PlusCircle className="w-5 h-5" />,
        category: "events",
        color: "from-purple-500 to-indigo-600",
      },
      {
        title: "COSA Create",
        path: "/cosa/create",
        icon: <FileText className="w-5 h-5" />,
        category: "cosa",
        color: "from-yellow-500 to-amber-600",
      },
      {
        title: "COSA View",
        path: "/cosa",
        icon: <Layers className="w-5 h-5" />,
        category: "cosa",
        color: "from-yellow-500 to-amber-600",
      },
    ],
  },
};
