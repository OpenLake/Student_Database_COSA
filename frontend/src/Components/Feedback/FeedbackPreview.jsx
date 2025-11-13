import { Calendar, CheckCircle, XCircle, Target, Gavel } from "lucide-react";
import { InfoCard } from "../common/InfoCard";
import { useContext, useState } from "react";
import { ResolutionModal } from "./ResolutionModel";
import { useFeedback } from "../../hooks/useFeedback";
import { AdminContext } from "../../context/AdminContext";

const FeedbackPreview = ({ fb }) => {
  const { isUserLoggedIn } = useContext(AdminContext);
  const isStudent = isUserLoggedIn?.role === "STUDENT";

  const { markAsResolved } = useFeedback();
  const [showModal, setShowModal] = useState(false);
  const [modalFeedbackId, setModalFeedbackId] = useState(null);
  const [resolving, setResolving] = useState(false);

  const handleResolve = async (actionTaken) => {
    setResolving(true);
    const result = await markAsResolved(modalFeedbackId, actionTaken);
    setResolving(false);
    if (result.success) {
      setShowModal(false);
    }
  };
  if (!fb)
    return (
      <div className="p-3 flex items-center justify-center">
        <p className="font-semibold text-xl">Select Feedback to preview</p>
      </div>
    );

  // Format target display
  const getTargetDisplay = () => {
    if (fb.target_type === "User" && fb.target_data) {
      return fb.target_data.personal_info?.name
        ? `${fb.target_data.personal_info?.name} (${fb.target_data.username})`
        : fb.target_data.username;
    } else if (fb.target_type === "Event" && fb.target_data) {
      return `${fb.target_data.title} (${fb.target_data.organizing_unit})`;
    } else if (fb.target_type === "Club/Organization" && fb.target_data) {
      return `${fb.target_data.name} (${fb.target_data.parent})`;
    } else if (fb.target_type === "POR" && fb.target_data) {
      return `${fb.target_data.title} (${fb.target_data.unit})`;
    }
    return "N/A";
  };

  // Prepare description items
  const descriptionItems = [
    {
      key: "Type",
      value: fb.type,
    },
    {
      key: "Created At",
      value: new Date(fb.created_at).toLocaleDateString("en-US", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      }),
      icon: Calendar,
    },
    {
      key: "Status",
      value: fb.is_resolved ? "Resolved" : "Not Resolved",
      icon: fb.is_resolved ? CheckCircle : XCircle,
    },
  ];

  if (fb.is_resolved) {
    descriptionItems.push({
      key: "Resolved At",
      value: new Date(fb.resolved_at).toLocaleDateString("en-US", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      }),
      icon: CheckCircle,
    });
    descriptionItems.push({
      key: fb.type === "Complaint" ? "Action Taken" : "Admin Response",
      value: fb.actions_taken,
      icon: Gavel,
    });
  }

  descriptionItems.push({
    key: "Target",
    value: getTargetDisplay(),
    icon: Target,
  });

  const onResolve = (id) => {
    setModalFeedbackId(id);
    setShowModal(true);
  };

  return (
    <>
      <InfoCard
        title={fb.comments}
        titleClass="!text-lg"
        subtitle=""
        // badgeText={fb.is_resolved ? "Resolved" : "Pending"}
        // badgeColor={
        //   fb.is_resolved
        //     ? "bg-green-100 text-green-800"
        //     : "bg-red-100 text-red-800"
        // }
        descriptionItems={descriptionItems}
        onAction={!fb.is_resolved && !isStudent && onResolve}
        onActionText={!fb.is_resolved && !isStudent && `Mark as Resolved`}
        onActionColor="bg-[#C0FFBD]"
        onActionProps={fb._id}
        // onEdit={onEdit}
        // onDelete={onDelete}
        bgColor="bg-white"
      />
      <ResolutionModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSubmit={handleResolve}
        loading={resolving}
      />
    </>
  );
};

export default FeedbackPreview;
