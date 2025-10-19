import { SidebarProvider } from "../hooks/useSidebar";
import EventList from "../Components/Events/EventList";
import Layout from "../Components/common/Layout";
import EventForm from "../Components/Events/EventForm";
import { useState } from "react";

const EventsPage = () => {
  const [addEvent, setAddEvent] = useState(false);

  const components = {
    EventList: EventList,
    EventForm: EventForm,
  };
  const gridConfig = [
    {
      id: "main",
      component: addEvent ? "EventForm" : "EventList",
      position: {
        colStart: 0,
        colEnd: 15,
        rowStart: 0,
        rowEnd: addEvent ? 16 : 12,
      },
      props: { addEvent: addEvent, setAddEvent: setAddEvent },
    },
  ];
  return (
    <Layout
      headerText="Events"
      gridConfig={gridConfig}
      components={components}
    />
  );
};

export default EventsPage;
