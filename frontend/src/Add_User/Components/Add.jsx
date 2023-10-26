import './Add.css';

import React, { Component } from 'react';
import Card from './Card'; // Import the Card component

class Add extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isCardVisible: false,
    };
  }

  toggleCardVisibility = () => {
    this.setState((prevState) => ({
      isCardVisible: !prevState.isCardVisible,
    }));
  };
  
  


  render() {
    return (
      <div style={{ textAlign: "center", margin: "10px"}}>
        
        <button onClick={this.toggleCardVisibility}  className={'Add_user'}>Add User</button>
        {this.state.isCardVisible && <Card />}
      </div>
    );
  }
}

export default Add;
