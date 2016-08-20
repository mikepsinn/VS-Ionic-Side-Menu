angular.module('starter')
    // Measurement Service
    .factory('bugsnagService', function() {
        
        // service methods
        var bugsnagService = {

            reportError : function(exception){
                var message = exception.toString();
                console.error('ERROR: ' + message);
                var stacktrace;
                if(typeof exception.stack !== 'undefined'){
                    stacktrace = exception.stack.toLocaleString();
                } else {
                    stacktrace = "No stack trace provided with exception";
                }
                Bugsnag.apiKey = window.private_keys.bugsnag_key;
                Bugsnag.notify("ERROR: "+message, "Stacktrace: "+stacktrace, {}, "error");
            }
        };

        return bugsnagService;
    });