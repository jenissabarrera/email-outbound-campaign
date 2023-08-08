import React, { useState } from "react";
import "./Dashboard.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useCampaigns } from "../use-campaign/UseCampaign.tsx";
import Modal from "react-modal";
import SelectCampaign from "../select-campaign/SelectCampaign.tsx";
import {
  getStatus,
  Conversation,
  getCampaign,
  postCampaignDetails,
} from "../../utils/GenesysCloudUtils.tsx";

Modal.setAppElement("#root");

interface EmailFormat {
  id: string;
  subject: string;
  recipient: string;
  status: string;
  deliveryDate: string;
}

const Dashboard: React.FC = () => {
  const { campaigns, isLoading, campaignId, selectCampaign } = useCampaigns();
  const [emails, setEmails] = useState<EmailFormat[]>([]);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

  const bounceCount = emails.filter(
    (email) => email.status === "BOUNCE"
  ).length;
  const deliveredCount = emails.filter(
    (email) => email.status === "DELIVERED"
  ).length;
  const totalCount = emails.length;

  const handleDateChange = async (dates: [Date | null, Date | null]) => {
    const [start, end] = dates;
    setStartDate(start);
    setEndDate(end);

    if (!campaignId) {
      setModalMessage("Please select a campaign before choosing a date range");
      setModalIsOpen(true);
      return;
    }

    if (!processedData.length) {
      setModalMessage(
        "No data returned for the selected date range and campaign."
      );
      setModalIsOpen(true);
    }
  };

  return (
    <div className="container mt-4">
      <Modal isOpen={modalIsOpen} onRequestClose={() => setModalIsOpen(false)}>
        <p>{modalMessage}</p>
        <button onClick={() => setModalIsOpen(false)}>Close</button>
      </Modal>

      <div className="dashboard-container">
        <div className="header-container">
          <h1 className="dashboard-header">Dashboard</h1>
          <div className="date-picker-container">
            <SelectCampaign
              campaigns={campaigns}
              isLoading={isLoading}
              campaignId={campaignId}
              selectCampaign={selectCampaign}
              required
              className="select-campaign"
            />
            <DatePicker
              selected={startDate}
              onChange={(date) => handleDateChange([date, endDate])}
              startDate={startDate}
              endDate={endDate}
              selectsStart
              dateFormat="yyyy-MM-dd"
              placeholderText="From"
              maxDate={endDate}
            />
            <DatePicker
              selected={endDate}
              onChange={(date) => handleDateChange([startDate, date])}
              startDate={startDate}
              endDate={endDate}
              selectsEnd
              dateFormat="yyyy-MM-dd"
              placeholderText="To"
              minDate={startDate}
            />
          </div>
        </div>
      </div>

      <table className="table table-striped">
        <thead>
          <tr>
            <th>Subject</th>
            <th>Recipient</th>
            <th>Status</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {emails.map((email) => (
            <tr key={email.id}>
              <td>{email.subject}</td>
              <td>{email.recipient}</td>
              <td>{email.status}</td>
              <td>{email.deliveryDate}</td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr>
            <th>Total: {totalCount}</th>
            <th>Bounce: {bounceCount}</th>
            <th>Delivered: {deliveredCount}</th>
            <th colSpan={3}></th>
          </tr>
        </tfoot>
      </table>

      <div className="back-button-container">
        <a href="/" className="btn btn-secondary">
          Back
        </a>
      </div>
    </div>
  );
};

export default Dashboard;
