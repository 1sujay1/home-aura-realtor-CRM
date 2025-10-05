import React from "react";
import { Box, H2, Text } from "@adminjs/design-system";

const ExpenseDashboardComponent = (props) => {
  return (
    <Box>
      {/* ✅ Your custom message */}
      <Box
        variant="white"
        p="xl"
        mb="xl"
        style={{
          textAlign: "center",
          background: "#f5f5f5",
          borderRadius: 12,
        }}
      >
        <H2>Hello World 👋</H2>
        <Text>This is rendered above the default AdminJS list.</Text>
      </Box>

      {/* ✅ Render the default list below */}
      <props.DefaultAction {...props} />
    </Box>
  );
};

export default ExpenseDashboardComponent;
