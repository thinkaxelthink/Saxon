define(['jquery', 'libs/events', 'mouseGenerator', 'backbone', 'localStorage'], function ($, Events, MouseGen) {
	// MIXINS -> move this to somewhere better
		_.mixin({
			capitalize : function(string) {
				return string.charAt(0).toUpperCase() + string.substring(1).toLowerCase();
			},
			spacelize: function (s) {
				return s.replace(/_/g, ' ');
			}
		});


		var Mouse = Backbone.Model.extend({
			defaults: function() {
				return {
					name: 'noname',
					rank: 'norank',
					age: 0,
					parents: ['',''],
					senior_artisan: '',
					mentor: '',
					fur_color: '',
					friend: '',
					enemy: '',
					cloak_color: '',
					belief: '',
					instinct: '',
					goal: '',
					contacts: '',
					gear: [],
					traits: [],
					nature: 0,
					will: 0,
					health: 0,
					resources: 0,
					circles: 0,
					skills: [],
					wises: []
				};
			}
		});

		var MiceList = Backbone.Collection.extend({
			model: Mouse,
			localStorage: new Backbone.LocalStorage("mice-backbone")
		});


		var Mice = new MiceList;

		var MiceView = Backbone.View.extend({
			tagName: 'div',
			className: 'mouse',
			template: _.template($('#mouse-item-template').html()),
			events: {
				'dblclick .view': 'edit',
			},
			initialize: function() {
				this.listenTo(this.model, 'change', this.render);
				this.listenTo(this.model, 'destroy', this.remove);
			},
			render: function() {

				this.$el.html(this.template(this.model.toJSON()));	
				
				// this.$el.toggleClass('done', this.model.get('done'));
				// this.input = this.$('.edit');
				return this;
			},
			edit: function (e) {
				log('editing', e, this );
				$(e.currentTarget).addClass("editing");
				$(e.currentTarget).find('input').focus();
			}
		});

		var AppView = Backbone.View.extend({
			el: $('#main'),
			statsTemplate: _.template($('#stats-template').html()),
			events: {
				"click button.create": "createMouse"
			},
			initialize: function() {
				log('appview initialize', Mice);
				this.listenTo(Mice, 'add', this.addOne);
				this.listenTo(Mice, 'reset', this.addAll);
				this.listenTo(Mice, 'all', this.render);

				Mice.fetch();
			},
			render: function() {
				log('render');
			},
			createMouse: function(e) {
				log('createMouse', MouseGen);

				Mice.create(MouseGen.generate());
			},
			addOne: function(mouse) {
				log('addOne', mouse, this.$("#mice-list").children().length);
				var view = new MiceView({model: mouse});
				if(this.$("#mice-list").children().length < 1)
				{
					this.$("#mice-list").append(view.render().el);
				}
				else
				{
					$(view.render().el).insertBefore( this.$("#mice-list").children().first() );
				}
			},
			addAll: function(m) {
				log('addAll', m);
			}
		});

		var App = new AppView;
		// log('m', Mice, App);



});