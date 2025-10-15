import React from 'react';
import BaseStatCard from '../BaseStatCard';

const ChildClubsCard = ({ count }) => (
  <BaseStatCard 
    title="Parent of" 
    value={count ?? 0}
    footer="Clubs / Units" 
  />
);

export default ChildClubsCard;