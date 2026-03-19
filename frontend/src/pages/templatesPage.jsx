import Layout from "../Components/common/Layout";
import Templates from "../Components/Templates/Template";
//import { RequestProvider } from "../context/RequestContext.js";
import { useSidebar } from "../hooks/useSidebar";

export default function TemplatesPage() {
  const { isCollapsed } = useSidebar();

  const components = {
    Templates: Templates,
  };

  const gridConfig = [
    {
      id: "templates",
      component: "Templates",
      position: {
        colStart: 0,
        colEnd: isCollapsed ? 26 : 20,
        rowStart: 0,
        rowEnd: 16,
      },
    },
  ];

  return (
    <>
      <Layout
        headerText="Templates"
        gridConfig={gridConfig}
        components={components}
      />
    </>
  );
}
