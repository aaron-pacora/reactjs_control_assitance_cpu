import React, { Component } from 'react';

import DialogTitle from '@material-ui/core/DialogTitle';
import Tooltip from '@material-ui/core/Tooltip';
import Dialog from '@material-ui/core/Dialog';
import Snackbar from '@material-ui/core/Snackbar';

import Button from 'components/Button';

import SvgSave from 'icons/svg_save_icon.svg';
import SvgDelete from 'icons/svg_delete.svg';
import SvgClear from 'icons/svg_clear.svg';
import SvgEdit from 'icons/svg_edit.svg';

import RequestClient from 'utils/requestClient.jsx';
import KeyDownFormat from 'utils/keyDownFormat';

class ViewGroup extends Component{
   constructor(props){
      super(props);
      this.state = {
         data        : this.props.data,
         item        : this.props.item,
         itemToDelete: -1,
         showSnackBar: false
      };
      this.enabledButton    = this.props.enabledButton
      this.editGroup        = this.editGroup.bind(this);
      this.saveGroup        = this.saveGroup.bind(this);
      this.changeInputValue = this.changeInputValue.bind(this);
      this.isEdited         = false;
   }

   componentWillReceiveProps(props){
      this.setState({data:props.data,item:props.item});
   }

   editGroup(i){
      this.isEdited = true
      this.setState({ item: i });
      const data = this.state.data.map((el) => {
         if (el.id == i.id) {
            el.state = "3";
         }else{
            el.state = "1";
         }
         return el;
      });
      this.setState({data:data});
   }

   saveGroup(id,name){
      let params = {
         id : id,
         name : name
      };
      if (name.trim() == "") {
         this.setState({ showSnackBar: true });
         return;
      } else {
         let areRepetat = false;
         this.state.data.forEach(element => {
            if (id != element.id) {
               if (element.name.toUpperCase() == name.toUpperCase()) {
                  areRepetat = true;
               }
            }
         });

         if (areRepetat) {
            this.setState({ showSnackBar: true });
            return;
         }
      }
      if (!this.isEdited) {
         RequestClient.doQuery("/groups/save",params)
         .then((rpta)=>{
            if (rpta){
               this.setState({data:rpta});
               this.enabledButton(rpta);
            }
         });
      } else {
         RequestClient.doQuery("/groups/edit",params)
         .then((rpta)=>{
            if (rpta) {
               this.setState({data:rpta});
               this.isEdited = false;
               this.enabledButton(rpta);
            }
         });
      };
   }

   closeEdited(id,name){
      let array = this.state.data.map((el) => {
         if (el.id == id) {
            el.state = "1";
            el.name = name;
         }
         return el;
      });
      this.setState({ data: array});
   }

   executeDelete(el) {
      let id = el.id;
      let params = {};
      if (id != -1) {
         params.id = id;
      }
      RequestClient.doQuery("/groups/delete", params).then((rpta) => {
         let data = this.state.data;
         if (!rpta) {
            this.setState({ itemToDelete: -1 })
            return;
         } else {
            this.enabledButton(rpta);
            this.setState({itemToDelete:-1, item: null});
         }
      });
   }
   handleOnClear() {
      let item = this.state.item;
      item.name = "";
      this.setState({ itemToDelete: -1, item: item, showSnackBar: false });
   }

   getDialog() {
      let isOpen = (this.state.itemToDelete != -1);
      let name = (this.state.item != null ?  this.state.item.name : "");
      return <Dialog onClose={() => { this.handleOnClear() }} className="e-dialog" aria-labelledby="simple-dialog-title" open={isOpen}>
         <DialogTitle id="simple-dialog-title">¿Desea eliminar "{name}"?</DialogTitle>
         <div className="e-dialog-buttons">
            <Button className="c-button e-dialog-button-c_normal" onClick={() => { this.handleOnClear() }}>
               <div>No</div>
            </Button>
            <Button className="c-button e-dialog-button-c_red" onClick={() => { this.executeDelete(this.state.item) }}>
               <div>Sí</div>
            </Button>
         </div>
      </Dialog>
   }

   cancelAddItem(i){
      this.isEdited = false;
      let array = this.state.data.map((el) => {
         if (el.id == i) {
            if (el.state != 2) {
               el.state = "1";
            }
         }
         return el;
      });
      let data = array.filter( el => el.state != 2);
      this.setState({ item: null, showSnackBar: false});
      this.enabledButton(data);
   }

   changeInputValue(e){
      var item = Object.assign({}, this.state.item);
      if (item != null) {
         item.name = e.target.value;
      }
      this.setState({ item: item});
   }

   renderData(){
      let cont = 0;
      let element = this.state.data.map((el)=>{
         cont += 1;
         return(
            <div className="e-table-item" key={el.id}>
               <div className="e-table-item--min e-table-item--center">
                  {cont}
               </div>
               {(()=>{
                  if (el.state == 1) {
                     return(
                        <div className="e-table-item--max e-table-item--center">
                           {el.name}
                        </div>
                     );
                  } else {
                     return (
                        <input type      = "text"
                               className = "e-table-item--max e-input--line"
                               value     = {this.state.item.name}
                               onKeyDown = {(e) => { KeyDownFormat.formatText(e) }}
                               onChange  = {(e) => {this.changeInputValue(e);}}
                        />
                     );
                  }
               })()}
               {(()=>{
                  if (el.state == 1) {
                     return (
                        <div className="e-table-item--medium e-table-item--center">
                           <Tooltip title="Editar">
                              <div className="e-icon e-icon--circle"
                                   onClick = {()=>{this.editGroup(el);}}
                              >
                                 <SvgEdit />
                              </div>
                           </Tooltip>
                           {(()=>{
                              if (el.delete) {
                                 return(
                                    <Tooltip title="Eliminar">
                                       <div className="e-icon e-icon--circle"
                                          onClick={() => {this.handleOnDelete(el.id,el.name);}}
                                       >
                                          <SvgDelete />
                                       </div>
                                    </Tooltip>
                                 )
                              }
                           })()}
                        </div>
                     )
                  } else {
                     return (
                        <div className="e-table-item--medium e-table-item--center">
                           <Tooltip title="Guardar">
                              <div className="e-icon e-icon--circle e-table-item--icon_save"
                                 onClick={() => { this.saveGroup(el.id, this.state.item.name); }}
                              >
                                 <SvgSave/>
                              </div>
                           </Tooltip>
                           <Tooltip title="Cancelar">
                              <div className="e-icon e-icon--circle e-table-item--icon_cancel"
                                   onClick = {()=>{this.cancelAddItem(el.id);}}
                              >
                                 <SvgClear/>
                              </div>
                           </Tooltip>
                        </div>
                     )
                  }
               })()}
            </div>
         )
      });
      return element;
   }



   handleOnDelete(id, name) {
      let item = this.state.item;
      if(item == null){
         item = {};
      }
      item.id = id;
      item.name = name;
      this.setState({ itemToDelete: id, item: item })
   }

   render(){
      return(
         <div className="e-table">
            <div className="e-table-header">
               <div className="e-table-item--min">N°</div>
               <div className="e-table-item--max">Nombre</div>
               <div className="e-table-item--medium">Acciones</div>
            </div>
            <div className="e-table-content">
               {(()=>{
                  return this.renderData();
               })()}
            </div>
            {this.getDialog()}
            {this.getSnackBar()}
         </div>
      )
   }

   handleCloseSnackBar = () => {
      this.setState({ showSnackBar: false });
   }

   getSnackBar() {
      return <Snackbar
         anchorOrigin = {{
            vertical  : 'bottom',
            horizontal: 'left',
         }}
         open             = {this.state.showSnackBar}
         autoHideDuration = {2000}
         onClose          = {this.handleCloseSnackBar}
         message          = {
            (() => {
               let item = this.state.item;
               if (item == null){
                  return;
               }
               if (item.name.trim() == "") {
                  return <span id="message-id">¡El nombre es necesario!</span>;
               } else {
                  let areRepetat = false;
                  this.state.data.forEach(element => {
                     if (item.id != element.id) {
                        if (element.name.toUpperCase() == item.name.toUpperCase()) {
                           areRepetat = true;
                        }
                     }
                  });

                  if (areRepetat) {
                     return <span id="message-id">¡El nombre debe ser único!</span>;
                  }
               }
               return <span id="message-id">¡Datos no válidos!</span>;
            })()
         }
         action={[]}
      />;
   }

}
export default ViewGroup;
