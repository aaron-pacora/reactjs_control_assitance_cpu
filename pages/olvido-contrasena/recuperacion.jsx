import React, { Component } from 'react';

import Empty from 'views/olvido-contrasena/recuperacion/empty';
import Confirmation from 'views/olvido-contrasena/recuperacion/confirmation';

import Fn from 'utils/functions';
import RequestServer from 'utils/requestServer';

import 'sass_pages/olvido-contrasena/recuperacion.sass';

class Recovery extends Component {

   static async getInitialProps(ctx) {
      let serverProps = { areEmpty: true };
      let code = Fn.existsValue(ctx.query.code, null);
      if (code == null){
         return serverProps;
      }
      let responsePassword = await RequestServer.doQuery(ctx, "/generate-password", {code});
      if (!responsePassword.exists){
         return serverProps;
      }
      serverProps.areEmpty = false;
      serverProps.password = responsePassword.password;
      return serverProps;
   }

   constructor(props){
      super(props);
      this.areEmpty = props.areEmpty;
      this.password = props.password;
   }

   render() {
      return (
         <div className="p-recovery">
            {(()=>{
               if (this.areEmpty){
                  return <Empty />;
               }
               return <Confirmation password={this.password} />;
            })()}
         </div>
      )
   }
}

export default Recovery;
