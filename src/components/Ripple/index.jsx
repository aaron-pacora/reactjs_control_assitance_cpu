import React, { Component } from 'react';

import PropTypes from 'prop-types';

const DURATION = 230;

import './index.sass';

class Ripple extends Component {

   static propTypes = {
      onRequestRemove: PropTypes.func.isRequired
   }

   constructor(props) {
      super(props);
      this.state = {
         in : false,
         out: false
      };
      this.set1 = "";
      this.set2 = "";
      this.set3 = "";
   }

   componentDidMount(){
      this.set1 = setTimeout(()=>{
         this.setState({in: true,out: false});
         this.set2 = setTimeout(()=>{
            this.setState({ in: false, out: true});
            this.set3 = setTimeout(()=>{
               this.props.onRequestRemove();
            }, DURATION);
         }, DURATION);
      }, 15);
   }
   
   componentWillUnmount(){
      clearTimeout(this.set1);
      clearTimeout(this.set2);
      clearTimeout(this.set3);
   }

   render() {
      let className = "c-ripple";
      if(this.state.in){
         className = `${className} c-ripple--in`;
      }
      if(this.state.out){
         className = `${className} c-ripple--out`;
      }

      const style = {};
      if(this.props.left) style.left = this.props.left;
      if(this.props.top) style.top = this.props.top;

      return (
         <div className={className} style={style}/>
      )
   }
}

export default Ripple;
