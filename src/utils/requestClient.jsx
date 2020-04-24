import axios from 'axios';
import { URLAPI } from './global.url';
import nookies from 'nookies';
//see more in-->  https://github.com/axios/axios :v
class RequestClient {
   doQuery(url, data = {}) {
      return new Promise((resolve, reject) => {
         let obj = {
            method: 'post',
            url   : URLAPI + url,
         };
         if ((data instanceof FormData) == true) {
            data.append("hash", nookies.get()._scpu);
         } else {
            data.hash = nookies.get()._scpu;
         }
         obj.data = data;
         axios(obj)
            .then((response) => {
               let data = response.data;
               let action = data.action;
               if (action !== undefined){
                  if (action == 'logout'){
                     nookies.remove('_scpu');
                     window.location.href = "/";
                  }else{
                     resolve(data);
                  }
               }else{
                  resolve(data);
               }
            }).catch(() => {
               resolve(null);
            });
      });
   }

   doLogout(cookies){
      return new Promise((resolve, reject) => {
         let obj = {
            method: 'post',
            url: URLAPI + '/user/logout',
         };
         obj.data = {
            hash: cookies.get('_scpu')
         };
         axios(obj)
            .then((response) => {
               window.location.href = "/";
               cookies.remove('_scpu');
               resolve(response.data.isLogOut);
            }).catch(() => {
               resolve(false);
            });
      });
   }

   deleteCookie(ctx){
      nookies.destroy(ctx,'_scpu');
   }

   redirectNotLogin(ctx){
      let cookiesCpu = nookies.get(ctx)._scpu;
      if (cookiesCpu === undefined){
         ctx.res.redirect("/");
      }
   }
   redirectLogin(ctx){
      let cookiesCpu = nookies.get(ctx)._scpu;
      if (cookiesCpu !== undefined) {
         ctx.res.redirect("/alumnos");
      }
   }

   forceRedirect(ctx,route = "/alumnos"){
      ctx.res.redirect(route);
   }

}

export default (new RequestClient());

