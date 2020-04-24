class Functions {
   existsValue(anyValue,defValue=null){
      if (anyValue !== undefined){
         return anyValue;
      }
      return defValue;
   }
   //format YYYY-mm-dd
   getMonth(date){
      const array = ["Enero","Febrero","Marzo","Abril","Mayo","Junio",
                     "Julio","Agosto","Setiembre","Octubre","Noviembre","Diciembre"]
      const month = date.split("-")[1];
      return array[month-1];

   }
   getDay(date){
      return date.split("-")[2];
   }
   isSunday(date) {
      return new Date(date).getUTCDay() === 0;
   }

}

export default  new Functions();

