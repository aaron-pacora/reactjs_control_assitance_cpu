import React, { Component } from 'react'

export default class footer extends Component {
   componentDidMount() {

   }
   render() {
      return (
         <div className="footer">
            <div className="footer-total">
               <div className="footer__total h-border--primary">
                  <div className="h-txt--center h-pd bg-primary--reverse">Total de alumnos</div>
                  <div className="h-txt--primary h-txt--center h-pd">{this.props.quantity}</div>
               </div>
               <div className="footer__detail">
                  <table className="e-table-full">
                     <thead className="e-table-full__head bg-primary--reverse">
                        <tr className="e-table-full__row">
                           <td className="e-table-full__cell">Estados</td>
                           <td className="e-table-full__cell">Total</td>
                           <td className="e-table-full__cell ">%</td>
                        </tr>
                     </thead>
                     <tbody className="e-table-full__body">
                        <tr className="e-table-full__row">
                           <td className="e-table-full__cell">Asistencias</td>
                           <td className="e-table-full__cell">121</td>
                           <td className="e-table-full__cell">92</td>
                        </tr>
                        <tr className="e-table-full__row">
                           <td className="e-table-full__cell">Tardanzas</td>
                           <td className="e-table-full__cell">4</td>
                           <td className="e-table-full__cell">2</td>
                        </tr>
                        <tr className="e-table-full__row">
                           <td className="e-table-full__cell">Faltas</td>
                           <td className="e-table-full__cell">5</td>
                           <td className="e-table-full__cell">2.1</td>
                        </tr>
                     </tbody>
                  </table>
               </div>
            </div>
            {
               this.props.children
            }
         </div>
      )
   }
}
