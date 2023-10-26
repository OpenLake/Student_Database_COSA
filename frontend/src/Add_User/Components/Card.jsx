import './Add.css';
import React, { Component } from 'react';
import { Card, CardBody, CardTitle, Form, FormGroup, Label, Input, Button } from 'reactstrap';

class InputForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      name: '',
      id: '',
      program: '',
      discipline: '',
      add_year: '',
      achievements: [],
      pos_res: [],
      isFormVisible: true, // Initially set to visible
    };
  }

  handleInputChange = (e) => {
    const { name, value } = e.target;
    this.setState({ [name]: value });
  }

  handleAddPOR = () => {
    this.setState((prevState) => ({
      pos_res: [...prevState.pos_res, ''],
    }));
  }

  handleRemovePOR = (index) => {
    this.setState((prevState) => {
      const pos_res = [...prevState.pos_res];
      pos_res.splice(index, 1);
      return { pos_res };
    });
  }

  handlePORChange = (index, e) => {
    const { value } = e.target;
    this.setState((prevState) => {
      const pos_res = [...prevState.pos_res];
      pos_res[index] = value;
      return { pos_res };
    });
  }

  handleAddAchievement = () => {
    this.setState((prevState) => ({
      achievements: [...prevState.achievements, ''],
    }));
  }

  handleRemoveAchievement = (index) => {
    this.setState((prevState) => {
      const achievements = [...prevState.achievements];
      achievements.splice(index, 1);
      return { achievements };
    });
  }
  handleAchievementChange = (index, e) => {
    const { value } = e.target;
    this.setState((prevState) => {
      const achievements = [...prevState.achievements];
      achievements[index] = value;
      return { achievements };
    });
  }
  handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission logic here (e.g., storing data or sending it to a server)
    console.log(this.state);

    // Hide the form upon submission
    this.setState({
      isFormVisible: false,
    });
  }

  render() {
    const { name, id, program, discipline, add_year, pos_res, achievements, isFormVisible } = this.state;

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
                  name="id"
                  id="id"
                  value={id}
                  onChange={this.handleInputChange}
                />
              </FormGroup>
              <FormGroup>
                <Label for="program">Program</Label>
                <Input
                  type="text"
                  name="program"
                  id="program"
                  value={program}
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
              {pos_res.map((POR, index) => (
                <FormGroup key={index}>
                  <Input
                    type="text"
                    value={POR}
                    onChange={(e) => this.handlePORChange(index, e)}
                  />
                  <Button
                    color="danger"
                    onClick={() => this.handleRemovePOR(index)}
                    style={{ marginTop: '10px' }}
                  >
                    Remove
                  </Button>
                </FormGroup>
              ))}
              <Button color="success" onClick={this.handleAddPOR}>Add POR</Button>
              <CardTitle tag="h5">Achievements</CardTitle>
              {achievements.map((achievement, index) => (
                <FormGroup key={index}>
                  <Input
                    type="text"
                    value={achievement}
                    onChange={(e) => this.handleAchievementChange(index, e)}
                  />
                  <Button
                    color="danger"
                    onClick={() => this.handleRemoveAchievement(index)}
                    style={{ marginTop: '10px' }}
                  >
                    Remove
                  </Button>
                </FormGroup>
              ))}
              <Button color="success" onClick={this.handleAddAchievement}>Add Achievement</Button>
              <br></br>
              <button   className={'submit_button'} type="submit">
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
