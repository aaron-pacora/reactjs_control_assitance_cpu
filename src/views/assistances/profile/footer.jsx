import React, { Component } from 'react'
import requestClient from '../../../utils/requestClient';
import {withRouter} from 'next/router';
import CircularProgress from '@material-ui/core/CircularProgress';
import Modal from './modal';
export default withRouter(
class Footer extends React.Component {
   state={
      data : null,
      status : null,
      events : null
   }
   componentDidMount(){
      this.fetchStatus();
      this.fetchEvents();

   }
   fetchStatus= async ()=>{
      const id = this.props.router.query.id;

      const response =await requestClient.doQuery("/student/status",{id});

      this.setState({
         status: response
      })
   }
   fetchEvents= async()=>{
      const id = this.props.router.query.id;
      const response = await requestClient.doQuery("/student/events",{id});

      this.setState({
         events: response
      })

   }
   render() {
      return (
         <div className="p-footer">
            <div className="p-event h-scroll-design">
               <table className="e-table-full">
                  <thead className="e-table-full__head">
                     <tr className="e-table-full__row">
                        <td className="e-table-full__cell" colSpan={3}>Eventos</td>
                     </tr>
                     <tr className="e-table-full__row">
                        <td className="e-table-full__cell">Día/Mes</td>
                        <td className="e-table-full__cell">Nombre</td>
                        <td className="e-table-full__cell">Condición</td>
                     </tr>
                  </thead>
                  <tbody className="e-table-full__body">
                     {
                        (()=>{
                           if(this.state.events!==null){
                              return this.state.events.map((el,i)=>(
                                 <tr className="e-table-full__row" key={el.date+i}>
                                    <td className="e-table-full__cell">{cutDate(el.date+"")}</td>
                                    <td className="e-table-full__cell">{el.description}</td>
                                    <td className="e-table-full__cell">{getType(el.type)}</td>
                                 </tr>
                              ));
                           }else{
                              return <tr className="e-table-full__row">
                                       <td  colSpan="3">
                                          <CircularProgress className="c-circular-progress " />
                                       </td>
                                    </tr>
                           }
                        })()

                     }

                  </tbody>
               </table>
            </div>
            <div className="p-status ">
               <table className="e-table-full ">
                  <thead className="e-table-full__head--reverse">
                     <tr className="e-table-full__row">
                        <td className="e-table-full__cell">Estado</td>
                        <td className="e-table-full__cell">Total</td>
                        <td className="e-table-full__cell">%</td>
                     </tr>
                  </thead>
                  <tbody className="e-table-full__body">
                  {
                     (()=>{
                        if(this.state.status!==null){
                           let [assist,late,lack] = [0,0,0];
                           this.state.status.forEach(el=>{
                              switch (el.type)  {
                                 case '1':
                                    assist=el.times;
                                    break;
                                 case '2':
                                    late=el.times;
                                    break;
                                 case '3':
                                    lack=el.times;
                                    break;
                              }
                           });

                           const total = assist+late+lack;
                           const [p_assist,p_late,p_lack]= this.state.status.map(el=>((
                                                            el.times/total)*100).toFixed(2));
                           return(
                                 <React.Fragment>
                                    <tr className="e-table-full__row">
                                       <td className="e-table-full__cell">Asistencias</td>
                                       <td className="e-table-full__cell">{assist}</td>
                                       <td className="e-table-full__cell">{p_assist}</td>
                                    </tr>
                                    <tr className="e-table-full__row">
                                       <td className="e-table-full__cell">Tardanzas</td>
                                       <td className="e-table-full__cell">{late}</td>
                                       <td className="e-table-full__cell">{p_late}</td>
                                    </tr>
                                    <tr className="e-table-full__row">
                                       <td className="e-table-full__cell">Faltas</td>
                                       <td className="e-table-full__cell">{lack}</td>
                                       <td className="e-table-full__cell">{p_lack}</td>
                                    </tr>
                                 </React.Fragment>
                           );
                        }else{
                              return <tr className="e-table-full__row">
                                 <td colSpan="3">
                                    <CircularProgress className="c-circular-progress" color="primary"/>
                                 </td>
                              </tr>
                        }
                     })()
                  }
                  </tbody>
               </table>
            </div>
            <div className="p-status-final h-border--primary h-txt--center">
               <div className="bg-primary--reverse h-pd">
                  Estado Final
               </div>
               {
                  (()=>{
                     if(this.state.status!==null){
                        return <div className="h-txt--primary  h-pd">
                           {
                              (()=>{
                                 let [assist,late,lack] = [0,0,0];
                                 this.state.status.forEach(el=>{
                                    switch (el.type)  {
                                       case '1':
                                          assist=el.times;
                                          break;
                                       case '2':
                                          late=el.times;
                                          break;
                                       case '3':
                                          lack=el.times;
                                          break;
                                    }
                                 });

                                 if((late/3)+lack>=3){
                                    return <React.Fragment>
                                          No apto
                                       <Modal/>
                                    </React.Fragment>
                                 }else{
                                    return "Apto"
                                 }
                              })()

                           }
                        </div>
                     }else{
                        return <CircularProgress className="c-circular-progress c-circular-progress--small" color="primary"/>
                     }
                  })()

               }
            </div>

         </div>
      )
   }

}
)
function cutDate(date){

   return date.split("-").filter((el,i)=>i!==0).reverse().join("/");
}
function getType(type){
   switch (type) {
      case '0':
         return "Faltó";
      case '1':
         return "Asistió";
   }
}