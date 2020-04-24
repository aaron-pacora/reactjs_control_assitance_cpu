import React, { Component } from 'react';

import Form from 'views/olvido-contrasena/index/form';

import 'sass_pages/olvido-contrasena/index.sass';

class ForgotPassword extends Component {
   render() {
      return (
         <div className="p-forgot-password">
            <Form />
         </div>
      )
   }
}

export default ForgotPassword;
