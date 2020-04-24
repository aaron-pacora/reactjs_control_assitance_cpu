import React, { Component } from 'react';

import fn from 'utils/functions';
import './index.sass';

class Input extends Component {
   constructor(props) {
      super(props);
      this.onFocusInput = this.onFocusInput.bind(this);
      this.onBlurInput  = this.onBlurInput.bind(this);

      this.className = " " + fn.existsValue(props.className, "");
      this.type      = fn.existsValue(props.type, "text");
      this.name      = fn.existsValue(props.name, "");
      this.id        = fn.existsValue(props.id, "");
      this.state = {
         classFocus: ""
      }
   }
   onFocusInput(){
      this.setState({
         classFocus : "c-input--focus"
      });
   }
   onBlurInput(){
      this.setState({
         classFocus: ""
      });
   }
   render() {
      return (
         <div className={"c-input" + this.className + " " + this.state.classFocus}
            onFocus={this.onFocusInput}
            onBlur={this.onBlurInput}
            >
            <input type={this.type} name={this.name} id={this.id}/>
         </div>
      )
   }
}

export default Input;
