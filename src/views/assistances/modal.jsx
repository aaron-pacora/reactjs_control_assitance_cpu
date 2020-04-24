import React from 'react';
import requestClient from '../../utils/requestClient';
import CircularProgress from '@material-ui/core/CircularProgress';
import Snackbar from '@material-ui/core/Snackbar';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Radio from '@material-ui/core/Radio';
import { Grid } from '@material-ui/core';

class Modal extends React.Component{
   state = {
      isloading: false,
      open     : false,
      hasError : false,
   }

   constructor(props){
      super(props);
      this.state={
         type : props.type
      }
   }
   render(){
      return (
         <React.Fragment>
            <div className="c-modal e-shadow--12">
               {
                  (()=>{
                     if(this.state.isloading){
                        return <CircularProgress color="primary" />
                     }else{
                        return <React.Fragment>
                                 <RadioGroup
                                    aria-label="Gender"
                                    name="gender1"
                                    className="c-modal__container-buttons"
                                    value={this.state.type}
                                    onChange={this.handleChange}
                                 >
                                    <FormControlLabel value="2" control={<Radio />} label="T" />
                                    <FormControlLabel value="1" control={<Radio />} label="A" />
                                    <FormControlLabel value="3" control={<Radio />} label="F" />
                                 </RadioGroup>

                           {/* <div className="c-modal__late" name="2"  onClick={this.handleClick}>T</div>
                           <div className="c-modal__assist" name="1" onClick={this.handleClick}>A</div>
                           <div className="c-modal__lack" name="3" onClick={this.handleClick}>F</div> */}
                        </React.Fragment>
                     }
                  })()

               }

            </div>
            <Snackbar
               anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'left',
               }}

               open={this.state.open}
               autoHideDuration={2000}
               onClose={this.handleCloseSnackBar}
               message={
                  (()=>{
                     if (this.state.hasError) {
                        return <span id="message-id">
                           Ha ocurrido un error
                        </span>
                     } else {
                        return <span id="message-id">
                           Cambiado correctamente
                        </span>
                     }
                  })()

               }
               action={[]}
            />
         </React.Fragment>
      );
   }
   handleOpenSnackBar= (hasError)=>{
      this.setState({open: true, hasError : hasError});
   }
   handleCloseSnackBar= ()=>{
      this.setState({open: false, hasError: false});
   }
   handleClick=async (e)=>{
      const newType = e.target.getAttribute("name")
      const data = {
         type : newType,
         id: this.props.id,
         date : this.props.date
      }
      this.setState({isloading:true});
      const response = await requestClient.doQuery("/assists/updateType",data)
      this.setState({isloading:false});
      if(response){
         this.handleOpenSnackBar(false);
         this.props.changeValue(newType);
      }else{
         this.handleOpenSnackBar(true);
      }

   }
   handleChange=(e)=>{
      let value = e.target.value;
      this.setState({
         type: value
      })
   }
}
export default Modal;
