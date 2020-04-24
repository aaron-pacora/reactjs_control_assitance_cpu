import React, { Component } from 'react';

import RequestServer from 'utils/requestServer';
import Form from 'views/usuarios/index/form';

import 'sass_pages/usuarios/index.sass';

class Users extends Component {

   static async getInitialProps(ctx) {
      let serverProps = { currentPage: "users" };

      let data                    = await RequestServer.doQuery(ctx, "/user/list");
          serverProps.data        = data.listUser;
          serverProps.typeUsers   = data.typeUsers;
      let genericData             = await RequestServer.doQuery(ctx, "/generic-data");
          serverProps.genericData = genericData;
      return serverProps;
   }

   constructor(props) {
      super(props);
      this.data = props.data;
      this.typeUsers = props.typeUsers;
   }

   componentDidMount() {
      // if (window.screen.width < 760) {
      //    window.location.href = "/desarrollando-version-movil";
      // }
   }

   render() {
      return (
         <div className="p-users">
            <Form data={this.data} typeUsers={this.typeUsers}/>
         </div>
      )
   }
}

export default Users;
