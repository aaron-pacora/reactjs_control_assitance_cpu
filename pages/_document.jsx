import React from 'react';
import PropTypes from 'prop-types';

import flush from 'styled-jsx/server';
import Document, { Head, Main, NextScript } from "next/document";

export default class MyDocument extends Document {
   render() {
      const { pageContext } = this.props;
      return (
         <html lang="es">
               <Head>
                  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
                  <meta name="robots" content="noindex"/>
                  {/* <title>Sistema de Control de Reportes</title> */}
                  <meta name="theme-color" content={pageContext.theme.palette.primary.main} />
                  <link rel="icon" type="image/x-icon" href="/static/logo_cpu.png" />
               </Head>
               <body>
                  <Main />
                  <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:300,400,500"/>
                  <script src="https://cdn.jsdelivr.net/npm/js-cookie@2/src/js.cookie.min.js"></script>
                  <NextScript />
               </body>
         </html>
      );
   }
}

MyDocument.getInitialProps = ctx => {
  let pageContext;
  const page = ctx.renderPage(Component => {
    const WrappedComponent = props => {
      pageContext = props.pageContext;
      return <Component {...props} />;
    };

    WrappedComponent.propTypes = {
      pageContext: PropTypes.object.isRequired,
    };

    return WrappedComponent;
  });

  return {
    ...page,
    pageContext,
    styles: (
      <React.Fragment>
        <style
          id="jss-server-side"
          dangerouslySetInnerHTML={{ __html: pageContext.sheetsRegistry.toString() }}
        />
        {flush() || null}
      </React.Fragment>
    ),
  };
};

