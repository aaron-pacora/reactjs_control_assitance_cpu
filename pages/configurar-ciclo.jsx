import React, { Component } from 'react';

import Body from 'views/configurar-ciclo/body';
import RequestServer from 'utils/requestServer';

import 'sass_pages/configurar-ciclo/index.sass';

class ConfigCycle extends Component {

   static async getInitialProps(ctx) {
      let serverProps = { currentPage: "cycle"};
      let dataCycle = await RequestServer.doQuery(ctx, "/configure-cycle");
      serverProps.cycleData = dataCycle;
      let genericData = await RequestServer.doQuery(ctx, "/generic-data");
      serverProps.genericData = genericData;
      return serverProps;
   }

   constructor(props) {
      super(props);
      this.updateData = this.updateData.bind(this);
      this.state  = {
         dataCycle: props.cycleData
      }
   }

   updateData(data){
      this.setState({dataCycle:data});
   }

   componentDidMount() {
      // if (window.screen.width < 760) {
      //    window.location.href = "/desarrollando-version-movil";
      // }
   }

   render() {
      return (
         <div className="p-conf_cycle">
            <div className="e-title">Configuración del Ciclo</div>
            <Body dataCycle={this.state.dataCycle} updateData = {this.updateData}/>
         </div>
      )
   }
}

export default ConfigCycle;
