const mongoose = require('mongoose');

const scitech_por = new mongoose.Schema({
    club: { type:String, required:true},
    designation: { type:String, required:true},
    session: { type:String, required:true}
});

const cult_por = new mongoose.Schema({
    club: { type:String, required:true},
    designation: { type:String, required:true},
    session: { type:String, required:true}
});

const sport_por = new mongoose.Schema({
    club: { type:String, required:true},
    designation: { type:String, required:true},
    session: { type:String, required:true}
});

const acad_por = new mongoose.Schema({
    club: { type:String, required:true},
    designation: { type:String, required:true},
    session: { type:String, required:true}
});

const achievementSchema = new mongoose.Schema({
    under: { type:String, required:true},
    designation: { type:String, required:true},
    eventName: { type:String, required:true},
    conductedBy: { type:String, required:true},
});

const student = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    id:{
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
