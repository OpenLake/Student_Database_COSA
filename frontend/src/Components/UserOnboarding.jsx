import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { fetchCredentials, completeOnboarding } from "../services/auth";
import { Button, Form, FormGroup, Input, Label, Container } from "reactstrap";
import { AdminContext } from "./../App"; // Assuming you have a utility to set onboarding status
export default function OnboardingForm() {
  const navigate = useNavigate();
  const { setIsOnboardingComplete } = useContext(AdminContext);
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    ID_No: "",
    mobile_no: "",
    add_year: "",
    Program: "",
    discipline: "",
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const user = await fetchCredentials();
        setUserData((prev) => ({
          ...prev,
          name: user.name,
          email: user.username,
        }));
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };
    fetchUser();
  }, []);
  const validate = () => {
    const newErrors = {};
    if (!userData.ID_No) newErrors.ID_No = "ID Number is required";
    if (!userData.mobile_no.match(/^\d{10}$/))
      newErrors.mobile_no = "Mobile number must be 10 digits";
    if (!userData.add_year || userData.add_year < 2016)
      newErrors.add_year = "Invalid admission year";
    if (!userData.Program) newErrors.Program = "Program is required";
    if (!userData.discipline) newErrors.discipline = "Discipline is required";
    return newErrors;
  };
  const handleChange = (e) => {
    setUserData({
      ...userData,
      [e.target.name]: e.target.value,
    });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    try {
      await completeOnboarding(userData);
      setIsOnboardingComplete(true);
      navigate("/"); // After onboarding, send to RoleRedirect via App logic
    } catch (error) {
      console.error("Error completing onboarding", error);
    }
  };

  return (
    <Container
      className="d-flex flex-column justify-content-center align-items-center"
      style={{ height: "100vh" }}
    >
      <Form onSubmit={handleSubmit} style={{ width: "40%" }}>
        <h2 className="text-center mb-4">Onboarding</h2>

        <FormGroup>
          <Label>Name</Label>
          <Input type="text" value={userData.name} readOnly />
        </FormGroup>

        <FormGroup>
          <Label>Email</Label>
          <Input type="email" value={userData.email} readOnly />
        </FormGroup>

        <FormGroup>
          <Label>ID Number</Label>
          <Input
            name="ID_No"
            type="number"
            value={userData.ID_No}
            onChange={handleChange}
          />
          {errors.ID_No && <p className="text-danger">{errors.ID_No}</p>}
        </FormGroup>

        <FormGroup>
          <Label>Mobile Number</Label>
          <Input
            name="mobile_no"
            type="text"
            value={userData.mobile_no}
            onChange={handleChange}
          />
          {errors.mobile_no && (
            <p className="text-danger">{errors.mobile_no}</p>
          )}
        </FormGroup>

        <FormGroup>
          <Label>Admission Year</Label>
          <Input
            name="add_year"
            type="number"
            value={userData.add_year}
            onChange={handleChange}
          />
          {errors.add_year && <p className="text-danger">{errors.add_year}</p>}
        </FormGroup>

        <FormGroup>
          <Label>Program</Label>
          <Input
            name="Program"
            type="text"
            value={userData.Program}
            onChange={handleChange}
          />
          {errors.Program && <p className="text-danger">{errors.Program}</p>}
        </FormGroup>

        <FormGroup>
          <Label>Discipline</Label>
          <Input
            name="discipline"
            type="text"
            value={userData.discipline}
            onChange={handleChange}
          />
          {errors.discipline && (
            <p className="text-danger">{errors.discipline}</p>
          )}
        </FormGroup>

        <Button color="primary" type="submit" block>
          Submit
        </Button>
      </Form>
    </Container>
  );
}
