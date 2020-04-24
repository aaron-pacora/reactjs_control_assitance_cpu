import React, { Component } from 'react';
import Button from 'components/Button';

import DialogTitle from '@material-ui/core/DialogTitle';
import Snackbar from '@material-ui/core/Snackbar';
import Checkbox from '@material-ui/core/Checkbox';
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
      this.allModules = props.modules;
      ;
      this.state = {
         data      : this.preProccessData(props.data),
         checkeds  : [],
         changeItem: {
            name: ''
         },
         itemToEdit  : -1,      // -9 intetando crear
         onTryNew    : false,
         onTryDelete : false,
         itemToDelete: -1,
         itemClicked : -1,
         showSnackBar: false
      };
   }

   preProccessData(data){
      return data.map((item)=>{
         let modules = JSON.parse(item.modules);
         if (modules[0].id == null){
            modules = [];
         }
         return {
            id    : item.id,
            name  : item.name,
            delete: item.delete,
            modules
         }
      });
   }

   componentWillReceiveProps(props) {
      this.setState({ data: this.preProccessData(props.data), paginator: props.paginator });
   }

   render() {
      return (
         <div className="p-types_user-form">
            <div className="p-types_user-form-button">
               <div className="e-title">Tipos de Usuarios</div>
               {(() => {
                  if (this.state.onTryNew == false && this.state.itemToEdit == -1) {
                     return <Button className="c-button" onClick={() => {
                        this.setState({ onTryNew: true, itemClicked: -9, itemToEdit: -9, checkeds: []});
                     }}>
                        <div>Nuevo Tipo de Usuario</div>
                     </Button>;
                  }
               })()}
            </div>
            <div className="p-types_user-form-tables">
               <div className="e-table">
                  <div className="e-table-header">
                     <div className="e-table-item--min">N°</div>
                     <div className="e-table-item--max">Nombre</div>
                     <div className="e-table-item--medium">Acciones</div>
                  </div>

                  <div className="e-table-content">
                     {(() => {
                        let list = [];
                        list = this.state.data.map((element, i) => {
                           let status = 1;
                           if (this.state.itemToEdit == element.id) {
                              status = 0;
                           }
                           return this.getItemTypeUser(i, element.id, element.name, element.modules, element.delete, status);
                        });
                        return list;
                     })()}
                     {(() => {
                        if (this.state.onTryNew) {
                           return this.getItemTypeUser(this.state.data.length, -9, "",[],true, 0)
                        }
                     })()}
                  </div>
               </div>
               {(()=>{
                  if (this.state.itemClicked != -1){
                     return this.getTableModules();
                  }
               })()}
               {this.getDialog()}
               {this.getSnackBar()}
            </div>
         </div>
      );
   }

   getSnackBar() {
      return <Snackbar
         anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
         }}
         open             = {this.state.showSnackBar}
         autoHideDuration = {2000}
         onClose          = {this.handleCloseSnackBar}
         message={
            (() => {
               if (this.state.checkeds.length == 0){
                  return <span id="message-id">¡Seleccione al menos un acceso!</span>;
               }
               if (this.state.changeItem.name.trim() == ""){
                  return <span id="message-id">¡El nombre es necesario!</span>;
               }else{
                  let areRepetat = false;
                  let changeItem = this.state.changeItem;
                  this.state.data.forEach(element => {
                     if (this.state.itemToEdit != element.id){
                        if (element.name.toUpperCase() == changeItem.name.toUpperCase()) {
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

   handleCloseSnackBar = () => {
      this.setState({ showSnackBar: false });
   }

   getTableModules(){
      let firstArray  = [];
      let secondArray = [];
      if (this.state.itemToEdit != -1 || this.state.itemClicked == -9){
         firstArray = this.allModules;
         secondArray = this.state.checkeds;
      }else{
         firstArray = this.state.checkeds;
         secondArray = this.allModules
      }
      return <div className="e-table">
         <div className="e-table-header">
            <div className="e-table-item--max">Acceso a</div>
         </div>
         <div className="e-table-content">
            {(() => {
               let list = [];
               list = firstArray.map((element, i) => {
                  if (element.id == null){
                     return null;
                  }
                  let isChecked = false;
                  return <div className="e-table-item" key={i}>
                     {(() => {
                        if (this.state.itemToEdit != -1) {
                           secondArray.forEach(ck => {
                              if (ck.id != null) {
                                 if (ck.id == element.id) {
                                    isChecked = true;
                                 }
                              }
                           });
                           return this.getCheckbox(isChecked, element);
                        }
                        return <div className="e-table-item--min e-table-item--center">{i + 1}</div>;
                     })()}
                     <div className="e-table-item--max">{element.name}</div>
                  </div>;
               });
               return list;
            })()}
         </div>
      </div>;
   }

   getCheckbox(isChecked, element){
      return <Checkbox
         className = "e-table-item--min e-table-item--center e-checkbox"
         checked   = {isChecked}
         color     = "primary"
         onChange  = {(e) => {
            let checkedChange = e.target.checked;
            let newCheckeds   = this.state.checkeds;
            if (checkedChange) {
               newCheckeds.push(element);
            } else {
               newCheckeds = this.state.checkeds.filter((item) => {
                  if (element.id != null) {
                     if (element.id !== item.id) {
                        return item;
                     }
                  }
               });
            }
            this.setState({ checkeds: newCheckeds });
         }}
         value="checkedA"
      />
   }

   handleOnEdit(id, name) {
      if(this.state.onTryNew === true){
         return;
      }
      let changeItem = this.state.changeItem;
      changeItem.name = name;
      this.setState({ itemToEdit: id, changeItem: changeItem })
   }
   handleOnSave(id) {
      let changeItem = this.state.changeItem;
      let itemToEdit = this.state.itemToEdit;
      let params = {
         name   : changeItem.name,
         modules: this.state.checkeds
      };
      if (itemToEdit > 0) {
         params.id = itemToEdit;
      }
      if (changeItem.name.trim() == "" || this.state.checkeds.length == 0) {
         this.setState({ showSnackBar: true });
         return;
      }else{
         let areRepetat = false;
         this.state.data.forEach(element => {
            if (id != element.id) {
               if (element.name.toUpperCase() == changeItem.name.toUpperCase()) {
                  areRepetat = true;
               }
            }
         });

         if (areRepetat){
            this.setState({ showSnackBar: true });
            return;
         }
      }
      RequestClient.doQuery("/types_user/new_edit", params).then((rpta) => {
         let data = this.state.data;
         let newData = data;
         if (!rpta.isSaved) {
            changeItem.name = '';
            this.setState({ itemToEdit: -1, changeItem: changeItem, onTryNew: false, checkeds: [] })
            return;
         }
         if (itemToEdit > 0) {
            newData = data.map(element => {
               if (itemToEdit == element.id) {
                  element.name    = changeItem.name;
                  element.modules = params.modules;
               }
               return element;
            });
         } else if (id == -9) {
            let item = {
               id     : rpta.item.id,
               name   : rpta.item.name,
               modules: params.modules,
               delete : true
            };
            newData.push(item);
         }
         changeItem.id      = -1;
         changeItem.name    = "";
         changeItem.modules = [];
         changeItem.delete = true;
         this.setState({ itemClicked: rpta.id, itemToEdit: -1, changeItem: changeItem, onTryNew: false, data: newData, checkeds: params.modules });
      });
   }
   handleOnClear() {
      let changeItem = this.state.changeItem;
      changeItem.name = "";
      this.setState({ itemToEdit: -1, itemToDelete: -1, changeItem: changeItem, onTryNew: false, itemClicked: -1, checkeds: [] })
   }
   handleOnDelete(id, name) {
      if (this.state.onTryNew === true) {
         return;
      }
      let changeItem = this.state.changeItem;
      changeItem.name = name;
      this.setState({ itemToDelete: id, changeItem: changeItem })
   }

   handleOnClickItem(id, modules){
      if (this.state.onTryNew === true || this.state.itemToEdit == id) {
         return;
      }
      this.setState({ itemClicked: id, checkeds: modules});
   }

   getItemTypeUser(i, id, name,modules,canDelete, status) {
      let isClicked = (this.state.itemClicked == id);
      let classClicked = (isClicked ? "clicked":"");
      return <div className={"e-table-item " + classClicked} key={i} onClick={()=>{this.handleOnClickItem(id,modules)}}>
         <div className="e-table-item--min e-table-item--center">{i + 1}</div>
         {(() => {
            if (status == 1) {
               return <div className="e-table-item--max e-table-item--center">{name}</div>;
            }
            let changeItem = this.state.changeItem;
            return <div className="e-table-item--max e-table-item--center">
               <input type="text" className="e-input--line"
                  onKeyDown = {(e) => { KeyDownFormat.formatText(e) }}
                  value     = {changeItem.name}
                  onChange  = {(e) => { changeItem.name = e.target.value; this.setState({ changeItem: changeItem }) }} />
            </div>;
         })()}
         {(() => {
            if (status == 1) {
               return <div className="e-table-item--medium e-table-item--center">
                  <div className="e-icon e-icon--circle" onClick={() => { this.handleOnEdit(id, name) }}>
                     <SvgEdit />
                  </div>
                  {(()=>{
                     if (canDelete){
                        return <div className="e-icon e-icon--circle" onClick={() => { this.handleOnDelete(id,name) }}>
                           <SvgDelete />
                        </div>;
                     }
                     return <div className="e-icon"></div>;
                  })()}
               </div>
            }
            return <div className="e-table-item--medium e-table-item--center">
               <div className="e-icon e-icon--circle e-table-item--icon_save" onClick={() => { this.handleOnSave(id) }}>
                  <SvgSave />
               </div>
               <div className="e-icon e-icon--circle e-table-item--icon_cancel"
                  onClick={() => { this.handleOnClear() }}>
                  <SvgClear />
               </div>
            </div>
         })()}

      </div>
   }

   executeDelete() {
      let id = this.state.itemToDelete;
      let params = {};
      if (id > 0) {
         params.id = id;
      }
      RequestClient.doQuery("/types_user/delete", params).then((rpta) => {
         let item =  {
            name  : '',
            delete: true
         };
         let data = this.state.data;
         if (!rpta.isSaved) {
            this.setState({ itemToDelete: -1, changeItem: item,  itemClicked: -1, checkeds: [] })
            return;
         } else {
            let newData = data.filter(element => {
               if (id !== element.id) {
                  return element;
               }
            });
            this.setState({ data: newData, changeItem: item, itemToDelete: -1, checkeds: [],itemClicked: -1 })
         }
      });
   }

   getDialog() {
      let isOpen = (this.state.itemToDelete != -1);
      return <Dialog onClose={() => { this.handleOnClear() }} className="e-dialog" aria-labelledby="simple-dialog-title" open={isOpen}>
         <DialogTitle id="simple-dialog-title">¿Desea eliminar "{this.state.changeItem.name}"?</DialogTitle>
         <div className="e-dialog-buttons">
            <Button className="c-button e-dialog-button-c_normal" onClick={() => { this.handleOnClear() }}>
               <div>No</div>
            </Button>
            <Button className="c-button e-dialog-button-c_red" onClick={() => { this.executeDelete() }}>
               <div>Sí</div>
            </Button>
         </div>
      </Dialog>
   }
}

export default Body;
