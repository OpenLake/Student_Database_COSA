import React from 'react';
import BaseStatCard from '../BaseStatCard';

const TotalAchievementsCard = ({ count }) => (
  <BaseStatCard title="Total Achievements" value={count ?? 0} />
);

export default TotalAchievementsCard;