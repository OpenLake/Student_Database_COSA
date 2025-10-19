import Skills from "../Components/Skills/Skills";
import Layout from "../Components/common/Layout";

const SkillsPage = () => {
  const components = {
    Skills: Skills,
  };
  const gridConfig = [
    {
      id: "main",
      component: "Skills",
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
      headerText="Skills"
      gridConfig={gridConfig}
      components={components}
    />
  );
};

export default SkillsPage;
