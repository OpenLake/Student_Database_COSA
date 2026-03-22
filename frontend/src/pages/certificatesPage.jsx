import Layout from "../Components/common/Layout";
import CertificatesList from "../Components/Certificates/CertificatesList";
import { useSidebar } from "../hooks/useSidebar";

export default function CertificatesPage() {
  const { isCollapsed } = useSidebar();

  const components = {
    CertificatesList: CertificatesList,
  };

  const gridConfig = [
    {
      id: "certificates",
      component: "CertificatesList",
      position: {
        colStart: 0,
        colEnd: isCollapsed ? 26 : 20,
        rowStart: 0,
        rowEnd: 16,
      },
    },
  ];

  return (
    <Layout
      headerText="Certificates"
      gridConfig={gridConfig}
      components={components}
    />
  );
}
