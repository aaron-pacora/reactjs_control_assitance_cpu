import React, { Component } from 'react';

import Form from 'views/cambiar-contrasena/index/form';

import RequestServer from 'utils/requestServer';

import 'sass_pages/cambiar-contrasena/index.sass';

class ChangePassword extends Component {

   static async getInitialProps(ctx) {
      let serverProps = { currentPage: "-", showMenu: false};
      let genericData = await RequestServer.doQuery(ctx, "/generic-data");
      serverProps.genericData = genericData;
      return serverProps;
   }

   constructor() {
      super();
   }

   componentDidMount() {
      // if (window.screen.width < 760) {
      //    window.location.href = "/desarrollando-version-movil";
      // }
   }

   render() {
      return (
         <div className="p-change-password">
            <Form/>
         </div>
      )
   }
}

export default ChangePassword;
