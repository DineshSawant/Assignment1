var DynamicTreeComp = (function() {

	Ext.define('Contacts', {
		extend: 'Ext.data.Model',
		fields: [{
			name: 'checked',
			defaultValue: false
		}, 'id', {
			name: 'leaf',
			type: 'boolean'
		}, {
			name: 'text',
			mapping: 'text'
		}, {
			name: 'children'
		}, {
			name: 'selected',
			type: 'boolean'
		}],
		proxy: {
			type: 'ajax',
			url: 'data/contacts.json',
			reader: {
				type: 'json',
				// root: 'contacts'
			},
			actionMethod: {
				read: 'POST'
			},
			jsonData: true
		}
	});

	Ext.define('Contacts.tree.Panel', {
		extend: 'Ext.tree.Panel',
		useArrows: true,
		checkParent: function() {
			console.log('checkParent...');
		},
		listeners: {
			checkChange: function (node, checked) {
				var _this = this;
				node.cascadeBy(function(child) {
					child.set('checked', checked);
				});

				_this.checkParent(node);
			},
		}
	});

	var _private = {
		getStore: function() {
			console.log('Getting store...');
			return Ext.create('Ext.data.TreeStore', {
				model: 'Contacts',
				fields: ['text'],
				jsonData: true,
				root: {
					text: 'Demo Tree',
					// expanded: true
				}
			});
		},
		createTree: function() {
			console.log('createTree.....');
			return Ext.create('Contacts.tree.Panel', {
				renderTo: 'contacts',
				title: 'DynamicTreeComp',
				store: this.getStore(),
				height: 200,
				width: 400
			});
		},
		createTabel: function() {
			return Ext.create('Ext.panel.Panel', {
				renderTo: 'contacts',
				title: 'Test Panel',
				height: 200,
				width: 400,
				layout: {
					type: 'table',
					columns: 2,
					tdAttrs: {
			            style: {
			               border: '1px solid green'
			            }
			        }
				},
				items: [
					{ xtype: 'checkbox', padding: 10 },
					{ xtype: 'displayfield', value: 'Test Fiels One', padding: 10 },
					{ xtype: 'checkbox', padding: 10 },
					{ xtype: 'displayfield', value: 'Test Fiels Two', padding: 10 },
					{ xtype: 'checkbox', padding: 10 },
					{ xtype: 'displayfield', value: 'Test Fiels Three', padding: 10 }
				]
			});
		}
	};

	function DynamicTreeComp() {}

	DynamicTreeComp.prototype = {
		create: function() {
			console.log('Creating DynamicTreeComp...');
			var tree = _private.createTree();
			return tree;
		},
		createTabel: function() {
			var tabel = _private.createTabel();
			return tabel;
		}
	}

	return DynamicTreeComp;

})();

Ext.application({
	name: 'Tree',
	launch: function() {
		var tree = new DynamicTreeComp();
		tree.create();
		tree.createTabel();
	}
});