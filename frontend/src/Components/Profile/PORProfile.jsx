import React, { useEffect, useState } from "react";
import {
  User,
  GraduationCap,
  Calendar,
  Users,
  ClipboardList,
  Briefcase,
} from "lucide-react";
import axios from "axios";
import { useProfile } from "../../hooks/useProfile";

const PORProfile = () => {
  const [position, setPosition] = useState(null);
  const [holder, setHolder] = useState(null);
  const [loading, setLoading] = useState(true);

  const { profile, loading: profileLoading } = useProfile();
  const userId = profile?._id;

  useEffect(() => {
    if (!userId) return;

    const fetchData = async () => {
      try {
        const [positionsRes, holdersRes] = await Promise.all([
          axios.get("http://localhost:5000/api/positions/get-all", {
            withCredentials: true,
          }),
          axios.get(
            "http://localhost:5000/api/positions/get-all-position-holder",
            { withCredentials: true },
          ),
        ]);

        const positions = positionsRes.data;
        const holders = holdersRes.data;

        const porHolder = holders.find((h) => h.user_id?._id === userId);

        if (!porHolder) {
          setLoading(false);
          return;
        }

        setHolder(porHolder);

        const fullPosition = positions.find(
          (p) => p._id === porHolder.position_id._id,
        );

        setPosition(fullPosition);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userId]);

  if (loading || profileLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FBF8E6]">
        <div className="animate-spin rounded-full h-10 w-10 border-2 border-blue-300 border-t-blue-600"></div>
      </div>
    );
  }

  if (!holder || !position) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FBF8E6]">
        <p className="text-gray-600 text-lg">No POR assigned.</p>
      </div>
    );
  }

  const student = holder.user_id;

  return (
    <div className="min-h-screen bg-[#FBF8E6] px-8 py-6">
      {/* Page Title */}

      {/* Profile Header */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 flex items-center gap-6 shadow-sm">
        <img
          src={student?.personal_info?.profilePic || "/default-profile.png"}
          alt="profile"
          className="w-24 h-24 rounded-full object-cover border"
        />
        <div>
          <h2 className="text-2xl font-semibold text-gray-900">
            {student.personal_info.name}
          </h2>
          <p className="text-gray-500">{student.username}</p>
          <span className="inline-block mt-2 text-xs bg-blue-100 text-blue-700 px-3 py-1 rounded-full">
            {position.title}
          </span>
        </div>
      </div>

      {/* Analytics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-6">
        <StatCard label="Position Type" value={position.position_type} />
        <StatCard label="Tenure Year" value={holder.tenure_year} />
        <StatCard label="Unit / Club" value={position.unit_id.name} />
      </div>

      {/* Info Sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        <Section title="Student Information">
          <InfoRow
            icon={GraduationCap}
            label="Batch"
            value={profile.academic_info?.batch_year || "-"}
          />
          <InfoRow
            icon={Users}
            label="Branch"
            value={profile.academic_info?.branch || "-"}
          />
        </Section>

        <Section title="Position Information">
          <InfoRow
            icon={Briefcase}
            label="Position Title"
            value={position.title}
          />
          <InfoRow
            icon={Calendar}
            label="Tenure Year"
            value={holder.tenure_year}
          />
          <InfoRow
            icon={ClipboardList}
            label="Position Type"
            value={position.position_type}
          />
        </Section>
      </div>

      {/* Description */}
      <div className="mt-6">
        <Section title="Position Description">
          <p className="text-sm text-gray-700 leading-relaxed">
            {position.description}
          </p>
        </Section>
      </div>

      {/* Responsibilities */}
      <div className="mt-6">
        <Section title="Responsibilities">
          <ul className="list-disc ml-5 space-y-2 text-sm text-gray-700">
            {position.responsibilities?.map((r, i) => (
              <li key={i}>{r}</li>
            ))}
          </ul>
        </Section>
      </div>
    </div>
  );
};

/* ---------- Reusable Components ---------- */

const Section = ({ title, children }) => (
  <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200">
    <h3 className="text-lg font-semibold text-gray-900 mb-3 pb-1 border-b border-gray-200">
      {title}
    </h3>
    {children}
  </div>
);

const InfoRow = ({ icon: Icon, label, value }) => (
  <div className="flex items-center gap-4 mb-3 bg-gray-50 p-3 rounded-lg border border-gray-200">
    {Icon && <Icon className="w-5 h-5 text-blue-600" />}
    <div>
      <p className="text-xs text-gray-500">{label}</p>
      <p className="text-sm font-medium text-gray-900">{value}</p>
    </div>
  </div>
);

const StatCard = ({ label, value }) => (
  <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
    <p className="text-xs text-gray-500">{label}</p>
    <p className="text-lg font-semibold text-gray-900 mt-1">{value}</p>
  </div>
);

export default PORProfile;
