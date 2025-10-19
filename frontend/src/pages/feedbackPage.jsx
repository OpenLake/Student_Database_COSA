import Layout from "../Components/common/Layout";
import Feedback from "../Components/Feedback/Feedback";

const FeedbackPage = () => {
  const components = {
    Feedback: Feedback,
  };
  const gridConfig = [
    {
      id: "main",
      component: "Feedback",
      position: {
        colStart: 0,
        colEnd: 15,
        rowStart: 0,
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
