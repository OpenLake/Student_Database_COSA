const {Event} = require('../models/schema');

// fetch 4 most recently updated events
exports.getLatestEvents = async (req, res) => {
    try{
        const latestEvents = await Event.find({})
         .sort({updated_at: -1})
         .limit(4)
         .select('title updated_at schedule.venue status');

         const formatedEvents =latestEvents.map(event=>({
            id: event._id,
            title: event.title,
            date: event.updated_at.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
            venue: (event.schedule && event.schedule.venue) ? event.schedule.venue : 'TBA',
            status: event.status || 'TBD'
         }))
         res.status(200).json(formatedEvents);
    } catch (error) {
        console.error('Error fetching latest events:', error);
        res.status(500).json({ message: 'Server error' });
    }
};