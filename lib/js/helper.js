/**
 * Created by nbugash on 04/12/15.
 */
var AppSpiderValidateHelper = {
    convertToString: function(type, data, separator, isnewline ) {
        switch(separator.trim()) {
            case '=':
                separator = '=';
                break;
            default:
                separator = ': ';
                break;
        }
        if (!isnewline) {
            isnewline = '; '
        } else {
            isnewline = '\n'
        }
        var str = "";
        switch (type.toUpperCase()) {
            case 'JSON':
                for (var key in data){
                    if (key === 'COOKIE') {
                        str = str + key + separator + AppSpiderValidateHelper.convertToString('JSON', data[key],'=', false) + isnewline;
                    } else {
                        str = str + key + separator + data[key] + isnewline;
                    }
                }
                break;
            default :
                break;
        }
        return str;
    },

    convertToJSON: function(type, data){
        var jsonObj = {};
        switch (type.toUpperCase()){
            case 'STRING':
                var array = data.split("\n");
                for (var i = 0; i < array.length; i++){
                    if (array[i].indexOf(':') > -1 ){
                        var a = array[i].split(':');
                        jsonObj[a[0].trim()] = a[a.length - 1].trim();
                    }
                }
                break;
            case 'ARRAY':
                for(var i = 0; i < data.length; i++) {
                    if (data[i].indexOf('=') > -1) {
                        var a = data[i].split('=');
                        jsonObj[a[0].trim()] = a[a.length -1].trim();
                    }
                }
            default:
                break;
        }
        return jsonObj;
    }
};