import Layout from "../Components/common/Layout";
import StudentManagement from "../Components/Students/StudentManagement";
import { useSidebar } from "../hooks/useSidebar";

export default function StudentsPage() {
  const { isCollapsed } = useSidebar();

  const components = {
    StudentManagement: StudentManagement,
  };

  const gridConfig = [
    {
      id: "students",
      component: "StudentManagement",
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
      headerText="Students"
      gridConfig={gridConfig}
      components={components}
    />
  );
}