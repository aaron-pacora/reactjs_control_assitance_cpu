import React, { Component } from 'react';

import Button from 'components/Button';

import RequestClient from 'utils/requestClient';
import KeyDownFormat from 'utils/keyDownFormat';

import CircularProgress from '@material-ui/core/CircularProgress';

import validator from 'validator';

class Form extends Component {

   constructor() {
      super();
      this.doLogin = this.doLogin.bind(this);
      this.state = {
         username : '',
         password : '',
         onFetch  : false,
         showError: false
      };
   }

   render() {
      return (
         <div className="p-login-form e-shadow--3">
            <div className="p-login-form-header">
               <div className="e-title">
                  <span>Iniciar Sesión</span>
               </div>
               <div className="p-login-form-content-img">
                  <img src="/static/logo_cpu.png" alt="Logo de CPU"/>
               </div>
            </div>
            <div className="p-login-form-inputs">
               <input placeholder = "Correo electrónico"
                      onChange    = {(e) => { this.setState({ username: e.target.value })}}
                      type        = "text"
                      onKeyDown   = {(e) => { KeyDownFormat.formatEmail(e)}}
                      value       = {this.state.username}
                      className   = "e-input"/>
               <input placeholder = "Contraseña"
                      type        = "password"
                      onChange    = {(e) => { this.setState({ password: e.target.value }) }}
                      value       = {this.state.password}
                      onKeyUp     = {(e) => {
                        if(e.keyCode == 13){
                           this.doLogin();
                        }
                      }}
                      className = "e-input"/>
            </div>
            {this.showMessageError()}
            <div className="p-login-forgot">
               <span className="p-login-msn-forgot" onClick={()=>{
                  window.location.href = "/olvido-contrasena";
               }}>¿Ha olvidado su contraseña?</span>
            </div>
            <div className="p-login-form-content-button">
               {((()=>{
                  if (this.state.onFetch === false){
                     return <Button className="p-login-form-button" onClick={this.doLogin}>
                        Iniciar Sesión
                     </Button>;
                  }else{
                     return <CircularProgress className="e-progress" size={50} />
                  }
               }))()}
            </div>
         </div>
      )
   }

   doLogin(){
      let username = this.state.username;
      let password = this.state.password;
      let validEmail = validator.isEmail(username);
      let validPassword = (password != '' && password.length >= 8);
      if (!(validEmail && validPassword)) {
         this.setState({ showError: true });
         return;
      };
      this.setState({ onFetch: true });
      let params = {
         username, password
      };
      RequestClient.doQuery("/user/login", params).then((rpta) => {
         let obj = {};
         if (rpta.isValid === true) {
            let hash = rpta.hash;
            Cookies.set('_scpu', hash);
            window.location.href = "/";
         } else {
            obj.showError = true;
            obj.onFetch = false;
         }
         this.setState(obj);
      });
   }

   showMessageError(){
      if(!this.state.showError){
         return;
      }
      setTimeout(() => { this.setState({ showError: false }); }, 2500);
      return <div className="p-login-form-msn_error">
         <span>Datos no válidos.</span>
      </div>;
   }
}

export default Form;
