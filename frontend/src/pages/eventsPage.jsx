import { SidebarProvider } from "../hooks/useSidebar";
import EventList from "../Components/Events/EventList";
import Layout from "../Components/common/Layout";
import EventForm from "../Components/Events/EventForm";
import { useState } from "react";
import Calendar from "../Components/common/Calendar";
import LatestUpdates from "../Components/common/LatestUpdatesCard";
import NSCard from "../Components/NsoNss/NSCard";
import Events from "../Components/Events/Events";

const EventsPage = () => {
  const [addEvent, setAddEvent] = useState(false);

  const components = {
    EventList: EventList,
    EventForm: EventForm,
    Calendar: Calendar,
    LatestUpdates: LatestUpdates,
    NSCard: NSCard,
    Events: Events,
  };
  const gridConfig = [
        {
      id: "main",
      component: "Events",
      position: {
        colStart: 0,
        colEnd: 14,
        rowStart: 0,
        rowEnd: 10,
      },
    },
    {
      id: "calendar",
      component: "Calendar",
      position: {
        colStart: 14,
        colEnd: 20,
        rowStart: 0,
        rowEnd: 7,
      },
    },
    {
      id: "updates",
      component: "LatestUpdates",
      position: {
        colStart: 14,
        colEnd: 20,
        rowStart: 7,
        rowEnd: 16,
      },
    },
    {
      id: "NSONSS",
      component: "NSCard",
      position: {
        colStart: 0,
        colEnd: 14,
        rowStart: 10,
        rowEnd: 16,
      },
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
