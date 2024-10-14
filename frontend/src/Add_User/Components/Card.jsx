import "./Add.css";
import React, { Component } from "react";
import {
  Card,
  CardBody,
  CardHeader,
  CardTitle,
  Form,
  FormGroup,
  Label,
  Input,
  Button,
  Row,
  Col,
  FormFeedback,
} from "reactstrap";

class InputForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      name: "",
      ID_No: "",
      Program: "",
      discipline: "",
      add_year: "",
      pos_res: [
        {
          club: "",
          designation: "",
          session: "",
          type: "",
        },
      ],
      achievements: [
        {
          under: "",
          designation: "",
          eventName: "",
          conductedBy: "",
        },
      ],
      isFormVisible: true, // Initially set to visible
    };
  }

  handleInputChange = (e) => {
    const { name, value } = e.target;
    this.setState({ [name]: value });
  };

  handleAddPOR = () => {
    this.setState((prevState) => ({
      pos_res: [
        ...prevState.pos_res,
        {
          club: "",
          designation: "",
          session: "",
          type: "",
        },
      ],
    }));
  };

  handleRemovePOR = (index) => {
    this.setState((prevState) => {
      const pos_res = [...prevState.pos_res];
      pos_res.splice(index, 1);
      return { pos_res };
    });
  };

  handlePORChange = (index, field, e) => {
    const { value } = e.target;
    this.setState((prevState) => {
      const pos_res = [...prevState.pos_res];
      pos_res[index][field] = value;
      return { pos_res };
    });
  };

  handleAddAchievement = () => {
    this.setState((prevState) => ({
      achievements: [
        ...prevState.achievements,
        {
          under: "",
          designation: "",
          eventName: "",
          conductedBy: "",
        },
      ],
    }));
  };

  handleRemoveAchievement = (index) => {
    this.setState((prevState) => {
      const achievements = [...prevState.achievements];
      achievements.splice(index, 1);
      return { achievements };
    });
  };

  handleAchievementChange = (index, field, e) => {
    const { value } = e.target;
    this.setState((prevState) => {
      const achievements = [...prevState.achievements];
      achievements[index][field] = value;
      return { achievements };
    });
  };

  handleSubmit = async (event) => {
    event.preventDefault();
    const student = this.state;
    // console.log(student)
    try {
      const url = `${process.env.REACT_APP_BACKEND_URL}/auth/add`;
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(student),
        credentials: "include",
      });

      if (response.status === 201) {
        console.log(response);
        this.setState({ isFormVisible: false });
      } else {
        throw new Error("Request failed");
      }
    } catch (error) {
      console.log(error);
    }
  };

  render() {
    const {
      name,
      ID_No,
      Program,
      discipline,
      add_year,
      pos_res,
      achievements,
      isFormVisible,
    } = this.state;

    if (!isFormVisible) {
      return <div>Student added Successfully</div>;
    }

    return (
      <>
        <Card
          className={"InputForm-card"}
          style={{ width: "100%" }}
          color="secondary"
          outline
        >
          <CardHeader tag="h5" className="fw-bold">
            Student Details
          </CardHeader>
          <CardBody>
            <Form className="text-start" onSubmit={this.handleSubmit}>
              <Row>
                <Col md={6}>
                  <FormGroup>
                    <Label for="name">Name*</Label>
                    <Input
                      type="text"
                      style={{ background: "whitesmoke" }}
                      name="name"
                      id="name"
                      value={name}
                      onChange={this.handleInputChange}
                      required
                      invalid={!/^[A-Za-z\s]*$/.test(name)}
                    />
                    <FormFeedback invalid>
                      Name must only contain alphabetic characters
                    </FormFeedback>
                  </FormGroup>
                </Col>
                <Col md={6}>
                  <FormGroup>
                    <Label for="id">ID*</Label>
                    <Input
                      type="number"
                      style={{ background: "whitesmoke" }}
                      name="ID_No"
                      id="ID_No"
                      value={ID_No}
                      onChange={this.handleInputChange}
                      required
                    />
                  </FormGroup>
                </Col>
              </Row>

              <Row>
                <Col md={5}>
                  <FormGroup>
                    <Label for="program">Program*</Label>
                    <Input
                      type="text"
                      style={{ background: "whitesmoke" }}
                      name="Program"
                      id="Program"
                      value={Program}
                      onChange={this.handleInputChange}
                      required
                    />
                  </FormGroup>
                </Col>
                <Col md={4}>
                  <FormGroup>
                    <Label for="discipline">Discipline*</Label>
                    <Input
                      type="text"
                      name="discipline"
                      id="discipline"
                      style={{ background: "whitesmoke" }}
                      value={discipline}
                      onChange={this.handleInputChange}
                      required
                    />
                  </FormGroup>
                </Col>
                <Col md={3}>
                  <FormGroup>
                    <Label for="add_year">Year of Admission*</Label>
                    <Input
                      type="number"
                      name="add_year"
                      id="add_year"
                      style={{ background: "whitesmoke" }}
                      value={add_year}
                      onChange={this.handleInputChange}
                      required
                      invalid={add_year != null && add_year <= 2016}
                    />
                    <FormFeedback invalid>
                      Admission year can only be after 2016
                    </FormFeedback>
                  </FormGroup>
                </Col>
              </Row>

              <Row>
                <Col md={10}>
                  <CardTitle tag="h5" className="fw-bold pt-1">
                    PORs
                  </CardTitle>
                </Col>
                <Col md={2}>
                  <Button
                    color="success"
                    outline
                    style={{ width: "100%" }}
                    onClick={this.handleAddPOR}
                  >
                    Add POR
                  </Button>
                </Col>
              </Row>
              {pos_res.map((por, index) => (
                <div key={index}>
                  <hr className="mt-2 mb-3"></hr>
                  <CardTitle
                    className="fw-bolder"
                    style={{ color: "gray" }}
                    tag="h6"
                  >
                    POR No. {index + 1}
                  </CardTitle>
                  <Row>
                    <Col>
                      <FormGroup>
                        <Label>Club*</Label>
                        <Input
                          type="text"
                          style={{ background: "whitesmoke" }}
                          value={por.club}
                          onChange={(e) =>
                            this.handlePORChange(index, "club", e)
                          }
                          required
                        />
                      </FormGroup>
                    </Col>
                    <Col>
                      <FormGroup>
                        <Label>Designation*</Label>
                        <Input
                          type="text"
                          value={por.designation}
                          style={{ background: "whitesmoke" }}
                          onChange={(e) =>
                            this.handlePORChange(index, "designation", e)
                          }
                          required
                        />
                      </FormGroup>
                    </Col>
                  </Row>
                  <Row>
                    <Col md={6}>
                      <FormGroup>
                        <Label>Session*</Label>
                        <Input
                          type="text"
                          value={por.session}
                          style={{ background: "whitesmoke" }}
                          required
                          onChange={(e) =>
                            this.handlePORChange(index, "session", e)
                          }
                        />
                      </FormGroup>
                    </Col>
                    <Col md={4}>
                      <FormGroup>
                        <Label>Type*</Label>
                        <Input
                          value={por.type}
                          className="mb-3"
                          style={{ background: "whitesmoke" }}
                          type="select"
                          onChange={(e) =>
                            this.handlePORChange(index, "type", e)
                          }
                          required
                          placeholder="select"
                        >
                          <option value="">Select Option</option>
                          <option value="AcademicPOR">Academics POR</option>
                          <option value="ScitechPOR">Scitech POR</option>
                          <option value="CulturalsOR">Culturals POR</option>
                          <option value="SportsPOR">Sports POR</option>
                        </Input>
                      </FormGroup>
                    </Col>
                    <Col>
                      <Button
                        color="danger"
                        outline
                        onClick={() => this.handleRemovePOR(index)}
                        style={{ marginTop: "32px", width: "100%" }}
                      >
                        Remove
                      </Button>
                    </Col>
                  </Row>
                </div>
              ))}

              <Row className="mt-4">
                <Col md={9}>
                  <CardTitle tag="h5" className="fw-bold pt-1">
                    Achievements
                  </CardTitle>
                </Col>
                <Col md={3}>
                  <Button
                    color="success"
                    outline
                    style={{ width: "100%" }}
                    onClick={this.handleAddAchievement}
                  >
                    Add Achievement
                  </Button>
                </Col>
              </Row>
              {achievements.map((achievement, index) => (
                <div key={index}>
                  <hr className="mt-2 mb-3"></hr>
                  <CardTitle
                    className="fw-bolder"
                    style={{ color: "gray" }}
                    tag="h6"
                  >
                    Achievement No. {index + 1}
                  </CardTitle>
                  <Row>
                    <Col>
                      <FormGroup>
                        <Label>Under*</Label>
                        <Input
                          type="text"
                          value={achievement.under}
                          style={{ background: "whitesmoke" }}
                          required
                          onChange={(e) =>
                            this.handleAchievementChange(index, "under", e)
                          }
                        />
                      </FormGroup>
                    </Col>
                    <Col>
                      <FormGroup>
                        <Label>Designation</Label>
                        <Input
                          type="text"
                          style={{ background: "whitesmoke" }}
                          value={achievement.designation}
                          onChange={(e) =>
                            this.handleAchievementChange(
                              index,
                              "designation",
                              e,
                            )
                          }
                        />
                      </FormGroup>
                    </Col>
                  </Row>
                  <Row>
                    <Col md={6}>
                      <FormGroup>
                        <Label>Event Name*</Label>
                        <Input
                          type="text"
                          style={{ background: "whitesmoke" }}
                          value={achievement.eventName}
                          required
                          onChange={(e) =>
                            this.handleAchievementChange(index, "eventName", e)
                          }
                        />
                      </FormGroup>
                    </Col>
                    <Col md={4}>
                      <FormGroup>
                        <Label>Conducted By</Label>
                        <Input
                          type="text"
                          style={{ background: "whitesmoke" }}
                          value={achievement.conductedBy}
                          onChange={(e) =>
                            this.handleAchievementChange(
                              index,
                              "conductedBy",
                              e,
                            )
                          }
                        />
                      </FormGroup>
                    </Col>
                    <Col>
                      <Button
                        color="danger"
                        outline
                        onClick={() => this.handleRemoveAchievement(index)}
                        style={{ marginTop: "31px", width: "100%" }}
                      >
                        Remove
                      </Button>
                    </Col>
                  </Row>
                </div>
              ))}
              <Button color="secondary" style={{ width: "100%" }} type="submit">
                Submit
              </Button>
              <p style={{ color: "red" }}>*All fields must be present</p>
            </Form>
          </CardBody>
        </Card>
      </>
    );
  }
}

export default InputForm;
