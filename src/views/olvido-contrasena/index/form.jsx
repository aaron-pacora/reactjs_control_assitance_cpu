import React, { Component } from 'react';

import Button from 'components/Button';
import RequestClient from 'utils/requestClient';

import CircularProgress from '@material-ui/core/CircularProgress';
import Snackbar from '@material-ui/core/Snackbar';

import KeyDownFormat from 'utils/keyDownFormat';

import validator from 'validator';

class Form extends Component {

   constructor() {
      super();
      this.handleClose = this.handleClose.bind(this);
      this.sendRequest = this.sendRequest.bind(this);
      this.state = {
         username : '',
         onFetch  : false,
         showError: false,
         msnError : "¡Correo no válido!",
         open     : false
      };
   }

   render() {
      return (
         <div className="p-f_pass-form e-shadow--3">
            <div className="p-f_pass-form-header">
               <div className="e-title">
                  <span>Olvido de Contraseña</span>
               </div>
               <div className="p-f_pass-form-content-img">
                  <img src="/static/logo_cpu.png" alt="Logo de CPU" onClick={() => {
                     window.location.href = "/";
                  }}/>
               </div>
            </div>
            <div className="p-f_pass-form-inputs">
               <input placeholder = "Correo electrónico"
                      onChange    = {(e) => { this.setState({ username: e.target.value }) }}
                      type        = "text"
                      value       = {this.state.username}
                      onKeyDown   = {(e) => { KeyDownFormat.formatEmail(e)}}
                      onKeyUp     = {(e) => {
                           if (e.keyCode == 13) {
                              this.sendRequest();
                           }
                        }}
                      className = "e-input" />
            </div>
            {this.showMessageError()}
            <div className="p-f_pass-form-content-button">
               {((() => {
                  if (this.state.onFetch === false) {
                     return <Button className="p-f_pass-form-button" onClick={this.sendRequest}>
                        Enviar Solicitud
                     </Button>;
                  } else {
                     return <CircularProgress className="e-progress" size={50} />
                  }
               }))()}
            </div>
            <Snackbar
               anchorOrigin = {{ vertical:'top', horizontal: 'right' }}
               open         = {this.state.open}
               onClose      = {this.handleClose}
               ContentProps = {{
                  'aria-describedby': 'message-id',
               }}
               message={<span id="message-id">¡El correo se envió exitosamente!</span>}
            />
         </div>
      )
   }

   handleClose() {
      this.setState({ open: false });
   };

   sendRequest() {
      let username = this.state.username;
      let validEmail = validator.isEmail(username);
      if (!validEmail) {
         this.setState({ showError: true });
         return;
      };
      this.setState({ onFetch: true });
      let params = { username };
      RequestClient.doQuery("/forgot-my-password", params).then((rpta) => {
         let obj = {};
         if (rpta.error != null){
            obj.showError = true;
            obj.msnError = rpta.error;
         }else{
            obj.open = true;
            setTimeout(() => { window.location.href = "/"; }, 3000);
         }
         obj.onFetch = false;
         this.setState(obj);
      });
   }

   showMessageError() {
      if (!this.state.showError) {
         return;
      }
      setTimeout(() => { this.setState({ showError: false, msnError: "¡Correo no válido!" }); }, 3000);
      return <div className="p-f_pass-form-msn_error">
         <span>{this.state.msnError}</span>
      </div>;
   }
}

export default Form;
