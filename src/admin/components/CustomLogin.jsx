import React from "react";
import { Box, Button, H2 } from "@adminjs/design-system";

const CustomLogin = () => {
  return React.createElement(
    Box,
    {
      height: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      flexDirection: "column",
    },
    [
      React.createElement(
        H2,
        { key: "heading", mb: "xl" },
        "👋 Hello from Custom Login!"
      ),
      React.createElement(
        Button,
        {
          key: "button",
          variant: "primary",
          size: "lg",
          onClick: () => alert("Test Button Clicked"),
        },
        "Click Me"
      ),
    ]
  );
};

export default CustomLogin;
