angular.module('starter')
	// Measurement Service
	.factory('timeService', function() {

		// service methods
		return {

			getSecondsSinceMidnightLocalFromUtcString: function (utcTimeString) {

				var timeFormat = "HH:mm:ss Z";
				var utcTimeStringFull = moment().format(timeFormat);
				if(utcTimeString){
					utcTimeStringFull = utcTimeString + " +0000";
				}
				
				var hours = parseInt(moment(utcTimeStringFull, timeFormat).format("HH"));
				var minutes = parseInt(moment(utcTimeStringFull, timeFormat).format("mm"));
				var seconds = parseInt(moment(utcTimeStringFull, timeFormat).format("ss"));
				var secondsSinceMidnightLocal =
					hours * 60 *60 + minutes * 60 + seconds;

                // not sure why this is necessary
                secondsSinceMidnightLocal = secondsSinceMidnightLocal - 60 * 60;
                if(secondsSinceMidnightLocal < 0) {
                    secondsSinceMidnightLocal = secondsSinceMidnightLocal + 86400;
                }

				return secondsSinceMidnightLocal;
			},

			getSecondsSinceMidnightLocalFromLocalString: function (localTimeString) {
				var timeFormat = "HH:mm:ss";
				var hours = parseInt(moment(localTimeString, timeFormat).format("HH"));
				var minutes = parseInt(moment(localTimeString, timeFormat).format("mm"));
				var seconds = parseInt(moment(localTimeString, timeFormat).format("ss"));
				var secondsSinceMidnightLocal =
					hours * 60 *60 + minutes * 60 + seconds;
				return secondsSinceMidnightLocal;
			},

            getEpochTimeFromUtcString: function (utcTimeString) {
                var timeFormat = "HH:mm:ss";
                var epochTime = moment(utcTimeString, timeFormat).unix();
                return epochTime;
            },

			getEpochTimeFromLocalString: function (localTimeString) {
				var timeFormat = "HH:mm:ss";
				var epochTime = moment(localTimeString, timeFormat).unix();
				return epochTime;
			},

			getLocalTimeStringFromUtcString: function (utcTimeString) {

				var timeFormat = "HH:mm:ss Z";
				var utcTimeStringFull = moment().format(timeFormat);
				if(utcTimeString){
					utcTimeStringFull = utcTimeString + " +0000";
				}
				var returnTimeFormat = "HH:mm:ss";

				var localTimeString = moment(utcTimeStringFull, timeFormat).format(returnTimeFormat);
				console.debug("localTimeString is " + localTimeString);

				return localTimeString;
			},

			humanFormat: function(hhmmssFormatString){
				var intitialTimeFormat = "HH:mm:ss";
				var humanTimeFormat = "hh:mm A";
				return moment(hhmmssFormatString, intitialTimeFormat).format(humanTimeFormat);
			},

			getUtcTimeStringFromLocalString: function (localTimeString) {

				var returnTimeFormat = "HH:mm:ss";
				var utcTimeString = moment(localTimeString, returnTimeFormat).utc().format(returnTimeFormat);
				console.debug("utcTimeString is " + utcTimeString);

				return utcTimeString;
			},

			getEpochMillisecondsFromUtcDateTimeString: function (utcDateTimeString) {
				var timeFormat = 'YYYY-MM-DD HH:mm:ss';
				var epochMilliseconds = 1000 * moment(utcDateTimeString, timeFormat).unix();
				return epochMilliseconds;
			},

			getLocalMidnightInUtcString: function () {
				var localMidnightMoment = moment(0, "HH");
				var timeFormat = 'YYYY-MM-DD HH:mm:ss';
				var localMidnightInUtcString = localMidnightMoment.utc().format(timeFormat);
				return localMidnightInUtcString;
			},

			
			getCurrentTimeInUtcString: function () {
				var currentMoment = moment();
				var timeFormat = 'HH:mm:ss';
				var currentTimeInUtcString = currentMoment.utc().format(timeFormat);
				return currentTimeInUtcString;
			},

			getCurrentTimeInLocalString: function () {
				var currentMoment = moment();
				var timeFormat = 'HH:mm:ss';
				var currentTimeInLocalString = currentMoment.format(timeFormat);
				return currentTimeInLocalString;
			},

			getCurrentDateTimeInUtcString: function () {
				var currentMoment = moment();
				var timeFormat = 'YYYY-MM-DD HH:mm:ss';
				var currentDateTimeInUtcString = currentMoment.utc().format(timeFormat);
				return currentDateTimeInUtcString;
			},

			getCurrentDateTimeInUtcStringPlusMin: function (minutes) {
				var currentMoment = moment().add(minutes, 'minutes');
				var timeFormat = 'YYYY-MM-DD HH:mm:ss';
				var currentDateTimeInUtcStringPlus15Min = currentMoment.utc().format(timeFormat);
				return currentDateTimeInUtcStringPlus15Min;
			},

			convertDateObjectToLocalTimeString: function(dateObject) {
				var hours = dateObject.getHours();
				var minutes = dateObject.getMinutes();
				var seconds = dateObject.getSeconds();
				var localTimeString = hours + ":" + minutes + ":" + seconds;
				console.log("localTimeString is " + localTimeString);
				return localTimeString;
			}
		};

	});