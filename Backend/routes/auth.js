  const jwt_decode = require('jwt-decode');
  const express = require("express");
  const router = express.Router();
  const mongoose = require("mongoose");
  const { restrictToPresident, restrictToAdmin } = require("../middlewares");
  const  {Student,ScietechPOR,CultPOR,SportsPOR,AcadPOR} = require("../models/student");

  router.get('/',  function (req, res) {
    try {
      const jwtToken = req.cookies.credentials;
      const user = JSON.parse(req.headers['user-details']);
      const decoded = jwt_decode(jwtToken);
  
      const { username, password } = req.DB_credentials;
      const dbUri = `mongodb+srv://${username}:${password}@cosa-database.xypqv4j.mongodb.net/?retryWrites=true&w=majority`;
      mongoose.connect(dbUri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      })
        .then(async () => {
          console.log('Connected to MongoDB234');
          console.log("done");
          return res
            .status(201)
            .json({ success: true, message: "Student Added Successfully" });
        })
        .catch((error) => {
          console.error('MongoDB connection error:', error);
          return res.status(500).json({ success: false, message: "MongoDB connection error" });
        });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
  });

  router.post('/add', async (req, res) => {

    try {
      const jwtToken = req.cookies.credentials;
      // const user = JSON.parse(req.headers['user-details']);
      const decoded = jwt_decode(jwtToken);
    
      const { username, password } = req.DB_credentials;
        const student = new Student({
          name: req.body.name,
          ID_No: req.body.ID_No,
          Program: req.body.Program,
          discipline: req.body.discipline,
          pos_res: req.body.pos_res,
          add_year:req.body.add_year
        });
        pors = req.body.pos_res;
      
      
        const dbUri = `mongodb+srv://${username}:${password}@cosa-database.xypqv4j.mongodb.net/?retryWrites=true&w=majority`;
        mongoose.connect(dbUri, {
          useNewUrlParser: true,
          useUnifiedTopology: true,
          })
          .then(async () => {

          const st = await student.save();
          pors.forEach(element => {
            if(element.type == "AcademicPOR"){
              const acad_por = new AcadPOR({
                student:st,
                club: element.club,
                designation: element.designation,
                session: element.session
              });
              acad_por.save();
            }
            if(element.type == "CulturalsPOR"){
              const cult_por = new CultPOR({
                student:st,
                club: element.club,
                designation: element.designation,
                session: element.session
              });
              cult_por.save();
            }
            if(element.type == "SportsPOR"){
              const sport_por = new SportsPOR({
                student:st,
                club: element.club,
                designation: element.designation,
                session: element.session
              });
              sport_por.save();
            }
            if( element.type == "ScitechPOR"){
              const scitech_por = new ScietechPOR({
                student:st,
                club: element.club,
                designation: element.designation,
                session: element.session
              });
              
              scitech_por.save();
              console.log(scitech_por)
            }
          });
          mongoose.connection.close();
          console.log('MongoDB connection closed');
            return res
            .status(201)
            .json({ success: true, message: "Student Added Successfully" })

          })
          .catch((error) => {
          console.error('MongoDB connection error:', error);
          })
      } catch (error) {
        console.log(error);
        return res.status(400).json({ success: false, message: "process failed" });
      }
  });


  router.post('/remove',  async (req, res) => {
    try {

      const jwtToken = req.cookies.credentials;
      const user = JSON.parse(req.headers['user-details']);
      const decoded = jwt_decode(jwtToken);

      const { username, password } = req.DB_credentials;

      const dbUri = `mongodb+srv://${username}:${password}@cosa-database.xypqv4j.mongodb.net/?retryWrites=true&w=majority`;
      mongoose.connect(dbUri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        })
        .then(async() => {
        console.log('Connected to MongoDB234');
        const student = await Student.findOne({ID_No:req.body.ID_No});
        await Student.findByIdAndDelete((student._id));
        mongoose.connection.close();
        return res.status(200).json({ success: true, message: "Student Deleted Successfully" });
        })
        .catch((error) => {
        console.error('MongoDB connection error:', error);
        });
      } catch (error) {
        console.log(error);
        return res.status(400).json({ success: false, message: "process failed" });
      }
  });


  router.post('/update',  async (req, res) => {
    
    try {   
      const decoded = req.decoded;
     
      const { username, password, User } = req.DB_credentials;
      const data = req.body.data;
      const stud = data.student
      const PORs = req.body.editedData.PORS;
   
      console.log(PORs);
      const dbUri = `mongodb+srv://${username}:${password}@cosa-database.xypqv4j.mongodb.net/?retryWrites=true&w=majority`;
      await mongoose.connect(dbUri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        }).then(async() => {
          const student = await Student.findById((stud._id)).exec();;
          console.log(student)
          if(User =="President"){
           
            for (const element of PORs){
              if(element.type == 'Scitech-POR'){
                await ScietechPOR.findByIdAndUpdate(element._id,{
                  student:student,
                  club: element.club,
                  designation:element.designation,
                  session:element.session
                }, { new: true, upsert: true })
                .exec();
              }
              else if(element.type == 'Cult-POR'){
                await CultPOR.findByIdAndUpdate(element._id,{
                  student:student,
                  club: element.club,
                  designation:element.designation,
                  session:element.session
                }, { new: true, upsert: true })
                .exec();
              }
              else if(element.type == 'Sport-POR'){
                await SportsPOR.findByIdAndUpdate(element._id,{
                  student:student,
                  club: element.club,
                  designation:element.designation,
                  session:element.session
                },{ new: true, upsert: true })
                .exec();
              }
              else if(element.type == 'Acad-POR'){
                await AcadPOR.findByIdAndUpdate(element._id,{
                  student:student,
                  club: element.club,
                  designation:element.designation,
                  session:element.session
                }, { new: true, upsert: true })
                .exec();
              }
            };
          }
          if (User == 'Gensec_Scitech'){
            for (const element of PORs)  {
              if(element.type == 'Scitech-POR'){
                await ScietechPOR.findByIdAndUpdate(element._id,{
                  student:student,
                  club: element.club,
                  designation:element.designation,
                  session:element.session
                }, { new: true, upsert: true })
                .exec();
              }
            };
          }
          if (User == 'Gensec_Cult'){
            for (const element of PORs) {
              if(element.type == 'Cult-POR'){
                await CultPOR.findByIdAndUpdate(element._id,{
                  student:student,
                  club: element.club,
                  designation:element.designation,
                  session:element.session
                }, { new: true, upsert: true })
                .exec();
              }
            };
          }
          if (User == 'Gensec_Sport'){
            for (const element of PORs) {
              for (const element of PORs) {
                await  SportsPOR.findByIdAndUpdate(element._id,{
                  student:student,
                  club: element.club,
                  designation:element.designation,
                  session:element.session
                }, { new: true, upsert: true })
                .exec();
              }
            };
          }
          if (User == 'Gensec_Acad'){
            for (const element of PORs) {
              if(element.type == 'Acad-POR'){
                await AcadPOR.findByIdAndUpdate(element._id,{
                  student:student,
                  club: element.club,
                  designation:element.designation,
                  session:element.session
                }, { new: true, upsert: true })
                .exec();
              }
            };
          }
            await mongoose.connection.close();
            return res.status(200).json({ success: true, message: "Data Updated Successfully" });
        })
        .catch((error) => {
          console.error('MongoDB connection error:', error);
          });



      } catch (error) {
        console.log(error);
        return res.status(400).json({ success: false, message: "process failed" });
      }
  });


    module.exports = router;

