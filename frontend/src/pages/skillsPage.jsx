import AddSkill from "../Components/Skills/AddSkill";
import Skills from "../Components/Skills/Skills";
import TopSkills from "../Components/Skills/TopSkills";
import Layout from "../Components/common/Layout";

const SkillsPage = () => {
  const components = {
    Skills: Skills,
    TopSkills: TopSkills,
    AddSkill: AddSkill,
  };
  const gridConfig = [
    {
      id: "main",
      component: "Skills",
      position: {
        colStart: 0,
        colEnd: 14,
        rowStart: 0,
        rowEnd: 16,
      },
      // props: { add: add, setAdd: setAdd },
    },
    {
      id: "main",
      component: "AddSkill",
      position: {
        colStart: 14,
        colEnd: 20,
        rowStart: 0,
        rowEnd: 8,
      },
    },
    {
      id: "main",
      component: "TopSkills",
      position: {
        colStart: 14,
        colEnd: 20,
        rowStart: 8,
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
