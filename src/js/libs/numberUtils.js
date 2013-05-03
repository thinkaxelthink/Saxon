
define(['jquery', 'libs/events'], function($, Events){
	
	var _type = "NUMBER_UTILS";

	return {
		numberWithCommas: function(x) {
		    var parts = x.toString().split(".");
		    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
		    return parts.join(".");
		},
		isBetween: function ( value , firstValue , secondValue ) {
			/**
			Determines if the value is included within a range.
			
			@param value: Number to determine if it is included in the range.
			@param firstValue: First value of the range.
			@param secondValue: Second value of the range.
			@return Returns <code>true</code> if the number falls within the range; otherwise <code>false</code>.
			@usageNote The range values do not need to be in order.
			@example
				<code>
					trace(NumberUtil.isBetween(3, 0, 5)); // Traces true
					trace(NumberUtil.isBetween(7, 0, 5)); // Traces false
				</code>
			*/
			return !(value < Math.min(firstValue, secondValue) || value > Math.max(firstValue, secondValue));
		},
		getRandomArbitrary: function (min, max) {
		  return Math.random() * (max - min) + min;
		},
		getRandomInt: function(min, max) {
			// Returns a random integer between min and max
			// Using Math.round() will give you a non-uniform distribution!
		  return Math.floor(Math.random() * (max - min + 1)) + min;
		},
		randomIntegerWithinRange: function(min, max) {
			return Math.round(this.randomWithinRange(min, max));
		},
		randomWithinRange: function(min, max) {
			return min + (Math.random() * (max - min));
		},
		min: function( a , b, prop) {
			// Evaluates a and b and returns the Object with the smaller value for prop.
			if (isNaN(a[prop]) && isNaN(b[prop]) || a[prop] == null && b[prop] == null)
				return NaN;
			if (a[prop] == null || b[prop] == null)
				return (b[prop] == null) ? a : b;
			
			if (isNaN(a[prop]) || isNaN(b[prop]))
				return isNaN(b[prop]) ? a : b;
			
			return ( Math.min( a[ prop ] , b[ prop ] ) === a[ prop ] ) ? a : b;
			
		},
		max: function( a , b, prop) {
			// Evaluates a and b and returns the Object with the larger value for prop.
			if (isNaN(a[prop]) && isNaN(b[prop]) || a[prop] == null && b[prop] == null)
				return NaN;
			if (a[prop] == null || b[prop] == null)
				return (b[prop] == null) ? a : b;
			
			if (isNaN(a[prop]) || isNaN(b[prop]))
				return isNaN(b[prop]) ? a : b;
			
			return (Math.max( a[ prop ] , b[ prop ] ) === a[prop]) ? a : b;
			
		},
		roundDecimalToPlace: function( value , place ) {
			var p = Math.pow(10, place);
			
			return Math.round(value * p) / p;
		},
		abbreviateKilos: function ( value , round ) {
			if( typeof round !== 'undefined' && round !== false )
			{
				return Math.ceil( value / 1000 ).toString() + 'k';
			}
			else
			{
				return ( value / 1000 ).toString() + 'k';
			}
		}
	};
});