import Layout from "../Components/common/Layout";
import TaskManagement from "../Components/TaskManagement/tasks";
import { useSidebar } from "../hooks/useSidebar";

export default function TasksPage() {
  const { isCollapsed } = useSidebar();

  const components = {
    TaskManagement: TaskManagement,
  };

  const gridConfig = [
    {
      id: "tasks",
      component: "TaskManagement",
      position: {
        colStart: 0,
        colEnd: isCollapsed ? 25 : 20,
        rowStart: 0,
        rowEnd: 16,
      },
    },
  ];

  return (
    <Layout
      headerText="Task Management"
      gridConfig={gridConfig}
      components={components}
    />
  );
}
