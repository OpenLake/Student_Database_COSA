import { useState, useEffect } from "react";
import api from "../utils/api";
import { useProfile } from "./useProfile";

export const usePositionForm = (currentUser) => {

  const [formData, setFormData] = useState({
    title: "",
    unit_id: "",
    position_type: "",
    custom_position_type: "",
    responsibilities: [""],
    requirements: {
      min_cgpa: 0,
      min_year: 1,
      skills_required: [""],
    },
    description: "",
    position_count: 1,
  });

  const [units, setUnits] = useState([]);
  const [scopedUnits, setScopedUnits] = useState([]);
  const [isCoordinator, setIsCoordinator] = useState(false);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const userRole = currentUser?.role || "";
  const userEmail = currentUser?.email || "";

  useEffect(() => {
    const fetchUnits = async () => {
      try {
        const res = await api.get(`/api/events/units`);
        setUnits(res.data || []);
      } catch (error) {
        console.error("Failed to fetch units:", error);
      }
    };
    fetchUnits();
  }, []);

  useEffect(() => {
    if (!units.length) {
      setScopedUnits([]);
      return;
    }

    if (userRole === "PRESIDENT") {
      setScopedUnits(units);
      setIsCoordinator(false);
    } else if (userRole.startsWith("GENSEC")) {
      const category = userRole.split("_")[1]?.toLowerCase();
      const scoped = units.filter(
        (u) => (u?.category || "").toLowerCase() === category
      );
      setScopedUnits(scoped);
      setIsCoordinator(false);
    } else if (userRole === "CLUB_COORDINATOR" && userEmail) {
      const coordinatorUnit = units.find(
        (u) => u?.contact_info?.email?.toLowerCase() === userEmail.toLowerCase()
      );
      if (coordinatorUnit) {
        setScopedUnits([coordinatorUnit]);
        setFormData((prev) => ({ ...prev, unit_id: coordinatorUnit._id }));
      }
      setIsCoordinator(true);
    } else {
      setScopedUnits(units);
    }
  }, [units, userRole, userEmail]);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = "Position title is required.";
    if (!formData.unit_id)
      newErrors.unit_id = "Organizational unit is required.";
    if (!formData.position_type)
      newErrors.position_type = "Position type is required.";
    if (
      formData.position_type === "Other" &&
      !formData.custom_position_type.trim()
    )
      newErrors.custom_position_type = "Please specify the position type.";
    if (formData.responsibilities.every((r) => r.trim() === ""))
      newErrors.responsibilities = "At least one responsibility is required.";
    if (!formData.position_count || formData.position_count < 1)
      newErrors.position_count = "Position count must be at least 1.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    const cleanedData = {
      ...formData,
      position_type:
        formData.position_type === "Other"
          ? formData.custom_position_type
          : formData.position_type, // Reverted to original logic for position_type
      responsibilities: formData.responsibilities.filter((r) => r.trim()),
      requirements: {
        ...formData.requirements,
        skills_required: formData.requirements.skills_required.filter((s) =>
          s.trim()
        ),
      },
    };

    try {
      await api.post(`/api/positions/add-position`, cleanedData);
      alert("Position created successfully!");
      setFormData({
        title: "",
        unit_id: "",
        position_type: "",
        custom_position_type: "",
        responsibilities: [""],
        requirements: { min_cgpa: 0, min_year: 1, skills_required: [""] },
        description: "",
        position_count: 1,
      });
      setErrors({});
    } catch (error) {
      alert(error.response?.data?.message || "Failed to create position.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    formData,
    setFormData,
    units,
    scopedUnits,
    isCoordinator,
    errors,
    setErrors,
    isSubmitting,
    handleSubmit,
  };
};

// Hook for viewing positions
export const usePositions = () => {
  const { profile } = useProfile();
  const [positions, setPositions] = useState([]);
  const [filteredPositions, setFilteredPositions] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUnit, setSelectedUnit] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [selectedPosition, setSelectedPosition] = useState(null);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    const fetchPositions = async () => {
      try {
        const res = await api.get(`/api/positions/get-all`);
        setPositions(res.data);
        setFilteredPositions(res.data);
      } catch (error) {
        console.error("Error fetching positions:", error);
      }
    };
    fetchPositions();
  }, []);

  useEffect(() => {
    let filtered = positions;
    filtered = filtered.filter(
      (position) => position.unit_id?.name === profile?.personal_info.name
    );

    if (searchTerm) {
      filtered = filtered.filter(
        (position) =>
          position.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          position.position_id
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          position.unit_id?.name
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          position.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedUnit) {
      filtered = filtered.filter(
        (position) => position.unit_id?.name === selectedUnit
      );
    }

    if (selectedType) {
      filtered = filtered.filter(
        (position) => position.position_type === selectedType
      );
    }

    setFilteredPositions(filtered);
  }, [searchTerm, selectedUnit, selectedType, positions, profile?.personal_info.name]);

  const units = [
    ...new Set(positions.map((pos) => pos.unit_id?.name).filter(Boolean)),
  ];
  const positionTypes = [...new Set(positions.map((pos) => pos.position_type))];

  return {
    positions,
    filteredPositions,
    searchTerm,
    setSearchTerm,
    selectedUnit,
    setSelectedUnit,
    selectedType,
    setSelectedType,
    selectedPosition,
    setSelectedPosition,
    showDetails,
    setShowDetails,
    units,
    positionTypes,
  };
};
