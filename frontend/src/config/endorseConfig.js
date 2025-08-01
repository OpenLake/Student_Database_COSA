// Configuration for different GenSec roles
export const GenSecConfig = {
  GENSEC_CULTURAL: {
    skillType: "cultural",
    displayTitle: "Cultural Secretary",
    pageTitle: "Cultural Endorsement Panel",
    description:
      "Review and endorse cultural skills, user skills, and achievements.",
    primaryColor: "#1f2937",
    accentColor: "#374151",
  },
  GENSEC_SPORTS: {
    skillType: "sports",
    displayTitle: "Sports Secretary",
    pageTitle: "Sports Endorsement Panel",
    description:
      "Review and endorse sports skills, user skills, and achievements.",
    primaryColor: "#1f2937",
    accentColor: "#374151",
  },
  GENSEC_SCITECH: {
    skillType: "technical",
    displayTitle: "Technical Secretary",
    pageTitle: "Technical Endorsement Panel",
    description:
      "Review and endorse technical skills, user skills, and achievements.",
    primaryColor: "#1f2937",
    accentColor: "#374151",
  },
  GENSEC_ACADEMIC: {
    skillType: "academic",
    displayTitle: "Academic Secretary",
    pageTitle: "Academic Endorsement Panel",
    description:
      "Review and endorse academic skills, user skills, and achievements.",
    primaryColor: "#1f2937",
    accentColor: "#374151",
  },
};

// Tab configuration
export const endorsementTabs = [
  {
    id: "user-skills",
    label: "User Skills",
    description: "Endorse individual user skill claims",
    icon: "user",
  },
  {
    id: "skills",
    label: "Skills",
    description: "Endorse skill definitions and categories",
    icon: "skill",
  },
  {
    id: "achievements",
    label: "Achievements",
    description: "Verify and endorse user achievements",
    icon: "achievement",
  },
];

// Helper function to get config by role
export const getConfigByRole = (role) => {
  return GenSecConfig[role];
};

// Helper function to get all available roles
export const getAllRoles = () => {
  return Object.keys(GenSecConfig);
};
