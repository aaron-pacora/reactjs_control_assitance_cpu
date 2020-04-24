import React, { Component } from 'react';

import Button from 'components/Button';
import RequestClient from 'utils/requestClient';

import CircularProgress from '@material-ui/core/CircularProgress';

class Form extends Component {

   constructor() {
      super();
      this.executeChangePassword = this.executeChangePassword.bind(this);
      this.repeat_password = React.createRef();
      this.password        = React.createRef();
      this.state = {
         currentPassword: '',
         newPassword    : '',
         repeatPassword : '',
         onFetch        : false,
         showError      : false,
         showSuccess    : false,
         isOlder : false
      };
   }

   render() {
      return (
         <div className="p-change-password-form e-shadow--3">
            <div className="p-change-password-form-header">
               <div className="e-title">
                  <span>Cambiar contraseña</span>
               </div>
            </div>
            <div className="p-change-password-form-inputs">
               <input placeholder = "Contraseña Actual"
                      onChange    = {(e) => { this.setState({ currentPassword: e.target.value }) }}
                      type        = "password"
                      onPaste     = {(e)=>{e.preventDefault()}}
                      value       = {this.state.currentPassword}
                      onKeyUp     = {(e) => {
                        if(e.keyCode == 13){
                           this.password.current.focus();
                        }
                      }}
                      className   = "e-input" />
               <input placeholder = "Nueva Contraseña"
                      type        = "password"
                      onPaste     = {(e)=>{e.preventDefault()}}
                      onChange    = {(e) => { this.setState({ newPassword: e.target.value }) }}
                      value       = {this.state.newPassword}
                      ref         = {this.password}
                      onKeyUp     = {(e) => {
                        if(e.keyCode == 13){
                           this.repeat_password.current.focus();
                        }
                      }}
                      className   = "e-input" />
               <input placeholder = "Repita Contraseña"
                      type        = "password"
                      ref         = {this.repeat_password}
                      onPaste     = {(e)=>{e.preventDefault()}}
                      onChange    = {(e) => { this.setState({ repeatPassword: e.target.value }) }}
                      value       = {this.state.repeatPassword}
                      onKeyUp     = {(e) => {
                        if(e.keyCode == 13){
                           this.executeChangePassword();
                        }
                      }}
                      className   = "e-input" />
            </div>
            {this.showMessageError()}
            {this.showMessageChanged()}
            <div className="p-change-password-form-content-button">
               {((() => {
                  if (this.state.onFetch === false) {
                     return <Button className="p-change-password-form-button" onClick={this.executeChangePassword}>
                        Guardar
                     </Button>;
                  } else {
                     return <CircularProgress className="e-progress" size={50} />
                  }
               }))()}
            </div>
         </div>
      )
   }

   executeChangePassword(){
      let params = {
         currentPassword: this.state.currentPassword,
         newPassword: this.state.newPassword,
         repeatPassword: this.state.repeatPassword,
      }
      let isValid = true;
      for (const key in params) {
         if (params.hasOwnProperty(key)) {
            const password = params[key];
            isValid &= (password != '' && password.length >= 8);
         }
      }
      let updateState = {
         currentPassword: '',
         newPassword: '',
         repeatPassword: '',
      }
      if (isValid === 0) {
         updateState.showError = true;
         this.setState(updateState);
         return;
      }
      if (params.repeatPassword != params.newPassword) {
         this.setState({ showError: true });
         return;
      }
      this.setState({ onFetch: true });
      RequestClient.doQuery("/user/change-password", params).then((rpta) => {
         updateState.onFetch = false;
         updateState.isOlder = rpta.older == true;
         let isChanged = rpta.isChanged;
         updateState.showSuccess = isChanged;
         if (isChanged == false) {
            updateState.showError = true;
         } else {
            setTimeout(() => {
               RequestClient.doLogout(Cookies);
            }, 2000);
         }
         this.setState(updateState);
      });
   }

   showMessageError() {
      if (!this.state.showError) {
         return;
      }
      let msn = "Datos no válidos. ¡Reintente!";
      if(this.state.newPassword !== this.state.repeatPassword){
         msn = "La nueva contraseña no coinciden.";
      }
      if(this.state.isOlder){
         msn = "La nueva contraseña no puede ser igual a la actual";
      }
      setTimeout(() => { this.setState({ showError: false }); }, 2500);
      return <div className="p-change-password-form-msn p-change-password-form-msn--error">
         <span>{msn}</span>
      </div>;
   }

   showMessageChanged() {
      if (!this.state.showSuccess) {
         return;
      }
      setTimeout(() => { this.setState({ showSuccess: false }); }, 2500);
      return <div className="p-change-password-form-msn p-change-password-form-msn--success">
         <span>¡Se actualizó contraseña! Vuelva a logearse.</span>
      </div>;
   }
}

export default Form;
