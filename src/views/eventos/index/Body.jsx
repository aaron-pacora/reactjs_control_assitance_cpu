import React, { Component } from 'react';
import Button from 'components/Button';

import DialogTitle from '@material-ui/core/DialogTitle';
import Snackbar from '@material-ui/core/Snackbar';
import Dialog from '@material-ui/core/Dialog';

import SvgSave from 'icons/svg_save_icon.svg';
import SvgEdit from 'icons/svg_edit.svg';
import SvgDelete from 'icons/svg_delete.svg';
import SvgClear from 'icons/svg_clear.svg';

import RequestClient from 'utils/requestClient';
import KeyDownFormat from 'utils/keyDownFormat';

class Body extends Component {

   constructor(props) {
      super(props);
      this.state = {
         data: props.data,
         changeItem: {
            name: '',
            date: ''
         },
         itemToEdit  : -1,      // -9 intetando crear
         onTryNew    : false,
         onTryDelete : false,
         itemToDelete: -1,
         showSnackBar: false
      };
      this.cycle = props.cycle;
   }

   componentWillReceiveProps(props) {
      this.setState({ data: props.data, paginator: props.paginator });
   }

   render() {
      return(
         <div className="p-events-body">
            <div className="p-events-body-button">
               <div className="e-title">Eventos</div>
               {(()=>{
                  if (this.state.onTryNew == false && this.state.itemToEdit == -1){
                     return <Button className="c-button" onClick={() => {
                        this.setState({ onTryNew: true });
                     }}>
                        <div>Nuevo Evento</div>
                     </Button>;
                  }
               })()}
            </div>
            <div className="e-table">
               <div className="e-table-header">
                  <div className="e-table-item--min">N°</div>
                  <div className="e-table-item--max">Nombre</div>
                  <div className="e-table-item--max">Fecha</div>
                  <div className="e-table-item--medium">Acciones</div>
               </div>

               <div className="e-table-content">
                  {(() => {
                     let list = [];
                     list = this.state.data.map((element, i) => {
                        let status = 1;
                        if (this.state.itemToEdit == element.id){
                           status = 0;
                        }
                        return this.getItemEvent(i,element.id, element.name, element.date, status);
                     });
                     return list;
                  })()}
                  {(()=>{
                     if (this.state.onTryNew){
                        return this.getItemEvent(this.state.data.length, -9, "", "", 0)
                     }
                  })()}
               </div>
            </div>
            {this.getDialog()}
            {this.getSnackBar()}
         </div>
      );
   }

   getSnackBar(){
      return <Snackbar
         anchorOrigin={{
            vertical  : 'bottom',
            horizontal: 'left',
         }}
         open             = {this.state.showSnackBar}
         autoHideDuration = {2000}
         onClose          = {this.handleCloseSnackBar}
         message={
            (() => {
               let changeItem = this.state.changeItem;
               let msn = "¡Datos no válidos!";
               if (changeItem.name.trim() == ""){
                  msn = "¡El nombre es obligatorio!";
               }else if (changeItem.date.trim() == ""){
                  msn = "¡La fecha es obligatoria!";
               }
               let areRepetatDate = false;
               let id = this.state.itemToEdit;
               this.state.data.forEach(element => {
                  if (id != element.id) {
                     if (element.date == changeItem.date) {
                        areRepetatDate = true;
                     }
                  }
               });

               if (areRepetatDate){
                  msn = "¡La fecha debe ser única!";
               }
               return <span id="message-id">{msn}</span>;
            })()
         }
         action={[]}
      />;
   }

   handleCloseSnackBar = () => {
      this.setState({ showSnackBar: false });
   }

   handleOnEdit(id,name,date){
      if (this.state.onTryNew === true) {
         return;
      }
      let changeItem = this.state.changeItem;
      changeItem.name = name;
      changeItem.date = date;
      this.setState({ itemToEdit: id, changeItem: changeItem })
   }
   handleOnSave(id){
      let changeItem = this.state.changeItem;
      let itemToEdit = this.state.itemToEdit;
      let params = {
         name: changeItem.name,
         date: changeItem.date
      };

      if (changeItem.name.trim() == "" || changeItem.date.trim() == ""){
         this.setState({showSnackBar: true});
         return;
      }else{
         let areRepetat = false;
         this.state.data.forEach(element => {
            if (id != element.id) {
               if (element.date == changeItem.date){
                  areRepetat = true;
               }
            }
         });

         if (areRepetat) {
            this.setState({ showSnackBar: true });
            return;
         }
      }
      if (itemToEdit != -1){
         params.id = itemToEdit;
      }
      RequestClient.doQuery("/events/new_edit", params).then((rpta)=>{
         let data = this.state.data;
         let newData = data;
         if (!rpta.isSaved){
            changeItem.name = '';
            changeItem.date = '';
            this.setState({ itemToEdit: -1, changeItem: changeItem, onTryNew: false})
            return;
         }
         if (itemToEdit > 0) {
            newData = data.map(element => {
               if (itemToEdit == element.id) {
                  element.name = changeItem.name;
                  element.date = changeItem.date;
               }
               return element;
            });
         } else if (id == -9) {
            changeItem.id = -1;
            let entryItem = rpta.item;
            let item = {
               id  : entryItem.id,
               name: entryItem.description,
               date: entryItem.date
            };
            newData.push(item);
         }
         changeItem.name = '';
         changeItem.date = '';
         this.setState({ itemToEdit: -1, changeItem: changeItem, onTryNew: false, data: newData });
      });
   }
   handleOnClear() {
      let changeItem = this.state.changeItem;
      changeItem.name = "";
      changeItem.date = "";
      this.setState({ itemToEdit: -1,itemToDelete: -1, changeItem: changeItem, onTryNew: false })
   }
   handleOnDelete(id, name, date) {
      if (this.state.onTryNew === true) {
         return;
      }
      let changeItem = this.state.changeItem;
      changeItem.name = name;
      changeItem.date = date;
      this.setState({ itemToDelete: id, changeItem: changeItem })
   }

   getItemEvent(i,id,name,date,status){
      let dateComplete = "";
      if (date != ""){
         let partsDate = date.split("-");
         dateComplete = partsDate[2] + "/" + partsDate[1] + "/" + partsDate[0];
      }
      return <div className="e-table-item" key={i}>
         <div className="e-table-item--min e-table-item--center">{i+1}</div>
         {(()=>{
            if (status == 1){
               return <div className="e-table-item--max">{name}</div>;
            }
            let changeItem = this.state.changeItem;
            return <input type="text" className="e-table-item--max e-input--line" onKeyDown={(e) => { KeyDownFormat.formatTextAlphaNumeric(e)}}
                     value    = {changeItem.name}
                     onChange = {(e)=>{changeItem.name = e.target.value; this.setState({changeItem: changeItem})}}/>
         })()}
         {(()=>{
            if (status == 1){
               return <div className="e-table-item--max e-table-item--center">{dateComplete}</div>
            }
            return <div className="e-table-item--max e-table-item--center">
               <input type="date" name="date_init" id="date_init" min={this.cycle.start} max={this.cycle.finish} defaultValue={date} onChange={(e) => {
                  let changeItem = this.state.changeItem;
                  changeItem.date = e.target.value;
                  this.setState({ changeItem: changeItem })
               }}/>
            </div>;
         })()}
         {(()=>{
            if (status == 1){
               return <div className="e-table-item--medium e-table-item--center">
                  <div className="e-icon e-icon--circle" onClick={() => { this.handleOnEdit(id, name, date)}}>
                     <SvgEdit />
                  </div>
                  <div className="e-icon e-icon--circle" onClick={() => { this.handleOnDelete(id,name,date)}}>
                     <SvgDelete />
                  </div>
               </div>
            }
            return <div className="e-table-item--medium e-table-item--center">
               <div className="e-icon e-icon--circle e-table-item--icon_save" onClick={() => { this.handleOnSave(id)}}>
                  <SvgSave />
               </div>
               <div className="e-icon e-icon--circle e-table-item--icon_cancel"
                  onClick={() => { this.handleOnClear()}}>
                  <SvgClear />
               </div>
            </div>
         })()}

      </div>
   }

   executeDelete(){
      let id = this.state.itemToDelete;
      let params = {};
      if (id != -1) {
         params.id = id;
      }
      RequestClient.doQuery("/events/delete", params).then((rpta)=>{
         let data = this.state.data;
         let emptyItem = {
            name: '',
            date: ''
         };
         if (!rpta.isSaved) {
            this.setState({ itemToDelete: -1, changeItem: emptyItem })
            return;
         }else{
            let newData = data.filter(element => {
               if (id !== element.id) {
                  return element;
               }
            });
            this.setState({ data: newData, itemToDelete: -1, changeItem: emptyItem})
         }
      });
   }

   getDialog(){
      let isOpen = (this.state.itemToDelete != -1);
      return <Dialog onClose={() => { this.handleOnClear()}} className="e-dialog" aria-labelledby="simple-dialog-title" open={isOpen}>
         <DialogTitle id="simple-dialog-title">¿Desea eliminar "{this.state.changeItem.name}"?</DialogTitle>
         <div className="e-dialog-buttons">
            <Button className="c-button e-dialog-button-c_normal" onClick={() => { this.handleOnClear()}}>
               <div>No</div>
            </Button>
            <Button className="c-button e-dialog-button-c_red" onClick={() => { this.executeDelete()}}>
               <div>Sí</div>
            </Button>
         </div>
      </Dialog>
   }
}

export default Body;
