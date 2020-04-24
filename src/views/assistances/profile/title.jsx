import React from "react";
import Button from 'components/Button/index'

export default class  Title extends React.Component {
   render(){
      return (
         <div className="p-header">
               <div className="p-header__title e-title">Asistencias | {this.props.fullName}</div>
               <Button className="p-header__button" onClick={this.handleClick}>Volver</Button>
            </div>

      );
   }
   handleClick = ()=>{
      window.location="/asistencias";
   }
}

