import React, { Component } from 'react';

import Button from 'components/Button';

class Confirmation extends Component {

   constructor(props) {
      super(props);
      this.password = props.password;
   }

   render() {
      return (
         <div className="p-recovery-content e-shadow--3">
            <div className="p-recovery-header">
               <div className="e-title">
                  <span>Confirmación de Recuperación de Cuenta</span>
               </div>
            </div>
            <div className="p-recovery-description">
               <span>¡Hola! Hemos confirmado su petición de recuperación de cuenta por olvido de contraseña. Esta es su nueva contraseña</span>
            </div>
            <div className="p-recovery-code">
               <span>{this.password}</span>
            </div>
            <div className="p-recovery-description p-recovery-description--size_min">
               <span>Es recomendable ingresar al sistema y cambiar su contraseña. Esta página ya no podrá ser accedida.</span>
            </div>
            <div className="p-recovery-content-container-button">
               <Button className="p-recovery-content-button" onClick={() => { window.location.href = "/"; }}>
                  Ir al Inicio de Sesión
               </Button>
            </div>
         </div>
      )
   }
}

export default Confirmation;
