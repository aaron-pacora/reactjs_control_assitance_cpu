
class SpecualChars {
   convertToHtml(mystring) {
      return mystring.replace(/&/g, "&amp;")
         .replace(/>/g, "&gt;")
         .replace(/</g, "&lt;")
         .replace(/"/g, "&quot;");
   }
}

export default (new SpecualChars());

