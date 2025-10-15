import React from 'react';
import BaseStatCard from '../BaseStatCard';

const TotalPositionsCard = ({ count }) => (
  <BaseStatCard title="Total PORs" value={count ?? 0} />
);

export default TotalPositionsCard;