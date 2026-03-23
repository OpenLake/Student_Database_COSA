import React, { useContext } from "react";
import { AdminContext } from "../../context/AdminContext";
import { TenureRecords } from "./TenureRecords";
import ManagePositions from "../ManagePosition";

const PORs = () => {
  const { isUserLoggedIn } = useContext(AdminContext);
  const userRole = isUserLoggedIn?.role || "STUDENT";
  return userRole === "STUDENT" ? <ManagePositions /> : <TenureRecords />;
};

export default PORs;
