import React, { Component } from 'react';

import RequestServer from 'utils/requestServer';
import Form from 'views/tipos-de-usuario/index/form';

import 'sass_pages/tipos-de-usuario/index.sass';

class TypeUsers extends Component {

   static async getInitialProps(ctx) {
      let serverProps = { currentPage: "types_user" };
      let typeUsers = await RequestServer.doQuery(ctx, "/types_user");
      let allModules = await RequestServer.doQuery(ctx, "/all_modules");
      serverProps.data = typeUsers;
      serverProps.allModules = allModules;
      let genericData = await RequestServer.doQuery(ctx, "/generic-data");
      serverProps.genericData = genericData;
      return serverProps;
   }

   constructor(props) {
      super(props);
      this.data = props.data;
      this.allModules = props.allModules;
   }

   componentDidMount() {
      // if (window.screen.width < 760) {
      //    window.location.href = "/desarrollando-version-movil";
      // }
   }

   render() {
      return (
         <div className="p-types_user">
            <Form data={this.data} modules={this.allModules}/>
         </div>
      )
   }
}

export default TypeUsers;
