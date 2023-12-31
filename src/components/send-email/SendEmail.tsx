import React, { useState, useEffect } from "react";
import "./SendEmail.css";
import { Spinner, Modal, Button } from "react-bootstrap";
import DefaultEmail from "./EmailDefaults";
import { SelectCampaign } from "../select-campaign/SelectCampaign.tsx";
import { useCampaigns } from "../use-campaign/UseCampaign.tsx";
import {
  getCampaign,
  postCampaignDetails,
  putResponsemanagementLibrary,
  getExistingResponse,
  getResponseManagementLibrary,
} from "../../utils/GenesysCloudUtils.tsx";

const SendEmail: React.FC = () => {
  // State variables to manage form data and loading status
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [isMessageDefault, setIsMessageDefault] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [modalTitle, setModalTitle] = useState("");
  const { campaigns, isLoading, campaignId, selectCampaign } = useCampaigns();

  const handleShowModal = (title: string, message: string) => {
    setModalTitle(title);
    setModalMessage(message);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  // Set default message when isMessageDefault changes
  useEffect(() => {
    if (isMessageDefault) {
      setSubject(DefaultEmail.subject);
      setMessage(DefaultEmail.message);
    } else {
      setSubject("");
      setMessage("");
    }
  }, [isMessageDefault]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    let contentId = null;
    let lastItem = null;
    let entities = null;
    let responseLibraryVersion: string | null = null;

    // Validate if a campaign is selected before submitting the form
    if (!campaignId) {
      throw new Error("Please select a campaign before sending the email.");
    }

    // Find the selected campaign from the fetched campaigns data
    const selectedCampaign = campaigns.find(
      (campaign) => campaign.id === campaignId
    );

    if (!selectedCampaign) {
      throw new Error("Selected campaign not found in the fetched data.");
    }

    // Check if the required properties are available in the selected campaign
    const requiredProps = [
      "id",
      "division",
      "contactList",
      "emailConfig",
      "name",
    ];
    for (const prop of requiredProps) {
      if (!selectedCampaign[prop]) {
        throw new Error(
          `Selected campaign data is missing the "${prop}" property.`
        );
      }
    }

    console.log("isMessageDefault:", isMessageDefault);

    if (!isMessageDefault) {
      // Fetch the response library version
      try {
        const responseManagementLibraryData =
          await getResponseManagementLibrary();
        responseLibraryVersion = responseManagementLibraryData.version;
        console.log("Response Library Version:", responseLibraryVersion);

        // Update the response management library
        try {
          const putResponsemanagementLibraryData =
            await putResponsemanagementLibrary(
              subject,
              message,
              responseLibraryVersion
            );
          console.log(
            "putResponsemanagementLibraryData:",
            putResponsemanagementLibraryData
          );
        } catch (error) {
          console.error("Error updating response management library:", error);
        }

        // Fetch existing responses
        try {
          const responsemanagementResponsesData = await getExistingResponse();
          entities = responsemanagementResponsesData.entities;
          lastItem = entities && entities[entities.length - 1];
          console.log("Last response management data item:", lastItem);
          contentId = lastItem.id;
        } catch (error) {
          console.error("Error fetching existing responses:", error);
        }
      } catch (error) {
        console.error("Error fetching response library version:", error);
      }
    } else if (isMessageDefault) {
      contentId = selectedCampaign.emailConfig.contentTemplate.id;
      console.log(typeof contentId);
      console.log(" Default Content ID", contentId);
    }

    // Prepare the body for postCampaignDetails with the selected campaign data
    const body = {
      id: selectedCampaign.id,
      name: selectedCampaign.name,
      version: selectedCampaign.version,
      division: selectedCampaign.division,
      campaignStatus: "on",
      contactList: selectedCampaign.contactList,
      alwaysRunning: false,
      messagesPerMinute: 10,
      emailConfig: {
        emailColumns: selectedCampaign.emailConfig.emailColumns,
        contentTemplate: {
          id: contentId,
        },
        fromAddress: selectedCampaign.emailConfig.fromAddress,
      },
    };
    try {
      // Call postCampaignDetails with the filled body and campaign ID
      console.log("Sending email with body:", body);
      await postCampaignDetails(campaignId, body);
      // const patchCampaignDetails = await patchCampaignDetails(campaignId, body);

      handleShowModal("Success", "Email sent successfully!");
    } catch (error) {
      console.error("Error while handling form submission:", error.message);
      handleShowModal("Error", "An error occurred while sending the email.");
    }
  };

  return (
    <div className="container mt-4">
      <h1 className="send-email-title">Send Email</h1>
      <div className="send-email-form">
        {isLoading ? (
          <div className="d-flex justify-content-center align-items-center flex-column">
            <Spinner
              animation="border"
              role="status"
              size="lg"
              variant="primary"
            />
            <span className="sr-only">Loading...</span>
          </div>
        ) : (
          <form onSubmit={(e) => handleSubmit(e)}>
            <div className="form-group">
              <label htmlFor="campaign">Campaign:</label>
              <select
                className="form-control custom-input"
                id="campaign"
                value={campaignId}
                onChange={(e) => selectCampaign(e.target.value)}
                required
              >
                <option value="">Select a campaign</option>
                {campaigns.map((campaign: any) => (
                  <option key={campaign.id} value={campaign.id}>
                    {campaign.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="messageType">Default Message:</label>
              <input
                type="checkbox"
                id="messageType"
                checked={isMessageDefault}
                onChange={(e) => setIsMessageDefault(e.target.checked)}
              />
            </div>
            <div className="form-group">
              <label htmlFor="subject">Subject:</label>
              <input
                type="text"
                className="form-control"
                id="subject"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                required
                readOnly={isMessageDefault}
              />
            </div>
            <div className="form-group">
              <label htmlFor="message">Message:</label>
              <textarea
                className="form-control custom-textarea"
                id="message"
                rows={5}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
                readOnly={isMessageDefault}
              ></textarea>
            </div>
            <button type="submit" className="btn btn-primary">
              Send Email
            </button>
            <a href="/" className="btn btn-secondary ml-2">
              Back
            </a>
          </form>
        )}
      </div>
      <Modal show={showModal} onHide={handleCloseModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>{modalTitle}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="text-center">
            <p>{modalMessage}</p>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default SendEmail;
