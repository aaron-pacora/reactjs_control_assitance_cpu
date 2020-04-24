import axios from 'axios';
import { URLAPI } from './global.url';
import nookies from 'nookies';
import Router from 'next/router';
//see more in-->  https://github.com/axios/axios :v
class RequestServer {
   doQuery(ctx, url, data = {}) {
      return new Promise((resolve, reject) => {
         let obj = {
            method: 'post',
            url: URLAPI + url,
         };
         data.hash = nookies.get(ctx)._scpu;
         obj.data  = data;
         axios(obj)
         .then((response) => {
            let data = response.data;
            let action = data.action;
            if (action !== undefined) {
               if (action == 'logout') {
                  nookies.destroy(ctx, '_scpu');
                  if (ctx.res) {
                     ctx.res.writeHead(302, {
                        Location: '/'
                     })
                     ctx.res.end();
                  } else {
                     Router.push('/');
                  }
               } else {
                  resolve(data);
               }
            } else {
               resolve(data);
            }
         }).catch(() => {
            resolve(null);
         });
      });
   }
}

export default (new RequestServer());

