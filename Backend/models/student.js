const mongoose = require('mongoose');


// Define submodels for different 'pos_res' types

const student = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    ID_No:{
        type:Number,
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
    
});

const achievement = new mongoose.Schema({
    student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Student', // Reference the 'Student' model
        required: true,
      },
    under: { type:String},
    designation: { type:String, required:false},
    eventName: { type:String, required:false},
    conductedBy: { type:String, required:false},
});

// const por = new mongoose.Schema({
//     student : student,
//     club: { type: String, required: true },
//     designation: { type: String, required: true },
//     session: { type: String, required: true },
//     type: { type: String, required: true }, // Add a 'type' field to distinguish between types
// }, {
//     discriminatorKey: 'type', // This is the field that will be used to determine the submodel
// });

const scitech_por = new mongoose.Schema({
    student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Student', // Reference the 'Student' model
        required: true,
      },
    club: { type:String, required:true},
    designation: { type:String, required:true},
    session: { type:String, required:true},
    type: {
        type: String,
        default: 'Scitech-POR', // Set the default value to 'scitech por'
        immutable: true, // Mark the field as immutable
      },
});

const cult_por = new mongoose.Schema({
    student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Student', // Reference the 'Student' model
        required: true,
      },
    club: { type:String, required:true},
    designation: { type:String, required:true},
    session: { type:String, required:true},
    type: {
        type: String,
        default: 'Cult-POR', // Set the default value to 'scitech por'
        immutable: true, // Mark the field as immutable
      },
});

const sport_por = new mongoose.Schema({
    student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Student', // Reference the 'Student' model
        required: true,
      },
    club: { type:String, required:true},
    designation: { type:String, required:true},
    session: { type:String, required:true},
    type: {
        type: String,
        default: 'Sport-POR', // Set the default value to 'scitech por'
        immutable: true, // Mark the field as immutable
      },
});

const acad_por = new mongoose.Schema({
    student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Student', // Reference the 'Student' model
        required: true,
      },
    club: { type:String, required:true},
    designation: { type:String, required:true},
    session: { type:String, required:true},
    type: {
        type: String,
        default: 'Acad-POR', // Set the default value to 'scitech por'
        immutable: true, // Mark the field as immutable
      },
});


const Student = mongoose.model('Student', student);
const ScietechPOR = mongoose.model('ScietechPOR',scitech_por);
const CultPOR = mongoose.model('CultPOR', cult_por);
const SportsPOR = mongoose.model('SportSPOR',sport_por);
const AcadPOR = mongoose.model('AcadPOR',acad_por);
const Achievement = mongoose.model('Achievement',achievement);
module.exports = {Student,ScietechPOR,CultPOR,SportsPOR,AcadPOR,Achievement};
