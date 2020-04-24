import Delete from '@material-ui/icons/ExpandLess';
import React, { Component } from 'react';
import { RadioGroup, Radio, FormControlLabel, TextField, Typography, CircularProgress, Collapse } from '@material-ui/core';
import {  } from "react-dnd";
import Button from '@material-ui/core/Button';
import Card from '../../components/Card';
import requestClient from '../../utils/requestClient';

 export default class Detail extends Component {
   state = {
      type       : "1",
      description: "",
      visible    : true,
      disabled   : true,
      id         : null,
      date       : null,
      loading    : false,
   }
   constructor(props){
      super(props);
   }
   componentDidMount(){
      let {description,type,id,date} = this.props;
      this.setState({
         type,
         description,
         date,
         id
      })
      let modal = document.querySelector(".footer-portal");
      modal.setAttribute("draggable","true")
      modal.addEventListener("dragstart",(e)=>{
         let {left,top} = e.target.getBoundingClientRect();
         let x_model =e.clientX-left;
         let y_model =e.clientY-top
         e.dataTransfer.setData("x_model", x_model);
         e.dataTransfer.setData("y_model", y_model);
      })
      document.body.addEventListener("drop",(e)=>{
         e.preventDefault();
         let x_model = e.dataTransfer.getData("x_model");
         let y_model = e.dataTransfer.getData("y_model");
         modal.style=`left: ${e.clientX-parseInt(x_model)}px;top: ${e.clientY-parseInt(y_model)}px`;
      })
      document.body.addEventListener("dragover",(e)=>{
         e.preventDefault();
      })
   }

  render() {
    return (
       <Collapse in={this.state.visible}>
       {
         (()=>{
               if(!this.state.loading){
                  return <Card className="footer-modal" ref ={ref => {this.modal=ref}}>
                     <div className="footer-modal__title" >
                        {
                           this.state.date
                        }
                        <Button onClick={this.onClose}>
                           {
                              <Delete className="svg"/>
                           }
                        </Button>
                     </div>
                     <div className="footer-modal__content" >
                        <RadioGroup
                           aria-label="Gender"
                           name="gender1"
                           className="footer-modal__buttons"
                           value={this.state.type}
                           onChange={this.handleChangeType}

                           >
                           <FormControlLabel disabled={this.state.disabled} value="2" control={<Radio />} label="T" />
                           <FormControlLabel disabled={this.state.disabled}  value="1" control={<Radio />} label="A" />
                           <FormControlLabel disabled={this.state.disabled}  value="3" control={<Radio />} label="F" />
                        </RadioGroup>
                        <div className="footer-modal__description">
                           <TextField
                              id="outlined-multiline-static"
                              label="Descripción"
                              multiline
                              rows="4"
                              value={this.state.description}
                              margin="normal"
                              variant="outlined"
                              onChange= {this.handleChangeDescription}
                              disabled={this.state.disabled}
                              />
                        </div>
                     </div>
                     {
                        (()=>{
                           if(this.state.disabled){
                              return <Button variant="contained" className="footer-modal__button" size="small" onClick={this.toggle}>
                              Editar
                           </Button>
                           }else{
                              return <Button variant="contained" className="footer-modal__button" size="small" onClick={this.handleSubmit}>
                              Guardar
                           </Button>
                           }
                        })()

                     }
                  </Card>
               }else {
                  return <Card className="footer-modal">
                     <CircularProgress
                        className="circular-progress"
                        color="primary"
                        />
                  </Card>
               }

         })()
      }
      </Collapse>
    )
  }
  handleChangeType=(e)=>{
     this.setState({
        type: e.target.value
   });
}
  handleChangeDescription=(e)=>{
     let el=document.getElementById("outlined-multiline-static");
      this.setState({
        description:  el.value
      });
  }
  handleSubmit=async ()=>{
      this.toggle();
      let data = this.state;

      const response = await requestClient.doQuery("/assists/updateType",data)
      this.initLoad();
      if(response){
         this.props.changeValue(data.type,data.description);
      }
      setTimeout(() => {
         this.endLoad();
      }, 500);
  }
  initLoad=()=>{
     this.setState({
        loading : true
     })
  }
  endLoad=()=>{
     this.setState({
        loading : false
     })
  }
  toggle=()=>{
     this.setState((state, props) => { return {
         disabled: !state.disabled
      }})

  }
  onClose=()=>{
     this.setState({
        visible: false
     });
  }
}
