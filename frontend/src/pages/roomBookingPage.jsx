import React from "react";
import Layout from "../Components/common/Layout";
import RoomBooking from "../Components/RoomBooking";

const RoomBookingPage = () => {
  const components = {
    RoomBooking: RoomBooking,
  };

  const gridConfig = [
    {
      id: "main",
      component: "RoomBooking",
      position: {
        colStart: 0,
        colEnd: 20,
        rowStart: 0,
        rowEnd: 16,
      },
    },
  ];

  return (
    <Layout
      headerText="Room Booking"
      gridConfig={gridConfig}
      components={components}
    />
  );
};

export default RoomBookingPage;
