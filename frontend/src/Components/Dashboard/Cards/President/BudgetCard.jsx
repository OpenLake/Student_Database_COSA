import React from 'react';
import BaseStatCard from '../BaseStatCard';

const BudgetCard = ({ budget }) => {
  const used = budget?.used ?? 0;
  const total = budget?.total ?? 0;
  const percentage = total > 0 ? ((used / total) * 100).toFixed(0) : 0;

  return (
    <BaseStatCard 
      title="Total Budget Used" 
      value={`₹${used.toLocaleString()}`} 
      footer={`${percentage}% of total allocated`}
    />
  );
};

export default BudgetCard;