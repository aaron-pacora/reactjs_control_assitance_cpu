import React, { Component } from 'react';
import Button from 'components/Button';

import RequestClient from 'utils/requestClient';

import Snackbar from '@material-ui/core/Snackbar';
import { isThisQuarter } from 'date-fns';

class Body extends Component {

   constructor(props) {
      super(props);
      this.onSaveCycle = this.onSaveCycle.bind(this);
      this.handleClick = this.handleClick.bind(this);
      this.handleClose = this.handleClose.bind(this);
      this.status = false;
      this.updateData = this.props.updateData;
      this.state = {
         dataCycle: props.dataCycle,
         open     : false,
         isCorrect: true,
      }
   }

   componentWillReceiveProps(props){
      this.setState({dataCycle:props.dataCycle});
   }

   getToday(status){
      if (this.state.dataCycle == null) {
         var today = new Date();
         var dd = today.getDate();
         if (dd < 10) {
            dd = "0"+dd;
         }
         var mm = today.getMonth() + 1; //January is 0!
         var yyyy = today.getFullYear();
         switch (status) {
            case 1:
               var dd = today.getDate()+1;
               if (dd < 10) {
                  dd = "0"+dd;
               }
               break;
            case 2:
               var mm  = today.getMonth() + 5; //January is 0!
               if (mm > 12) {
                  mm = mm - 12;
                  var yyyy = today.getFullYear()+1;
               }
               if (mm < 10) {
                  mm = "0"+mm;
               }
               break;
         }
         return yyyy+"-"+mm+"-"+dd
      } else {
         switch(status){
            case 1:
               return this.state.dataCycle.start;
            case 2:
               return this.state.dataCycle.finish;
         }
      }
   }

   enableInput(type){
      if (this.state.dataCycle != null) {
         var today = new Date();
         var dd = today.getDate();
         if (dd < 10) {
            dd = "0" + dd;
         }
         var mm = today.getMonth() + 1; //January is 0!
         var yyyy = today.getFullYear();
         var date = yyyy + "-" + mm + "-" + dd
         let finishDate = new Date(this.state.dataCycle.finish);
         let todayDate = new Date(date);
         if (finishDate.getTime() >= todayDate.getTime()) {
            if (!this.status) {
               switch(type){
                  case "input":
                     return "readOnly";
                  case "button":
                     return "disabled";
               }
            }
         } else {
            return "";
         }
      } else {
         return "";
      }
   }

   render() {
      let dataCycle    = this.state.dataCycle;
      let { open }     = this.state;
      let classSuccess = this.state.isCorrect ? 'success' : 'error';
      let msnSuccess   = this.state.isCorrect ? 'Guardado Exitoso' : 'Ha ocurrido un problema. Reintente.';
      return (
         <div className={"p-conf_cycle-body " + classSuccess}>
            <form action="">
               <div className= "c-input-form">
                  <span>Nombre del ciclo:</span>
                  <input type="text" placeholder="Ciclo"
                     readOnly = {this.enableInput("input")}
                     className="e-input e-input--uppercase"
                     onChange={(e)=>{
                        this.status = true;
                        dataCycle.name = e.target.value;
                        this.setState(dataCycle);
                     }}
                     value={dataCycle.name}/>
               </div>
               <div className="c-input-form c-input-date">
                  <span>Seleccione el Inicio del ciclo:</span>
                  <input type="date" name="date_init" id="date_init" defaultValue={this.getToday(1)} min={this.getToday(1)}
                     readOnly =  {this.enableInput("input")}
                     onChange={(e)=>{
                        this.status = true;
                        let dataCycle = this.state.dataCycle;
                        dataCycle.start = e.target.value;
                        this.setState(dataCycle);
                     }}
                        />
               </div>
               <div className="c-input-form c-input-date">
                  <span>Seleccione el Fin del ciclo:</span>
                  <input type="date" name="date_end" id="date_end" min={this.getToday(1)} defaultValue={this.getToday(2)}
                     readOnly= {this.enableInput("input")}
                     onChange={(e)=>{
                        this.status = true;
                        let dataCycle = this.state.dataCycle;
                        dataCycle.finish = e.target.value;
                        this.setState(dataCycle);
                     }}
                  />
               </div>
               <Button className={this.enableInput("button")} onClick={this.onSaveCycle}>
                  <div>Guardar</div>
               </Button>
               <p className="c-text">No se podrá editar el ciclo hasta que se culmine.</p>
            </form>
            <Snackbar
               anchorOrigin = {{ vertical:'top', horizontal: 'right' }}
               open         = {open}
               onClose      = {this.handleClose}
               ContentProps = {{
                  'aria-describedby': 'message-id',
               }}
               message={<span id="message-id">{msnSuccess}</span>}
            />
         </div>
      )
   }

   handleClick() {
      this.setState({ open: true });
   };

   handleClose() {
      this.setState({ open: false });
   };

   onSaveCycle(){
      let params = {
         newData: this.state.dataCycle
      }
      RequestClient.doQuery("/configure-cycle/save", params).then((rpta) => {
         this.handleClick();
         this.status = false;
         this.setState({ isCorrect: rpta.isCorrect});
         this.updateData(rpta.data);
      });
   }
}

export default Body;
