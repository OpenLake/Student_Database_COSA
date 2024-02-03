import Card from "../Components/Card";

function Body({ studentDetails }) {
  return (
    <div>
      {studentDetails && <Card data={studentDetails} />}

      {/* {IsUserLoggedIn && studentDetails && <UpdateCards studentDetails={studentDetails} />} */}
    </div>
  );
}

export default Body;
