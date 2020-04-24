import React from 'react';

export default class Status extends React.Component {
   render() {
      return (
         <div className="status">
            <Detail />
            <Final />
         </div>
      )
   }
}
function Detail(props) {
   return (
      <div className="status__detail">
         
      </div>
   );
}

function Final(props) {
   return (
      <div className="status__final">

      </div>
   );
}
