// src/components/dashboard/cards/common/StatCard.js
import React from "react";

const BaseStatCard = ({ title, value, footer }) => (
  <div className="p-4 bg-white/90 rounded-2xl shadow-sm h-full flex flex-col justify-between">
    <div>
      <div className="text-xs text-slate-600 uppercase tracking-wider">{title}</div>
      <div className="text-3xl font-bold text-slate-900 mt-1">{value}</div>
    </div>
    {footer && <div className="text-sm text-green-600 mt-2">{footer}</div>}
  </div>
);

export default BaseStatCard;