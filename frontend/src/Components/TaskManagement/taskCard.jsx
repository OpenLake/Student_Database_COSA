import { PRIORITY_CARD_STYLE, STATUS_CONFIG } from "./ui";

// --- Task Card ---
export default function TaskCard({ task, View }) {
  const style = PRIORITY_CARD_STYLE[task.priority];
  const status = STATUS_CONFIG[task.status];

  return (
    <div
      onClick={() => View(task)}
      className={`${style.bg} rounded-2xl border ${style.border} ${style.hover} p-4 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 cursor-pointer group flex flex-col gap-3`}
    >
      {/* Priority accent strip */}
      <div className={`h-1 w-10 rounded-full ${style.accent} opacity-60`} />

      {/* Top row */}
      <div className="flex items-start justify-between gap-2">
        <h3 className="text-sm font-semibold text-stone-800 leading-tight line-clamp-2 group-hover:text-stone-900 transition-colors">
          {task.title}
        </h3>
        <span
          className={`shrink-0 text-xs font-bold px-2.5 py-1 rounded-full border ${style.badge}`}
        >
          {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
        </span>
      </div>

      {/* Status */}
      <div className="flex items-center gap-1.5">
        <span className={`w-2 h-2 rounded-full ${status.dot}`}></span>
        <span className={`text-sm font-semibold ${status.text}`}>
          {status.label}
        </span>
        <span className="ml-auto text-sm text-stone-500 font-medium">
          Due{" "}
          {new Date(task.deadline)
            .toLocaleDateString("en-GB")
            .replaceAll("/", "-")}
        </span>
      </div>

      {/* Progress bar */}
      <div>
        <div className="flex justify-between text-xs text-stone-400 font-medium mb-1">
          <span>Progress</span>
          <span className="font-bold text-stone-600">
            {task.progress > 0 ? task.progress : 0}%
          </span>
        </div>
        <div className="h-1.5 rounded-full bg-white/70 overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ${style.progress}`}
            style={{ width: `${task.progress}%` }}
          />
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between">
        <div className="flex -space-x-1.5">
          {task.assignees.slice(0, 3).map((a, i) => (
            <div
              key={i}
              title={a}
              className={`w-6 h-6 rounded-full ${style.avatarBg} border-2 border-white flex items-center justify-center text-[9px] font-bold text-white`}
            >
              {a.personal_info.name.charAt(0)}
            </div>
          ))}
          {task.assignees.length > 3 && (
            <div className="w-6 h-6 rounded-full bg-stone-200 border-2 border-white flex items-center justify-center text-[9px] font-bold text-stone-500">
              +{task.assignees.length - 3}
            </div>
          )}
        </div>
        <button
          className={`text-xs font-semibold border px-3 py-1 !rounded-xl transition-colors ${style.viewBtn}`}
        >
          View
        </button>
      </div>
    </div>
  );
}
