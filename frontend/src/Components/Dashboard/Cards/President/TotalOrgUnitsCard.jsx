import React from 'react';
import BaseStatCard from '../BaseStatCard';

const TotalOrgUnitsCard = ({ count }) => (
  <BaseStatCard 
    title="Total Org. Units" 
    value={count ?? 0} 
  />
);

export default TotalOrgUnitsCard;