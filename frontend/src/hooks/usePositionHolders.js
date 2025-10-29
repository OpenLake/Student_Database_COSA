import { useState, useEffect, useRef, useContext } from "react";
import { useNavigate } from "react-router-dom";
import api from "../utils/api";
import { useProfile } from "./useProfile";
import { AdminContext } from "../context/AdminContext";

// Hook for managing position holder form logic
export const usePositionHolderForm = (currentUser) => {
  const [formData, setFormData] = useState({
    user_id: "",
    position_id: "",
    tenure_year: "",
    appointment_details: { appointed_by: "", appointment_date: "" },
    performance_metrics: {
      events_organized: "",
      budget_utilized: "",
      feedback: "",
    },
    status: "active",
  });

  const [users, setUsers] = useState([]);
  const [positions, setPositions] = useState([]);
  const [units, setUnits] = useState([]);
  const [scopedPositions, setScopedPositions] = useState([]);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const currentUserRole = currentUser?.role || null;
  const currentUserEmail = currentUser?.email || "";

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [usersRes, positionsRes, unitsRes] = await Promise.all([
          api.get(`/api/events/users`),
          api.get(`/api/positions/get-all`),
          api.get(`/api/events/units`),
        ]);
        setUsers(usersRes.data);
        setPositions(positionsRes.data);
        setUnits(unitsRes.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (!positions.length) {
      setScopedPositions([]);
      return;
    }

    if (
      !currentUserRole ||
      currentUserRole === "PRESIDENT" ||
      currentUserRole === "STUDENT"
    ) {
      setScopedPositions(positions);
    } else {
      // Apply role-based filtering logic here
      setScopedPositions(positions);
    }
  }, [positions, units, currentUserRole, currentUserEmail]);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.user_id) newErrors.user_id = "User selection is required.";
    if (!formData.position_id)
      newErrors.position_id = "Position selection is required.";
    if (!formData.tenure_year)
      newErrors.tenure_year = "Tenure year is required.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      await api.post(`/api/positions/add-position-holder`, formData);
      alert("Position Holder created successfully!");
      setFormData({
        user_id: "",
        position_id: "",
        tenure_year: "",
        appointment_details: { appointed_by: "", appointment_date: "" },
        performance_metrics: {
          events_organized: "",
          budget_utilized: "",
          feedback: "",
        },
        status: "active",
      });
      setErrors({});
    } catch (error) {
      alert("Failed to create position holder.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    formData,
    setFormData,
    users,
    positions: scopedPositions,
    units,
    errors,
    setErrors,
    isSubmitting,
    handleSubmit,
  };
};

// Hook for viewing position holders
export const usePositionHolders = () => {
  const { isUserLoggedIn } = useContext(AdminContext);
  const userRole = isUserLoggedIn?.role || "STUDENT";
  const { profile } = useProfile();

  const [positionHolders, setPositionHolders] = useState([]);
  const [filteredHolders, setFilteredHolders] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [selectedTenure, setSelectedTenure] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [selectedHolder, setSelectedHolder] = useState(null);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    const fetchPositionHolders = async () => {
      try {
        const res = await api.get(`/api/positions/get-all-position-holder`);
        setPositionHolders(res.data);
        setFilteredHolders(res.data);
      } catch (error) {
        console.error("Error fetching position holders:", error);
      }
    };
    fetchPositionHolders();
  }, []);

  useEffect(() => {
    let filtered = positionHolders;
    filtered = filtered.filter(
      (holder) =>
        (userRole !== "STUDENT"
          ? holder.position_id?.unit_id?.name
          : holder.user_id?.personal_info?.name) ===
        profile?.personal_info.name,
    );

    if (searchTerm) {
      filtered = filtered.filter(
        (holder) =>
          holder.user_id?.personal_info?.name
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          holder.user_id?.username
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          holder.user_id?.user_id
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          holder.position_id?.title
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase()),
      );
    }

    if (selectedStatus) {
      filtered = filtered.filter((holder) => holder.status === selectedStatus);
    }
    if (selectedTenure) {
      filtered = filtered.filter(
        (holder) => holder.tenure_year === selectedTenure,
      );
    }
    if (selectedDepartment) {
      filtered = filtered.filter(
        (holder) => holder.position_id?.unit_id?.name === selectedDepartment,
      );
    }

    setFilteredHolders(filtered);
  }, [
    searchTerm,
    selectedStatus,
    selectedTenure,
    selectedDepartment,
    positionHolders,
  ]);

  const statuses = ["active", "completed", "terminated"];
  const tenureYears = [
    ...new Set(positionHolders.map((h) => h.tenure_year)),
  ].sort();
  const departments = [
    ...new Set(
      positionHolders.map((h) => h.position_id?.unit_id?.name).filter(Boolean),
    ),
  ];

  return {
    positionHolders,
    filteredHolders,
    setFilteredHolders,
    searchTerm,
    setSearchTerm,
    selectedStatus,
    setSelectedStatus,
    selectedTenure,
    setSelectedTenure,
    selectedDepartment,
    setSelectedDepartment,
    selectedHolder,
    setSelectedHolder,
    showDetails,
    setShowDetails,
    statuses,
    tenureYears,
    departments,
  };
};
