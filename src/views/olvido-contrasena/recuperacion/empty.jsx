import React, { Component } from 'react';

import Button from 'components/Button';

class Empty extends Component {

   constructor() {
      super();
   }

   render() {
      return (
         <div className="p-recovery-content e-shadow--3">
            <div className="p-recovery-header">
               <div className="e-title">
                  <span>¡El código no existe o no está disponible!</span>
               </div>
            </div>
            <div className="p-recovery-description p-recovery-description--center">
               <span>Este enlace no puede procesar código ya usado o vencido.</span>
            </div>
            <div className="p-recovery-content-container-button">
               <Button className="p-recovery-content-button" onClick={() => { window.location.href = "/";}}>
                  Volver al Login
               </Button>
            </div>
         </div>
      )
   }
}

export default Empty;
