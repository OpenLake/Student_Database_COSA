import './Add.css';
import React, { Component } from 'react';
import { Card, CardBody, CardTitle, Form, FormGroup, Label, Input, Button, Row, Col, Placeholder } from 'reactstrap';

class InputForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      name: '',
      ID_No: '',
      Program: '',
      discipline: '',
      add_year: '',
      pos_res: [
        {
          club: '',
          designation: '',
          session: '',
          type: '',
        },
      ],
      achievements: [
        {
          under: '',
          designation: '',
          eventName: '',
          conductedBy: '',
        },
      ],
      isFormVisible: true, // Initially set to visible
    };
  }

  handleInputChange = (e) => {
    const { name, value } = e.target;
    this.setState({ [name]: value });
  }

  handleAddPOR = () => {
    this.setState((prevState) => ({
      pos_res: [
        ...prevState.pos_res,
        {
          club: '',
          designation: '',
          session: '',
          type: '',
        },
      ],
    }));
  }

  handleRemovePOR = (index) => {
    this.setState((prevState) => {
      const pos_res = [...prevState.pos_res];
      pos_res.splice(index, 1);
      return { pos_res };
    });
  }

  handlePORChange = (index, field, e) => {
    const { value } = e.target;
    this.setState((prevState) => {
      const pos_res = [...prevState.pos_res];
      pos_res[index][field] = value;
      return { pos_res };
    });
  }

  handleAddAchievement = () => {
    this.setState((prevState) => ({
      achievements: [
        ...prevState.achievements,
        {
          under: '',
          designation: '',
          eventName: '',
          conductedBy: '',
        },
      ],
    }));
  }

  handleRemoveAchievement = (index) => {
    this.setState((prevState) => {
      const achievements = [...prevState.achievements];
      achievements.splice(index, 1);
      return { achievements };
    });
  }

  handleAchievementChange = (index, field, e) => {
    const { value } = e.target;
    this.setState((prevState) => {
      const achievements = [...prevState.achievements];
      achievements[index][field] = value;
      return { achievements };
    });
  }

  handleSubmit = async (event) => {
    event.preventDefault();
    const student = this.state;
    // console.log(student)
    try {
      const url = 'http://localhost:8000/auth/add';
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(student),
        credentials: 'include',
      });
  
      if (response.status == 201) {
        console.log(response)
   
      } else {
        throw new Error('Request failed');
      }
    } catch (error) {
      console.log(error);
    }
  };

  render() {
    const { name, ID_No, Program, discipline, add_year, pos_res, achievements, isFormVisible } = this.state;

    if (!isFormVisible) {
      return <div>Student added Successfully</div>;
    }

    return (
      <div>
        <Card className={"InputForm-card"}>
          <CardBody>
            <CardTitle tag="h5">Student Details</CardTitle>
            <Form onSubmit={this.handleSubmit}>
              <FormGroup>
                <Label for="name">Name</Label>
                <Input
                  type="text"
                  name="name"
                  id="name"
                  value={name}
                  onChange={this.handleInputChange}
                />
              </FormGroup>
              <FormGroup>
                <Label for="id">ID</Label>
                <Input
                  type="text"
                  name="ID_No"
                  id="ID_No"
                  value={ID_No}
                  onChange={this.handleInputChange}
                />
              </FormGroup>
              <FormGroup>
                <Label for="program">Program</Label>
                <Input
                  type="text"
                  name="Program"
                  id="Program"
                  value={Program}
                  onChange={this.handleInputChange}
                />
              </FormGroup>
              <FormGroup>
                <Label for="discipline">Discipline</Label>
                <Input
                  type="text"
                  name="discipline"
                  id="discipline"
                  value={discipline}
                  onChange={this.handleInputChange}
                />
              </FormGroup>
              <FormGroup>
                <Label for="add_year">Year of Admission</Label>
                <Input
                  type="text"
                  name="add_year"
                  id="add_year"
                  value={add_year}
                  onChange={this.handleInputChange}
                />
              </FormGroup>

              <CardTitle tag="h5">PORs</CardTitle>
              {pos_res.map((por, index) => (
                <div key={index}>
                  <Row>
                    <Col>
                      <FormGroup>
                        <Label>Club</Label>
                        <Input
                          type="text"
                          value={por.club}
                          onChange={(e) => this.handlePORChange(index, 'club', e)}
                        />
                      </FormGroup>
                    </Col>
                    <Col>
                      <FormGroup>
                        <Label>Designation</Label>
                        <Input
                          type="text"
                          value={por.designation}
                          onChange={(e) => this.handlePORChange(index, 'designation', e)}
                        />
                      </FormGroup>
                    </Col>
                  </Row>
                  <Row>
                    <Col>
                      <FormGroup>
                        <Label>Session</Label>
                        <Input
                          type="text"
                          value={por.session}
                          onChange={(e) => this.handlePORChange(index, 'session', e)}
                        />
                      </FormGroup>
                    </Col>
                    <Col>
                      <FormGroup>
                        <Label>Type</Label>
                        <select
                          value={por.type}
                          onChange={(e) => this.handlePORChange(index, 'type', e)
                          }
                          placeholder="select"
                        >
                        <option value="AcademicPOR">Academics POR</option>
                        <option value="ScitechPOR">Scitech POR</option>
                        <option value="CulturalsOR">Culturals POR</option>
                        <option value="SportsPOR">Sports POR</option>
                        </select>
                      </FormGroup>
                    </Col>

                  </Row>
                  <Button
                    color="danger"
                    onClick={() => this.handleRemovePOR(index)}
                    style={{ marginTop: '10px' }}
                  >
                    Remove POR
                  </Button>
                </div>
              ))}
              <Button color="success" onClick={this.handleAddPOR}>Add POR</Button>

              <CardTitle tag="h5">Achievements</CardTitle>
              {achievements.map((achievement, index) => (
                <div key={index}>
                  <Row>
                    <Col>
                      <FormGroup>
                        <Label>Under</Label>
                        <Input
                          type="text"
                          value={achievement.under}
                          onChange={(e) => this.handleAchievementChange(index, 'under', e)}
                        />
                      </FormGroup>
                    </Col>
                    <Col>
                      <FormGroup>
                        <Label>Designation</Label>
                        <Input
                          type="text"
                          value={achievement.designation}
                          onChange={(e) => this.handleAchievementChange(index, 'designation', e)}
                        />
                      </FormGroup>
                    </Col>
                  </Row>
                  <Row>
                    <Col>
                      <FormGroup>
                        <Label>Event Name</Label>
                        <Input
                          type="text"
                          value={achievement.eventName}
                          onChange={(e) => this.handleAchievementChange(index, 'eventName', e)}
                        />
                      </FormGroup>
                    </Col>
                    <Col>
                      <FormGroup>
                        <Label>Conducted By</Label>
                        <Input
                          type="text"
                          value={achievement.conductedBy}
                          onChange={(e) => this.handleAchievementChange(index, 'conductedBy', e)}
                        />
                      </FormGroup>
                    </Col>
                  </Row>
                  <Button
                    color="danger"
                    onClick={() => this.handleRemoveAchievement(index)}
                    style={{ marginTop: '10px' }}
                  >
                    Remove Achievement
                  </Button>
                </div>
              ))}
              <Button color="success" onClick={this.handleAddAchievement}>Add Achievement</Button>

              <br></br>
              <button className={'submit_button'} type="submit">
                Submit
              </button>
            </Form>
          </CardBody>
        </Card>
      </div>
    );
  }
}

export default InputForm;
