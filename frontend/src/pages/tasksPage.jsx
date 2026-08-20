import Layout from "../Components/common/Layout";
import TasksBoard from "../Components/TaskManagement/TasksBoard";
import { useSidebar } from "../hooks/useSidebar";

export default function TasksPage() {
  const { isCollapsed } = useSidebar();

  const components = { TasksBoard: TasksBoard };

  const gridConfig = [
    {
      id: "tasks",
      component: "TasksBoard",
      position: { colStart: 0, colEnd: isCollapsed ? 26 : 20, rowStart: 0, rowEnd: 16 },
    },
  ];

  return <Layout headerText="Tasks" gridConfig={gridConfig} components={components} />;
}