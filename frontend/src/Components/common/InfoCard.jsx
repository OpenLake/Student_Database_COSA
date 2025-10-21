import { Edit, Trash2 } from "lucide-react";

export const InfoCard = ({
  title,
  subtitle,
  badgeText,
  badgeColor,
  descriptionItems,
  onAction,
  onActionText,
  onActionColor,
  onActionDisabled,
  onEdit,
  onDelete,
  onActionProps,
}) => (
  <div className="bg-[#FDFAE2] rounded-xl px-6 py-6">
    <div className="mb-2">
      <div className="flex justify-between items-start gap-4">
        <div className="text-xl font-bold text-black truncate">{title}</div>
        <span
          className={`p-2 ${badgeColor} text-xs rounded-full font-medium shadow-sm truncate`}
        >
          {badgeText}
        </span>
      </div>

      <div className={`text-sm font-semibold text-black mb-8 text-gray-600`}>
        {subtitle}
      </div>
      <div className="space-y-1 text-xs">
        {descriptionItems.map(({ key, value, icon: Icon }, index) => (
          <div key={index} className="flex items-center gap-2">
            {Icon && <Icon className="w-3.5 h-3.5 shrink-0" />}
            <span className="font-semibold">{key}:</span>
            <span>{value}</span>
          </div>
        ))}
      </div>
    </div>

    <div className="flex gap-1 mt-3">
      <button
        onClick={() => onAction(onActionProps)}
        className={`flex-1 px-2 py-1 ${onActionColor} text-black text-xs font-medium rounded-2xl hover:bg-[#A0D9B0] transition-colors ${onActionDisabled ? "disabled" : ""}`}
      >
        {onActionText}
      </button>

      <button
        onClick={() => onEdit(onActionProps)}
        className="px-2 py-1 bg-[#E8E8E8] text-black rounded-2xl hover:bg-[#D5D5D5] transition-colors"
      >
        <Edit className="w-5 h-5" />
      </button>

      <button
        onClick={() => onDelete(onActionProps)}
        className="px-2 py-1 bg-[#FFB4B4] text-[#941111] rounded-2xl hover:bg-[#FFA0A0] transition-colors"
      >
        <Trash2 className="w-5 h-5" />
      </button>
    </div>
  </div>
);
