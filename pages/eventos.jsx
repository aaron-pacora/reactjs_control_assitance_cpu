import React, { Component } from 'react';

import RequestServer from 'utils/requestServer';
import Body from 'views/eventos/index/Body';

import 'sass_pages/eventos/index.sass';

class Events extends Component {

   static async getInitialProps(ctx) {
      let serverProps = { currentPage: "events" };
      let events = await RequestServer.doQuery(ctx, "/events");
      serverProps.data = events;
      let genericData = await RequestServer.doQuery(ctx, "/generic-data");
      serverProps.genericData = genericData;
      return serverProps;
   }

   constructor(props) {
      super(props);
      this.data  = props.data;
      this.cycle = props.genericData.cycle;
   }

   componentDidMount() {
      // if (window.screen.width < 760) {
      //    window.location.href = "/desarrollando-version-movil";
      // }
   }

   render() {
      return (
         <div className="p-events">
            <Body data={this.data} cycle={this.cycle}/>
         </div>
      )
   }
}

export default Events;
