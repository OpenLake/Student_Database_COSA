import Calendar from "../Components/common/Calendar";
import Layout from "../Components/common/Layout";
import MostActiveClubs from "../Components/organization/MostActiveClubs";
import Organization from "../Components/organization/organization";

const OrganizationPage = () => {
  const components = {
    Organization: Organization,
    MostActiveClubs: MostActiveClubs,
    Calendar: Calendar,
  };
  const gridConfig = [
    {
      id: "main",
      component: "Organization",
      position: {
        colStart: 0,
        colEnd: 14,
        rowStart: 0,
        rowEnd: 16,
      },
    },
    {
      id: "active",
      component: "MostActiveClubs",
      position: {
        colStart: 14,
        colEnd: 20,
        rowStart: 8,
        rowEnd: 16,
      },
    },
    {
      id: "calendar",
      component: "Calendar",
      position: {
        colStart: 14,
        colEnd: 20,
        rowStart: 0,
        rowEnd: 8,
      },
    },
  ];
  return (
    <Layout
      headerText="Organization"
      gridConfig={gridConfig}
      components={components}
    />
  );
};

export default OrganizationPage;
