import React, { useContext } from "react";
import { AdminContext } from "../../context/AdminContext";
import { CreateTenure, TenureRecords, ViewTenure } from "./TenureRecords";
import ManagePositions from "../ManagePosition";
import ViewPositionHolder from "./ViewPositionHolder";

const PORs = () => {
  const { isUserLoggedIn } = useContext(AdminContext);
  const userRole = isUserLoggedIn?.role || "STUDENT";
  return userRole === "STUDENT" ? <ManagePositions /> : <TenureRecords />;
};

export default PORs;
