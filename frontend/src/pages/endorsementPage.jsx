import Endorsement from "../Components/Endorsement/Endorsement";
import Layout from "../Components/common/Layout";

const EndorsementPage = () => {
  const components = {
    Endorsement: Endorsement,
  };
  const gridConfig = [
    {
      id: "main",
      component: "Endorsement",
      position: {
        colStart: 0,
        colEnd: 15,
        rowStart: 0,
        rowEnd: 16,
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
