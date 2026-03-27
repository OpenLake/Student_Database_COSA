const OrganizationalUnit = require("../models/organizationSchema");
const { HttpError } = require("../utils/httpError");

async function getOrganization(id) {
  const org = await OrganizationalUnit.findById(id);
  if (!org) throw new HttpError(403, "Organization doesn't exist");
  return org;
}

async function getPresidentOrganization(club) {

  if(club.type?.toLowerCase() !== "club"){
    throw new HttpError(403, "Organization is not a club");
  }
  const presidentOrg = await OrganizationalUnit.findOne({
    hierarchy_level: 0,
    parent_unit_id: null,
  });
  if (!presidentOrg) throw new HttpError(500, "President organization not found");

  if (!club.parent_unit_id) {
    throw new HttpError(403, "Organization(Club) does not belong to a council");
  }

  const councilObj = await getOrganization(club.parent_unit_id);
  if (!councilObj.parent_unit_id) {
    throw new HttpError(403, "Organization(Council) does not belong to a president organization");
  }

  if (councilObj.type?.toLowerCase() !== "council") {  
    throw new HttpError(403, "Organization does not belong to a council");  
  } 

  const presidentObj = await getOrganization(councilObj.parent_unit_id);
  if (!presidentOrg._id.equals(presidentObj._id)) {
    throw new HttpError(500, "Invalid Organization");
  }

  return presidentObj;
}

module.exports = {
    getOrganization,
    getPresidentOrganization
}