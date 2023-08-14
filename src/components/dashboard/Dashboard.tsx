import React, { useState } from "react";
import "./Dashboard.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useCampaigns } from "../use-campaign/UseCampaign.tsx";
// import Modal from "react-modal";
import SelectCampaign from "../select-campaign/SelectCampaign.tsx";
import {
  getStatus,
  Conversation,
  getCampaign,
  postCampaignDetails,
} from "../../utils/GenesysCloudUtils.tsx";

// Modal.setAppElement("#root");

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
  // const [modalIsOpen, setModalIsOpen] = useState(false);
  // const [modalMessage, setModalMessage] = useState("");

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

    if (start && end) {
      const formattedStartDate = start.toISOString();
      const formattedEndDate = end.toISOString();
      const dateRangeString = `${formattedStartDate}/${formattedEndDate}`;

      setStartDate(start);
      setEndDate(end);

      if (!campaignId) {
        alert("Please select a campaign before choosing a date range");
        return;
      }

      getStatus(dateRangeString, campaignId)
        .then((statusData: any) => {
          console.log("status data", statusData);
          // Process the data to extract the required fields for the table
          const processedData: Email[] = [];
          statusData.conversations.forEach((conversations: any) => {
            conversations.participants.forEach((participant) => {
              participant.sessions.forEach((session) => {
                if (!session.extendedDeliveryStatus) return;
                const recipient = session.addressTo || "N/A";
                const subject =
                  session.segments.length > 0
                    ? session.segments[0].subject
                    : "N/A";
                const status = session.extendedDeliveryStatus || "N/A";
                const formatDate = (dateString: string) => {
                  const date = new Date(dateString);
                  return (
                    date.toLocaleDateString() + " " + date.toLocaleTimeString()
                  );
                };
                console.log("from date", session.segments[0].segmentStart);
                const deliveryDate = formatDate(
                  session.segments[0].segmentStart || "N/A"
                );

                processedData.push({
                  id: conversations.conversationId,
                  recipient,
                  subject,
                  status,
                  deliveryDate,
                });
              });
            });
          });
          setEmails(processedData);
        })
        .catch((error: Error) => {
          console.error("Error fetching status data:", error);
        });

      console.log("dates and campaign id", dateRangeString, campaignId);

      // The following lines should be inside the then-block if you want to use 'processedData'
      // console.log("processed data", processedData);
      // if (!processedData.length) {
      //   alert("No data returned for the selected date range and campaign.");
      // }
    }
  };

  return (
    <div className="container mt-4">
      {/* <Modal isOpen={modalIsOpen} onRequestClose={() => setModalIsOpen(false)}>
        <p>{modalMessage}</p>
        <button onClick={() => setModalIsOpen(false)}>Close</button>
      </Modal> */}

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
