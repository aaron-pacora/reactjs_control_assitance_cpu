import React, { Component } from 'react';
import RequestServer from 'utils/requestServer';
import 'sass_pages/desarrollando-version-movil/index.sass';
import SvgMaintenance from 'icons/svg_maintenance.svg';

class DeveloperVersionMovile extends Component{

   static async getInitialProps(ctx) {
      let serverProps = { currentPage: "" };

      let genericData = await RequestServer.doQuery(ctx, "/generic-data");
      serverProps.genericData = genericData;
      return serverProps;
   }

   constructor(){
      super();
   }

   componentDidMount(){
      if (window.screen.width >= 760) {
         window.location.href = "/alumnos";
      }
   }

   render() {
      return (
          <div className="p-mobile">
            <div className="m-icon">
               <SvgMaintenance/>
            </div>
            <div className="m-text">
               <h4 className="m-t-title">
                  ¡Estamos preparando la versión móvil!
               </h4>
               <p className="m-t-paragraph">
                  El equipo de CPU estamos trabajando
                  duro para poder brindarles un mejor servicio.
               </p>
               <p className="m-t-paragraph">
                  Tenga un poco de paciencia y verá los resultados.
               </p>
            </div>
            <h6 className="m-atte">Atte. Equipo CPU</h6>
          </div>
      );
   }
}
export default DeveloperVersionMovile;