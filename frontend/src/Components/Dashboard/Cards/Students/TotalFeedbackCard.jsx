import React from 'react';
import BaseStatCard from '../BaseStatCard';

const TotalFeedbackCard = ({ count }) => (
  <BaseStatCard title="Total Feedback Given" value={count ?? 0} />
);

export default TotalFeedbackCard;