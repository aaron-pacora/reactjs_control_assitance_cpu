import validator from 'validator';

class KeyDownFormat {
   formatNumber(e) {
      if (this.isAllowedKey(e.which)) {
         let newKey;
         newKey = e.key.replace(/[^0-9]/g, "");
         if (newKey == '') {
            e.key = '';
            e.preventDefault();
         }
      }
   }
   formatPrice(e) {
      if (this.isAllowedKey(e.which)) {
         let $this, valPrice, dotPosition, indexInText;
         let newKey;
         $this       = $(this);
         valPrice    = $this.val();
         indexInText = $this.get(0).selectionStart;

         dotPosition = valPrice.indexOf('.');
         if (dotPosition != -1) {
            newKey = e.key.replace(/[^0-9|]/g, "");
            if (indexInText > dotPosition) {
               let part = valPrice.substring(dotPosition);
               if (part.length == 3) {
                  e.key = '';
                  e.preventDefault();
               }
            }
         } else {
            newKey = e.key.replace(/[^0-9|\.]/g, "");
         }
         if (newKey == '') {
            e.key = '';
            e.preventDefault();
         }
      }
   }
   putComma(e) {
      if (this.isAllowedKey(e.which) || e.which == 8) {
         let $this,      valPrice,  lenthPrice, arr, arrPrice, count = 1, word = '', decimal, posText;
             $this      = $(this);
             valPrice   = $this.val();
             posText    = valPrice.split(',').length - 1;
             posText    = $this.get(0).selectionStart - posText;
             arr        = valPrice.split('.');
             valPrice   = arr[0].replace(/,/g, '');
             decimal    = arr[1] != undefined ? "." + arr[1] : '';
             lenthPrice = valPrice.length;
             arrPrice   = valPrice.split('');

         for (var i = lenthPrice - 1; i > -1; i--) {
            if (count == 3 && i != 0) {
               word  = "," + arrPrice[i] + word;
               count = 0;
               posText++;
            } else {
               word = arrPrice[i] + word;
            }
            count++;
         }
         decimal = decimal.replace(/,/g, '');
         decimal = decimal.substring(0, 3);
         $this.val(word + decimal);
         $this.get(0).setSelectionRange(posText, posText);
      }
   }
   onLostFocus(e) {
      let $this, valPrice, lenthPrice, arr, arrPrice, decimal;
      $this    = $(this);
      valPrice = $this.val();
      arr      = valPrice.split('.');
      decimal  = arr[1] != undefined ? "." + arr[1] + "00" : '.00';
      decimal  = decimal.substring(0, 3);
      arrPrice = arr[0] == '' ? "0" : arr[0];
      $this.val(arrPrice + decimal);
   }
   formatDecimal(e) {
      if (this.isAllowedKey(e.which)) {
         let newKey;

         newKey = e.key.replace(/[^0-9|\.|\,]/g, "");

         if (newKey == '') {
            e.preventDefault();
         }
      }
   }
   formatDecimalPress(e) {
      let $this, result, restrict;

      $this = $(this);

      result   = this.convertButtonKeyBoard(this, e);
      restrict = this.restrictLenghtDecimals(this);

      if (restrict) {
         return false;
      }

      return result;
   }
   formatText(e) {
      if (this.isAllowedKey(e.which)) {
         let newKey;

         newKey = e.key.replace(/[^'A-zñáéíóú ÑÁÉÍÓÚ\.]|[\^\\_]/g, "");

         if (newKey == '') {
            e.preventDefault();
         }
      }
   }
   formatTextAlphaNumeric(e) {
      if (this.isAllowedKey(e.which)) {
         let newKey;

         newKey = e.key.replace(/[^'A-zñáéíóú ÑÁÉÍÓÚ\.0-9]|[\^\\_]/g, "");

         if (newKey == '') {
            e.preventDefault();
         }
      }
   }
   formatDescription(e) {
      if (this.isAllowedKey(e.which)) {
         let newKey;

         newKey = e.key.replace(/[^'A-zñáéíóú ÑÁÉÍÓÚ0-9.,;-°]|\|/g, "");

         if (newKey == '') {
            e.preventDefault();
         }
      }
   }
   formatAlphanum(e) {
      if (this.isAllowedKey(e.which)) {
         let newKey;

         newKey = e.key.replace(/[^A-zñáéíóú ÑÁÉÍÓÚ0-9]|[\[\]\\\_\^]/g, "");

         if (newKey == '') {
            e.preventDefault();
         }
      }
   }
   formatStatement(e) {
      if (this.isAllowedKey(e.which)) {
         let newKey;

         newKey = e.key.replace(/[^'A-zñáéíóú ÑÁÉÍÓÚ|-|0-9|,().|\-]|\\|\'|\^|\[|\]/g, "");

         if (newKey == '') {
            e.preventDefault();
         }
      }
   }
   formatAddress(e) {
      if (this.isAllowedKey(e.which)) {
         let newKey;

         newKey = e.key.replace(/[^'A-zñáéíóú ÑÁÉÍÓÚ|-|0-9|,|@|.|:|/|?|=|-|°]|\\|\'|\^|\|/g, "");
         if (newKey == '') {
            e.preventDefault();
         }
      }
   }
   formatEmail(e) {
      if (this.isAllowedKey(e.which) && e.which != 81) {
         let newKey;

         newKey = e.key.replace(/[^'A-zñáéíóúÑÁÉÍÓÚ@.0-9-]|[\[\]\^']|[\^\\-]/g, "");

         if (newKey == '') {
            e.preventDefault();
         }
      }
   }
   formatWebAddress(e) {
      if (this.isAllowedKey(e.which)) {
         let newKey;

         newKey = e.key.replace(/[^'A-zñáéíóú ÑÁÉÍÓÚ|-|0-9|,|@|.|:|/|?|=|-]|\\|\'|\^|\|/g, "");
         if (newKey == '') {
            e.preventDefault();
         }
      }
   }
   convertButtonKeyBoard(This, e) {
      if ($(This).val().indexOf('.') != -1 || $(This).val().indexOf(',') != -1) {
         if (String.fromCharCode(e.which) == ',' || String.fromCharCode(e.which) == '.') {
            return false;
         }
      }
      else if (String.fromCharCode(e.which) == ',') {
         // IE
         if (document.selection) {
            var range      = document.selection.createRange();
                range.text = '.';
            // Chrome + FF
         } else if (This.selectionStart || This.selectionStart == '0') {

            var start = This.selectionStart;
            var end   = This.selectionEnd;

            $(This).val($(This).val().substring(0, start) + '.'
               + $(This).val().substring(end, $(This).val().length));

            This.selectionStart = start + 1;
            This.selectionEnd   = start + 1;
         } else {
            $(This).val($(This).val() + '.');
         }
         return false;
      }
   }

   restrictLenghtDecimals(This) {
      let position      = 0;
      let countDecimals = 0;

      if ($(This).val().indexOf('.') != -1) {
         position      = $(This).val().indexOf('.');
         countDecimals = $(This).val().substring(position, $(This).val().length).length;
      }
      else if ($(This).val().indexOf(',') != -1) {
         position      = $(This).val().indexOf(',');
         countDecimals = $(This).val().substring(position, $(This).val().length).length;
      }
      return (countDecimals > 2) ? true: false;
   }

   isAllowedKey(keyWhich) {
      return keyWhich != 8 && keyWhich != 37 && keyWhich != 39 && keyWhich != 9 && keyWhich != 46;
   }
}

export default (new KeyDownFormat());

