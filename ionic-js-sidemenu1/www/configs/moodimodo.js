
var getPlatform = function () {


    if(typeof ionic !== "undefined" &&
        typeof ionic.Platform !== "undefined") {
        var currentPlatform = ionic.Platform.platform();
        var currentPlatformVersion = ionic.Platform.version();
        if (currentPlatform.indexOf('win') > -1){
            return 'windows';
        }
        return ionic.Platform.isIOS() ? "iOS" : ionic.Platform.isAndroid() ? "Android" : "Web";
    }
    else {
        return "Unknown Platform";
    }
};

window.config = {
    bugsnag:{
        notifyReleaseStages:['Production','Staging']
    },
    clientSourceName : "MoodiModo "+ getPlatform(),
    domain : 'app.quantimo.do',
    environment: "Development",
    permissions : ['readmeasurements', 'writemeasurements'],
    port : '4417',
    protocol : 'https',
    shoppingCartEnabled : true
};

config.appSettings  = {
    appName : 'MoodiModo',
    linkToChromeExtension : "https://chrome.google.com/webstore/detail/quantimodo-life-tracking/lncgjbhijecjdbdgeigfodmiimpmlelg",
    allowOffline : true,
    loaderImagePath : 'img/pop-tart-cat.gif',
    
    settingsPageOptions :
    {
        showReminderFrequencySelector : true
    },

    defaultState : 'app.remindersInbox',
    welcomeState : 'app.welcome',

    primaryOutcomeVariable : 'Mood',

    appStorageIdentifier: 'MoodiModoData*',

    headline : 'Sync and Analyze Your Data',
    features: [
        ' - Automatically backup and sync your data across devices',
        ' - Track diet, treatments, symptoms, and anything else',
        ' - Analyze your data to see the strongest predictors of your mood'
    ],

    primaryOutcomeVariableDetails : {
        id : 1398,
        name : "Overall Mood",
        variableName: "Overall Mood",
        category : "Mood",
        abbreviatedUnitName : "/5",
        combinationOperation: "MEAN",
        description: 'positive',
        unitName: '1 to 5 Rating'
    },

    primaryOutcomeVariableRatingOptionLabels : [
        'Depressed',
        'Sad',
        'OK',
        'Happy',
        'Ecstatic'
    ],
    /* NEW STUFF */

    primaryOutcomeVariableRatingOptionLowercaseLabels : [
        'depressed',
        'sad',
        'ok',
        'happy',
        'ecstatic'
    ],

    positiveRatingImages : [
        'img/rating/ic_face_depressed.png',
        'img/rating/ic_face_sad.png',
        'img/rating/ic_face_ok.png',
        'img/rating/ic_face_happy.png',
        'img/rating/ic_face_ecstatic.png'
    ],

    negativeRatingImages : [
        'img/rating/ic_face_ecstatic.png',
        'img/rating/ic_face_happy.png',
        'img/rating/ic_face_ok.png',
        'img/rating/ic_face_sad.png',
        'img/rating/ic_face_depressed.png'
    ],

    numericRatingImages : [
        'img/rating/ic_1.png',
        'img/rating/ic_2.png',
        'img/rating/ic_3.png',
        'img/rating/ic_4.png',
        'img/rating/ic_5.png'
    ],

    /* END NEW STUFF */

    welcomeText : "Let's start off by reporting your first mood on the card below",
    primaryOutcomeVariableTrackingQuestion : "How are you?",
    primaryOutcomeVariableAverageText : "Your average mood is ",
    mobileNotificationImage : "file://img/icons/icon_128.png",
    mobileNotificationText : "Time to track!",
    ratingValueToTextConversionDataSet: {
        "1": "depressed",
        "2": "sad",
        "3": "ok",
        "4": "happy",
        "5": "ecstatic"
    },
    ratingTextToValueConversionDataSet : {
        "depressed" : 1,
        "sad" : 2,
        "ok" : 3,
        "happy" : 4,
        "ecstatic": 5
    },

    intro : [
        // screen 1
        {
            img : {
                width : '150',
                height : '150',
                url : 'img/icons/icon.png'
            },
            content : {

                firstP : {
                    visible : true,
                    content : 'Welcome to MoodiModo',
                    classes : 'intro-header positive'
                }, 
                logoDiv : {
                    visible : true,
                    id : 'logo'
                },
                finalP : {
                    visible : true,
                    content : 'MoodiModo allows you track your <span class="positive">mood</span> and identify the hidden factors which may most influence it.',
                    classes : 'intro-paragraph',
                    buttonBarVisible : true   
                }
            }
        },
        {
            img : {
                width : '180',
                height : '180',
                url : 'img/rating/ic_face_ecstatic.png'
            },
            content : {

                firstP : {
                    visible : true,
                    content : 'Thank you for helping us derive a mathematical equation for happiness!',
                    classes : 'intro-paragraph positive'
                }, 
                
                logoDiv : {
                    visible : true,
                    id : 'logo'
                },
                finalP: {
                    visible : true,
                    content : 'Now start tracking and optimize your life!',
                    classes : 'intro-paragraph-small',
                    buttonBarVisible : true
                }
            }
        }
    ],

    helpPopupMessages : {
        "#/app/example" :'You can see and edit your past mood ratings and notes by tapping on any item in the list.  <br/> <br/>You can also add a note by tapping on a mood rating in the list.',
    },

    remindersInbox : {

    },

    wordAliases : {
        
    },

    floatingMaterialButton : {
        button1 : {
            icon: 'ion-android-notifications-none',
            label: 'Add a Reminder',
            stateAndParameters: "'app.reminderSearch'"
        },
        button2 : {
            icon: 'ion-compose',
            label: 'Record a Measurement',
            stateAndParameters: "'app.measurementAddSearch'"
        },
        button3 : {
            icon: 'ion-ios-cloud-download-outline',
            label: 'Import Data',
            stateAndParameters: "'app.import'"
        },
        button4 : {
            icon: 'ion-ios-star',
            label: 'Add a Favorite Variable',
            stateAndParameters: "'app.favoriteSearch'"
        }
    },

    menu : [
        {
            title : 'Reminder Inbox',
            href : '#/app/reminders-inbox',
            icon : 'ion-archive'
        },
        {
            title : 'Favorites',
            href : '#/app/favorites',
            icon : 'ion-ios-star'
        },
        {
            title : 'Overall Mood',
            click : 'togglePrimaryOutcomeSubMenu',
            showSubMenuVariable : 'showPrimaryOutcomeSubMenu',
            isSubMenuParent : true,
            collapsedIcon : 'ion-happy-outline',
            expandedIcon : 'ion-chevron-down'
        },
        {
            title : 'Charts',
            isSubMenuChild : true,
            showSubMenuVariable : 'showPrimaryOutcomeSubMenu',
            href : '#/app/track',
            icon : 'ion-arrow-graph-up-right'
        },
        {
            title : 'History',
            isSubMenuChild : true,
            showSubMenuVariable : 'showPrimaryOutcomeSubMenu',
            href : '#/app/history',
            icon : 'ion-ios-list-outline'
        },
        {
            title : 'Positive Predictors',
            isSubMenuChild : true,
            showSubMenuVariable : 'showPrimaryOutcomeSubMenu',
            href : '#/app/predictors/positive',
            icon : 'ion-happy-outline'
        },
        {
            title : 'Negative Predictors',
            isSubMenuChild : true,
            showSubMenuVariable : 'showPrimaryOutcomeSubMenu',
            href : '#/app/predictors/negative',
            icon : 'ion-sad-outline'
        },
        {
            title : 'Manage Reminders',
            click : 'toggleReminderSubMenu',
            showSubMenuVariable : 'showReminderSubMenu',
            isSubMenuParent : true,
            collapsedIcon : 'ion-android-notifications-none',
            expandedIcon : 'ion-chevron-down'
        },
        {
            title : 'All Reminders',
            isSubMenuChild : true,
            showSubMenuVariable : 'showReminderSubMenu',
            href : '#/app/reminders-manage/Anything',
            icon : 'ion-android-globe'
        },
        {
            title : 'Emotions',
            isSubMenuChild : true,
            showSubMenuVariable : 'showReminderSubMenu',
            href : '#/app/reminders-manage/Emotions',
            icon : 'ion-happy-outline'
        },
        {
            title : 'Foods',
            isSubMenuChild : true,
            showSubMenuVariable : 'showReminderSubMenu',
            href : '#/app/reminders-manage/Foods',
            icon : 'ion-ios-nutrition-outline'
        },
        {
            title : 'Physical Activity',
            isSubMenuChild : true,
            showSubMenuVariable : 'showReminderSubMenu',
            href : '#/app/reminders-manage/Physical Activity',
            icon : 'ion-ios-body-outline'
        },
        {
            title : 'Symptoms',
            isSubMenuChild : true,
            showSubMenuVariable : 'showReminderSubMenu',
            href : '#/app/reminders-manage/Symptoms',
            icon : 'ion-sad-outline'
        },
        {
            title : 'Treatments',
            isSubMenuChild : true,
            showSubMenuVariable : 'showReminderSubMenu',
            href : '#/app/reminders-manage/Treatments',
            icon : 'ion-ios-medkit-outline'
        },
        {
            title : 'Vital Signs',
            isSubMenuChild : true,
            showSubMenuVariable : 'showReminderSubMenu',
            href : '#/app/reminders-manage/Vital Signs',
            icon : 'ion-ios-pulse'
        },
        {
            title : 'Record Measurement',
            click : 'toggleTrackingSubMenu',
            showSubMenuVariable : 'showTrackingSubMenu',
            isSubMenuParent : true,
            collapsedIcon : 'ion-compose',
            expandedIcon : 'ion-chevron-down'
        },
        {
            title : 'Track Anything',
            isSubMenuChild : true,
            showSubMenuVariable : 'showTrackingSubMenu',
            href : '#/app/track_factors',
            icon : 'ion-android-globe'
        },
        {
            title : 'Record a Meal',
            isSubMenuChild : true,
            showSubMenuVariable : 'showTrackingSubMenu',
            href : '#/app/track_factors_category/Foods',
            icon : 'ion-ios-nutrition-outline'
        },
        {
            title : 'Rate an Emotion',
            isSubMenuChild : true,
            showSubMenuVariable : 'showTrackingSubMenu',
            href : '#/app/track_factors_category/Emotions',
            icon : 'ion-happy-outline'
        },
        {
            title : 'Rate a Symptom',
            isSubMenuChild : true,
            showSubMenuVariable : 'showTrackingSubMenu',
            href : '#/app/track_factors_category/Symptoms',
            icon : 'ion-ios-pulse'
        },
        {
            title : 'Record a Treatment',
            isSubMenuChild : true,
            showSubMenuVariable : 'showTrackingSubMenu',
            href : '#/app/track_factors_category/Treatments',
            icon : 'ion-ios-medkit-outline'
        },
        {
            title : 'Record Activity',
            isSubMenuChild : true,
            showSubMenuVariable : 'showTrackingSubMenu',
            href : '#/app/track_factors_category/Physical Activity',
            icon : 'ion-ios-body-outline'
        },
        {
            title : 'Record Vital Sign',
            isSubMenuChild : true,
            showSubMenuVariable : 'showTrackingSubMenu',
            href : '#/app/track_factors_category/Vital Signs',
            icon : 'ion-ios-pulse'
        },
        {
            title : 'History',
            click : 'toggleHistorySubMenu',
            showSubMenuVariable : 'showHistorySubMenu',
            isSubMenuParent : true,
            collapsedIcon : 'ion-ios-list-outline',
            expandedIcon : 'ion-chevron-down'
        },
        {
            title : 'All Measurements',
            isSubMenuChild : true,
            showSubMenuVariable : 'showHistorySubMenu',
            href : '#/app/history-all/Anything',
            icon : 'ion-android-globe'
        },
        {
            title : 'Emotions',
            isSubMenuChild : true,
            showSubMenuVariable : 'showHistorySubMenu',
            href : '#/app/history-all/Emotions',
            icon : 'ion-happy-outline'
        },
        {
            title : 'Foods',
            isSubMenuChild : true,
            showSubMenuVariable : 'showHistorySubMenu',
            href : '#/app/history-all/Foods',
            icon : 'ion-ios-nutrition-outline'
        },
        {
            title : 'Symptoms',
            isSubMenuChild : true,
            showSubMenuVariable : 'showHistorySubMenu',
            href : '#/app/history-all/Symptoms',
            icon : 'ion-sad-outline'
        },
        {
            title : 'Treatments',
            isSubMenuChild : true,
            showSubMenuVariable : 'showHistorySubMenu',
            href : '#/app/history-all/Treatments',
            icon : 'ion-ios-medkit-outline'
        },
        {
            title : 'Physical Activity',
            isSubMenuChild : true,
            showSubMenuVariable : 'showHistorySubMenu',
            href : '#/app/history-all/Physical Activity',
            icon : 'ion-ios-body-outline'
        },
        {
            title : 'Vital Signs',
            isSubMenuChild : true,
            showSubMenuVariable : 'showHistorySubMenu',
            href : '#/app/history-all/Vital Signs',
            icon : 'ion-ios-pulse'
        },
        {
            title : 'Locations',
            isSubMenuChild : true,
            showSubMenuVariable : 'showHistorySubMenu',
            href : '#/app/history-all/Location',
            icon : 'ion-ios-location-outline'
        },
        {
            title : 'Import Data',
            href : '#/app/import',
            icon : 'ion-ios-cloud-download-outline'
        },
        {
            title : 'Charts',
            href : '#/app/search-variables',
            icon : 'ion-arrow-graph-up-right'
        },
        {
            title : 'Strongest Predictors',
            click : 'togglePredictorSearchSubMenu',
            showSubMenuVariable : 'showPredictorSearchSubMenu',
            isSubMenuParent : true,
            collapsedIcon : 'ion-ios-analytics',
            expandedIcon : 'ion-chevron-down'
        },
        {
            title : 'For Everyone',
            isSubMenuChild : true,
            showSubMenuVariable : 'showPredictorSearchSubMenu',
            href : '#/app/search-common-relationships',
            icon : 'ion-ios-people'
        },
        {
            title : 'For You',
            isSubMenuChild : true,
            showSubMenuVariable : 'showPredictorSearchSubMenu',
            href : '#/app/search-user-relationships',
            icon : 'ion-person'
        },
        {
            title : 'Positive Mood',
            isSubMenuChild : true,
            showSubMenuVariable : 'showPredictorSearchSubMenu',
            href : '#/app/predictors/positive',
            icon : 'ion-happy-outline'
        },
        {
            title : 'Negative Mood',
            isSubMenuChild : true,
            showSubMenuVariable : 'showPredictorSearchSubMenu',
            href : '#/app/predictors/negative',
            icon : 'ion-sad-outline'
        },
        {
            title : 'Settings',
            href : '#/app/settings',
            icon : 'ion-ios-gear-outline'
        },
        {
            title : 'Help & Feedback',
            href : "#/app/feedback",
            icon : 'ion-ios-help-outline'
        }
    ]
};

config.getEnv = function(){

    var env = "";

    if(window.location.origin.indexOf('local')> -1){
        //On localhost
        env = "Development";
    }
    else if(window.location.origin.indexOf('file://')){
        env = this.environment;
    }
    else if(window.location.origin.indexOf('staging.quantimo.do') > -1){
        env = "Staging";
    }
    else if(window.location.origin.indexOf('app.quantimo.do')){
        env = "Production";
    }

    return env;
};

config.getClientId = function(){
    //if chrome app
    if (window.chrome && chrome.runtime && chrome.runtime.id) {
        return window.private_keys.client_ids.Chrome;
    } else {
        var platform = getPlatform();
        if (platform === "Web") { return window.private_keys.client_ids.Web };
        if (platform === "iOS") { return window.private_keys.client_ids.iOS };
        if (platform === "Android") { return window.private_keys.client_ids.Android };
        if (platform === "windows") { return window.private_keys.client_ids.windows };
        return window.private_keys.client_ids.Web;
    }
};

config.getClientSecret = function(){
    if (window.chrome && chrome.runtime && chrome.runtime.id) {
        return window.private_keys.client_secrets.Chrome;
    } else {
        var platform = getPlatform();
        if (platform === "Web") { return window.private_keys.client_secrets.Web };
        if (platform === "iOS") { return window.private_keys.client_secrets.iOS };
        if (platform === "Android") { return window.private_keys.client_secrets.Android };
        if (platform === "windows") { return window.private_keys.client_secrets.windows };
        return window.private_keys.client_secrets.Web;
    }
};

config.getRedirectUri = function () {
    var currentPlatform = ionic.Platform.platform();
    var currentPlatformVersion = ionic.Platform.version();
    if(!window.private_keys.redirect_uris){
        return 'https://app.quantimo.do/ionic/Modo/www/callback/';
    }
    if (window.chrome && chrome.runtime && chrome.runtime.id) {
        return window.private_keys.redirect_uris.Chrome;
    } else {
        var platform = getPlatform();
        if (platform === "Web") { return window.private_keys.redirect_uris.Web };
        if (platform === "iOS") { return window.private_keys.redirect_uris.iOS };
        if (platform === "Android") { return window.private_keys.redirect_uris.Android };
        if (platform === "windows") { return window.private_keys.redirect_uris.windows };
        return window.private_keys.redirect_uris.Web;
    }
};

config.getApiUrl = function () {
    var currentPlatform = ionic.Platform.platform();
    var currentPlatformVersion = ionic.Platform.version();
    if(!window.private_keys.api_urls){
        return 'https://app.quantimo.do';
    }
    var platform = getPlatform();
    if (window.chrome && chrome.runtime && chrome.runtime.id) {
        return window.private_keys.api_urls.Chrome;
    } else if (platform === 'Web' && window.private_keys.client_ids.Web === 'oAuthDisabled') {
        return window.location.origin;
    } else {
        if (platform === "Web") { return window.private_keys.api_urls.Web };
        if (platform === "iOS") { return window.private_keys.api_urls.iOS };
        if (platform === "Android") { return window.private_keys.api_urls.Android };
        if (platform === "windows") { return window.private_keys.api_urls.windows };
        return window.private_keys.api_urls.Web;
    }
};

config.getAllowOffline = function(){
    return true;
};

config.getPermissionString = function(){

    var str = "";
    for(var i=0; i < config.permissions.length; i++) {
        str += config.permissions[i] + "%20";
    }
    return str.replace(/%20([^%20]*)$/,'$1');

};

config.getProtocol = function () {
    if (typeof ionic !== "undefined") {
        var currentPlatform = ionic.Platform.platform();
        if(currentPlatform.indexOf('win') > -1){
            return 'ms-appx-web';
        }
    }

    return 'https';

};


config.getURL = function (path) {
    var currentPlatform = ionic.Platform.platform();
    var currentPlatformVersion = ionic.Platform.version();
    if(typeof path === "undefined") {
        path = "";
    }
    else {
        path += "?";
    }

    var url = "";

    if(config.getApiUrl() !== "undefined") {
        url = config.getApiUrl() + "/" + path;
    }
    else
    {
        url = config.getProtocol() + "://" + config.domain + "/" + path;
    }

   return url;
};

config.get = function(key){
	return config[key]? config[key] : false;
};


window.notification_callback = function(reportedVariable, reportingTime){
    var startTime  = Math.floor(reportingTime/1000) || Math.floor(new Date().getTime()/1000);
    var keyIdentifier = config.appSettings.appStorageIdentifier;
    var val = false;

    // convert values
    if(reportedVariable === "repeat_rating"){
        val = localStorage[keyIdentifier+'lastReportedPrimaryOutcomeVariableValue']?
        JSON.parse(localStorage[keyIdentifier+'lastReportedPrimaryOutcomeVariableValue']) : false;
    } else {
        val = config.appSettings.ratingTextToValueConversionDataSet[reportedVariable]?
        config.appSettings.ratingTextToValueConversionDataSet[reportedVariable] : false;
    }

    // report
    if(val){
        // update localstorage
        localStorage[keyIdentifier+'lastReportedPrimaryOutcomeVariableValue'] = val;

        var allMeasurementsObject = {
            storedValue : val,
            value : val,
            startTime : startTime,
            humanTime : {
                date : new Date().toISOString()
            }
        };

        // update full data
        if(localStorage[keyIdentifier+'allMeasurements']){
            var allMeasurements = JSON.parse(localStorage[keyIdentifier+'allMeasurements']);
            allMeasurements.push(allMeasurementsObject);
            localStorage[keyIdentifier+'allMeasurements'] = JSON.stringify(allMeasurements);
        }
        
        //update measurementsQueue
        if(!localStorage[keyIdentifier+'measurementsQueue']){
            localStorage[keyIdentifier+'measurementsQueue'] = '[]';
        } else {
            var measurementsQueue = JSON.parse(localStorage[keyIdentifier+'measurementsQueue']);
            measurementsQueue.push(allMeasurementsObject);
            localStorage[keyIdentifier+'measurementsQueue'] = JSON.stringify(measurementsQueue);
        }
    }
};