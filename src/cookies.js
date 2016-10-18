// could be replaced by std lib

let cookies = {
  set: function(name, value, days) {
    var expires;

    if (typeof document === 'undefined') {
      return;
    }

    if (days) {
      var date = new Date();
      date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
      expires = '; expires=' + date.toGMTString();
    } else {
      expires = '';
    }

    document.cookie = name + '=' + value + expires + '; path=/';

  },

  get: function(cName) {
    if (typeof document !== 'undefined' && document.cookie.length > 0) {
      var cStart = document.cookie.indexOf(cName + '=');

      if (cStart !== -1) {
        cStart = cStart + cName.length + 1;
        var cEnd = document.cookie.indexOf(';', cStart);

        if (cEnd === -1) {
          cEnd = document.cookie.length;
        }

        return unescape(document.cookie.substring(cStart, cEnd));
      }
    }
    return '';
  }
};

export default cookies;
