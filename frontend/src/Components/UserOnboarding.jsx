import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { fetchCredentials, completeOnboarding } from "../services/auth";
import { AdminContext } from "../App";
import logo from "../assets/image.png";

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
          name: user.personal_info.name,
          email: user.personal_info.email,
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
    if (!/^\d{10}$/.test(userData.mobile_no))
      newErrors.mobile_no = "Mobile number must be 10 digits";
    if (!userData.add_year || userData.add_year < 2016)
      newErrors.add_year = "Invalid admission year";
    if (!userData.Program) newErrors.Program = "Program is required";
    if (!userData.discipline) newErrors.discipline = "Discipline is required";
    return newErrors;
  };

  const handleChange = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
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
      navigate("/", { replace: true });
    } catch (error) {
      console.error("Error completing onboarding", error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4 py-8">
      <div className="flex flex-col md:flex-row w-full max-w-6xl bg-white rounded-2xl shadow-xl overflow-hidden">
        {/* Left Panel */}
        <div className="md:w-1/2 w-full bg-gradient-to-r from-blue-900 to-blue-800 text-white p-10 flex flex-col justify-center items-center">
          <div className="bg-white/20 rounded-full p-4">
            <img
              src={logo}
              alt="student"
              className="w-32 h-32 object-contain rounded-full"
            />
          </div>
          <h1 className="text-3xl font-bold mt-6 mb-2 text-center">
            Welcome to Our College
          </h1>
          <p className="text-lg text-center">
            Complete your profile to access all campus services and tools.
          </p>
        </div>

        {/* Right Form */}
        <div className="md:w-1/2 w-full p-10">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">
            Student Registration
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700">
                  Name
                </label>
                <input
                  type="text"
                  value={userData.name}
                  readOnly
                  className="w-full border rounded-md px-3 py-2 bg-gray-100 text-gray-600"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                  type="email"
                  value={userData.email}
                  readOnly
                  className="w-full border rounded-md px-3 py-2 bg-gray-100 text-gray-600"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700">
                  Student ID Number
                </label>
                <input
                  type="number"
                  name="ID_No"
                  value={userData.ID_No}
                  onChange={handleChange}
                  className="w-full border rounded-md px-3 py-2"
                />
                {errors.ID_No && (
                  <p className="text-red-500 text-sm">{errors.ID_No}</p>
                )}
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">
                  Mobile Number
                </label>
                <input
                  type="text"
                  name="mobile_no"
                  value={userData.mobile_no}
                  onChange={handleChange}
                  className="w-full border rounded-md px-3 py-2"
                />
                {errors.mobile_no && (
                  <p className="text-red-500 text-sm">{errors.mobile_no}</p>
                )}
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700">
                  Admission Year
                </label>
                <input
                  type="number"
                  name="add_year"
                  value={userData.add_year}
                  onChange={handleChange}
                  className="w-full border rounded-md px-3 py-2"
                />
                {errors.add_year && (
                  <p className="text-red-500 text-sm">{errors.add_year}</p>
                )}
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">
                  Program
                </label>
                <input
                  type="text"
                  name="Program"
                  value={userData.Program}
                  onChange={handleChange}
                  className="w-full border rounded-md px-3 py-2"
                />
                {errors.Program && (
                  <p className="text-red-500 text-sm">{errors.Program}</p>
                )}
              </div>

              <div className="md:col-span-2">
                <label className="text-sm font-medium text-gray-700">
                  Discipline
                </label>
                <input
                  type="text"
                  name="discipline"
                  value={userData.discipline}
                  onChange={handleChange}
                  className="w-full border rounded-md px-3 py-2"
                />
                {errors.discipline && (
                  <p className="text-red-500 text-sm">{errors.discipline}</p>
                )}
              </div>
            </div>

            <button
              type="submit"
              className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md transition duration-200"
            >
              Complete Registration
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
