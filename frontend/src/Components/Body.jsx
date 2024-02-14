import { useState, useContext, useEffect } from "react";
import { AdminContext } from "../App";
import Card from "../Components/Card";
import UpdateCards from "../Add_User/Components/Update";
import IssueCards from "../Add_User/Components/RaiseIssue";
import { fetchStudent } from "../services/utils";

function Body({ studentDetails }) {
  const { IsUserLoggedIn } = useContext(AdminContext);
  const [userDetails, setUserDetails] = useState(null);
  useEffect(() => {
    fetchStudent(IsUserLoggedIn.ID_No).then((data) => {
      setUserDetails(data);
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
            {IsUserLoggedIn.role === "user" ? (
              <Card data={studentDetails} />
            ) : (
              <UpdateCards studentDetails={studentDetails} />
            )}
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
          {IsUserLoggedIn.role === "user" ? (
            <IssueCards studentDetails={userDetails} />
          ) : (
            <UpdateCards studentDetails={userDetails} />
          )}
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
