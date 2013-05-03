define(['require', 'libs/events','libs/jsonloader', 'libs/numberUtils', 'underscore'], onJsonPluginLoaded);

function onJsonPluginLoaded ( r , Events , JsonLoader, NumberUtils ) {
	var configRules = {};	
	var configList = ['../config/mouse.json', '../config/ranks.json',
		'../config/names.json', '../config/circles.json', 
		'../config/gear.json', '../config/nature.json', 
		'../config/resources.json', '../config/skills.json', 
		'../config/territories.json', '../config/traits.json', 
		'../config/wises.json'];
	
	_.each(configList, function(element, index, list) {
		JsonLoader.load(element, r, function (d) {
			configRules[element.match(/(\w+:\/{2})?((?:\w+\.){2}\w+)?(\/?[\S]+\/|\/)?([\w]+)([\.]\w+)?(\?\S+)?/i)[4]] = d;
			if( index >= ( list.length - 1 ) )
			{
				Events.publish('MOUSE_GENERATOR_READY');
			}
		}, {isBuild: false});
	});


	function pickSkill ( list , max )
	{
		var randomIndex = 0, delta = [];
		for (var i = 0; i < max; i++)
		{
			randomIndex = NumberUtils.randomIntegerWithinRange( 0 , list.length-1 );
			delta.push( list[randomIndex] );
		}

		return delta;
	}

	function calculateRatings(arr) {
		var a = [], b = [], prev;

		arr.sort();
		for ( var i = 0; i < arr.length; i++ )
		{
			if ( arr[i] !== prev )
			{
				a.push(arr[i]);
				b.push(1);
			} 
			else
			{
				b[b.length-1]++;
			}
			prev = arr[i];
		}

		return [a, b];
	}

	return {
		generate: function() {
			var randomMouse = {},item;
			// pick gender
			var mouseGender = ['male', 'female'][NumberUtils.randomIntegerWithinRange(0,1)],
			enemyGender = ['male', 'female'][NumberUtils.randomIntegerWithinRange(0,1)],
			seniorGender = ['male', 'female'][NumberUtils.randomIntegerWithinRange(0,1)],
			mentorGender = ['male', 'female'][NumberUtils.randomIntegerWithinRange(0,1)],
			friendGender = ['male', 'female'][NumberUtils.randomIntegerWithinRange(0,1)],
			mouseFur = ['brown', 'blonde', 'gray', 'black', 'red'][NumberUtils.randomIntegerWithinRange(0,4)];
			// pick a rank
			var rankIndex = NumberUtils.randomIntegerWithinRange(0,configRules.ranks.length-1);
			_.extend( randomMouse , configRules.mouse, 
				{rank: configRules.ranks[rankIndex]},
				{age: NumberUtils.randomIntegerWithinRange(configRules.ranks[rankIndex].min_age , configRules.ranks[rankIndex].max_age) },
				{name: configRules.names[mouseGender][NumberUtils.randomIntegerWithinRange(0,configRules.names[mouseGender].length-1)]},
				{gender: mouseGender},
				{will: configRules.ranks[rankIndex].will },
				{health: configRules.ranks[rankIndex].health },
				{fur_color: mouseFur},
				{senior_artisan: configRules.names[seniorGender][NumberUtils.randomIntegerWithinRange(0,configRules.names[seniorGender].length-1)]},
				{mentor: configRules.names[mentorGender][NumberUtils.randomIntegerWithinRange(0,configRules.names[mentorGender].length-1)]},
				{friend: configRules.names[friendGender][NumberUtils.randomIntegerWithinRange(0,configRules.names[friendGender].length-1)]},
				{enemy: configRules.names[enemyGender][NumberUtils.randomIntegerWithinRange(0,configRules.names[enemyGender].length-1)]}
			);

			if(randomMouse.age >= 50)
			{
				if(mouseFur === 'gray')
				{
					mouseFur = 'thinning ' + mouseFur;
				}
				else
				{
					mouseFur = 'graying ' + mouseFur;
				}
				randomMouse.fur_color = mouseFur;
			}
			
			// calculate nature
			_.each( configRules.nature , function(element, index, list) {

				// random index within range
				var i = NumberUtils.randomIntegerWithinRange(0,
						element.modifiers.length-1);
				
				// modifies nature
				randomMouse.nature += element.modifiers[i].value;

				// adjust restriction lists
				if( typeof element.modifiers[i].restrict_traits !== 'undefined' 
					&& element.modifiers[i].restrict_traits !== null )
				{
					randomMouse.restrict_traits = randomMouse.restrict_traits.concat( element.modifiers[i].restrict_traits );
				}
				else if( typeof element.modifiers[i].restrict_skill !== 'undefined' 
					&& element.modifiers[i].restrict_skill !== null )
				{
					randomMouse.restrict_skill = randomMouse.restrict_skill.concat( element.modifiers[i].restrict_skill );
				}
				
			});

			// calculate resources
			// set base resource rating
			randomMouse.resources = randomMouse.rank.resources;
			_.each( configRules.resources , function(element, index, list) {
				// random index within range
				var i = NumberUtils.randomIntegerWithinRange(0,
						element.modifiers.length-1);
				// modifies resources
				randomMouse.resources += element.modifiers[i].value;

				// adjust restriction lists
				if( typeof element.modifiers[i].restrict_traits !== 'undefined' 
					&& element.modifiers[i].restrict_traits !== null )
				{
					randomMouse.restrict_traits = randomMouse.restrict_traits.concat( element.modifiers[i].restrict_traits );
				}
				else if( typeof element.modifiers[i].restrict_skill !== 'undefined' 
					&& element.modifiers[i].restrict_skill !== null )
				{
					randomMouse.restrict_skill = randomMouse.restrict_skill.concat( element.modifiers[i].restrict_skill );
				}
				else if( typeof element.modifiers[i].requirements !== 'undefined'
					&& element.modifiers[i].requirements.length >= 1 )
				{
					randomMouse.skills.push( element.modifiers[i].requirements[
						NumberUtils.randomIntegerWithinRange(0,element.modifiers[i].requirements.length-1)
					] );
				}
				else if( typeof element.modifiers[i].parent_requirements !== 'undefined'
					&& element.modifiers[i].parent_requirements.length >= 1 )
				{
					// TODO: Make parents skills below
					// randomMouse.parents.skills.push( element.modifiers[i].requirements[
					// 	NumberUtils.randomIntegerWithinRange(0,element.modifiers[i].requirements.length-1)
					// ] );
				}
			});

			// calculate circles
			// set base circles rating
			randomMouse.circles = randomMouse.rank.circles;
			_.each( configRules.circles , function(element, index, list) {
				// random index within range
				var i = NumberUtils.randomIntegerWithinRange(0,
						element.modifiers.length-1);
				// modifies circles
				if(element.modifiers[i].hasOwnProperty('parent_requirements') 
					&& !_.contains(randomMouse.restrict_traits, 'parent-guard') 
					|| !element.modifiers[i].hasOwnProperty('parent_requirements') )
				{
					randomMouse.circles += element.modifiers[i].value;

					// adjust restriction lists
					if( typeof element.modifiers[i].restrict_traits !== 'undefined' 
						&& element.modifiers[i].restrict_traits !== null )
					{
						randomMouse.restrict_traits = randomMouse.restrict_traits.concat( element.modifiers[i].restrict_traits );
					}
					else if( typeof element.modifiers[i].restrict_skill !== 'undefined' 
						&& element.modifiers[i].restrict_skill !== null )
					{
						randomMouse.restrict_skill = randomMouse.restrict_skill.concat( element.modifiers[i].restrict_skill );
					}
					else if( typeof element.modifiers[i].requirements !== 'undefined'
						&& element.modifiers[i].requirements.length >= 1 )
					{
						randomMouse.skills.push( element.modifiers[i].requirements[
							NumberUtils.randomIntegerWithinRange(0,element.modifiers[i].requirements.length-1)
						] );
					}
				}
			});

			// pick a hometown
			// Choose 1 trait & 1 skill from character hometown.
			var hometownIndex = NumberUtils.randomIntegerWithinRange(0,configRules.territories.length-1);
			_.extend( randomMouse , {hometown: _.omit(configRules.territories[hometownIndex],['traits','skills']) }, 
				{traits: _.without(randomMouse.traits.concat(configRules.territories[hometownIndex].traits[
					NumberUtils.randomIntegerWithinRange(0,configRules.territories[hometownIndex].traits.length-1)
				]) , randomMouse.restrict_traits)}, 
				{skills: _.without(randomMouse.skills.concat(configRules.territories[hometownIndex].skills[
					NumberUtils.randomIntegerWithinRange(0,configRules.territories[hometownIndex].skills.length-1)
				]) , randomMouse.restrict_skill)});

			// pick skills
			// log('natural talent', pickSkill( configRules.skills.trades , randomMouse.rank.natural_skill_max ));
			// log('extra_trade', pickSkill( configRules.skills.extra_trade , randomMouse.rank.parent_skill_max + randomMouse.rank.apprentice_skill_max ));
			// log('influence', pickSkill( configRules.skills.influence , randomMouse.rank.influence_max ));
			// log('skills', pickSkill( configRules.skills.skills , randomMouse.rank.mentor_skill_max + randomMouse.rank.guard_experience + randomMouse.rank.specialty ));
			randomMouse.skills = randomMouse.skills.concat(
				pickSkill( configRules.skills.trades , randomMouse.rank.natural_skill_max ),
				pickSkill( configRules.skills.extra_trade , randomMouse.rank.parent_skill_max + randomMouse.rank.apprentice_skill_max ),
				pickSkill( configRules.skills.influence , randomMouse.rank.influence_max ),
				pickSkill( configRules.skills.skills , randomMouse.rank.mentor_skill_max + randomMouse.rank.guard_experience + randomMouse.rank.specialty ) );
			randomMouse.traits = randomMouse.traits.concat(
				pickSkill( _.without( configRules.traits.inherent_trait , randomMouse.restrict_traits ) , randomMouse.rank.inherent_trait ) , 
				pickSkill( _.without( configRules.traits.learned_trait , randomMouse.restrict_traits ) , randomMouse.rank.learned_trait ) , 
				pickSkill( _.without( configRules.traits.experience_trait , randomMouse.restrict_traits ) , randomMouse.rank.experience_trait ) );
			randomMouse.wises = pickSkill( configRules.wises , randomMouse.rank.wise_check );

			// figure out ratings for each trait,skill, wise
			var skillRates = calculateRatings( randomMouse.skills );
			var traitRates = calculateRatings( randomMouse.traits );
			var wiseRates = calculateRatings( randomMouse.wises )
			randomMouse.skills = _.object(skillRates[0], skillRates[1]);
			randomMouse.traits = _.object(traitRates[0], traitRates[1]);
			randomMouse.wises = _.object(wiseRates[0], wiseRates[1]);

			// gear me, bitch
			randomMouse.gear = [ configRules.gear.weapons[ NumberUtils.randomIntegerWithinRange(0,configRules.gear.weapons.length-1) ] ];
			log('gear',  configRules.gear.weapons[ NumberUtils.randomIntegerWithinRange(0,configRules.gear.weapons.length-1) ] );
			// TODO:: generate colors or something
			randomMouse.cloak_color = 'green';



			log('nature mod',randomMouse);

			return randomMouse;
		}
	}
}