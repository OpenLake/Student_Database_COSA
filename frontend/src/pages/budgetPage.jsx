import React from "react";
import Layout from "../Components/common/Layout";
import BudgetManagement from "../Components/Budget/BudgetManagement";

const BudgetPage = () => {
  return (
    <Layout headerText="Budget Management">
      <BudgetManagement />
    </Layout>
  );
};

export default BudgetPage;
