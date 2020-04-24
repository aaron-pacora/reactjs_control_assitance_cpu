import React, { Component } from 'react';

import KeyDownFormat from 'utils/keyDownFormat';

class Filter extends Component {

   constructor(props) {
      super(props);
      this.doFilter = this.doFilter.bind(this);
      this.state = {
         filter: {
            text    : "",
            group_id: 1
         }
      };
      this.onChangeFilter = props.onChangeFilter;
      this.onWriting      = props.onWriting;
      this.beforeFilter   = "";
      this.controlTime    = "";
   }

   doFilter(){
      let filter = this.state.filter.text.trim().replace(/  +/g, ' ');
      if (this.beforeFilter != filter){
         this.beforeFilter = filter;
         this.onChangeFilter(this.state.filter);
      }else{
         this.onWriting(false);
      }
   }

   render() {
      return (
         <div className="p-student-filter">
            <input className   = "e-input"
                   placeholder = "Buscar Alumno"
                   type        = "text"
                   value       = {this.state.filter.text}
                   onKeyDown   = {(e) => { KeyDownFormat.formatText(e)}}
                   onChange    = {(e)=>{
                     clearTimeout(this.controlTime);
                     let filter = this.state.filter;
                     this.onWriting(true);
                     filter.text = e.target.value;
                     this.setState({filter});
                     this.controlTime = setTimeout(this.doFilter, 450);
                  }}/>
         </div>
      )
   }
}

export default Filter;
