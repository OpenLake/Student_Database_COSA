import React from 'react';
import BaseStatCard from '../BaseStatCard';

const ActiveMembersCard = ({ count }) => (
  <BaseStatCard 
    title="Active Members" 
    value={count ?? 0} 
  />
);

export default ActiveMembersCard;