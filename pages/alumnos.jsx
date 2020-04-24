import React, { Component } from 'react';

import Filter from 'views/alumnos/index/filter';
import Table from 'views/alumnos/index/table';

import Pagination from 'components/Pagination';

import RequestClient from 'utils/requestClient';
import RequestServer from 'utils/requestServer';

import 'sass_pages/alumnos/index.sass';

class Students extends Component {

   static async getInitialProps(ctx) {
      let serverProps = { currentPage: "students"};
      let params = {
         paginator: {
            quantity: 0,
            per_page: 15,
            page: 1
         },
         filter: {
            text: "",
            group_id: 1
         }
      };
      let genericData = await RequestServer.doQuery(ctx, "/generic-data");
      serverProps.genericData      = genericData;
      let dataStudients = await RequestServer.doQuery(ctx, "/pagination-studients", params);
      serverProps.data      = dataStudients.data;
      serverProps.paginator = dataStudients.paginator;
      serverProps.filter    = params.filter;
      return serverProps;
   }

   constructor(props) {
      super(props);
      this.executeQuery       = this.executeQuery.bind(this);
      this.executeQueryPage   = this.executeQueryPage.bind(this);
      this.executeQueryFilter = this.executeQueryFilter.bind(this);
      this.changeShowPreloader = this.changeShowPreloader.bind(this);

      this.state = {
         data         : props.data,
         paginator    : props.paginator,
         filter       : props.filter,
         showPreloader: false
      }
   }

   executeQuery(page, filter){
      let paginator = this.state.paginator;
      paginator.page = page;
      let params = {
         paginator,
         filter
      };
      RequestClient.doQuery("/pagination-studients", params).then((rpta) => {
         this.setState({
            data         : rpta.data,
            paginator    : rpta.paginator,
            filter       : filter,
            showPreloader: false
         });
      });
   }

   executeQueryPage(page){
      this.executeQuery(page,this.state.filter);
   }
   executeQueryFilter(filter){
      this.executeQuery(1,filter);
   }

   changeShowPreloader(st) {
      if (st != this.state.showPreloader) {
         this.setState({
            showPreloader: st
         });
      }
   }

   render() {
      return (
         <div className="p-student">
            <div className="p-student-header">
               <div className="e-title">{"Lista de Alumnos | " + this.props.genericData.cycle.name}</div>
               <Filter onChangeFilter={this.executeQueryFilter} onWriting={this.changeShowPreloader}/>
            </div>
            <Table data={this.state.data} paginator={this.state.paginator} showPreloader={this.state.showPreloader}/>
            <div className="p-student-pagination">
               <Pagination paginator={this.state.paginator} onChangePage={this.executeQueryPage} forceHidden={this.state.showPreloader}/>
            </div>
         </div>
      )
   }
}

export default Students;
