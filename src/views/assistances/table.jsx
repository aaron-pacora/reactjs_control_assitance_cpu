import React from 'react';

import  ReactDOM from "react-dom";

import Tooltip from '@material-ui/core/Tooltip';

import Zoom from '@material-ui/core/Zoom';

import Detail from './../../views/assistances/detail'
class table extends React.Component {

   constructor(props) {
      super(props);
      this.state = {
         students: this.props.students,
         page: this.props.page,
         per_page: this.props.per_page,
      }
   }
   static getDerivedStateFromProps(nextProps, prevState) {
      const { students, page, per_page } = nextProps
      return {
         students,
         per_page,
         page
      }
   }
   componentDidMount(){
   }
   render() {
      const {start , finish } = this.props.genericData.cycle;
      const range = rangeDays(start,finish);
      const months = getMonthDetail(range);
      const { students } = this.state;
      return (
         <table className="table ">
            <thead className="table__head">
               <tr className="table__row " key="holi">
                  <th className="table__cell no-border-right table__cell-number" rowSpan={2} colSpan={1}>N°</th>
                  <th className="table__cell no-border-left text--left table__cell-student" rowSpan={2} colSpan={1}>Alumno</th>
                  {
                     (()=>{
                        let response = [];
                        for (const key in months) {

                           response.push(
                              <th className="table__cell" colSpan={months[key]} key={key}>{key}</th>
                           )
                        }
                        return response;
                     })()

                  }
               </tr>
               <tr className="table__row" >
                  {
                     (()=>{
                        return range.map(el => (
                           <th className="table__cell number" key={el}>{getDay(el)}</th>
                        ))
                     })()
                  }
               </tr>
            </thead>
            <tbody className="table__body">
               {
                  <Row students = {students} per_page = {this.state.per_page}
                        page   = {this.props.page}
                       range    = {rangeDays(start,finish)}
                      />
               }
            </tbody>
         </table>
      )
   }
}
function Row({ students, page, per_page,range}) {
   return students.map((el, index) => (
      <tr className="table__row " key={index + "-" + el.id}>
         <td className="table__cell no-border-right table__cell-number text--center">{((page - 1) * per_page) + index + 1}</td>
         <td className="table__cell no-border-left table__cell-student" key={el.full_name + "-" + index}>{el.full_name}</td>
         <Assists assists={el.assists} id={el.id}  range={range} />
      </tr>
   ))
}
function Assists({ assists, id ,range}) {
   assists = JSON.parse(assists);

   assists = assists.sort((a,b)=>(
      new Date(a.date).getTime() - new Date(b.date).getTime()
   ));
   let response = assists.map((el, i) => (
      <Cell  key={i} el={{id,...el}}/>
   ));
   ;
   range = range.slice(assists.length,range.length)
            .map((el,i)=>(
      <Cell  key={assists.length+i} el={{date :el,id,type : "0"}}/>
   ));
   return response.concat(range);

}

class Cell extends React.Component {
   constructor(props) {
      super(props);
      this.state={
         type : props.el.type,
         description : props.el.description,
         id : props.el.id,
         date : props.el.date
      }
   }
   render() {
      const {date }        = this.props.el;
      const type = this.state.type;
      const {value,className } = this.convert(type,date);
      return (

               (()=>{
                  if (value==='-'||isSunday(date)) {
                     return <td className = {`table__cell table__cell-number h-txt--center ${className}`}>
                              {value}
                           </td >

                  }else{
                     return (
                        <React.Fragment>
                           <Tooltip TransitionComponent={Zoom} title="Ver detalle" placement="right">
                              <td className = {`table__cell table__cell-number h-txt--center ${className} cursor`}
                                    onClick= {this.handleClick}>
                              {value}
                              </td >
                           </Tooltip>
                        </React.Fragment>
                     );
                  }
               })()


               )
            }
   changeValue=(newType,newDescription)=>{
      this.setState({
         type : newType,
         description : newDescription
      });
   }
   convert(type,date){
      const HOLIDAY = '0';
      const ASISTIO = '1';
      const LATE = '2';
      const LACK = '3';
      let className = "",value;
      switch (type) {
         case ASISTIO:
         value ='A';
         break;
         case LATE:
         className += " table__cell--late";
         value = 'T';
         break;
         case LACK:
         value = 'F';
         if(isFuture(date) ){value='-'}
         else{className += " table__cell--lack";};
         break;
         case HOLIDAY:
         value = '-';
         break;
      }
      if(isSunday(date)) className += " table__cell--gray";
      return {
         className,
         value
      };
   }
   handleClick= ()=>{
      let container=document.getElementById("footer-portal");
      let data = this.state;
      ReactDOM.unmountComponentAtNode(container)
      ReactDOM.render( <Detail {...data} changeValue={this.changeValue}/>,container);
   }
}


//suponiendo que esta en formato yyyy-mm-dd
function isFuture(date){
   return new Date(date.replace(/-/g,"/")).getTime()> new Date().getTime()
}
function getDay(date) {
   return date.split("-")[2]
}
function getMonth(date) {
   const numberMonth = parseInt(date.split("-")[1]);
   const months = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio'
      , 'Julio', 'Agosto', 'Setiembre', 'Octubre', 'Noviembre', 'Diciembre']
   return months[numberMonth - 1];
}
function isSunday(date) {
   return new Date(date).getUTCDay() === 0;
}
function getMonthDetail(days= []){
   let response = {};
   days.forEach(el=>{
      let month = getMonth(el);
      response[month]===undefined?response[month]=1:response[month]++;
   });
   return response;
}
function rangeDays(start, end){
   start = new Date(start);
   end   = new Date(end);
   const response = [];
   while(end.getTime() >= start.getTime()){
      start.setDate(start.getDate() + 1);
      response.push(`${start.getFullYear()}-${(start.getMonth() + 1)}-${start.getDate()}`);
   }
   return response;
}

export default table;
