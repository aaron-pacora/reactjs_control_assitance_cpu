const express = require("express");
const next    = require("next");
const validator =require("validator")
const dev    = process.env.NODE_ENV !== "production";
const PORT   = 8080;
if (dev == 'production'){
   PORT   = 8100;
}
// para Prodicció  NODE_ENV=production node server/index.js
const app    = next({ dev });
// const routes = require('./routes')
// const handle = app.getRequestHandler(routes);
const handle = app.getRequestHandler();
// sudo sysctl fs.inotify.max_user_watches = 582222 && sudo sysctl - p
app
   .prepare()
   .then(() => {
      const server = express();
      const showRoutes = require("./routes/index.js");

      server.use("/api", showRoutes);
      server.get("/asistencias/:id",(req, res)=>{
         const  id =req.params.id;
         if(!validator.isInt(id)) return handle(req, res);
         const actualPage = '/asistencias/profile'
         const queryParams = { id }
         app.render(req, res, actualPage, queryParams)
      })
      server.get("/asistencias/profile",(req,res)=>{
         app.render404(req,res,"hol");
      });
      server.get("*", (req, res) => {
         return handle(req, res);
      });

      server.listen(PORT, err => {
         if (err) throw err;
         console.log(`> Ready on http://localhost:${PORT}`);
      });
   })
   .catch(ex => {
      console.error(ex.stack);
      process.exit(1);
   });
