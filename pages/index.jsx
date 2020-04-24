import React, { Component } from 'react';

import Form from 'views/index/form';

import 'sass_pages/index.sass';

class Login extends Component {

   static async getInitialProps(ctx) {
      // Request.redirectLogin(ctx);
   }

   constructor() {
      super();
   }

   componentDidMount(){
      Cookies.set('_sw', window.screen.width);
   }

   render() {
      return (
         <div className="p-login">
            <Form/>
         </div>
      )
   }
}

export default Login;
