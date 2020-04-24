import React from 'react';

import SvgArrowDown from 'icons/svg_arrow_down.svg';
import TextField from '@material-ui/core/TextField';
import Search from '@material-ui/icons/Search';

export default class head extends React.Component {
   constructor(props){
      super(props)
      let {options} = this.props;
      this.state = {
         selected: options[0],
         options: options
      }
   }
   componentDidUpdate(prevProps,prevState){
      let {selected} =this.state;
      if (prevState.selected!=selected) this.props.updateStudents(selected);
   }
   handleOnBlur= (e)=>{
      document.querySelector(".head__select").classList.remove("show-options")
   }
   handleOnClick= (e)=>{
      document.querySelector(".head__select").classList.toggle("show-options")

   }
   handleClickOption= (e)=>{
      const value = e.target.getAttribute("value")
      this.setState({
         selected: value
      })
      document.querySelector(".head__select").classList.remove("show-options")
   }

   render(){
      return (
         <div className="head">
            <h1 className="head__title e-title">
               Asistencia de Alumnos
            </h1>
            <div className="container-select">
               <div className="head__select" id="" tabIndex="1" onBlur={this.handleOnBlur} >
                  <div className="head__selected"  onClick={this.handleOnClick}>{this.state.selected}</div>
                     <div className="head__options">
                     {
                     this.state.options.map((el,i) =>(
                        <div value={el} key={4+i} className="head__option" onClick={this.handleClickOption}>{el}</div>
                     ))
                     }
                     </div>
               </div>
               <SvgArrowDown className="svg-arrow"/>
            </div>
            {/* <div className="p-search">
               <TextField
                  id="standard-dense"
                  label="Nombre y/o apellido"
                  margin="dense"
                  className="p-search__field"
                  placeholder="..."
                  />
               <Search className="p-search__icon"/>
            </div> */}
         </div>
      )
   }
}
