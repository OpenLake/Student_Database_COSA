import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import "react-tabs/style/react-tabs.css";
import AddPositionForm from "./AddPositionForm";
import AddPositionHolderForm from "./AddPositionHolderForm";
import ViewPosition from "./ViewPosition";
import ViewPositionHolder from "./ViewPositionHolder";
import { useState } from "react";
import { Eye, Plus } from "lucide-react";

export const TenureRecords = () => {
  const [add, setAdd] = useState(false);

  return (
    <div className="px-6 pt-6 pb-2 flex items-center justify-between flex-wrap gap-3">
      <div className="flex items-center justify-between">
        <div className="">
          <div className="text-2xl font-bold tracking-tight text-gray-900">
            Manage Positions
          </div>
        </div>
      </div>
      <button
        onClick={() => setAdd(!add)}
        className="flex items-center gap-2 bg-[#A98B74] text-white text-sm px-4 py-2 rounded-lg hover:bg-[#856A5D] transition-colors"
      >
        {add ? (
          <div className="flex gap-2">
            <Plus className="w-6 h-6" /> <span>Add Position</span>
          </div>
        ) : (
          <div className="flex gap-2">
            <Eye className="w-6 h-6" /> <span>View Position</span>
          </div>
        )}
      </button>
      {add ? <CreateTenure /> : <ViewTenure />}
    </div>
  );
};

export const CreateTenure = () => {
  return (
    <div className="bg-white min-h-screen text-black">
      <Tabs>
        <TabList className="flex border-b-2 border-gray-200">
          <Tab className="py-2 px-4 font-medium cursor-pointer border-b-3 border-transparent focus:outline-none [&.react-tabs__tab--selected]:border-gray-400">
            Add Position
          </Tab>
          <Tab className="py-2 px-4 font-medium cursor-pointer border-b-3 border-transparent focus:outline-none [&.react-tabs__tab--selected]:border-gray-400">
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
    <div className="bg-white min-h-screen text-black">
      <Tabs>
        <TabList className="flex border-b-2 border-gray-200">
          <Tab className="py-2 px-4 font-medium cursor-pointer border-b-3 border-transparent focus:outline-none [&.react-tabs__tab--selected]:border-gray-400">
            View Position
          </Tab>
          <Tab className="py-2 px-4 font-medium cursor-pointer border-b-3 border-transparent focus:outline-none [&.react-tabs__tab--selected]:border-gray-400">
            View Position Holder (POR)
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

// export default {ViewTenure,CreateTenure};
