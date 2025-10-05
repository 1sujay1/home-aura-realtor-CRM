import React, { useEffect, useState, useMemo } from "react";
import { Box, H2, Text, Button } from "@adminjs/design-system";
import { ApiClient } from "adminjs";

const Dashboard = () => {
  const [data, setData] = useState([]);
  const [role, setRole] = useState("staff");
  const [name, setName] = useState("");
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(
    String(new Date().getMonth() + 1).padStart(2, "0")
  );

  const api = new ApiClient();

  useEffect(() => {
    api
      .getDashboard()
      .then((res) => {
        console.log("Dashboard data:", res);
        setData(res.data?.data || []);
        setRole(res.data?.role || "");
        // setName(res.data?.email?.split("@")[0] || "Admin");
      })
      .catch((err) => console.error("Dashboard fetch error:", err));
  }, []);

  // Filter by selected month & year
  const filteredData = useMemo(() => {
    return data.filter((item) => {
      const d = new Date(item.date);
      return (
        d.getFullYear() === Number(selectedYear) &&
        String(d.getMonth() + 1).padStart(2, "0") === selectedMonth
      );
    });
  }, [data, selectedYear, selectedMonth]);

  const years = useMemo(() => {
    const currentYear = new Date().getFullYear();
    // Create a range of 3 years: current, next, next+1
    return [currentYear, currentYear + 1, currentYear + 2];
  }, []);

  useEffect(() => {
    if (years.length && !years.includes(selectedYear)) {
      setSelectedYear(new Date().getFullYear());
    }
  }, [years, selectedYear]);

  // Calculate expense totals by category
  const totals = useMemo(() => {
    const categories = ["Rent", "Travel", "Food", "Salary", "Ads", "Other"];
    const result = {};
    let monthlyTotal = 0;

    categories.forEach((cat) => {
      const sum = filteredData
        .filter((d) => d.expenseType === cat)
        .reduce((a, b) => a + Number(b.amount || 0), 0);
      result[cat] = sum;
      monthlyTotal += sum;
    });

    result.Total = monthlyTotal;
    return result;
  }, [filteredData]);

  // Grand total (all data)
  const grandTotal = useMemo(() => {
    return data.reduce((sum, d) => sum + Number(d.amount || 0), 0);
  }, [data]);

  const months = [
    { value: "01", name: "January" },
    { value: "02", name: "February" },
    { value: "03", name: "March" },
    { value: "04", name: "April" },
    { value: "05", name: "May" },
    { value: "06", name: "June" },
    { value: "07", name: "July" },
    { value: "08", name: "August" },
    { value: "09", name: "September" },
    { value: "10", name: "October" },
    { value: "11", name: "November" },
    { value: "12", name: "December" },
  ];

  // 🎨 Colors for each expense type
  const colors = {
    Rent: "#7dd3fc", // light sky blue
    Travel: "#6ee7b7", // pastel green
    Food: "#fca5a5", // soft coral
    Salary: "#fbbf24", // amber / gold
    Ads: "#fcd34d", // yellow
    Other: "#d8b4fe", // pastel purple
    Total: "#6366f1", // bright indigo
    GrandTotal: "#10ac84", // green
  };

  // 🎨 Common card style
  const cardStyle = {
    borderRadius: "12px",
    padding: "20px",
    color: "white",
    textAlign: "center",
    boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
    transition: "transform 0.2s ease, box-shadow 0.2s ease",
  };

  // 🧭 If not admin, show only greeting UI
  if (role !== "admin") {
    return (
      <Box
        variant="grey"
        p="xxl"
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        style={{ minHeight: "100vh", textAlign: "center" }}
      >
        <H2>Welcome to Home Aura Realtor 👋</H2>
        <Text mt="lg" mb="lg" lineHeight="lg" style={{ maxWidth: "600px" }}>
          This is your CRM dashboard. You can manage leads, clients, and
          properties using the navigation sidebar. Admin-only sections are
          restricted.
        </Text>
        <Box
          display="flex"
          gap="20px"
          mt="lg"
          style={{ flexWrap: "wrap", gap: "10px", padding: "10px" }}
        >
          <a href="/admin/resources/Leads">
            <Button variant="primary">Leads</Button>
          </a>
          <a href="/admin/resources/Client-Leads">
            <Button variant="primary">Client Leads</Button>
          </a>
          <a href="/admin/resources/Property-Owners">
            <Button variant="primary">Property Owners</Button>
          </a>
          <a href="/admin/resources/Tenant-Leads">
            <Button variant="primary">Tenant Leads</Button>
          </a>
        </Box>
      </Box>
    );
  }

  // 🧮 Admin Dashboard
  return (
    <Box
      variant="grey"
      p="xl"
      style={{ minHeight: "100vh", animation: "fadeIn 0.6s ease-in-out" }}
    >
      <H2 style={{ textAlign: "center" }}>🏡 Home Aura Realtor</H2>
      <Text mt="lg" mb="xl" lineHeight="lg" textAlign="center">
        Welcome to your CRM dashboard. Track leads, manage expenses, and monitor
        business performance — all in one place.
      </Text>

      {/* Navigation Buttons */}
      <Box
        display="flex"
        gap="md"
        mb="xl"
        style={{
          flexWrap: "wrap",
          alignItems: "center",
          padding: "10px",
          gap: "10px",
          justifyContent: "center",
        }}
      >
        <Button as="a" href="/admin/resources/Leads" variant="primary">
          Leads
        </Button>
        <Button as="a" href="/admin/resources/Client-Leads" variant="primary">
          Client Leads
        </Button>
        <Button
          as="a"
          href="/admin/resources/Property-Owners"
          variant="primary"
        >
          Property Owner Leads
        </Button>
        <Button as="a" href="/admin/resources/Tenant-Leads" variant="primary">
          Tenant Leads
        </Button>
        <Button as="a" href="/admin/resources/Expense-Entries" variant="danger">
          Expense List
        </Button>
      </Box>

      <H2 mb="xl" style={{ color: "#2e86de" }}>
        Expense Dashboard
      </H2>

      {/* Filters */}
      <Box
        display="flex"
        flexDirection="row"
        mb="xl"
        gap="20px"
        flexWrap="wrap"
        style={{ gap: "10px", padding: "10px" }}
      >
        <Box>
          <Text fontWeight="bold">Select Year:</Text>
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(Number(e.target.value))}
            style={{
              padding: "8px",
              borderRadius: "6px",
              border: "1px solid #ccc",
              minWidth: "120px",
            }}
          >
            {years.map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
        </Box>

        <Box>
          <Text fontWeight="bold">Select Month:</Text>
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            style={{
              padding: "8px",
              borderRadius: "6px",
              border: "1px solid #ccc",
              minWidth: "150px",
            }}
          >
            {months.map((m) => (
              <option key={m.value} value={m.value}>
                {m.name}
              </option>
            ))}
          </select>
        </Box>
      </Box>

      {/* Cards */}
      <Box
        display="grid"
        gridTemplateColumns="repeat(auto-fill, minmax(200px, 1fr))"
        gap="20px"
        style={{ gap: "10px", padding: "10px" }}
      >
        {Object.entries(totals).map(([key, value]) => (
          <Box
            key={key}
            style={{
              ...cardStyle,
              background: colors[key] || "#888", // fallback grey
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.transform = "translateY(-5px)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.transform = "translateY(0px)")
            }
          >
            <Text fontWeight="bold" style={{ fontSize: "16px" }}>
              {key === "Total"
                ? `Total (${
                    months.find((m) => m.value === selectedMonth)?.name
                  })`
                : key}
            </Text>
            <Text fontSize="xl" fontWeight="bold" mt="md">
              ₹{value.toLocaleString()}
            </Text>
          </Box>
        ))}

        {/* Grand Total Card */}
        <Box
          style={{
            ...cardStyle,
            background: `linear-gradient(135deg, #10ac84 0%, #222 100%)`,
          }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.transform = "translateY(-5px)")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.transform = "translateY(0px)")
          }
        >
          <Text fontWeight="bold" style={{ fontSize: "16px" }}>
            Grand Total (All Time)
          </Text>
          <Text fontSize="xl" fontWeight="bold" mt="md">
            ₹{grandTotal.toLocaleString()}
          </Text>
        </Box>
      </Box>
    </Box>
  );
};

export default Dashboard;
