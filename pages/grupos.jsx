import React, { Component } from 'react';

import RequestServer from 'utils/requestServer';
import GroupsView from 'views/grupos/index'
import Button from 'components/Button';


import 'sass_pages/grupos/index.sass';

class Groups extends Component {

   static async getInitialProps(ctx) {
      let serverProps = { currentPage: "groups" };

      let genericData = await RequestServer.doQuery(ctx, "/generic-data");
      let data = await RequestServer.doQuery(ctx, "/groups/validate");
      serverProps.genericData = genericData;
      serverProps.data = data;
      return serverProps;
   }

   constructor(props) {
      super(props);
      this.state = {
         data: props.data,
         stateAdd : "",
         item:null
      }
      this.addGroup = this.addGroup.bind(this);
      this.enabledButton = this.enabledButton.bind(this);
   }

   enabledButton(data){
      this.setState({stateAdd:"",data:data,item:null});
   }

   componentDidMount() {
      // if (window.screen.width < 760) {
      //    window.location.href = "/desarrollando-version-movil";
      // }
   }

   addGroup(){
      let data = this.state.data;
      let object = {
         id: data.length + 1,
         name : "",
         state : "2",
         delete:true
      }
      data.push(object);
      this.setState({data:data,stateAdd:"disabled",item:object});
   }

   render() {
      return (
         <div className="p-groups">
            <div className="g-title_header">
               <div className="e-title">Lista de Grupos</div>
               <Button
                  className = {this.state.stateAdd}
                  onClick = {this.addGroup}
               >Nuevo Grupo</Button>
            </div>
            <GroupsView
               data = {this.state.data}
               enabledButton = {this.enabledButton}
               item = {this.state.item}
            />
         </div>
      )
   }
}

export default Groups;
