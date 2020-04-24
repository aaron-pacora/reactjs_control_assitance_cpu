import React, { Component } from 'react';

import Card from 'components/Card';
import ItemMenu from './itemMenu';

import SvgBackArrow from 'icons/svg_back_arrow.svg';
import SvgForwardArrow from 'icons/svg_forward_arrow.svg';

import fn from 'utils/functions';

class Menu extends Component {
   constructor(props) {
      super(props);
      this.menuItems    = props.dataMenu;
      this.dataSelected = fn.existsValue(props.selected, "home");
      this.state = {
         classExpandedMenu : ""
      }
   }

   render() {
      let classMenu = "l-menu e-card c-card--ly c-card--no_border " + this.state.classExpandedMenu;
      return (
         <div className="parent-menu">
            <Card className={classMenu} elevation={0}>
               {this.menuItems.map((item, key) => {
                  let hasSubmenu = fn.existsValue(item.submenu, false) !== false;
                  return <div key={key}>
                     <ItemMenu
                        hasSubmenu={hasSubmenu}
                        dataSelected={this.dataSelected}
                        item={item} />
                  </div>;
               })}
               <div className="l-menu_item l-menu_item--collapse" onClick={this.handleExpandedMenu.bind(this)}>
                  <div className="l-menu_option">
                     <div className="e-icon e-icon--menu e-icon--forward">
                        <SvgForwardArrow />
                     </div>
                     <div className="e-icon e-icon--menu e-icon--back">
                        <SvgBackArrow />
                     </div>
                     <span className="l-menu_option-text no-select">Colapsar</span>
                  </div>
               </div>
            </Card>
            {(()=>{
               if (this.state.classExpandedMenu != "") {
                  return <div className="l-menu-background" onClick={this.handleExpandedMenu.bind(this)} />;
               }
            })()}
         </div>
      )
   }

   handleExpandedMenu(){
      let classExpandedMenu = "l-menu_item--collapse--expanded";
      if (this.state.classExpandedMenu != "") {
         classExpandedMenu = "";
      }
      this.setState({ classExpandedMenu: classExpandedMenu });
   }
}

export default Menu;
