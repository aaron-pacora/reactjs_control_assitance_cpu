import React, { Component } from 'react';

import Ripple from '../Ripple';

import fn from 'utils/functions';
import './index.sass';

class Button extends Component {
   constructor(props) {
      super(props);
      this.className = " " + fn.existsValue(props.className, "");
      this.onClick   = fn.existsValue(props.onClick, ()=>{});
      this.state = {
         ripples : []
      };
   }
   componentWillReceiveProps(prevProps){
      this.className = " " + fn.existsValue(prevProps.className, "");
      this.onClick   = fn.existsValue(prevProps.onClick, () => { });
   }
   render() {
      return (
         <div className={"c-button no-select e-shadow--1" + this.className} onClick={(e)=>{
            this.onClick();
            const left = e.pageX - e.currentTarget.offsetLeft;
            const top  = e.pageY - e.currentTarget.offsetTop
            const id   = Math.random().toString();
            const ripples = [...this.state.ripples, { left, top, id}];
            this.setState({ripples});
         }}>
            {this.props.children}
            {this.state.ripples.map(({left,top,id})=>{
               return <Ripple
                  left = {`${left}px`}
                  top  = {`${top}px`}
                  key  = {`${id}px`}
                  onRequestRemove={()=>{
                     this.setState(state => ({
                        ripples: state.ripples.filter(x => x.id !== id)
                     }));
                  }}
               />
            })}
         </div>
      )
   }
}

export default Button;
