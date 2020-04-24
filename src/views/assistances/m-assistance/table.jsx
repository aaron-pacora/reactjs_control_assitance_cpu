import React, { Component } from 'react';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import AddAssistance from 'icons/svg_add_assistance.svg';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import Dialog from '@material-ui/core/Dialog';
import RadioGroup from '@material-ui/core/RadioGroup';
import Radio from '@material-ui/core/Radio';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import TextField from '@material-ui/core/TextField';
import RequestClient from "utils/requestClient";
import Snackbar from '@material-ui/core/Snackbar';

class Table extends Component{
   constructor(props) {
      super(props);
      this.handleSave = this.handleSave.bind(this);
      this.state = {
         students: this.props.students,
         page: this.props.page,
         per_page: this.props.per_page,
         open: false,
         description:"",
         value:null,
         radioGroupRef : null,
         openToast:false,
         hasError:false,
         studen_id:null,
         date:null
      }
      this.options = [
         'Asistió',
         'Faltó',
         'Tardanza',
      ];
   }

   async handleClickOpenPopUp(id){
      var date = new Date().toISOString().slice(0, 10);
      let params = {
         id:id
      }

      var assistance_student = await RequestClient.doQuery("/assists/today", params);
      if (Array.isArray(assistance_student) && assistance_student.length) {
         let value;
         switch (assistance_student[0].type) {
            case "1":
               value = "Asistió";
               break;
            case "2":
               value = "Tardanza";
               break;
            case "3":
               value = "Faltó";
               break;
         }
         this.setState({   open: true,
                           value: value,
                           description: assistance_student[0].description,
                           studen_id  : id,
                           date: assistance_student[0].date
                        });
      } else {
         this.setState({   open: true,
                           studen_id:id,
                           date:date
                        });
      }
   };

   handleClose = () => {
      this.setState({ open: false, description: "", value: null, radioGroupRef: null, studen_id:null});
   };

   handleChange = name => event => {
      this.setState({
         [name]: event.target.value,
      });
   };

   handleChangeRadioGroup = (event, value) => {
      this.setState({ value });
   };

   async handleSave(){
      let value;
      switch (this.state.value) {
         case "Asistió":
            value = "1";
            break;
         case "Tardanza":
            value = "2";
            break;
         case "Faltó":
            value = "3";
            break;
      }
      let params = {
         id: this.state.studen_id,
         date:this.state.date,
         type: value,
         description:this.state.description
      }
      var rpta = await RequestClient.doQuery("/assists/updateType", params);
      if (rpta) {
         this.setState({openToast:true});
         this.handleClose();
      } else {
         this.setState({openToast:true,hasError:true});
         this.handleClose();
      }
   }

   handleCloseSnackBar = () => {
      this.setState({ openToast: false, hasError: false });
   }

   render(){
      return(
         <div className="v-a-table">
            {(()=>{
               if (this.state.students != null) {
                  let element = this.state.students.map((el)=>{
                     return(
                        <Card className="t-user" key={el.id}>
                           <CardContent className="t-u-content">
                              <p className="t-u-name">{el.full_name}</p>
                              <Button  size="small"
                                       onClick={async () => { await this.handleClickOpenPopUp(el.id);}}
                              >
                                 <div className="b-icon">
                                    <AddAssistance/>
                                 </div>
                              </Button>
                           </CardContent>
                        </Card>
                     )
                  })
                  return element;
               } else {
                  return <div>No hay alumnos</div>
               }
            })()}
            <Dialog
               open             = {this.state.open}
               onClose          = {this.handleClose}
               aria-labelledby  = "alert-dialog-title"
               aria-describedby = "alert-dialog-description"
            >
               <DialogTitle id="alert-dialog-title">{"Asignar asistencia"}</DialogTitle>
               <DialogContent>
                  <RadioGroup
                     ref={ref => {
                        this.state.radioGroupRef = ref;
                     }}
                     aria-label="Ringtone"
                     name="ringtone"
                     value={this.state.value}
                     onChange={this.handleChangeRadioGroup}
                  >
                     {this.options.map(option => (
                        <FormControlLabel value={option} key={option} control={<Radio color="primary" />} label={option} />
                     ))}
                  </RadioGroup>
                  <TextField
                     id="standard-multiline-flexible"
                     label="Descripción"
                     multiline
                     rowsMax="4"
                     value={this.state.description}
                     onChange={this.handleChange('description')}
                     margin="normal"
                  />
               </DialogContent>
               <DialogActions>
                  <Button onClick={this.handleSave} color="primary">
                     Guardar
            </Button>
                  <Button onClick={this.handleClose} color="primary" autoFocus>
                     Cancelar
            </Button>
               </DialogActions>
            </Dialog>
            <Snackbar
               anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'left',
               }}

               open={this.state.openToast}
               autoHideDuration={2000}
               onClose={this.handleCloseSnackBar}
               message={
                  (() => {
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
         </div>
      )
   }
}
export default Table;