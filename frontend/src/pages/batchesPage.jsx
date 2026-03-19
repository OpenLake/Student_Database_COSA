import Layout from "../Components/common/Layout.jsx";
import Batches from "../Components/Batches/batches.jsx"
import { useSidebar } from "../hooks/useSidebar.js";

export default function BatchesPage() {
  const { isCollapsed } = useSidebar();

  const components = {
    
    Batches: Batches,
  };

  const gridConfig = [
    {
      id: "batches",
      component: "Batches",
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
        headerText="Batches"
        gridConfig={gridConfig}
        components={components}
      />
    </>
  );
}
