angular.module('starter')

    // Handlers the Welcome Page
    .controller('LoginCtrl', function($scope, $state, $rootScope, $ionicLoading, $injector, utilsService, authService,
                                      localStorageService, $timeout, bugsnagService) {

        $scope.controller_name = "LoginCtrl";
        console.log("isIos is" + $rootScope.isIos);
        $rootScope.hideNavigationMenu = true;
        $scope.headline = config.appSettings.headline;
        $scope.features = config.appSettings.features;
        var $cordovaFacebook = {};
        if(($rootScope.isIOS || $rootScope.isAndroid) && $injector.has('$cordovaFacebook')){
            $cordovaFacebook = $injector.get('$cordovaFacebook');
        }

        $scope.init = function () {
            Bugsnag.context = "login";
            $scope.hideLoader();
            if($rootScope.helpPopup){
                console.log('Closing help popup!');
                $rootScope.helpPopup.close();
            }
            console.log("login initialized");
            if(!$rootScope.user){
                $rootScope.getUserAndSetInLocalStorage();
            }
            if($rootScope.user){
                $ionicLoading.hide();
                console.log("Already logged in on login page.  Going to default state...");
                $rootScope.hideNavigationMenu = false;
                $state.go(config.appSettings.defaultState);
            }
        };

        $scope.register = function() {
            var register = true;
            $scope.login(register);
        };

        // User wants to login
        $scope.login = function(register) {
            var currentPlaform = config.getPlatform();
            $scope.showLoader('Logging you in...');
            localStorageService.setItem('isWelcomed', true);
            $rootScope.isWelcomed = true;

            if($rootScope.isChromeApp){
                chromeAppLogin(register);
            } else if ($rootScope.isChromeExtension) {
                chromeExtensionLogin(register);
            } else if (ionic.Platform.platform().indexOf('win') > -1) {
                nonNativeMobileLogin(register);
            } else if(ionic.Platform.is('browser')){
                console.log("$scope.login: Browser Detected");
                browserLogin(register);
            } else {
                console.log("$scope.login: Browser and Chrome Not Detected.  Assuming mobile platform");
                nonNativeMobileLogin(register);
            }

            var userObject = localStorageService.getItemAsObject('user');

            $rootScope.user = userObject;

            if($rootScope.user){
                console.debug('login: Setting up user and going to default state');
                $rootScope.setUserForIntercom($rootScope.user);
                $rootScope.setUserForBugsnag($rootScope.user);
                $rootScope.hideNavigationMenu = false;
                $state.go(config.appSettings.defaultState);
                if (typeof analytics !== 'undefined')  {
                    analytics.trackView("Login Controller");
                    analytics.setUserId(userObject.id);
                }

            }
        };

        var getOrSetUserInLocalStorage = function() {
            var userObject = localStorageService.getItemAsObject('user');
            if(!userObject){
                userObject = $rootScope.getUserAndSetInLocalStorage();
            }
            if(userObject){
                console.log('Settings user in getOrSetUserInLocalStorage');
                $rootScope.user = userObject;
                return userObject;
            }

        };

        // get Access Token
        var fetchAccessTokenAndUserDetails = function(authorization_code, withJWT) {
            //$scope.showLoader();
            authService.getAccessTokenFromAuthorizationCode(authorization_code, withJWT)
                .then(function(response) {

                    if(response.error){
                        console.error("Error generating access token");
                        console.log('response', response);
                        localStorageService.setItem('user', null);
                    } else {
                        console.log("Access token received",response);
                        if(typeof withJWT !== "undefined" && withJWT === true) {
                            authService.updateAccessToken(response, withJWT);
                        }
                        else {
                            authService.updateAccessToken(response);
                        }

                        console.debug('get user details from server and going to defaultState...');
                        $rootScope.getUserAndSetInLocalStorage();
                        $rootScope.hideNavigationMenu = false;
                        $rootScope.$broadcast('callAppCtrlInit');
                        $state.go(config.appSettings.defaultState);

                    }
                })
                .catch(function(err){
                    Bugsnag.notify(err, JSON.stringify(err), {}, "error");
                    console.log("error in generating access token", err);
                    // set flags
                    localStorageService.setItem('user', null);
                });
        };

        var nonNativeMobileLogin = function(register) {
            //$scope.showLoader();
            //console.log("nonNativeMobileLogin: Mobile device detected and ionic platform is " + ionic.Platform.platforms[0]);
            console.log(JSON.stringify(ionic.Platform.platforms));

            var url = authService.generateV1OAuthUrl(register);

            console.log('nonNativeMobileLogin: open the auth window via inAppBrowser.');
            // Set location=yes instead of location=no temporarily to try to diagnose intermittent white screen on iOS
            var ref = window.open(url,'_blank', 'location=yes,toolbar=yes');

            $timeout(function () {
                console.log('nonNativeMobileLogin: Automatically closing inAppBrowser auth window after 60 seconds.');
                ref.close();
            }, 60000);

            console.log('nonNativeMobileLogin: listen to its event when the page changes');
            ref.addEventListener('loadstart', function(event) {

                console.log(JSON.stringify(event));
                console.log('nonNativeMobileLogin: The event.url is ' + event.url);
                console.log('nonNativeMobileLogin: The redirection url is ' + config.getRedirectUri());

                console.log('nonNativeMobileLogin: Checking if changed url is the same as redirection url.');
                if(utilsService.startsWith(event.url, config.getRedirectUri())) {

                    console.log('nonNativeMobileLogin: event.url starts with ' + config.getRedirectUri());
                    if(!utilsService.getUrlParameter(event.url,'error')) {

                        var authorizationCode = authService.getAuthorizationCodeFromUrl(event);
                        console.log('nonNativeMobileLogin: Closing inAppBrowser.');
                        ref.close();
                        console.log('nonNativeMobileLogin: Going to get an access token using authorization code.');
                        fetchAccessTokenAndUserDetails(authorizationCode);

                    } else {
                        var errorMessage = "nonNativeMobileLogin: error occurred:" + utilsService.getUrlParameter(event.url, 'error');
                        console.log(errorMessage);
                        bugsnagService.reportError(errorMessage);
                        console.error('nonNativeMobileLogin: close inAppBrowser');
                        ref.close();
                    }
                }

            });
        };

        var chromeAppLogin = function(register){
          //$scope.showLoader();
          console.log("login: Use Chrome app (content script, background page, etc.");
          var url = authService.generateV1OAuthUrl(register);
          chrome.identity.launchWebAuthFlow({
              'url': url,
              'interactive': true
          }, function() {
              var authorizationCode = authService.getAuthorizationCodeFromUrl(event);
              authService.getAccessTokenFromAuthorizationCode(authorizationCode);
          });
        };

        var chromeExtensionLogin = function(register) {
            //$scope.showLoader();
            var loginUrl = config.getURL("api/v2/auth/login");
            if (register === true) {
            loginUrl = config.getURL("api/v2/auth/register");
            }
            console.log("Using Chrome extension, so we use sessions instead of OAuth flow. ");
            chrome.tabs.create({ url: loginUrl });
            console.debug("Closing window");
            window.close();
        };

        $scope.nativeLogin = function(platform, accessToken){
            //$scope.showLoader();
            localStorageService.setItem('isWelcomed', true);
            $rootScope.isWelcomed = true;

            authService.getJWTToken(platform, accessToken)
                .then(function(JWTToken){
                    // success

                    console.log("nativeLogin: Mobile device detected and platform is " + platform);
                    var url = authService.generateV2OAuthUrl(JWTToken);

                    console.log('nativeLogin: open the auth window via inAppBrowser.');
                    var ref = window.open(url,'_blank', 'location=no,toolbar=no');

                    console.log('nativeLogin: listen to event when the page changes.');
                    ref.addEventListener('loadstart', function(event) {

                        console.log("nativeLogin: loadstart event", event);
                        console.log('nativeLogin: check if changed url is the same as redirection url.');

                        if(utilsService.startsWith(event.url, config.getRedirectUri())) {

                            if(!utilsService.getUrlParameter(event.url,'error')) {

                                var authorizationCode = authService.getAuthorizationCodeFromUrl(event);

                                console.log('nativeLogin: Got authorization code: ' + authorizationCode + ' Closing inAppBrowser.');
                                ref.close();

                                var withJWT = true;
                                // get access token from authorization code
                                fetchAccessTokenAndUserDetails(authorizationCode, withJWT);
                            } else {
                                var errorMessage = "nativeLogin: error occurred: " + utilsService.getUrlParameter(event.url, 'error');
                                bugsnagService.reportError(errorMessage);
                                console.error(errorMessage);

                                // close inAppBrowser
                                ref.close();
                            }
                        }

                    });
                }, function(){
                    // error

                    $ionicLoading.hide();
                    console.log("error occurred, couldn't generate JWT");
                });
        };

        // log in with google
        $scope.googleLogin = function(register){
            $scope.showLoader('Logging you in...');
            document.addEventListener('deviceready', deviceReady, false);
            function deviceReady() {
                //I get called when everything's ready for the plugin to be called!
                console.log('Device is ready!');
                window.plugins.googleplus.login({
                        'scopes': 'email https://www.googleapis.com/auth/fitness.activity.write https://www.googleapis.com/auth/fitness.body.write https://www.googleapis.com/auth/fitness.nutrition.write https://www.googleapis.com/auth/plus.login', // optional, space-separated list of scopes, If not included or empty, defaults to `profile` and `email`.
                        'webClientId': '1052648855194.apps.googleusercontent.com', // optional clientId of your Web application from Credentials settings of your project - On Android, this MUST be included to get an idToken. On iOS, it is not required.
                        'offline': true // optional, but requires the webClientId - if set to true the plugin will also return a serverAuthCode, which can be used to grant offline access to a non-Google server
                    },
                    function (userData) {
                        $ionicLoading.hide();
                        console.debug('successfully logged in');
                        console.debug('google->', JSON.stringify(userData));
                        var tokenForApi = null;

                        /** @namespace userData.oauthToken */
                        /** @namespace userData.serverAuthCode */
                        if(userData.oauthToken) {
                            console.log('userData.oauthToken is ' + userData.oauthToken);
                            tokenForApi = userData.oauthToken;
                        } else if(userData.serverAuthCode) {
                            console.error('googleLogin: No userData.accessToken!  You might have to use cordova-plugin-googleplus@4.0.8 or update API to use serverAuthCode to get an accessToken from Google...');
                            tokenForApi = userData.serverAuthCode;
                        }

                        if(!tokenForApi){
                            Bugsnag.notify("ERROR: googleLogin could not get userData.oauthToken!  ", JSON.stringify(userData), {}, "error");
                            console.error('googleLogin: No userData.accessToken or userData.idToken provided! Fallback to nonNativeMobileLogin...');
                            nonNativeMobileLogin(register);
                        } else {
                            $scope.nativeLogin('google', tokenForApi);
                        }
                    },
                    function (errorMessage) {
                        $ionicLoading.hide();
                        Bugsnag.notify("ERROR: googleLogin could not get userData!  Fallback to nonNativeMobileLogin...", JSON.stringify(errorMessage), {}, "error");
                        console.error("Google login error: ", errorMessage);
                        console.debug('googleLogin: Fallback to nonNativeMobileLogin...');
                        nonNativeMobileLogin(register);
                    }
                );
            }

        };

        $scope.googleLogout = function(){
            /** @namespace window.plugins.googleplus */
            window.plugins.googleplus.logout(function (msg) {
                console.log("logged out of google!");
            }, function(fail){
                console.log("failed to logout", fail);
            });
        };

        // login with facebook
        $scope.facebookLogin = function(){
            $scope.showLoader('Logging you in...');
            $cordovaFacebook.login(["public_profile", "email", "user_friends"])
                .then(function(success) {
                    // success
                    $ionicLoading.hide();
                    console.log("facebookLogin_success");
                    console.log("facebook->", JSON.stringify(success));
                    var accessToken = success.authResponse.accessToken;

                    if(!accessToken){
                        Bugsnag.notify("ERROR: facebookLogin could not get accessToken!  ", JSON.stringify(success), {}, "error");
                    }

                    $scope.nativeLogin('facebook', accessToken);
                }, function (error) {
                    Bugsnag.notify("ERROR: facebookLogin could not get accessToken!  ", JSON.stringify(error), {}, "error");
                    console.log("facebook login error", error);
                });
        };

        // when user click's skip button
        $scope.skipLogin = function(){
            localStorageService.setItem('isWelcomed', true);
            $rootScope.isWelcomed = true;
            // move to the next screen
            $scope.goToDefaultStateIfWelcomed();
        };

        var browserLogin = function(register) {
            //$scope.showLoader();
            console.log("Browser Login");
            if (config.getClientId() !== 'oAuthDisabled') {
                oAuthBrowserLogin(register);
            } else {
                sendToNonOAuthBrowserLoginUrl(register);
            }
        };

        var sendToNonOAuthBrowserLoginUrl = function(register) {

            var user = getOrSetUserInLocalStorage();
            if(user){
                $rootScope.hideNavigationMenu = false;
                console.debug('sendToNonOAuthBrowserLoginUrl: User logged in so going to defaultState');
                $state.go(config.appSettings.defaultState);
            }
            if(!user){
                var loginUrl = config.getURL("api/v2/auth/login");
                if (register === true) {
                    loginUrl = config.getURL("api/v2/auth/register");
                }
                console.log("sendToNonOAuthBrowserLoginUrl: Client id is oAuthDisabled - will redirect to regular login.");
                loginUrl += "redirect_uri=" + encodeURIComponent(window.location.href.replace('app/login','app/reminders-inbox'));
                console.debug('sendToNonOAuthBrowserLoginUrl: AUTH redirect URL created:', loginUrl);
                var apiUrl = config.getApiUrl();
                var apiUrlMatchesHostName = apiUrl.indexOf(window.location.hostname);
                if(apiUrlMatchesHostName > -1 || $rootScope.isChromeExtension) {
                    $scope.showLoader('Logging you in...');
                    window.location.replace(loginUrl);
                } else {
                    alert("API url doesn't match auth base url.  Please make use the same domain in config file");
                }
            }
        };

        var oAuthBrowserLogin = function (register) {
            //$scope.showLoader();
            var url = authService.generateV1OAuthUrl(register);

            var ref = window.open(url, '_blank');

            if (!ref) {
                alert("You must first unblock popups, and and refresh the page for this to work!");
            } else {
                // broadcast message question every second to sibling tabs
                var interval = setInterval(function () {
                    ref.postMessage('isLoggedIn?', config.getRedirectUri());
                }, 1000);

                // handler when a message is received from a sibling tab
                window.onMessageReceived = function (event) {
                    console.log("message received from sibling tab", event.url);

                    if(interval !== false){
                        // Don't ask login question anymore
                        clearInterval(interval);
                        interval = false;

                        // the url that QuantiModo redirected us to
                        var iframe_url = event.data;

                        // validate if the url is same as we wanted it to be
                        if (utilsService.startsWith(iframe_url, config.getRedirectUri())) {
                            // if there is no error
                            if (!utilsService.getUrlParameter(iframe_url, 'error')) {
                                var authorizationCode = authService.getAuthorizationCodeFromUrl(event);
                                // get access token from authorization code
                                fetchAccessTokenAndUserDetails(authorizationCode);

                                // close the sibling tab
                                ref.close();

                            } else {
                                // TODO : display_error
                                console.error("Error occurred validating redirect url. Closing the sibling tab.",
                                    utilsService.getUrlParameter(iframe_url, 'error'));

                                // close the sibling tab
                                ref.close();
                            }
                        }
                    }
                };

                // listen to broadcast messages from other tabs within browser
                window.addEventListener("message", window.onMessageReceived, false);
            }
        };

        $scope.init();
    });
