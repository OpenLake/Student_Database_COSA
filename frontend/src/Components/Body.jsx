import { useState, useContext, useEffect } from "react";
import { AdminContext } from "../App";
import Card from "../Components/Card";
import { fetchStudent } from "../services/utils";

function Body({ studentDetails }) {
  const { IsUserLoggedIn } = useContext(AdminContext);
  const [userDetails, setUserDetails] = useState(null);
  useEffect(() => {
    fetchStudent(IsUserLoggedIn.ID_No).then((data) => {
      if (data) setUserDetails(data);
      else window.location.href = "/add-profile";
    });
  }, [IsUserLoggedIn.ID_No]);
  return (
    <div>
      {studentDetails !== undefined ? (
        studentDetails !== null ? (
          <>
            <p
              style={{
                textAlign: "center",
                fontSize: "1.5em",
                fontWeight: "bold",
                textDecoration: "underline",
              }}
            >
              Search Results
            </p>
            <Card data={studentDetails} />
          </>
        ) : (
          <p
            style={{
              textAlign: "center",
              fontSize: "1.5em",
              fontWeight: "bold",
            }}
          >
            No results found
          </p>
        )
      ) : userDetails ? (
        <>
          <p
            style={{
              textAlign: "center",
              fontSize: "1.5em",
              fontWeight: "bold",
              textDecoration: "underline",
            }}
          >
            Your Student Profile
          </p>
          <Card data={userDetails} />
        </>
      ) : (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            fontSize: "2em",
            height: "100%",
            fontWeight: "bold",
            color: "#555",
          }}
        >
          Your student profile doesn't exist yet, contact admins.
        </div>
      )}

      {/* {IsUserLoggedIn && studentDetails && <UpdateCards studentDetails={studentDetails} />} */}
    </div>
  );
}

export default Body;
