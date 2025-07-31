import React, { useState } from "react";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import "react-tabs/style/react-tabs.css";
import AddPositionForm from "./AddPositionForm";
import AddPositionHolderForm from "./AddPositionHolderForm";
import ViewPosition from "./ViewPosition";
import ViewPositionHolder from "./ViewPositionHolder";
export const CreateTenure = () => {
  return (
    <div className="bg-white min-h-screen p-8 text-black">
      <Tabs>
        <TabList className="flex space-x-4 border-b-2 border-gray-200">
          <Tab className="py-2 px-4 font-medium cursor-pointer border-b-2 border-transparent focus:outline-none [&.react-tabs__tab--selected]:border-[#4f46e5]">
            Add Position
          </Tab>
          <Tab className="py-2 px-4 font-medium cursor-pointer border-b-2 border-transparent focus:outline-none [&.react-tabs__tab--selected]:border-[#4f46e5]">
            Add Position Holder (POR)
          </Tab>
        </TabList>

        <TabPanel>
          <AddPositionForm />
        </TabPanel>
        <TabPanel>
          <AddPositionHolderForm />
        </TabPanel>
      </Tabs>
    </div>
  );
};

// ViewTenure: for viewing positions and holders
export const ViewTenure = () => {
  return (
    <div className="bg-white min-h-screen p-8 text-black">
      <Tabs>
        <TabList className="flex space-x-4 border-b-2 border-gray-200">
          <Tab className="py-2 px-4 font-medium cursor-pointer border-b-2 border-transparent focus:outline-none [&.react-tabs__tab--selected]:border-[#4f46e5]">
            View Positions
          </Tab>
          <Tab className="py-2 px-4 font-medium cursor-pointer border-b-2 border-transparent focus:outline-none [&.react-tabs__tab--selected]:border-[#4f46e5]">
            View Position Holders (POR)
          </Tab>
        </TabList>

        <TabPanel>
          <ViewPosition />
        </TabPanel>
        <TabPanel>
          <ViewPositionHolder />
        </TabPanel>
      </Tabs>
    </div>
  );
};

//export default {ViewTenure,CreateTenure};
