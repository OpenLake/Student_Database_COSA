const getRole = (userEmail) => {
  if (userEmail === process.env.SCITECH_USERNAME) {
    return "GENSEC_SCITECH";
  } else if (userEmail === process.env.ACAD_USERNAME) {
    return "GENSEC_ACADEMIC";
  } else if (userEmail === process.env.CULT_USERNAME) {
    return "GENSEC_CULTURAL";
  } else if (userEmail === process.env.SPORT_USERNAME) {
    return "GENSEC_SPORTS";
  } else if (userEmail === process.env.PRESIDENT_USERNAME) {
    return "PRESIDENT";
  }

  return "STUDENT";
};

module.exports = getRole;
