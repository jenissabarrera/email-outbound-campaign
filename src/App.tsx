import { BrowserRouter as Router, Link, Routes, Route } from "react-router-dom";
import React, { useEffect, useState } from "react";
import logo from "./assets/appfoundry-logo.png";

import EmailList from "./components/email-list/EmailList";
import SendEmail from "./components/send-email/SendEmail";
import Dashboard from "./components/dashboard/Dashboard";
import { authenticate, getCampaign } from "./utils/genesysCloudUtils";

const App: React.FC = () => {
  const [campaigns, setCampaigns] = useState([]);

  useEffect(() => {
    getPlatformClientData();
  }, []);

  async function getPlatformClientData() {
    try {
      await authenticate();
      const campaignData = await getCampaign();
      const campaignList = campaignData.entities.map((entity) => ({
        id: entity.id,
        name: entity.name,
      }));
      setCampaigns(campaignList);
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <Router>
      <nav className="navbar navbar-dark">
        <div className="container d-flex justify-content-center align-items-center">
          <Link to="/" className="navbar-brand d-flex align-items-center">
            {" "}
            {}
            <img
              src={logo}
              alt={logo}
              width="60"
              height="60"
              className="me-2"
            />
            <span className="fw-bold">AppFoundry Email Outbound Campaign</span>
          </Link>
        </div>
      </nav>
      <Routes>
        <Route path="/" element={<EmailList />} />
        <Route
          path="/send-email"
          element={<SendEmail campaigns={campaigns} />}
        />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </Router>
  );
};

export default App;
