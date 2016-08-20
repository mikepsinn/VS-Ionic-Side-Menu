angular.module('starter')

	.controller('RemindersInboxCtrl', function($scope, $state, $stateParams, $rootScope, $filter, $ionicPlatform,
											   $ionicActionSheet, $timeout, authService, reminderService, utilsService,
											   notificationService, userService, localStorageService) {

	    $scope.controller_name = "RemindersInboxCtrl";

		console.log('Loading ' + $scope.controller_name);
		
	    $scope.state = {
	    	showMeasurementBox : false,
	    	selectedReminder : false,
	    	reminderDefaultValue : "",
	    	selected1to5Value : false,
	    	allReminders : [
	    	],
	    	trackingRemindersNotifications : [
	    	],
	    	filteredReminderNotifications : [
	    	],
	    	measurementDate : new Date(),
	    	slots : {
				epochTime: new Date().getTime()/1000,
				format: 12,
				step: 1,
				closeLabel: 'Cancel'
			},
			variable : {},
			isDisabled : false,
			title : 'Reminder Inbox',
			loading : true,
			lastButtonPressTimeStamp : 0,
			lastClientX : 0,
			lastClientY : 0
	    };

		if(typeof config.appSettings.remindersInbox.showAddHowIFeelResponseButton !== 'undefined'){
			$scope.state.showAddHowIFeelResponseButton = config.appSettings.remindersInbox.showAddHowIFeelResponseButton;
		}

		if(typeof(config.appSettings.remindersInbox.hideAddNewReminderButton) !== 'undefined'){
			$scope.state.hideAddNewReminderButton = config.appSettings.remindersInbox.hideAddNewReminderButton;
		}

		if(typeof(config.appSettings.remindersInbox.showAddNewMedicationButton) !== 'undefined'){
			$scope.state.showAddNewMedicationButton = config.appSettings.remindersInbox.showAddNewMedicationButton;
		}

		if(typeof(config.appSettings.remindersInbox.showAddVitalSignButton) !== 'undefined'){
			$scope.state.showAddVitalSignButton = config.appSettings.remindersInbox.showAddVitalSignButton;
		}


		var setPageTitle = function(){
			if(typeof(config.appSettings.remindersInbox.title) !== 'undefined'){
				$scope.state.title = config.appSettings.remindersInbox.title;
			}

			if($stateParams.variableCategoryName){
				$scope.state.title = $filter('wordAliases')($stateParams.variableCategoryName) + " " + $filter('wordAliases')("Reminder Inbox");
			}

			if($stateParams.today) {
				$scope.state.title = 'Today';
			}

		};

		var isGhostClick = function ($event) {

				if($event &&
					$scope.state.lastButtonPressTimeStamp > $event.timeStamp - 3000 &&
					$scope.state.lastClientX === $event.clientX &&
					$scope.state.lastClientY === $event.clientY
				) {
					console.debug('This event is probably a ghost click so not registering.', $event);
					return true;
				} else {
					console.debug('This Track event is not a ghost click so registering.', $event);
					$scope.state.lastButtonPressTimeStamp = $event.timeStamp;
					$scope.state.lastClientX = $event.clientX;
					$scope.state.lastClientY = $event.clientY;
					return false;
				}

		};

		$scope.sendChromeEmailLink = function(){
			var subjectLine = "Install%20the%20" + config.appSettings.appName + "%20Chrome%20Browser%20Extension";
			var linkToChromeExtension = config.appSettings.linkToChromeExtension;
			var emailBody = "Did%20you%20know%20that%20you%20can%20easily%20track%20everything%20on%20your%20laptop%20and%20desktop%20with%20our%20Google%20Chrome%20browser%20extension%3F%20%20Your%20data%20is%20synced%20between%20devices%20so%20you%27ll%20never%20have%20to%20track%20twice!%0A%0ADownload%20it%20here!%0A%0A" + encodeURIComponent(linkToChromeExtension)  + "%0A%0ALove%2C%20%0AYou";

			if($rootScope.isMobile){
				$scope.sendWithEmailComposer(subjectLine, emailBody);
			} else {
				$scope.sendWithMailTo(subjectLine, emailBody);
			}
		};


		$scope.track = function(trackingReminderNotification, modifiedReminderValue, $event, dividerIndex, trackingReminderNotificationNotificationIndex){

			if(isGhostClick($event)){
				return;
			}

			$rootScope.filteredTrackingReminderNotifications[dividerIndex].trackingReminderNotifications[trackingReminderNotificationNotificationIndex].hide = true;
			console.debug('Tracking notification', trackingReminderNotification);
			console.log('modifiedReminderValue is ' + modifiedReminderValue);
			var params = {
				trackingReminderNotification: trackingReminderNotification,
				modifiedValue: modifiedReminderValue
			};
			localStorageService.deleteElementOfItemById('trackingReminderNotifications',
				trackingReminderNotification.id);

	    	reminderService.trackReminderNotification(params)
	    	.then(function(){
                notificationService.decrementNotificationBadges();
                if($rootScope.numberOfPendingNotifications < 2){
                    $scope.init();
                }
	    	}, function(err){
				Bugsnag.notify(err, JSON.stringify(err), {}, "error");
				console.error(err);
	    		utilsService.showAlert('Failed to Track Reminder, Try again!', 'assertive');
	    	});
	    };

	    $scope.skip = function(trackingReminderNotification, $event, dividerIndex, trackingReminderNotificationNotificationIndex){

			if(isGhostClick($event)){
				return;
			}

			$rootScope.filteredTrackingReminderNotifications[dividerIndex].trackingReminderNotifications[trackingReminderNotificationNotificationIndex].hide = true;

			console.debug('Skipping notification', trackingReminderNotification);
            localStorageService.deleteElementOfItemById('trackingReminderNotifications',
                trackingReminderNotification.id);
			var params = {
				trackingReminderNotificationId: trackingReminderNotification.id
			};
	    	reminderService.skipReminderNotification(params)
	    	.then(function(){
                notificationService.decrementNotificationBadges();
                if($rootScope.numberOfPendingNotifications < 2){
                    $scope.init();
                }
	    	}, function(err){
				Bugsnag.notify(err, JSON.stringify(err), {}, "error");
	    		utilsService.showAlert('Failed to Skip Reminder, Try again!', 'assertive');
				console.error(err);
	    	});
	    };

	    $scope.snooze = function(trackingReminderNotification, $event, dividerIndex, trackingReminderNotificationNotificationIndex){

			if(isGhostClick($event)){
				return;
			}

			$rootScope.filteredTrackingReminderNotifications[dividerIndex].trackingReminderNotifications[trackingReminderNotificationNotificationIndex].hide = true;

			console.debug('Snoozing notification', trackingReminderNotification);
			localStorageService.deleteElementOfItemById('trackingReminderNotifications',
				trackingReminderNotification.id);
			var params = {
				trackingReminderNotificationId: trackingReminderNotification.id
			};
	    	reminderService.snoozeReminderNotification(params)
	    	.then(function(){
                notificationService.decrementNotificationBadges();
                if($rootScope.numberOfPendingNotifications < 2){
                    $scope.init();
                }
	    	}, function(err){
				Bugsnag.notify(err, JSON.stringify(err), {}, "error");
				console.error(err);
	    		utilsService.showAlert('Failed to Snooze Reminder, Try again!', 'assertive');
	    	});
	    };

	    $scope.init = function(){
			Bugsnag.context = "reminderInbox";
			$rootScope.showAllCaughtUpCard = false;
			setPageTitle();
			authService.checkAuthOrSendToLogin();
			if (typeof analytics !== 'undefined')  { analytics.trackView("Reminders Inbox Controller"); }

			$scope.showHelpInfoPopupIfNecessary();
			if(!$stateParams.today){
				$rootScope.getTrackingReminderNotifications();
			} else {
				$scope.showLoader("Getting today's reminder notifications...");
				reminderService.getTrackingReminderNotifications($stateParams.variableCategoryName, $stateParams.today)
					.then(function (trackingReminderNotifications) {
						$rootScope.trackingReminderNotifications = trackingReminderNotifications;
						if(trackingReminderNotifications.length === 0){
							$rootScope.showAllCaughtUpCard = true;
						}
						//Stop the ion-refresher from spinning
						$scope.$broadcast('scroll.refreshComplete');
						$scope.hideLoader();
					}, function(){
						$scope.hideLoader();
						console.error("failed to get reminder notifications!");
						//Stop the ion-refresher from spinning
						$scope.$broadcast('scroll.refreshComplete');
					});
			}

			//update alarms and local notifications
			console.debug("reminderInbox init: calling refreshTrackingRemindersAndScheduleAlarms");
			reminderService.refreshTrackingRemindersAndScheduleAlarms();
			var d = new Date();
			var timeZoneOffsetInMinutes = d.getTimezoneOffset();

			if($rootScope.user && $rootScope.user.timeZoneOffset !== timeZoneOffsetInMinutes ){
				var params = {
					timeZoneOffset: timeZoneOffsetInMinutes
				};
				userService.updateUserSettings(params);
			}
			if(!$rootScope.user){
				userService.refreshUser();
			}

			if (typeof cordova !== "undefined") {
				$ionicPlatform.ready(function () {
					cordova.plugins.notification.local.clearAll(function () {
						console.debug("clearAll active notifications");
					}, this);
				});
			}

			// Triggered on a button click, or some other target
			$rootScope.showActionSheetMenu = function() {
				// Show the action sheet
				var hideSheet = $ionicActionSheet.show({
					buttons: [

					],
					destructiveText: '<i class="icon ion-trash-a"></i>Clear All Notifications',
					cancelText: '<i class="icon ion-ios-close"></i>Cancel',
					cancel: function() {
						console.log('CANCELLED');
					},
					buttonClicked: function(index) {
						console.log('BUTTON CLICKED', index);
						if(index === 0){

						}
						return true;
					},
					destructiveButtonClicked: function() {
						$scope.showLoader('Skipping all reminder notifications...');
						reminderService.skipAllReminderNotifications()
							.then(function(){
								notificationService.setNotificationBadge(0);
								$scope.init();
							}, function(err){
								Bugsnag.notify(err, JSON.stringify(err), {}, "error");
								console.error(err);
								utilsService.showAlert('Failed to skip all notifications, Try again!', 'assertive');
							});
						return true;
					}
				});


				$timeout(function() {
					hideSheet();
				}, 20000);

			};
		};

	    $scope.editMeasurement = function(trackingReminderNotification, dividerIndex, trackingReminderNotificationNotificationIndex){
			localStorageService.deleteElementOfItemById('trackingReminderNotifications',
				trackingReminderNotification.id);
			$rootScope.filteredTrackingReminderNotifications[dividerIndex].trackingReminderNotifications[trackingReminderNotificationNotificationIndex].hide = true;
			$state.go('app.measurementAdd',
				{
					reminderNotification: trackingReminderNotification,
					fromUrl: window.location.href
				});
	    };

	    $scope.editReminderSettingsByNotification = function(trackingReminderNotification){
			var trackingReminder = trackingReminderNotification;
			trackingReminder.id = trackingReminderNotification.trackingReminderId;
	    	$state.go('app.reminderAdd',
				{
					reminder: trackingReminder,
					fromUrl: window.location.href,
					fromState : $state.current.name
				});
	    };
		
		$scope.goToReminderSearchCategory = function(variableCategoryName) {
			$state.go('app.reminderSearchCategory',
				{
					variableCategoryName : variableCategoryName,
					fromUrl: window.location.href
				});
		};

        // when view is changed
    	$scope.$on('$ionicView.enter', function(e){
			$scope.hideLoader();
    		$scope.init();
    	});

		// Triggered on a button click, or some other target
		$scope.showActionSheetForNotification = function(trackingReminderNotification, $event) {

			if(isGhostClick($event)){
				return;
			}


			$scope.state.trackingReminderNotification = trackingReminderNotification;
			$scope.state.trackingReminder = trackingReminderNotification;
			$scope.state.trackingReminder.id = trackingReminderNotification.trackingReminderId;
			$scope.state.variableObject = trackingReminderNotification;
			$scope.state.variableObject.id = trackingReminderNotification.variableId;
			$scope.state.variableObject.name = trackingReminderNotification.variableName;
			// Show the action sheet
			var hideSheetForNotification = $ionicActionSheet.show({
				buttons: [
					{ text: '<i class="icon ion-android-notifications-none"></i>Edit Reminder'},
					{ text: '<i class="icon ion-ios-star"></i>Add ' + ' to Favorites' },
					{ text: '<i class="icon ion-edit"></i>Record ' + ' Measurement' },
					{ text: '<i class="icon ion-arrow-graph-up-right"></i>' + 'Visualize'},
					{ text: '<i class="icon ion-ios-list-outline"></i>' + 'History'},
					{ text: '<i class="icon ion-settings"></i>' + 'Variable Settings'},
					{ text: '<i class="icon ion-arrow-up-a"></i>Positive Predictors'},
					{ text: '<i class="icon ion-arrow-down-a"></i>Negative Predictors'}
				],
				destructiveText: '<i class="icon ion-trash-a"></i>Skip All Notifications',
				cancelText: '<i class="icon ion-ios-close"></i>Cancel',
				cancel: function() {
					console.log('CANCELLED');
				},
				buttonClicked: function(index) {
					console.log('BUTTON CLICKED', index);
					if(index === 0){
						$scope.editReminderSettingsByNotification($scope.state.trackingReminderNotification);
					}
					if(index === 1){
						$scope.addToFavoritesUsingVariableObject($scope.state.variableObject);
					}
					if(index === 2){
						$scope.goToAddMeasurementForVariableObject($scope.state.variableObject);
					}
					if(index === 3){
						$scope.goToChartsPageForVariableObject($scope.state.variableObject);
					}
					if(index === 4){
						$scope.goToHistoryForVariableObject($scope.state.variableObject);
					}
					if (index === 5) {
						$state.go('app.variableSettings',
							{variableName: $scope.state.trackingReminderNotification.variableName});
					}
					if(index === 6){
						$state.go('app.predictors',
							{
								variableObject: $scope.state.variableObject,
								requestParams: {
									effect:  $scope.state.variableObject.name,
									correlationCoefficient: "(gt)0"
								}
							});
					}
					if(index === 7){
						$state.go('app.predictors',
							{
								variableObject: $scope.state.variableObject,
								requestParams: {
									effect:  $scope.state.variableObject.name,
									correlationCoefficient: "(lt)0"
								}
							});
					}

					return true;
				},
				destructiveButtonClicked: function() {
					console.debug("Skipping all notifications for trackingReminder", $scope.state.trackingReminderNotification);
					var params = {
						trackingReminderId : $scope.state.trackingReminderNotification.trackingReminderId
					};
					$scope.showLoader('Skipping all ' + $scope.state.variableObject.name + ' reminder notifications...');
					reminderService.skipAllReminderNotifications(params)
						.then(function(){
							$scope.hideLoader();
							$scope.init();
						}, function(err){
							$scope.hideLoader();
							Bugsnag.notify(err, JSON.stringify(err), {}, "error");
							console.error(err);
							utilsService.showAlert('Failed to skip all notifications for , Try again!', 'assertive');
						});
					return true;
				}
			});


			$timeout(function() {
				hideSheetForNotification();
			}, 20000);

		};


	});
