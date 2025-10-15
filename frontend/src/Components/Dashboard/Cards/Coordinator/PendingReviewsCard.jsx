import React from 'react';
import BaseStatCard from '../BaseStatCard';

const PendingReviewsCard = ({ count }) => (
  <BaseStatCard 
    title="Pending Reviews" 
    value={count ?? 0}
    footer="Achievements & Feedback" 
  />
);

export default PendingReviewsCard;