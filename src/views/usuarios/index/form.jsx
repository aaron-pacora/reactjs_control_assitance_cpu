import React, { Component } from 'react';
import Button from 'components/Button';

import DialogTitle from '@material-ui/core/DialogTitle';
import Snackbar from '@material-ui/core/Snackbar';
import MenuItem from '@material-ui/core/MenuItem';
import Dialog from '@material-ui/core/Dialog';
import Select from '@material-ui/core/Select';

import validator from 'validator';

import SvgSave from 'icons/svg_save_icon.svg';
import SvgEdit from 'icons/svg_edit.svg';
import SvgDelete from 'icons/svg_delete.svg';
import SvgClear from 'icons/svg_clear.svg';

import RequestClient from 'utils/requestClient';
import KeyDownFormat from 'utils/keyDownFormat';

class Body extends Component {

   constructor(props) {
      super(props);
      this.typeUsers = props.typeUsers;
      this.state = {
         data: props.data,
         changeItem: {
            user_id       : -1,
            email         : "",
            type_user_id  : -1,
            type_user_name: "",
            showSnackBar  : false
         },
         itemToEdit  : -1,      // -9 intetando crear
         onTryNew    : false,
         onTryDelete : false,
         itemToDelete: -1
      }
   }

   componentWillReceiveProps(props) {
      this.setState({ data: props.data });
   }

   render() {
      return (
         <div className="p-users-body">
            <div className="p-users-body-button">
               <div className="e-title">Lista de Usuarios</div>
               {(() => {
                  if (this.state.onTryNew == false && this.state.itemToEdit == -1) {
                     return <Button className="c-button" onClick={() => {
                        this.setState({ onTryNew: true });
                     }}>
                        <div>Nuevo Usuario</div>
                     </Button>;
                  }
               })()}
            </div>
            <div className="e-table">
               <div className="e-table-header">
                  <div className="e-table-item--min">N°</div>
                  <div className="e-table-item--max e-table-item--email">Usuario</div>
                  <div className="e-table-item--max">Tipo de Usuario</div>
                  <div className="e-table-item--medium">Acciones</div>
               </div>

               <div className="e-table-content">
                  {(() => {
                     let list = [];
                     list = this.state.data.map((element, i) => {
                        let status = 1;
                        if (this.state.itemToEdit == element.user_id) {
                           status = 0;
                        }
                        return this.getItemUser(i, element, status);
                     });
                     return list;
                  })()}
                  {(() => {
                     if (this.state.onTryNew) {
                        let element = {
                           user_id       : -9,
                           email         : "",
                           type_user_id  : -1,
                           type_user_name: "",
                        }
                        return this.getItemUser(this.state.data.length, element, 0)
                     }
                  })()}
               </div>
            </div>
            {this.getDialog()}
            {this.getSnackBar()}
         </div>
      );
   }

   handleOnEdit(element) {
      if (this.state.onTryNew === true) {
         return;
      }
      this.setState({ itemToEdit: element.user_id, changeItem: element })
   }
   handleOnSave(user_id) {
      let changeItem = Object.assign({},this.state.changeItem);
      if (!validator.isEmail(changeItem.email)){
         this.setState({ showSnackBar: true });
         return;
      }
      if (changeItem.type_user_id == -1 || changeItem.type_user_id == null){
         this.setState({ showSnackBar: true });
         return;
      }else{
         let areRepetat = false;
         this.state.data.forEach(element => {
            if (user_id != element.user_id) {
               if (element.email.toUpperCase() == changeItem.email.toUpperCase()) {
                  areRepetat = true;
               }
            }
         });

         if (areRepetat) {
            this.setState({ showSnackBar: true });
            return;
         }
      }

      let itemToEdit = this.state.itemToEdit;
      let params = {
         email       : changeItem.email,
         type_user_id: changeItem.type_user_id
      };
      if (itemToEdit != -1) {
         params.current_user_id = itemToEdit;
      }
      RequestClient.doQuery("/user/new_edit", params).then((rpta) => {
         let data = this.state.data;
         let newData = data;
         if (!rpta.isSaved) {
            changeItem.email = '';
            changeItem.type_user_id = -1;
            this.setState({ itemToEdit: -1, changeItem: changeItem, onTryNew: false })
            return;
         }
         if (itemToEdit > 0) {
            newData = data.map(element => {
               if (itemToEdit == element.user_id) {
                  element.email        = changeItem.email;
                  element.type_user_id = changeItem.type_user_id;
                  element.type_user_name = changeItem.type_user_name;
               }
               return element;
            });
         } else if (user_id == -9) {
            let element            = {};
            element.user_id        = rpta.item.id;
            element.email          = rpta.item.email;
            element.type_user_id   = rpta.type_user_id;
            element.type_user_name = changeItem.type_user_name;
            newData.push(element);
         }
         changeItem.user_id        = -1;
         changeItem.email          = '';
         changeItem.type_user_id   = -1;
         changeItem.type_user_name = '';
         this.setState({ itemToEdit: -1, changeItem: changeItem, onTryNew: false, data: newData });
      });
   }
   handleOnClear() {
      let changeItem = {
         user_id       : -1,
         email         : "",
         type_user_id  : -1,
         type_user_name: "",
      };
      this.setState({ itemToEdit: -1, itemToDelete: -1, changeItem: changeItem, onTryNew: false, showSnackBar : false })
   }
   handleOnDelete(element) {
      if (this.state.onTryNew === true) {
         return;
      }
      let changeItem = element;
      this.setState({ itemToDelete: element.user_id, changeItem: changeItem, showSnackBar: false })
   }

   handleChangeSelect = event => {
      let changeItem = Object.assign({}, this.state.changeItem);
      this.typeUsers.forEach(element => {
         if (element.id == event.target.value){
            changeItem.type_user_name = element.name;
         }
      });
      changeItem.type_user_id = event.target.value;
      this.setState({ changeItem: changeItem  });
   };

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
               let areRepetat = false;
               let user_id    = this.state.itemToEdit;
               let changeItem = Object.assign({}, this.state.changeItem);;
               this.state.data.forEach(element => {
                  if (user_id != element.user_id) {
                     if (element.email == changeItem.email) {
                        areRepetat = true;
                     }
                  }
               });
               if (areRepetat) {
                  return <span id = "message-id">¡El correo debe ser único!</span>;
               }
               return <span id = "message-id">¡Datos no válidos!</span>;
            })()
         }
         action={[]}
      />;
   }

   handleCloseSnackBar = () => {
      this.setState({ showSnackBar: false });
   }

   getItemUser(i, element, status) {
      return <div className="e-table-item" key={i}>
         <div className="e-table-item--min e-table-item--center">{i + 1}</div>
         {(() => {
            if (status == 1) {
               return <div className="e-table-item--max e-table-item--email">
                  <span>{element.email}</span>
               </div>;
            }
            let changeItem = Object.assign({}, this.state.changeItem);
            return <div className="e-table-item--max e-table-item--email">
               <input type      = "text" className = "e-input--line"
                      value     = {changeItem.email}
                      onKeyDown = {(e) => { KeyDownFormat.formatEmail(e) }}
                      onChange  = {(e) => { changeItem.email = e.target.value; this.setState({ changeItem: changeItem }) }} />
            </div>;
         })()}
         {(() => {
            if (status == 1) {
               return <div className="e-table-item--max e-table-item--center">{element.type_user_name}</div>
            }
            return <div className="e-table-item--max e-table-item--center">
               <Select
                  className  = "e-select"
                  value      = {this.state.changeItem.type_user_id}
                  onChange   = {this.handleChangeSelect}
               >
                  {(() => {
                     return this.typeUsers.map((tp) => {
                        return <MenuItem key={tp.id} value={tp.id}>{tp.name}</MenuItem>
                     });
                  })()}
               </Select>
            </div>;
         })()}
         {(() => {
            if (status == 1) {
               return <div className="e-table-item--medium e-table-item--center">
                  <div className="e-icon e-icon--circle" onClick={() => { this.handleOnEdit(element) }}>
                     <SvgEdit />
                  </div>
                  <div className="e-icon e-icon--circle" onClick={() => { this.handleOnDelete(element) }}>
                     <SvgDelete />
                  </div>
               </div>
            }
            return <div className="e-table-item--medium e-table-item--center">
               <div className="e-icon e-icon--circle e-table-item--icon_save" onClick={() => { this.handleOnSave(element.user_id) }}>
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
      if (id != -1) {
         params.current_user_id = id;
      }
      RequestClient.doQuery("/user/delete", params).then((rpta) => {
         let data = this.state.data;
         if (!rpta.isSaved) {
            this.setState({ itemToDelete: -1 })
            return;
         } else {
            let newData = data.filter(element => {
               if (id !== element.user_id) {
                  return element;
               }
            });
            this.setState({ data: newData, itemToDelete: -1 })
         }
      });
   }

   getDialog() {
      let isOpen = (this.state.itemToDelete != -1);
      return <Dialog onClose={() => { this.handleOnClear() }} className="e-dialog" aria-labelledby="simple-dialog-title" open={isOpen}>
         <DialogTitle id="simple-dialog-title">¿Desea eliminar a "{this.state.changeItem.email}"?</DialogTitle>
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
