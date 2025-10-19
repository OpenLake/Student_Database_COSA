import { useState } from "react";
import Layout from "../Components/common/Layout";
import Feedback from "../Components/Feedback/Feedback";
import FeedbackPreview from "../Components/Feedback/FeedbackPreview";
import FeedbackStats from "../Components/Feedback/FeedbackStats";

const FeedbackPage = () => {
  const [add, setAdd] = useState(true);

  const components = {
    Feedback: Feedback,
    FeedbackPreview: FeedbackPreview,
    FeedbackStats: FeedbackStats,
  };
  const gridConfig = [
    {
      id: "main",
      component: "Feedback",
      position: {
        colStart: 0,
        colEnd: 14,
        rowStart: 0,
        rowEnd: 16,
      },
      props: { add: add, setAdd: setAdd },
    },
    {
      id: "main",
      component: "FeedbackPreview",
      position: {
        colStart: 14,
        colEnd: 20,
        rowStart: 0,
        rowEnd: 8,
      },
    },
    {
      id: "main",
      component: "FeedbackStats",
      position: {
        colStart: 14,
        colEnd: 20,
        rowStart: 8,
        rowEnd: 16,
      },
    },
  ];
  return (
    <Layout
      headerText="Feedback"
      gridConfig={gridConfig}
      components={components}
    />
  );
};

export default FeedbackPage;
