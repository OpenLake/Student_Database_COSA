import React, { useState, useEffect, useContext } from "react";
import api from "../../utils/api";
import { AdminContext } from "../../context/AdminContext";
import OrgList from "./OrgList";
const ViewClubs = () => {
  const { isUserLoggedIn } = useContext(AdminContext);
  const userRole = isUserLoggedIn?.role || "STUDENT";
  const [clubs, setClubs] = useState(null);
  const [selectedClub, setSelectedClub] = useState(null);
  const [currId, setCurrId] = useState(null);
  const getRoleCategory = (role) => {
    switch (role) {
      case "GENSEC_SCITECH":
        return "scitech";
      case "GENSEC_ACADEMIC":
        return "academic";
      case "GENSEC_CULTURAL":
        return "cultural";
      case "GENSEC_SPORTS":
        return "sports";
      default:
        return "";
    }
  };
  const getId = (role) => {
    switch (role) {
      case "GENSEC_SCITECH":
        return "COUNCIL_SCITECH";
      case "GENSEC_ACADEMIC":
        return "COUNCIL_CULTURAL";
      case "GENSEC_CULTURAL":
        return "COUNCIL_CULTURAL";
      case "GENSEC_SPORTS":
        return "COUNCIL_SPORTS";
      case "PRESIDENT":
        return "PRESIDENT_GYMKHANA";
      default:
        return "";
    }
  };
  useEffect(() => {
    const fetchUnits = async () => {
      let url = `/api/orgUnit/organizational-units`;
      const category = getRoleCategory(userRole);
      if (userRole !== "PRESIDENT" && category) {
        url += `?category=${category}`;
      }
      try {
        const { data } = await api.get(url);
        setClubs(data);
      } catch (error) {
        console.error("Error fetching organizational units:", error);
      }
    };
    fetchUnits();
  }, [userRole]);
  if (clubs) {
    clubs.find((unit) => {
      if (unit.unit_id == getId(userRole)) {
        setCurrId(unit._id);
      }
    });
  }
  return (
    <div className="min-h-screen p-8 rounded-3xl">
      <h2 className="text-2xl font-semibold mb-6 text-gray-800">
        Clubs under {userRole.replace(/_/g, " ")}
      </h2>
      <OrgList units={clubs} parent_unit_id={currId} />
    </div>
  );
};

export default ViewClubs;
