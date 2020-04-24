import React, { Component } from 'react'
import RequestServer from 'utils/requestServer';
import Title from 'views/assistances/profile/title';

import Galery from 'views/assistances/profile/galery';
import Footer from 'views/assistances/profile/footer';
import 'src/sass/pages/assistances/profile.sass';

export default class profile extends Component {
   static getInitialProps = async (context) => {

      let serverProps = { currentPage: "asistance" };
      let genericData = await RequestServer.doQuery(context, "/generic-data");
      const id = context.query.id;
      const data = {id}
      const response = await RequestServer.doQuery(context,"/student/show-assists",data);
      return {
         student: response?response.student:null,
         assists: response?response.assists:null,
         currentPage: serverProps.currentPage,
         genericData
      }
   }

   componentDidMount() {
      // if (window.screen.width < 760) {
      //    window.location.href = "/desarrollando-version-movil";
      // }
   }

   render() {
      return (
         <div className="p-assist-profile">
            <Title fullName={
                           this.props.student!==null?
                           this.props.student.full_name:
                           "No hay resultados para esta busqueda"
                        }/>
            {
               (()=>{
                  if (this.props.student!==null) {
                     return <React.Fragment>
                           <Galery data={this.props.assists}/>
                           <Footer />
                        </React.Fragment>
                  }else{
                     return <div className="h-message--info">
                        Error 404
                     </div>
                  }
               })()

            }
         </div>
      )
   }
}






