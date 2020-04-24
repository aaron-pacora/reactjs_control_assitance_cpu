import React, { Component } from 'react';

import DataMenu from './data_menu';

class ItemMenu extends Component {
   constructor(props) {
      super(props);
      this.item       = props.item;
      this.hasSubmenu = props.hasSubmenu;

      this.isSelected  = false;
      let dataSelected = props.dataSelected;
      if (typeof dataSelected == "string") {
         this.isSelected = (this.item.code == dataSelected);
      } else {
         this.isSelected      = (this.item.code == dataSelected.menu);
         this.submenuSelected = dataSelected.submenu;
      }
      this.state = {
         openSubmenu: this.isSelected
      };
   }

   render() {
      let item           = this.item;
      let classSelected  = this.isSelected ? "l-menu_item--selected" : "";
      let mainURL        = this.item.url;
      return <div className={"l-menu_item " + classSelected} key={item.code} onClick={() => {
         if (!this.hasSubmenu) {
            if (!this.isSelected) {
               window.location.href = mainURL;
            }
         } else {
            this.setState({
               openSubmenu: !this.state.openSubmenu
            });
         }
      }}>
         <div className="l-menu_option">
            <div className="e-icon e-icon--menu">
               {(()=>{
                  let CurrentMenu = DataMenu[this.item.code];
                  if (CurrentMenu != undefined){
                     let SvgIcon = CurrentMenu.svg;
                     return <SvgIcon />
                  }
               })()}
            </div>
            <span className="l-menu_option-text no-select">{item.name}</span>
         </div>
         {(()=>{
            if (this.hasSubmenu){
               let classOpenSubmenu = this.state.openSubmenu ? "l-menu-submenu--open":"";
               return <div className={"l-menu-submenu " + classOpenSubmenu}>
                  {this.getSubmenu()}
               </div>;
            }
         })()}
      </div>;
   }

   getSubmenu() {
      let submenu = this.item.submenu;
      let mainURL = this.item.url;
      return submenu.map((subItem, subIndex) => {
         let isSelectedSubmenu = (this.submenuSelected == subItem.code);
         let classSelected     = isSelectedSubmenu ? "l-menu-submenu_list--selected" : "";
         return <div className={"l-menu-submenu_list no-select " + classSelected} key={subIndex}
            onClick={() => {
               if (!isSelectedSubmenu) {
                  window.location.href = mainURL + subItem.url;
               }
            }}>
            {(() => {
               if (isSelectedSubmenu) {
                  return <div className="l-menu-submenu_list_left_icon" />;
               }
            })()}
            {subItem.name}
         </div>;
      });
   }
}

export default ItemMenu;
