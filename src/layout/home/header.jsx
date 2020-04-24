import React, { Component } from 'react';

import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import CircularProgress from '@material-ui/core/CircularProgress';

import RequestClient from 'utils/requestClient';

import SvgSettings from 'icons/svg_settings.svg';

class Header extends Component {
   constructor() {
      super();
      this.state = {
         doLogout: false
      }
   }

   state = {
      anchorEl: null,
   };

   handleClick = event => {
      this.setState({ anchorEl: event.currentTarget });
   };

   handleClose = () => {
      this.setState({ anchorEl: null });
   };

   render() {
      const { anchorEl } = this.state;
      return (
         <div className="l-header e-shadow--2">
            <div className="l-header-cpu">
               <img src={"/static/logo_cpu.png"} alt=""/>
            </div>
            <div className="l-header-icon">
               <Menu
                  id       = "simple-menu"
                  anchorEl = {anchorEl}
                  open     = {Boolean(anchorEl)}
                  onClose  = {this.handleClose}
               >
                  <MenuItem onClick={() => { window.location.href = "/cambiar-contrasena" }}>Cambiar Contraseña</MenuItem>
                  <MenuItem onClick={() => { this.handleClose(); this.doCloseSesion(); }}>Cerrar Sesión</MenuItem>
               </Menu>
               <div className="e-icon" onClick={this.handleClick}>
                  <SvgSettings/>
               </div>
            </div>
            {(()=>{
               if (this.state.doLogout){
                  return <div className="l-header--background">
                     <CircularProgress className="e-progress" size={100} />
                  </div>
               }
            })()}
         </div>
      )
   }

   doCloseSesion(){
      this.setState({doLogout: true});
      RequestClient.doLogout(Cookies);
   }
}

export default Header;
