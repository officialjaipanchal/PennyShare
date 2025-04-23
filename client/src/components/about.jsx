import { Typography, Link } from "@mui/material";
import { Box, Container } from "@mui/system";
import Copyright from "./Copyright";

const About = () => {
  return (
    <Container
      maxWidth="md"
      sx={{
        bgcolor: "background.paper",
        boxShadow: 3,
        borderRadius: 2,
        my: 10,
        py: 10,
        px: 4,
      }}
    >
      <Box textAlign="center">
        <Typography variant="h3" fontWeight="bold" gutterBottom>
          PennyShare
        </Typography>
        <Typography variant="subtitle1" color="textSecondary">
          AI-Powered Group Expense Management & Financial Insights
        </Typography>
      </Box>

      <Typography variant="h5" mt={5} fontWeight="bold">
        📌 Project Overview
      </Typography>
      <Typography variant="body1" mt={2}>
        PennyShare is an intelligent financial assistant and expense tracker
        built for modern group living. It helps you split bills, track personal
        and group expenses, and gain insightful suggestions about your financial
        habits. With AI-powered summaries and voice-friendly input, PennyShare
        transforms how you manage shared costs.
      </Typography>

      <Typography variant="h5" mt={5} fontWeight="bold">
        🚀 Key Features
      </Typography>
      <ul>
        <li>
          🤖 AI chatbot to query your expenses, summaries, and savings advice.
        </li>
        <li>👥 Create and manage groups to track shared spending.</li>
        <li>📊 View interactive insights, trends, and category breakdowns.</li>

        <li>🔐 Secure login and role-based access control.</li>
      </ul>

      <Typography variant="h5" mt={5} fontWeight="bold">
        🛠️ Technologies Used
      </Typography>
      <ul>
        <li>
          <strong>Frontend:</strong> React.js, Redux Toolkit, Material UI
        </li>
        <li>
          <strong>Backend:</strong> Node.js, Express.js, MongoDB, Mongoose
        </li>
        <li>
          <strong>AI/ML:</strong> OpenAI GPT, Mustache.js templating
        </li>
        <li>
          <strong>Utilities:</strong> Axios, Chart.js, Moment.js
        </li>
        <li>
          <strong>Security:</strong> JWT, bcrypt.js
        </li>
      </ul>

      {/* <Typography variant="h5" mt={5} fontWeight="bold">
        🙌 Get Involved
      </Typography>
      <Typography variant="body1" mt={2}>
        PennyShare is open source and community-driven. We welcome your ideas,
        improvements, and contributions. Help us improve AI prompts, add
        visualization features, or expand budgeting capabilities.
      </Typography> */}
      {/* <Box mt={2}>
        <Link href="https://github.com/tuzup/PennyShare/issues" target="_blank">
          Report a Bug
        </Link>
        &nbsp; | &nbsp;
        <Link href="https://github.com/tuzup/PennyShare/issues" target="_blank">
          Request a Feature
        </Link>
      </Box> */}

      <Typography variant="body2" mt={6} textAlign="center">
        &copy; {new Date().getFullYear()} Jaykumar Suthar. All rights reserved.
      </Typography>
      <Copyright />
    </Container>
  );
};

export default About;
