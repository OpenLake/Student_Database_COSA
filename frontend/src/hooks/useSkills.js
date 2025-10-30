import { useState, useEffect, useContext, useMemo } from "react";
import { AdminContext } from "../context/AdminContext";
import api from "../utils/api";

export const useSkills = () => {
  const { isUserLoggedIn } = useContext(AdminContext);
  const [skills, setSkills] = useState([]);
  const [userSkills, setUserSkills] = useState([]);
  const [positions, setPositions] = useState([]);
  const [loading, setLoading] = useState(false);

  // Filter states
  const [selectedType, setSelectedType] = useState("All");
  const [selectedProficiency, setSelectedProficiency] = useState("All");
  const [selectedEndorsement, setSelectedEndorsement] = useState("All");

  // Fetch initial data (skills and positions)
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [skillsRes, positionsRes] = await Promise.all([
          api.get(`/api/skills/get-skills`),
          api.get(`/api/positions/get-all`),
        ]);
        setSkills(skillsRes.data);
        setPositions(positionsRes.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  // Fetch user skills
  useEffect(() => {
    const fetchUserSkills = async () => {
      if (!isUserLoggedIn?._id) return;
      try {
        const userSkillsRes = await api.get(
          `/api/skills/user-skills/${isUserLoggedIn._id}`,
        );
        setUserSkills(userSkillsRes.data);
      } catch (error) {
        console.error("Failed to fetch user skills:", error);
      }
    };
    fetchUserSkills();
  }, [isUserLoggedIn]);

  // Memoized lists for filter dropdowns
  const { types, proficiencies, endorsementStatuses } = useMemo(() => {
    const uniqueTypes = [
      ...new Set(userSkills.map((us) => us.skill_id?.type).filter(Boolean)),
    ];
    const profs = ["Beginner", "Intermediate", "Advanced", "Expert"];
    const endorsements = ["Endorsed", "Not Endorsed"];
    return {
      types: uniqueTypes,
      proficiencies: profs,
      endorsementStatuses: endorsements,
    };
  }, [userSkills]);

  // Apply filters
  const filteredSkills = useMemo(() => {
    let filtered = userSkills;

    if (selectedType !== "All") {
      filtered = filtered.filter((us) => us.skill_id?.type === selectedType);
    }
    if (selectedProficiency !== "All") {
      filtered = filtered.filter(
        (us) =>
          us.proficiency_level?.toLowerCase() ===
          selectedProficiency.toLowerCase(),
      );
    }
    if (selectedEndorsement !== "All") {
      const isEndorsed = selectedEndorsement === "Endorsed";
      filtered = filtered.filter((us) => us.is_endorsed === isEndorsed);
    }

    return filtered;
  }, [selectedType, selectedProficiency, selectedEndorsement, userSkills]);

  // Refresh user skills
  const refreshUserSkills = async () => {
    if (!isUserLoggedIn?._id) return;
    try {
      const userSkillsRes = await api.get(
        `/api/skills/user-skills/${isUserLoggedIn._id}`,
      );
      setUserSkills(userSkillsRes.data);
    } catch (error) {
      console.error("Failed to refresh user skills:", error);
    }
  };

  return {
    skills,
    userSkills,
    positions,
    filteredSkills,
    loading,
    setLoading,
    selectedType,
    setSelectedType,
    selectedProficiency,
    setSelectedProficiency,
    selectedEndorsement,
    setSelectedEndorsement,
    types,
    proficiencies,
    endorsementStatuses,
    refreshUserSkills,
  };
};

export const useSkillForm = (onSuccess) => {
  const { isUserLoggedIn } = useContext(AdminContext);
  const [loading, setLoading] = useState(false);
  const [showNewSkillForm, setShowNewSkillForm] = useState(false);

  const [formData, setFormData] = useState({
    skill_id: "",
    proficiency_level: "beginner",
    position_id: "",
  });

  const [newSkillData, setNewSkillData] = useState({
    name: "",
    category: "",
    type: "technical",
    description: "",
  });

  const handleSkillChange = (skillId) => {
    setFormData((prev) => ({ ...prev, skill_id: skillId }));
    setShowNewSkillForm(skillId === "other");
  };

  const updateFormData = (updates) => {
    setFormData((prev) => ({ ...prev, ...updates }));
  };

  const updateNewSkillData = (updates) => {
    setNewSkillData((prev) => ({ ...prev, ...updates }));
  };

  const resetForm = () => {
    setFormData({
      skill_id: "",
      proficiency_level: "beginner",
      position_id: "",
    });
    setNewSkillData({
      name: "",
      category: "",
      type: "technical",
      description: "",
    });
    setShowNewSkillForm(false);
  };

  const submitNewSkill = async () => {
    try {
      const newSkillResponse = await api.post(
        `/api/skills/create-skill`,
        newSkillData,
      );
      resetForm();
      if (onSuccess) onSuccess();
      return { success: true, message: "Skill added successfully!" };
    } catch (error) {
      console.error("Error adding skill:", error);
      return {
        success: false,
        message: "Error adding skill. It might already exist in your profile.",
      };
    } finally {
      setLoading(false);
    }
    // skillIdToUse = newSkillResponse.data._id;
  };
  const submitSkill = async () => {
    if (!formData.skill_id) {
      return { success: false, message: "Please select a skill." };
    }

    if (
      showNewSkillForm &&
      (!newSkillData.name.trim() || !newSkillData.category.trim())
    ) {
      return {
        success: false,
        message: "Please fill all required fields for the new skill.",
      };
    }

    setLoading(true);
    try {
      let skillIdToUse = formData.skill_id;

      // Create new skill if needed
      if (showNewSkillForm) {
        const newSkillResponse = await api.post(
          `/api/skills/create-skill`,
          newSkillData,
        );
        skillIdToUse = newSkillResponse.data._id;
      }

      // Create user skill
      await api.post(`/api/skills/create-user-skill`, {
        user_id: isUserLoggedIn._id,
        skill_id: skillIdToUse,
        proficiency_level: formData.proficiency_level,
        position_id: formData.position_id || null,
      });

      resetForm();
      if (onSuccess) onSuccess();
      return { success: true, message: "Skill added successfully!" };
    } catch (error) {
      console.error("Error adding skill:", error);
      return {
        success: false,
        message: "Error adding skill. It might already exist in your profile.",
      };
    } finally {
      setLoading(false);
    }
  };

  return {
    formData,
    newSkillData,
    loading,
    showNewSkillForm,
    handleSkillChange,
    updateFormData,
    updateNewSkillData,
    resetForm,
    submitSkill,
    submitNewSkill,
  };
};
