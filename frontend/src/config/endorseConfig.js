const gensecPageConfig = {
  Tech: {
    title: "Tech Skills Pending Endorsement",
    subtitle: "Review and endorse technical skills submitted by students",
    fetchPath: "/skills/unendorsed/tech",
    endorsePathBase: "/skills/endorse/",
    themeColor: "blue",
  },
  Sports: {
    title: "Sports Skills Pending Endorsement",
    subtitle: "Review and endorse sports skills submitted by students",
    fetchPath: "/skills/unendorsed/sport",
    endorsePathBase: "/skills/endorse-sport/",
    themeColor: "red",
  },
  Academic: {
    title: "Academic Skills Pending Endorsement",
    subtitle: "Review and endorse academic skills submitted by students",
    fetchPath: "/skills/unendorsed/acad",
    endorsePathBase: "/skills/endorse-acad/",
    themeColor: "green",
  },
  Cultural: {
    title: "Cultural Skills Pending Endorsement",
    subtitle: "Review and endorse cultural skills submitted by students",
    fetchPath: "/skills/unendorsed/cultural",
    endorsePathBase: "/skills/endorse-cultural/",
    themeColor: "purple",
  },
};

export default gensecPageConfig;
