import React from 'react';
import PropTypes from 'prop-types';

import 'sass_pages/assistances/index.sass'
import 'sass_pages/assistances/m-assistances.sass';
import Head from 'views/assistances/head'
import Table from 'views/assistances/table'
import TableMobile from 'views/assistances/m-assistance/table'
import RequestClient from "utils/requestClient";
import  RequestServer  from "utils/requestServer";
import Footer from "views/assistances/footer"
import { withRouter } from "next/router";
import Pagination from 'components/Pagination/index';
import CircularProgress from '@material-ui/core/CircularProgress';

class  Assists extends React.Component{
   static getInitialProps = async (ctx)=>{

      let serverProps = { currentPage: "asistance" };
      serverProps.groups   = [];
      serverProps.students = [];
      let genericData = await RequestServer.doQuery(ctx, "/generic-data");
      const paginator_default ={quantity:0, per_page:10, page:1};
      const groups   = await RequestServer.doQuery(ctx,"/group");
      const  request = {name: groups[0].name , paginator:paginator_default}
      const response= await RequestServer.doQuery(ctx,"/assists",request);
      const name = groups[0].name
      const {paginator,students} = response;


      serverProps = {
         currentPage: "asistance",
         genericData,
         groups,
         paginator,
         students,
         name
      }

      return serverProps;
0
   }
   constructor(props){
      super(props);
      this.state= {
         students: props.students,
         name: props.name,
         paginator : {...props.paginator}
      }
   }

   componentDidMount() {
      // if (window.screen.width < 760) {
      //    window.location.href = "/desarrollando-version-movil";
      // }
   }

   componentDidUpdate(prevProps,prevState){
      if(this.state.name!==prevState.name){
         this.updateStudents();
      }
   }
   render() {
      let { groups, genericData} = this.props;
      let { students } = this.state;


      return(
         <div className="p-assistances">
            <Head options        = {groups.map(el=>el.name)}
                  updateStudents = {this.updateNameGroup}/>
            {
               (()=>{
                  if (students==="loading") {
                  
                     return <div className="c-circular-progress-container">
                        <CircularProgress className="c-circular-progress"/>
                     </div>
                  }else if ( students instanceof Array &&students.length){

                     return <React.Fragment>
                              <div className="container-table">
                              <Table students       = {students}
                                    {...this.state.paginator}
                                    updateStudents = {this.updateStudents}
                                    genericData    = {genericData}/>
                              </div>
                              <Pagination paginator={this.state.paginator} onChangePage={this.updateStudents}/>

                              <Footer quantity={this.state.paginator.quantity}>
                                 <div id="footer-portal" className="footer-portal"></div>
                              </Footer>
                              <div className="m-footer">
                                 <p className="f-text">Total de alumnos:</p>
                                 <p className="f-quantity">{this.state.paginator.quantity}</p>
                              </div>
                              <TableMobile
                                 students={students}
                                 {...this.state.paginator}
                                 updateStudents={this.updateStudents}
                                 genericData={genericData}
                              />
                              <Pagination paginator={this.state.paginator} onChangePage={this.updateStudents} />
                           </React.Fragment>

                  }else {
                     return "No hay datos que mostrar"
                  }
               })()
            }

         </div>
      )
   }
   updateNameGroup =(name) =>{
      this.setState({
         name
      });
   }
   updateStudents= async (page=1)=>{
      let {name ,paginator}= this.state;
      paginator.page = page;
      let formData = { name, paginator}
      this.setState({
         students: "loading"
      });
      this.moveScrollTo(0,0);
      let newStudents = await RequestClient.doQuery("/assists",formData);
      this.setState({
         students : newStudents.students,
         paginator: newStudents.paginator
      })
   }
   moveScrollTo=(left,top)=>{
      document.querySelector(".e-main_page--component").scrollTo({
         left,
         top,
         behavior : 'smooth'
      })
   }

}

export default  withRouter(Assists);
