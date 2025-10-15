import React from 'react';
import BaseStatCard from '../BaseStatCard';

const PendingRoomRequestsCard = ({ count }) => (
  <BaseStatCard 
    title="Pending Room Requests" 
    value={count ?? 0} 
  />
);

export default PendingRoomRequestsCard;