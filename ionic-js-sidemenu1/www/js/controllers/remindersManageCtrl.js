angular.module('starter')

	.controller('RemindersManageCtrl', function($scope, $state, $stateParams, $ionicPopup, $ionicLoading, $filter,
												$rootScope, $ionicActionSheet, $timeout, authService,
												localStorageService, reminderService, variableCategoryService) {

	    $scope.controller_name = "RemindersManageCtrl";

		console.log('Loading ' + $scope.controller_name);
	    
	    $scope.state = {
			showButtons : false,
			variableCategory : $stateParams.variableCategoryName,
	    	showMeasurementBox : false,
	    	selectedReminder : false,
	    	reminderDefaultValue : "",
	    	selected1to5Value : false,
	    	allReminders : [],
	    	filteredReminders : [],
	    	measurementDate : new Date(),
	    	slots : {
				epochTime: new Date().getTime()/1000,
				format: 12,
				step: 1,
				closeLabel: 'Cancel'
			},
			variable : {},
			isDisabled : false,
			loading : true,
			showTreatmentInfoCard : false,
			showSymptomInfoCard : false,
			orderParameter : 'variableName'
	    };

		function showAppropriateHelpInfoCards(){
			$scope.state.showTreatmentInfoCard = (!$scope.state.allReminders.length) && (window.location.href.indexOf('Treatments') > -1);
			$scope.state.showSymptomInfoCard = (!$scope.state.allReminders.length) && (window.location.href.indexOf('Symptom') > -1);
		}

		function getTrackingRemindersFromLocalStorage(){
			$scope.state.allReminders = [];
			var nonFavoriteReminders = [];
			var unfilteredReminders = JSON.parse(localStorageService.getItemSync('trackingReminders'));
			unfilteredReminders =
				variableCategoryService.attachVariableCategoryIcons(unfilteredReminders);
			if(unfilteredReminders) {
				for(var k = 0; k < unfilteredReminders.length; k++){
					if(unfilteredReminders[k].reminderFrequency !== 0){
						nonFavoriteReminders.push(unfilteredReminders[k]);
					}
				}
				if($stateParams.variableCategoryName !== 'Anything') {
					for(var j = 0; j < nonFavoriteReminders.length; j++){
						if($stateParams.variableCategoryName === nonFavoriteReminders[j].variableCategoryName){
							$scope.state.allReminders.push(nonFavoriteReminders[j]);
						}
					}
					showAppropriateHelpInfoCards();
				} else {
					$scope.state.allReminders = nonFavoriteReminders;
					showAppropriateHelpInfoCards();
				}
				$scope.state.allReminders = reminderService.addRatingTimesToDailyReminders($scope.state.allReminders);
			} else {
				showAppropriateHelpInfoCards();
			}
		}

	    // when date is updated
	    $scope.currentDatePickerCallback = function (val) {
	    	if(typeof(val)==='undefined'){
	    		console.log('Date not selected');
	    	} else {
	    		$scope.state.measurementDate = new Date(val);
	    	}
	    };

		// when time is changed
		$scope.currentTimePickerCallback = function (val) {
			if (typeof (val) === 'undefined') {
				console.log('Time not selected');
			} else {
				var a = new Date();
				a.setHours(val.hours);
				a.setMinutes(val.minutes);
				$scope.state.slots.epochTime = a.getTime()/1000;
			}
		};

	    // constructor
	    $scope.init = function(){
			Bugsnag.context = "reminderManage";
			getTrackingRemindersFromLocalStorage();
			authService.checkAuthOrSendToLogin();
			if (typeof analytics !== 'undefined')  { analytics.trackView("Manage Reminders Controller"); }

			if (!$stateParams.variableCategoryName || $stateParams.variableCategoryName === "Anything") {
				$scope.state.title = "Manage Reminders";
				$scope.state.addButtonText = "Add new reminder";
			}
			else {
				$scope.state.title = "Manage " + pluralize($filter('wordAliases')($stateParams.variableCategoryName), 1) + " Reminders";
				$scope.state.addButtonText = 'Add new ' +
					pluralize($filter('wordAliases')($stateParams.variableCategoryName.toLowerCase()), 1) + ' reminder';
			}

			$scope.state.showButtons = true;
			$scope.showHelpInfoPopupIfNecessary();
			if($rootScope.syncingReminders !== true) {
				console.debug("ReminderMange init: calling refreshTrackingRemindersAndScheduleAlarms");
				$scope.showLoader('Reminders coming down the pipes...');
				reminderService.refreshTrackingRemindersAndScheduleAlarms().then(function () {
					$scope.hideLoader();
					getTrackingRemindersFromLocalStorage();
					//Stop the ion-refresher from spinning
					$scope.$broadcast('scroll.refreshComplete');
				});
			} else {
				$scope.$broadcast('scroll.refreshComplete');
			}

			// Triggered on a button click, or some other target
			$rootScope.showActionSheetMenu = function() {
				// Show the action sheet
				var hideSheet = $ionicActionSheet.show({
					buttons: [
						{ text: '<i class="icon ion-arrow-down-c"></i>Sort by Name'},
						{ text: '<i class="icon ion-clock"></i>Sort by Time' }
					],
					cancelText: '<i class="icon ion-ios-close"></i>Cancel',
					cancel: function() {
						console.log('CANCELLED');
					},
					buttonClicked: function(index) {
						console.log('BUTTON CLICKED', index);
						if(index === 0){
							console.debug("Sort by name");
							$scope.state.orderParameter = 'variableName';
							$scope.init();
						}
						if(index === 1){
							console.debug("Sort by time");
							$scope.state.orderParameter = 'reminderStartTimeLocal';
							$scope.init();
						}

						return true;
					}
				});

				$timeout(function() {
					hideSheet();
				}, 20000);

			};
	    };

		$scope.showMoreNotificationInfoPopup = function(){
			var moreNotificationInfoPopup = $ionicPopup.show({
				title: "Individual Notifications Disabled",
				subTitle: 'Currently, you will only get one non-specific repeating device notification at a time.',
				scope: $scope,
				template: "It is possible to instead get a separate device notification for each tracking reminder that you create.  You can change this setting or update the notification frequency on the settings page.",
				buttons:[
					{
						text: 'Settings',
						type: 'button-positive',
						onTap: function(e) {
							$state.go('app.settings');
						}
					},
					{
						text: 'OK',
						type: 'button-assertive'
					}
				]

			});

			moreNotificationInfoPopup.then(function(res) {
				console.log('Tapped!', res);
			});
		};

	    $scope.edit = function(reminder){
	    	reminder.fromState = $state.current.name;
	    	$state.go('app.reminderAdd', 
	    	{
	    		reminder : reminder,
	    		fromUrl: window.location.href
	    	});
	    };

	    $scope.addNewReminderButtonClick = function(){
			if ($stateParams.variableCategoryName !== 'Anything') {
				$state.go('app.reminderSearchCategory',
					{
						variableCategoryName : $stateParams.variableCategoryName,
						fromUrl: window.location.href
					});
			}
			else {
				$state.go('app.reminderSearch',
					{
						variableCategoryName : $stateParams.variableCategoryName,
						fromUrl: window.location.href
					});
			}
	    };

	    $scope.deleteReminder = function(reminder){
			localStorageService.deleteElementOfItemById('trackingReminders', reminder.trackingReminderId).then(function(){
					getTrackingRemindersFromLocalStorage();
				});

			reminderService.deleteReminder(reminder.trackingReminderId)
	    	.then(function(){

	    	}, function(err){
				Bugsnag.notify(err, JSON.stringify(err), {}, "error");
	    		$ionicLoading.hide();
				$scope.loading = false;
	    		console.error('Failed to Delete Reminder!');
	    	});
	    };

        // when view is changed
    	$scope.$on('$ionicView.enter', function(e){
			$scope.hideLoader();
    		$scope.init();
    	});

		// Triggered on a button click, or some other target
		$scope.showActionSheet = function(trackingReminder, $index) {

			$scope.state.trackingReminder = trackingReminder;
			$scope.state.variableObject = trackingReminder;
			$scope.state.variableObject.id = trackingReminder.variableId;
			$scope.state.variableObject.name = trackingReminder.variableName;
			// Show the action sheet
			var hideSheet = $ionicActionSheet.show({
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
				destructiveText: '<i class="icon ion-trash-a"></i>Delete Reminder',
				cancelText: '<i class="icon ion-ios-close"></i>Cancel',
				cancel: function() {
					console.log('CANCELLED');
				},
				buttonClicked: function(index) {
					console.log('BUTTON CLICKED', index);
					if(index === 0){
						$scope.edit($scope.state.trackingReminder);
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
							{variableName: $scope.state.trackingReminder.variableName});
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
					$scope.deleteReminder($scope.state.trackingReminder);
					return true;
				}
			});

			$timeout(function() {
				hideSheet();
			}, 20000);
		};
	});