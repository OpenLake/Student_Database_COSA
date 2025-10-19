import Certificates from "../Components/Achievements/Certificates";
import Endorsement from "../Components/Endorsement/Endorsement";
import ClubPoints from "../Components/Positions/ClubPoints";
import Layout from "../Components/common/Layout";

const EndorsementPage = () => {
  const components = {
    Endorsement: Endorsement,
    Certificates: Certificates,
    ClubPoints: ClubPoints,
  };
  const gridConfig = [
    {
      id: "main",
      component: "Endorsement",
      position: {
        colStart: 0,
        colEnd: 14,
        rowStart: 0,
        rowEnd: 16,
      },
    },
    {
      id: "certificates",
      component: "Certificates",
      position: {
        colStart: 14,
        colEnd: 20,
        rowStart: 8,
        rowEnd: 16,
      },
    },
    {
      id: "points",
      component: "ClubPoints",
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
      headerText="Endorsement"
      gridConfig={gridConfig}
      components={components}
    />
  );
};

export default EndorsementPage;
