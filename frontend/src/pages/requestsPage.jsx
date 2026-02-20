import Layout from "../Components/common/Layout";
import Requests from "../Components/Requests/Requests.jsx";
import { RequestProvider } from "../context/RequestContext.js";
import { useSidebar } from "../hooks/useSidebar";

export default function CertificatesPage() {
  const { isCollapsed } = useSidebar();

  const components = {
    Requests: Requests,
  };

  const gridConfig = [
    {
      id: "requests",
      component: "Requests",
      position: {
        colStart: 0,
        colEnd: isCollapsed ? 26 : 20,
        rowStart: 0,
        rowEnd: 16,
      },
    },
  ];

  return (
    <RequestProvider>
      <Layout
        headerText="Requests"
        gridConfig={gridConfig}
        components={components}
      />
    </RequestProvider>
  );
}
