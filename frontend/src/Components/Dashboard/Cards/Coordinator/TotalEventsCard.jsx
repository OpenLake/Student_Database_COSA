import React from 'react';
import BaseStatCard from '../BaseStatCard';

const TotalEventsCard = ({ count }) => (
  <BaseStatCard 
    title="Total Events Organized" 
    value={count ?? 0} 
  />
);

export default TotalEventsCard;