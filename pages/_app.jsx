import App, { Container } from 'next/app';
import React from 'react';
import withReduxStore from 'r-redux/with-redux-store.jsx';

import { Provider } from 'react-redux';

import DataMenu from '../src/layout/home/data_menu.jsx';

import Header from '../src/layout/home/header';
import Menu from '../src/layout/home/menu';

import RequestClient from 'utils/requestClient';
import Fn from 'utils/functions';
import 'sass/config/base.sass';

import { MuiThemeProvider } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import JssProvider from 'react-jss/lib/JssProvider';
import getPageContext from 'src/theme-css-in-js/getPageContext';



class MyApp extends App {
   static async getInitialProps({ Component, router, ctx }) {
      let pageProps = {}

      if (Component.getInitialProps) {
         pageProps = await Component.getInitialProps(ctx)
      }

      if (Fn.existsValue(pageProps, null) != null){
         if (Fn.existsValue(pageProps.statusCode, 0) == 500) {
            RequestClient.deleteCookie(ctx);
         }
      }

      let route = router.route;
      let routesWithoutLayout = ["/", "/olvido-contrasena","/olvido-contrasena/recuperacion"];
      let isNotViewLogin = !(routesWithoutLayout.includes(route));
      if (isNotViewLogin){
         RequestClient.redirectNotLogin(ctx);
         let genericData = Fn.existsValue(pageProps.genericData, null);
         if (genericData == null){
            RequestClient.forceRedirect(ctx);
         }else{
            if (genericData.menu != undefined){
               let pathToAccess = DataMenu['generic'].paths;
               genericData.menu.forEach(element => {
                  pathToAccess = pathToAccess.concat(DataMenu[element.code].paths);
               });
               let partsRoute = route.split("/").filter(m => m);
               let hasAccess = false;
               pathToAccess.forEach(element => {
                  if (element == ("/" + partsRoute[0])){
                     hasAccess = true;
                  }
               });
               if (!hasAccess){
                  RequestClient.forceRedirect(ctx,genericData.menu[0].url);
               }

            }
         }
      }else{
         RequestClient.redirectLogin(ctx);
      }
      return { pageProps, isNotViewLogin }
   }

   constructor(props){
      super(props);
      this.pageContext = getPageContext();
   }
   componentDidMount(){
      const jssStyles = document.querySelector('#jss-server-side');
		if (jssStyles && jssStyles.parentNode) {
			jssStyles.parentNode.removeChild(jssStyles);
		}
   }
   render() {
      const { Component, pageProps, reduxStore, isNotViewLogin } = this.props;
      if (isNotViewLogin){
         let genericData = Fn.existsValue(pageProps.genericData, {});
         let dataMenu = Fn.existsValue(genericData.menu, []);
         return <Container>
            <Provider store={reduxStore}>
               <div className="e-main_page">
                  <Header />
                  <JssProvider
                     registry={this.pageContext.sheetsRegistry}
                     generateClassName={this.pageContext.generateClassName}>

                     <MuiThemeProvider
                        theme={this.pageContext.theme}
                        sheetsManager={this.pageContext.sheetsManager}>

                        <CssBaseline />
                           <div className="e-main_page--content">
                              <Menu dataMenu={dataMenu} selected={pageProps.currentPage} />
                              <div className={"e-main_page--component"}>
                                 <Component {...pageProps} pageContext={this.pageContext} />
                              </div>
                           </div>

                     </MuiThemeProvider>
                  </JssProvider>
               </div>
            </Provider>
         </Container>
      }
      return <Container>
         <Provider store={reduxStore}>
            <JssProvider
               registry={this.pageContext.sheetsRegistry}
               generateClassName={this.pageContext.generateClassName}>
               <MuiThemeProvider
                  theme={this.pageContext.theme}
                  sheetsManager={this.pageContext.sheetsManager}>
                  <CssBaseline />
                  <Component {...pageProps} pageContext={this.pageContext} />
               </MuiThemeProvider>
            </JssProvider>
         </Provider>
      </Container>
   }
}

export default withReduxStore(MyApp);
