angular.module('starter')

    // Controls the Track Page of the App
    .controller('ChartsPageCtrl', function($scope, $q, $state, $timeout, $rootScope, $ionicLoading,  $ionicActionSheet,
                                             $stateParams, chartService, localStorageService, QuantiModo, 
                                             variableService) {
        $scope.controller_name = "ChartsPageCtrl";
        $scope.addReminderButtonText = "Add Reminder";
        $scope.recordMeasurementButtonText = "Record Measurement";
        $scope.lineChartConfig = false;
        $scope.distributionChartConfig = false;
        $scope.state = {
            history : [],
            sum : 0,
            rangeLength : 0,
            averageValue : 0,
            offset: 0
        };

        $scope.addNewReminderButtonClick = function() {
            console.log("addNewReminderButtonClick");
            $state.go('app.reminderAdd', {
                variableObject: $scope.state.variableObject,
                fromState: $state.current.name
            });
        };

        $scope.recordMeasurementButtonClick = function() {
            $state.go('app.measurementAdd', {
                variableObject: $scope.state.variableObject,
                fromState: $state.current.name
            });
        };

        $scope.editSettingsButtonClick = function() {
            $state.go('app.variableSettings',
                {variableObject: $scope.state.variableObject});
        };

        var windowResize = function() {
            $(window).resize();

            // Not sure what this does
            $timeout(function() {
                $scope.$broadcast('highchartsng.reflow');
            }, 10);
            // Fixes chart width
            $scope.$broadcast('highchartsng.reflow');
        };

        var updateCharts = function(){

            if ($scope.state.history.length > 0) {
                // FIXME Eventually update fromDate and toDate so calendar can determine domain
                /*var fromDate = parseInt(localStorageService.getItemSync('fromDate'));
                var toDate = parseInt(localStorageService.getItemSync('toDate'));
                if (!fromDate) {
                    fromDate = 0;
                }
                if (!toDate) {
                    toDate = Date.now();
                }*/
                $scope.lineChartConfig = chartService.processDataAndConfigureLineChart($scope.state.history, $scope.state.variableObject);
                $scope.hourlyChartConfig =
                    chartService.processDataAndConfigureHourlyChart($scope.state.history, $scope.state.variableObject);
                $scope.weekdayChartConfig =
                    chartService.processDataAndConfigureWeekdayChart($scope.state.history, $scope.state.variableObject);
                $scope.distributionChartConfig =
                    chartService.processDataAndConfigureDistributionChart($scope.state.history, $scope.state.variableObject);
                windowResize();
            }
        };

        var getHistoryForVariable = function(params){
            if(!params.variableName){
                console.error("ERROR: params.variableName not provided to getHistoryForVariable");
                console.error("params: " + JSON.stringify(params));
                console.error("$scope.state.variableObject: " + JSON.stringify($scope.state.variableObject));
                return;
            }
            console.log("variablePageCtrl: getHistoryForVariable " + $scope.state.variableObject.name);
            $scope.showLoader('Getting ' + $scope.state.variableObject.name + ' measurements...');

            QuantiModo.getV1MeasurementsDaily(params, function(history){
                $scope.state.history = $scope.state.history.concat(history);
                
                if(history.length > 0){
                    $scope.state.offset = $scope.state.offset + 200;
                    params = {
                        offset: $scope.state.offset,
                        sort: "startTimeEpoch",
                        variableName: $scope.state.variableObject.name,
                        limit: 200
                    };
                    updateCharts();
                    getHistoryForVariable(params);
                }
                else {
                    if (history[0]) {
                        if(!$scope.state.variableObject.abbreviatedUnitName){
                            $scope.state.variableObject.abbreviatedUnitName = history[0].abbreviatedUnitName;
                        }
                        if(!$scope.state.variableObject.unitName){
                            $scope.state.variableObject.unitName = history[0].unitName;
                        }
                    }
                    $scope.hideLoader();
                    if ($scope.state.history.length > 0) {
                        console.log("variablePageCtrl: history log");
                        console.log($scope.state.history);
                        updateCharts();
                    }
                }
            }, function(error){
                Bugsnag.notify(error, JSON.stringify(error), {}, "error");
                console.error('error getting measurements', error);
                $scope.hideLoader();
            }, function(history) {
                $scope.state.history = $scope.state.history.concat(history);
            });
        };


        var getStatisticsForVariable = function (variableName) {
            $scope.state.variableObject = {
                name:  variableName
            };
            variableService.getVariablesByName(variableName).then(function(variableObject){
                $scope.state.variableObject = variableObject;
            });
        };
        
        $scope.init = function(){
            console.log("variablePageCtrl: init");
            if($stateParams.variableObject){
                $scope.state.variableObject = $stateParams.variableObject;
            } else if ($stateParams.trackingReminder){
                getStatisticsForVariable($stateParams.trackingReminder.variableName);
            } else if ($stateParams.variableName){
                getStatisticsForVariable($stateParams.variableName);
            } else {
                console.error("ERROR: chartsPageCtrl.init No variable name provided!");
                return;
            }

            $ionicLoading.hide();

            if($scope.state.variableObject.name){
                var params = {
                    sort: "startTimeEpoch",
                    variableName: $scope.state.variableObject.name,
                    limit: 200
                };
                getHistoryForVariable(params);
            } else {
                console.error('ERROR: $scope.state.variableObject.name not defined! $scope.state.variableObject: ' +
                    JSON.stringify($scope.state.variableObject));
            }
        };

        $scope.$on('$ionicView.enter', function(e) {
            $scope.init();
        });

        $rootScope.showActionSheetMenu = function() {

            console.debug("variablePageCtrl.showActionSheetMenu:  $scope.state.variableObject: ", $scope.state.variableObject);
            var hideSheet = $ionicActionSheet.show({
                buttons: [
                    { text: '<i class="icon ion-ios-star"></i>Add to Favorites'},
                    { text: '<i class="icon ion-compose"></i>Record Measurement'},
                    { text: '<i class="icon ion-android-notifications-none"></i>Add Reminder'},
                    { text: '<i class="icon ion-ios-list-outline"></i>History'},
                    { text: '<i class="icon ion-settings"></i>' + 'Variable Settings'},
                    { text: '<i class="icon ion-arrow-up-a"></i>Positive Predictors'},
                    { text: '<i class="icon ion-arrow-down-a"></i>Negative Predictors'}
                ],
                //destructiveText: '<i class="icon ion-trash-a"></i>Delete Favorite',
                cancelText: '<i class="icon ion-ios-close"></i>Cancel',
                cancel: function() {
                    console.log('CANCELLED');
                },
                buttonClicked: function(index) {
                    console.log('BUTTON CLICKED', index);
                    if(index === 0){
                        $scope.addToFavoritesUsingVariableObject($scope.state.variableObject);
                    }
                    if(index === 1){
                        $scope.goToAddMeasurementForVariableObject($scope.state.variableObject);
                    }
                    if(index === 2){
                        $scope.goToAddReminderForVariableObject($scope.state.variableObject);
                    }
                    if(index === 3) {
                        $scope.goToHistoryForVariableObject($scope.state.variableObject);
                    }
                    if (index === 4) {
                        $state.go('app.variableSettings',
                            {variableObject: $scope.state.variableObject});
                    }
                    if(index === 5){
                        $state.go('app.predictors',
                            {
                                variableObject: $scope.state.variableObject,
                                requestParams: {
                                    effect:  $scope.state.variableObject.name,
                                    correlationCoefficient: "(gt)0"
                                }
                            });
                    }
                    if(index === 6){
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
                    $scope.deleteReminder();
                    return true;
                }
            });


            $timeout(function() {
                hideSheet();
            }, 20000);

        };
    });