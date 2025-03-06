import React, { useState, useEffect } from "react";
import {
  Card,
  CardBody,
  CardHeader,
  Button,
  Row,
  Col,
  Modal,
  ModalHeader,
  ModalBody,
  Form,
  FormGroup,
  Label,
  Input
} from "reactstrap";
import "./Add.css";

const UserProfileButtons = ({ isLoggedIn, userDetails, onUpdateSuccess }) => {
    useEffect(() => {
        if (userDetails) {
          console.log("User details received:", userDetails);
        }
      }, [userDetails]);
      
  // State for modals
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [updateModalOpen, setUpdateModalOpen] = useState(false);
  
  // State for edited user details
  const [editedDetails, setEditedDetails] = useState({
    name: "",
    Program: "",
    discipline: "",
    add_year: ""
  });
  
  // State for new POR and achievement
  const [newPOR, setNewPOR] = useState({
    club: "",
    designation: "",
    session: "",
    type: ""
  });
  
  const [newAchievement, setNewAchievement] = useState({
    under: "",
    designation: "",
    eventName: "",
    conductedBy: ""
  });

  // Update local state when userDetails changes
  useEffect(() => {
    if (userDetails) {
      console.log("User details received:", userDetails);
      setEditedDetails({
        name: userDetails.name || "",
        Program: userDetails.Program || "",
        discipline: userDetails.discipline || "",
        add_year: userDetails.add_year || ""
      });
    }
  }, [userDetails]);
  
  // Toggle functions for modals
  const toggleEditModal = () => setEditModalOpen(!editModalOpen);
  const toggleUpdateModal = () => setUpdateModalOpen(!updateModalOpen);
  
  // Handle input changes for edit form
  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setEditedDetails(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Handle input changes for new POR
  const handlePORChange = (e) => {
    const { name, value } = e.target;
    setNewPOR(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Handle input changes for new achievement
  const handleAchievementChange = (e) => {
    const { name, value } = e.target;
    setNewAchievement(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Get the user ID from userDetails
  const getUserId = () => {
    if (!userDetails) {
      console.error("User details not available");
      return null;
    }
    
    // Log the userDetails to debug
    console.log("Getting user ID from:", userDetails);
    
    // Directly use ID_No as that's the field in your User schema
    return userDetails.ID_No;
  };
  
  // Submit handler for edit form
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    
    const userId = getUserId();
    if (!userId) {
      alert("User ID not found. Please try logging in again.");
      return;
    }
    
    try {
      const backendUrl = process.env.REACT_APP_BACKEND_URL || "http://localhost:8000";
      console.log("Sending update with user ID:", userId);
      console.log("Backend URL being used:", backendUrl);
      console.log("Update details:", editedDetails);
      
      const url = `${backendUrl}/auth/updateProfile`;
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: userId,
          updatedDetails: editedDetails
        }),
        credentials: "include", // Important for cookies/session
      });
      
      const data = await response.json();
      console.log("Response:", data);
      
      if (response.ok) {
        toggleEditModal();
        if (onUpdateSuccess) onUpdateSuccess();
        alert("Profile updated successfully!");
      } else {
        alert(`Failed to update profile: ${data.message || "Unknown error"}`);
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Failed to update profile. Please try again.");
    }
  };
  
  // Submit handler for POR form
  const handlePORSubmit = async (e) => {
    e.preventDefault();
    
    const userId = getUserId();
    if (!userId) {
      alert("User ID not found. Please try logging in again.");
      return;
    }
    
    const updateData = {
      userId: userId,
      updateType: 'por',
      data: newPOR
    };
    
    try {
      const backendUrl = process.env.REACT_APP_BACKEND_URL || "http://localhost:8000";
      console.log("Sending POR update with data:", updateData);
      
      const url = `${backendUrl}/auth/addRecord`;
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updateData),
        credentials: "include",
      });
      
      const data = await response.json();
      console.log("Response:", data);
      
      if (response.ok) {
        setNewPOR({
          club: "",
          designation: "",
          session: "",
          type: ""
        });
        
        if (onUpdateSuccess) onUpdateSuccess();
        alert("New POR added successfully!");
      } else {
        alert(`Failed to add POR: ${data.message || "Unknown error"}`);
      }
    } catch (error) {
      console.error("Error adding POR:", error);
      alert("Failed to add POR. Please try again.");
    }
  };
  
  // Submit handler for Achievement form
  const handleAchievementSubmit = async (e) => {
    e.preventDefault();
    
    const userId = getUserId();
    if (!userId) {
      alert("User ID not found. Please try logging in again.");
      return;
    }
    
    const updateData = {
      userId: userId,
      updateType: 'achievement',
      data: newAchievement
    };
    
    try {
      const backendUrl = process.env.REACT_APP_BACKEND_URL || "http://localhost:8000";
      console.log("Sending achievement update with data:", updateData);
      
      const url = `${backendUrl}/auth/addRecord`;
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updateData),
        credentials: "include",
      });
      
      const data = await response.json();
      console.log("Response:", data);
      
      if (response.ok) {
        setNewAchievement({
          under: "",
          designation: "",
          eventName: "",
          conductedBy: ""
        });
        
        if (onUpdateSuccess) onUpdateSuccess();
        alert("New achievement added successfully!");
      } else {
        alert(`Failed to add achievement: ${data.message || "Unknown error"}`);
      }
    } catch (error) {
      console.error("Error adding achievement:", error);
      alert("Failed to add achievement. Please try again.");
    }
  };
  
  // If user is not logged in, don't render the buttons
  if (!isLoggedIn || !userDetails) {
    return null;
  }
  
  return (
    <div className="profile-buttons mt-4">
      <Row>
        <Col md={6}>
          <Button 
            color="primary" 
            className="Add_user" 
            style={{ width: "100%" }}
            onClick={toggleEditModal}
          >
            Edit Profile
          </Button>
        </Col>
        <Col md={6}>
          <Button 
            color="success" 
            className="Add_user" 
            style={{ width: "100%" }}
            onClick={toggleUpdateModal}
          >
            Update Records
          </Button>
        </Col>
      </Row>
      
      {/* Edit Profile Modal */}
      <Modal isOpen={editModalOpen} toggle={toggleEditModal} size="lg">
        <ModalHeader toggle={toggleEditModal}>Edit Profile Details</ModalHeader>
        <ModalBody>
          <Form onSubmit={handleEditSubmit}>
            <Row>
              <Col md={12}>
                <FormGroup>
                  <Label for="name">Name</Label>
                  <Input
                    type="text"
                    name="name"
                    id="name"
                    value={editedDetails.name}
                    onChange={handleEditInputChange}
                    required
                  />
                </FormGroup>
              </Col>
            </Row>
            
            <Row>
              <Col md={6}>
                <FormGroup>
                  <Label for="Program">Program</Label>
                  <Input
                    type="text"
                    name="Program"
                    id="Program"
                    value={editedDetails.Program}
                    onChange={handleEditInputChange}
                    required
                  />
                </FormGroup>
              </Col>
              <Col md={6}>
                <FormGroup>
                  <Label for="discipline">Discipline</Label>
                  <Input
                    type="text"
                    name="discipline"
                    id="discipline"
                    value={editedDetails.discipline}
                    onChange={handleEditInputChange}
                    required
                  />
                </FormGroup>
              </Col>
            </Row>
            
            <Row>
              <Col md={6}>
                <FormGroup>
                  <Label for="add_year">Year of Admission</Label>
                  <Input
                    type="number"
                    name="add_year"
                    id="add_year"
                    value={editedDetails.add_year}
                    onChange={handleEditInputChange}
                    required
                  />
                </FormGroup>
              </Col>
            </Row>
            
            <Button color="primary" type="submit" className="submit_button">
              Save Changes
            </Button>
          </Form>
        </ModalBody>
      </Modal>
      
      {/* Update Records Modal */}
      <Modal isOpen={updateModalOpen} toggle={toggleUpdateModal} size="lg">
        <ModalHeader toggle={toggleUpdateModal}>Update Records</ModalHeader>
        <ModalBody>
          <Card className="mb-4">
            <CardHeader tag="h6" className="fw-bold">
              Add New Position of Responsibility
            </CardHeader>
            <CardBody>
              <Form onSubmit={handlePORSubmit}>
                <Row>
                  <Col md={6}>
                    <FormGroup>
                      <Label for="club">Club</Label>
                      <Input
                        type="text"
                        name="club"
                        id="club"
                        value={newPOR.club}
                        onChange={handlePORChange}
                        required
                      />
                    </FormGroup>
                  </Col>
                  <Col md={6}>
                    <FormGroup>
                      <Label for="designation">Designation</Label>
                      <Input
                        type="text"
                        name="designation"
                        id="designation"
                        value={newPOR.designation}
                        onChange={handlePORChange}
                        required
                      />
                    </FormGroup>
                  </Col>
                </Row>
                
                <Row>
                  <Col md={6}>
                    <FormGroup>
                      <Label for="session">Session</Label>
                      <Input
                        type="text"
                        name="session"
                        id="session"
                        value={newPOR.session}
                        onChange={handlePORChange}
                        required
                      />
                    </FormGroup>
                  </Col>
                  <Col md={6}>
                    <FormGroup>
                      <Label for="type">Type</Label>
                      <Input
                        type="select"
                        name="type"
                        id="type"
                        value={newPOR.type}
                        onChange={handlePORChange}
                        required
                      >
                        <option value="">Select Type</option>
                        <option value="AcademicPOR">Academics POR</option>
                        <option value="ScitechPOR">Scitech POR</option>
                        <option value="CulturalPOR">Culturals POR</option>
                        <option value="SportsPOR">Sports POR</option>
                      </Input>
                    </FormGroup>
                  </Col>
                </Row>
                
                <Button color="success" type="submit" className="submit_button">
                  Add POR
                </Button>
              </Form>
            </CardBody>
          </Card>
          
          <Card>
            <CardHeader tag="h6" className="fw-bold">
              Add New Achievement
            </CardHeader>
            <CardBody>
              <Form onSubmit={handleAchievementSubmit}>
                <Row>
                  <Col md={6}>
                    <FormGroup>
                      <Label for="under">Under</Label>
                      <Input
                        type="text"
                        name="under"
                        id="under"
                        value={newAchievement.under}
                        onChange={handleAchievementChange}
                        required
                      />
                    </FormGroup>
                  </Col>
                  <Col md={6}>
                    <FormGroup>
                      <Label for="achievementDesignation">Designation</Label>
                      <Input
                        type="text"
                        name="designation"
                        id="achievementDesignation"
                        value={newAchievement.designation}
                        onChange={handleAchievementChange}
                      />
                    </FormGroup>
                  </Col>
                </Row>
                
                <Row>
                  <Col md={6}>
                    <FormGroup>
                      <Label for="eventName">Event Name</Label>
                      <Input
                        type="text"
                        name="eventName"
                        id="eventName"
                        value={newAchievement.eventName}
                        onChange={handleAchievementChange}
                        required
                      />
                    </FormGroup>
                  </Col>
                  <Col md={6}>
                    <FormGroup>
                      <Label for="conductedBy">Conducted By</Label>
                      <Input
                        type="text"
                        name="conductedBy"
                        id="conductedBy"
                        value={newAchievement.conductedBy}
                        onChange={handleAchievementChange}
                      />
                    </FormGroup>
                  </Col>
                </Row>
                
                <Button color="success" type="submit" className="submit_button">
                  Add Achievement
                </Button>
              </Form>
            </CardBody>
          </Card>
        </ModalBody>
      </Modal>
    </div>
  );
};

export default UserProfileButtons;