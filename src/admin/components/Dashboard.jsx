import React from "react";
import { Box, H2, Text, Button } from "@adminjs/design-system";
import { Link } from "react-router-dom"; // Only if you're using React Router

const Dashboard = () => {
  return (
    <Box variant="grey" flex flexDirection="column" alignItems="center" p="xxl">
      <H2>Welcome to Home Aura Realtor CRM</H2>
      <Text mt="lg" mb="lg" lineHeight="lg">
        This is your admin dashboard. Use the links below to navigate.
      </Text>

      <Box mt="xl">
        {/* Leads link as a button */}
        <Link to="/admin/resources/Leads">
          <Button variant="primary">Go to Leads</Button>
        </Link>
      </Box>
    </Box>
  );
};

export default Dashboard;
