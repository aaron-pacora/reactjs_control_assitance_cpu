import React, { Component } from 'react';

import fn from 'utils/functions';
import './index.sass';

class Card extends Component {
   constructor(props) {
      super(props);
      this.elevation = "e-shadow--"+fn.existsValue(this.props.elevation, 1);
      this.className = " " + this.elevation + " " + fn.existsValue(this.props.className, "");
      this.state = {
         reload: false
      };
   }

   componentWillReceiveProps(newProps){
      this.elevation = "e-shadow--" + fn.existsValue(newProps.elevation, 1);
      this.className = " " + this.elevation + " " + fn.existsValue(newProps.className, "");
      this.setState({
         reload: true
      });
   }


   render() {
      return (
         <div className={"c-card" + this.className}>
            {this.props.children}
         </div>
      )
   }
}

export default Card;
