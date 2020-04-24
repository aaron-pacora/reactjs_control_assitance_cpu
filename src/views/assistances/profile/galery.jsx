import React from "react";
import Register from "./register";

import fn from "utils/functions";

export default class Galery extends React.Component {
   render() {

      const data = splitData(this.props.data);
      return (
         <div className="p-registers-container">
               {

                  data.map(el=>(
                     <div className="p-register h-scroll-design" key={el.month}>
                        <table className="e-table-full">
                           <thead className="e-table-full__head">
                              <tr className="e-table-full__row" key={el.month+"child"}>
                                 <td className="e-table-full__cell" colSpan={2}>
                                    {el.month}
                                 </td>
                              </tr>
                              <tr className="e-table-full__row" key="condition">
                                 <td className="e-table-full__cell">
                                    Día
                                 </td>
                                 <td className="e-table-full__cell">
                                    Condición
                                 </td>
                              </tr>
                           </thead>
                           <tbody className="e-table-full__body ">
                              {
                                 (()=>{
                                    return el.register.map(el =>(
                                       <tr className="e-table-full__row" key={el.day}>
                                          <td className="e-table-full__cell">
                                             {el.day}
                                          </td>
                                          <td className={
                                                (()=>{
                                                   let response= "e-table-full__cell";
                                                   if(fn.isSunday(el.date)){
                                                      response +=" bg--gray";
                                                   }
                                                   return response;
                                                })()

                                             }
                                             >
                                             {getType(el.type)}
                                          </td>
                                       </tr>));
                                 })()
                              }
                           </tbody>
                        </table>

                     </div>
                  ))
               }


            </div>
      );
   }
}
function splitData(data){
   const response= {};
   data.forEach(({date,type})=>{
      const month = fn.getMonth(date);
      const day = fn.getDay(date);
      if ( response[month]){
         response[month].push({day ,type,date});
      }else{
         response[month] = [];
      }
   });
   let keys = Object.keys(response)
   let newResponse= keys.map(el=>({month: el,register:response[el]}))
   return newResponse;
}

function getType(number){
   let response = "";
   switch (number) {
      case '1':
         response="Asistió";
         break;
      case '2':
         response = "Tardanza";
         break;
      case '3':
         response = "Faltó";
         break;
   }
   return response;
}

