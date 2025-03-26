import { useState, useEffect } from "react";

import { EditProfile } from "../Components/profile";
import { Container, Paper, Typography, Box } from "@mui/material";

const ProfilePage = () => {
  const [loading, setLoading] = useState(false);

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper
        elevation={3}
        sx={{
          p: 4,
          borderRadius: 2,
          boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
        }}
      >
        <Box mb={3}>
          <Typography variant="h4" fontWeight="bold" color="primary">
            Your Profile
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Manage your personal information
          </Typography>
        </Box>

        <EditProfile loading={loading} setLoading={setLoading} />
      </Paper>
    </Container>
  );
};

export default ProfilePage;
