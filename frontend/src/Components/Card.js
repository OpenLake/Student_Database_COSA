import React from "react";
import {Card, CardTitle, CardText,Button} from 'reactstrap';


function Cards() {
    return (
      <div style={{textAlign:"center", width:"75%", marginLeft: "13%"}}>
        
                <Card body>
                    <CardTitle tag="h5">
                        Achievements and POR
                    </CardTitle>
                    <CardText>
                    <br></br><br></br><br></br>
                        With supporting text below as a natural lead-in to additional content.
                        With supporting text below as a natural lead-in to additional content.
                        <br></br><br></br><br></br><br></br>
                        With supporting text below as a natural lead-in to additional content.
                        With supporting text below as a natural lead-in to additional content.
                        With supporting text below as a natural lead-in to additional content.
                        With supporting text below as a natural lead-in to additional content.<br></br>
                        With supporting text below as a natural lead-in to additional content.
                        
                    </CardText>
                    <Button style={{backgroundColor: "#419197"}}>
                        Exit
                    </Button>
                </Card>
            
      </div>
    );
  }
  
  export default Cards;
  