// src/components/dashboard/cards/gensec/PendingEndorsementsCard.js
import React from 'react';
import BaseStatCard from '../BaseStatCard';

const PendingEndorsementsCard = ({ skills, userSkills, achievements }) => {
    const totalPending = (skills ?? 0) + (userSkills ?? 0) + (achievements ?? 0);
    return (
        <BaseStatCard 
            title="Pending Endorsements" 
            value={totalPending} 
        />
    );
};
export default PendingEndorsementsCard;