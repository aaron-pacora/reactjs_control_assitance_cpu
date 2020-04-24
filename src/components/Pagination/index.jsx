import React, { Component } from 'react';

import Fn from 'utils/functions';

import './index.sass';

class Pagination extends Component {

   constructor(props) {
      super(props);
      this.onChangePage = props.onChangePage;
      let forceHidden   = Fn.existsValue(props.forceHidden, false);
      this.state = {
         paginator   : props.paginator,
         forceHidden : forceHidden
      }
   }

   componentWillReceiveProps(props) {
      let forceHidden = Fn.existsValue(props.forceHidden, false);
      this.setState({ paginator: props.paginator, forceHidden: forceHidden });
   }

   onClickOnPage(i){
      this.onChangePage(i);
   }

   render() {
      let paginator = this.state.paginator;
      let quantity  = paginator.quantity;
      let per_page  = paginator.per_page;
      if (quantity <= 0 || quantity <= per_page || this.state.forceHidden == true) {
         return <div/>;
      }

      let page        = paginator.page;
      let excedent    = quantity % per_page > 0 ? 1 : 0;
      let numberPages = ((quantity / per_page) | 0) + excedent;
      return (
         <div className="c-pagination">
            {(() => {
               if (paginator.page != 1) {
                  return <div className="c-pagination-option no-select" onClick={() => { this.onClickOnPage(1); }}>Primero</div>;
               }
               return <div className="c-pagination-option"/>;
            })()}
            <div className="c-pagination--numbers">
               {(() => {
                  let elements     = [];
                  let limitMaxPage = page + 3;
                  let limitMinPage = page - 3;
                  for (let i = limitMinPage; i <= limitMaxPage; i++) {
                     if (i > 0 && i <= numberPages) {
                        let isActive = (i == page) ? 'selected' : '';
                        elements.push(
                           <div
                              className = {"c-pagination--num no-select " + isActive}
                              onClick   = {()=>{ this.onClickOnPage(i); }}
                              key       = {i}>
                              {i}</div>
                        );
                     }
                  }
                  return elements;
               })()}
            </div>
            {(() => {
               if (numberPages != page) {
                  return <div className="c-pagination-option no-select" onClick={() => { this.onClickOnPage(numberPages);}}>Último</div>;
               }
               return <div className="c-pagination-option" />;
            })()}

         </div>
      )
   }
}

export default Pagination;
