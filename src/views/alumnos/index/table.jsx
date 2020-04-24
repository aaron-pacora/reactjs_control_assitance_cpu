import React, { Component } from 'react';

import SvgList from 'icons/svg_list.svg';
import Tooltip from '@material-ui/core/Tooltip';
import CircularProgress from '@material-ui/core/CircularProgress';

class Table extends Component {

   constructor(props) {
      super(props);
      this.state = {
         data         : props.data,
         paginator    : props.paginator,
         showPreloader: false
      }
   }

   componentWillReceiveProps(props){
      this.setState({ data: props.data, paginator: props.paginator, showPreloader: props.showPreloader});
   }

   render() {
      let page     = this.state.paginator.page;
      let per_page = this.state.paginator.per_page;
      if (this.state.showPreloader){
         return <div className="p-student-table p-student-table--progress">
            <CircularProgress className="e-progress" size={80} />
         </div>
      }
      if (this.state.data.length == 0){
         return <div className="p-student-table p-student-table--progress">
            Sin resultados
         </div>
      }
      return (
         <div className="p-student-table">
            <div className="e-table">
               <div className="e-table-header">
                  <div className="e-table-item--min">N°</div>
                  <div className="e-table-item--max">Nombres</div>
                  <div className="e-table-item--max">Apellidos</div>
                  <div className="e-table-item--max">N° Emergencia</div>
                  <div className="e-table-item--medium">Opciones</div>
               </div>
               <div className="e-table-content">
                  {(()=>{
                     let list = [];
                     list = this.state.data.map((element,i) => {
                        let phone = element.phone;
                        if (phone == "NULL"){
                           phone = "-";
                        }
                        return <div className="e-table-item" key={i}>
                           <div className="e-table-item--min e-table-item--center">{per_page * (page - 1) + i + 1}</div>
                           <div className="e-table-item--max e-table-item--center">{element.name}</div>
                           <div className="e-table-item--max e-table-item--center">{element.last_name}</div>
                           <div className="e-table-item--max e-table-item--center">{phone}</div>
                           <div className="e-table-item--medium e-table-item--center e-table-item--icon"
                                 onClick={()=>{window.location=`/asistencias/${element.id}`}}>

                              <Tooltip title="Ver Asistencias" placement="top">
                                 <div className="e-icon" onClick={()=>{this.onClickShowAssistans(i)}}>
                                    <SvgList/>
                                 </div>
                              </Tooltip>
                           </div>
                        </div>
                     });
                     return list;
                  })()}
               </div>
            </div>
         </div>
      )
   }

   onClickShowAssistans(i){
      console.log("enviar a: "+ i);
   }
}

export default Table;
