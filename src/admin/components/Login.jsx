import React, { useState } from "react";
import {
  Box,
  Button,
  H2,
  Text,
  Input,
  Illustration,
  Label,
} from "@adminjs/design-system";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setErrorMessage("");

    try {
      const res = await fetch("/admin/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({ email, password }).toString(),
        credentials: "same-origin",
      });

      if (res.redirected) {
        window.location.href = res.url;
      } else {
        const text = await res.text();
        if (text.includes("invalid") || text.includes("Invalid")) {
          setErrorMessage("Invalid email or password.");
        } else {
          setErrorMessage("Login failed. Please try again.");
        }
      }
    } catch (err) {
      console.error(err);
      setErrorMessage("An error occurred. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Box
      variant="grey"
      flex
      height="100vh"
      alignItems="center"
      justifyContent="center"
      p="lg"
    >
      <Box
        display="flex"
        flexDirection={["column", "row"]}
        width="100%"
        maxWidth="900px"
        boxShadow="card"
        borderRadius="lg"
        overflow="hidden"
        bg="white"
      >
        {/* Left Panel */}
        <Box
          width={["0", "50%"]}
          display={["none", "flex"]} // 👈 hides on small screens
          bg="primary100"
          color="white"
          p="xxl"
          flexDirection="column"
          justifyContent="center"
          alignItems="flex-start"
          textAlign={["center", "left"]}
        >
          <H2>Welcome to Home Aura Realtor</H2>
          <Text mt="lg" lineHeight="lg">
            Discover a smarter way to manage your real estate business. Home
            Aura CRM brings together property listings, leads, and builder
            connections — all in one unified platform for channel partners.
          </Text>
          <Illustration variant="Rocket" width={240} mt="xl" mx={["auto", 0]} />
        </Box>

        {/* Right Panel */}
        <Box
          width={["100%", "50%"]}
          p="xxl"
          display="flex"
          flexDirection="column"
          justifyContent="center"
        >
          <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            mb="xl"
            mt="lg"
          >
            <img
              src="/home_aura_realtor_logo.png"
              alt="Home Aura Realtor Logo"
              style={{
                width: "120px", // ↓ adjust size more proportionally
                height: "auto",
                marginBottom: "0.75rem",
              }}
            />
            <H2
              style={{
                fontSize: "24px", // ↓ reduce font size slightly if too large
                margin: 0,
                padding: 0,
                lineHeight: "1.2", // ↓ tighten line spacing
              }}
            >
              Home Aura Realtor
            </H2>
          </Box>

          <form onSubmit={handleSubmit}>
            <Label required mb="sm">
              Email
            </Label>
            <Input
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="Email"
              width="100%"
            />

            <Label mt="xl" mb="sm" required>
              Password
            </Label>
            <Input
              name="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Password"
              width="100%"
            />

            {errorMessage && (
              <Text mt="lg" color="error">
                {errorMessage}
              </Text>
            )}

            <Button
              mt="xl"
              variant="primary"
              type="submit"
              disabled={submitting}
              style={{ display: "block", margin: "2rem auto 0" }}
            >
              {submitting ? "Logging in..." : "Login"}
            </Button>
          </form>
        </Box>
      </Box>
    </Box>
  );
};

export default Login;
