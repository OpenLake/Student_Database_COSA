import Layout from "../Components/common/Layout";

import Profile from "../Components/Profile/Profile";

const ProfilePage = () => {
  const components = {
    Profile: Profile,
  };
  const gridConfig = [
    {
      id: "main",
      component: "Profile",
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
      headerText="Profile"
      gridConfig={gridConfig}
      components={components}
    />
  );
};

export default ProfilePage;
