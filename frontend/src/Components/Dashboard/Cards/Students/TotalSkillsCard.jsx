// src/components/dashboard/cards/student/TotalSkillsCard.js
import React from 'react';
import BaseStatCard from '../BaseStatCard';

const TotalSkillsCard = ({ count }) => (
  <BaseStatCard title="Total Skills" value={count ?? 0} />
);

export default TotalSkillsCard;