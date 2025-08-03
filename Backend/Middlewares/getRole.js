const { OrganizationalUnit } = require("../models/schema");
const getRole = async (userEmail) => {
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

  const club = await OrganizationalUnit.findOne({ email: userEmail });

  if (club) {
    return "CLUB_COORDINATOR";
  }

  return "STUDENT";
};

module.exports = getRole;
