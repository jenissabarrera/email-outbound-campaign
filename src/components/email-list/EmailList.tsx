import React, { useState } from "react";
import { Modal, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import "./EmailList.css"; //

const EmailList: React.FC = () => {
  const [showModal, setShowModal] = useState(false);

  const handleModalClose = () => {
    setShowModal(false);
  };

  return (
    <div className="container mt-4 text-center">
      <h1 className="campaign-title">
        Welcome to the AppFoundry CID Outbound Email Campaign!
      </h1>
      <button className="btn btn-primary" onClick={() => setShowModal(true)}>
        Let's get started!
      </button>

      {showModal && (
        <Modal show={showModal} onHide={handleModalClose} centered>
          <Modal.Header closeButton>
            <Modal.Title className="text-center"></Modal.Title>
          </Modal.Header>
          <Modal.Body className="text-center">
            <p>What would you like to do?</p>
          </Modal.Body>
          <Modal.Footer className="justify-content-center">
            <Link
              to="/send-email"
              className="btn btn-primary me-3"
              onClick={handleModalClose}
            >
              Send Email
            </Link>
            <Link
              to="/dashboard"
              className="btn btn-secondary"
              onClick={handleModalClose}
            >
              View Dashboard
            </Link>
          </Modal.Footer>
        </Modal>
      )}
    </div>
  );
};

export default EmailList;
