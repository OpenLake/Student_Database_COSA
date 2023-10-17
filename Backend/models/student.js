const mongoose = require('mongoose');

// const scitech_por = new mongoose.Schema({
//     club: { type:String, required:true},
//     designation: { type:String, required:true},
//     session: { type:String, required:true}
// });

// const cult_por = new mongoose.Schema({
//     club: { type:String, required:true},
//     designation: { type:String, required:true},
//     session: { type:String, required:true}
// });

// const sport_por = new mongoose.Schema({
//     club: { type:String, required:true},
//     designation: { type:String, required:true},
//     session: { type:String, required:true}
// });

// const acad_por = new mongoose.Schema({
//     club: { type:String, required:true},
//     designation: { type:String, required:true},
//     session: { type:String, required:true}
// });

const achievement = new mongoose.Schema({
    under: { type:String, required:true},
    designation: { type:String, required:false},
    eventName: { type:String, required:false},
    conductedBy: { type:String, required:false},
});

const por = new mongoose.Schema({
    club: { type: String, required: true },
    designation: { type: String, required: true },
    session: { type: String, required: true },
    type: { type: String, required: true }, // Add a 'type' field to distinguish between types
}, {
    discriminatorKey: 'type', // This is the field that will be used to determine the submodel
});

// Define submodels for different 'pos_res' types
const ScitechPor = mongoose.model('ScitechPor', por);
const CultPor = mongoose.model('CultPor', por);
const SportPor = mongoose.model('SportPor', por);
const AcadPor = mongoose.model('AcadPor', por);

const student = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    ID_No:{
        type:String,
        required:true,
        unique:true
    },
    Program:{
        type:String,
        required:true
    },
    discipline:{
        type:String,
        required:true
    },
    pos_res:{
    	type:[por],
    },
    add_year:{
    	type: Number,
    	required: true,
    	validate: {
            validator: function (value) {
                return Number.isInteger(value) && value > 2016;
            },
            message: 'Invalid year of Addmission'
        }
    },
    achievements:{
    	type:[achievement],
    }
});



const Student = mongoose.model('Student', student);

module.exports = Student;
