Ext.define('Ext.ux.CheckColumnPatch', {
    override: 'Ext.ux.CheckColumn',

    /**
     * @cfg {Boolean} [columnHeaderCheckbox=false]
     * True to enable check/uncheck all rows
     */
    columnHeaderCheckbox: false,

    constructor: function (config) {
        var me = this;
        me.callParent(arguments);

        me.addEvents('beforecheckallchange', 'checkallchange');

        if (me.columnHeaderCheckbox) {
            me.on('headerclick', function () {
                this.updateAllRecords();
            }, me);

            me.on('render', function (comp) {
                var grid = comp.up('grid');
                this.mon(grid, 'reconfigure', function () {
                    if (this.isVisible()) {
                        this.bindStore();
                    }
                }, this);

                if (this.isVisible()) {
                    this.bindStore();
                }

                this.on('show', function () {
                    this.bindStore();
                });
                this.on('hide', function () {
                    this.unbindStore();
                });
            }, me);
        }
    },

    onStoreDateUpdate: function () {
        var allChecked,
            image;

        if (!this.updatingAll) {
            allChecked = this.getStoreIsAllChecked();
            if (allChecked !== this.allChecked) {
                this.allChecked = allChecked;
                image = this.getHeaderCheckboxImage(allChecked);
                this.setText(image);
            }
        }
    },

    getStoreIsAllChecked: function () {
        var me = this,
            allChecked = true;
        me.store.each(function (record) {
            if (!record.get(this.dataIndex)) {
                allChecked = false;
                return false;
            }
        }, me);
        return allChecked;
    },

    bindStore: function () {
        var me = this,
            grid = me.up('grid'),
            store = grid.getStore();

        me.store = store;

        me.mon(store, 'datachanged', function () {
            this.onStoreDateUpdate();
        }, me);
        me.mon(store, 'update', function () {
            this.onStoreDateUpdate();
        }, me);

        me.onStoreDateUpdate();
    },

    unbindStore: function () {
        var me = this,
            store = me.store;

        me.mun(store, 'datachanged');
        me.mun(store, 'update');
    },

    updateAllRecords: function () {
        var me = this,
            allChecked = !me.allChecked;

        if (me.fireEvent('beforecheckallchange', me, allChecked) !== false) {
            this.updatingAll = true;
            me.store.suspendEvents();
            me.store.each(function (record) {
                record.set(this.dataIndex, allChecked);
            }, me);
            me.store.resumeEvents();
            me.up('grid').getView().refresh();
            this.updatingAll = false;
            this.onStoreDateUpdate();
            me.fireEvent('checkallchange', me, allChecked);
        }
    },

    getHeaderCheckboxImage: function (allChecked) {
        var cls = [],
            cssPrefix = Ext.baseCSSPrefix;

        if (this.columnHeaderCheckbox) {
            allChecked = this.getStoreIsAllChecked();
            //Extjs 4.2.x css
            cls.push(cssPrefix + 'grid-checkcolumn');
            //Extjs 4.1.x css
            cls.push(cssPrefix + 'grid-checkheader');

            if (allChecked) {
                //Extjs 4.2.x css
                cls.push(cssPrefix + 'grid-checkcolumn-checked');
                //Extjs 4.1.x css
                cls.push(cssPrefix + 'grid-checkheader-checked');
            }
        }
        return '<div style="margin:auto" class="' + cls.join(' ') + '">&#160;</div>'
    }
});


// User model
Ext.define('User', {
    extend: 'Ext.data.Model',
    fields: [ 'fName', 'lName', 'email', 'phone', 'birthDate', 'selected' ]
});

// User store
var userStore = Ext.create('Ext.data.Store', {
    model: 'User',
    pageSize: 3,
    proxy: {
        type: 'ajax',
        url: 'http://localhost:8081/',
        reader: {
            type: 'json',
            root: 'users',
            totalProperty: 'total'
        }
    },
    listeners: {
        'datachanged': function() {
            userStore.data.items.forEach(function(ele) {
                if(grid.selectedIDs.indexOf(ele.data.id) >=0) {
                    ele.data.selected = true;
                }else {
                    ele.data.selected = false;
                }
                return ele;
            });
        }
    }
});

// Country store
var countries =	 Ext.create('Ext.data.Store', {
	fields: ['code', 'name'],
	// autoLoad: true,
	// mode: 'local',
	proxy: {
        type: 'ajax',
        url: 'data/countries.json',
        reader: {
            type: 'json',
            root: 'countries'
        }
    }
});

// States store
var states = Ext.create('Ext.data.Store', {
	fields: ['countyId', 'abbr', 'name'],
	proxy: {
        type: 'ajax',
        url: 'data/states.json',
        reader: {
            type: 'json',
            root: 'states'
        }
    }
});

Ext.application({
	name: 'Assignment 1',
	launch: function() {
		Ext.create('Ext.container.Viewport', {
		    renderTo: Ext.getBody(),
		    layout: 'border',
		    items: [
		    	menuBar,
		        searchForm,
		        grid,
		    ]
		});
	}
});

var menuBar = Ext.create('Ext.container.Container', {
	region: 'north',
	items: [
		{
    		xtype: 'menu',
   			width: 1400,
		    layout: 'hbox',
		    floating: false,
		    items: [
				{	
					text: 'Home',
                    listeners: {
                        'click': function() {
                            window.location.assign('/');
                        }
                    }
				},
				{
					text: 'About Us',
				},
				{
			        text: 'Contacts',
                    listeners: {
                        'click': function() {
                            window.location.assign('contacts.html');
                        }
                    }
				},
				{
					text: 'Logout',
			    }
		    ]
		}
	]
});

var userInfo1 = Ext.create('Ext.container.Container', {
    layout: 'hbox',
    margin: '0 0 15 0',
    defaultType: 'textfield',
    items: [
		{
            name: 'firstName',
            fieldLabel: 'First Name',
            emptyText: 'First Name',
            allowBlank: false,
            height: 30,
            value: 'D'
        }, 
        {
            name: 'lastName',
            fieldLabel: 'Last Name',
            margins: '0 0 0 6',
            emptyText: 'Last Name',
            allowBlank: false,
            height: 30,
            value: 'S'
        },
        {
            fieldLabel: 'Email Address',
            name: 'email',
            vtype: 'email',
            allowBlank: false,
            height: 30,
            margins: '0 0 0 6',
            value: 'abc@gmail.com'
        },
        {
            fieldLabel: 'Phone Number',
            name: 'phone',
            height: 30,
            margins: '0 0 0 6',
            emptyText: 'xxx-xxx-xxxx',
            maskRe: /[\d\-]/,
            regex: /^\d{3}-\d{3}-\d{4}$/,
            regexText: 'Must be in the format xxx-xxx-xxxx'
        }
    ]
});

var userInfo2 = Ext.create('Ext.container.Container', {
    layout: 'hbox',
    defaultType: 'textfield',
    margin: '0 0 5 0',
    items: [
        {
            xtype: 'radiogroup',
            width: 230,
            fieldLabel: 'Gender',
            items: [
                {boxLabel: 'Male', name: 'gender', inputValue: 1},
                {boxLabel: 'Female', name: 'gender', inputValue: 2}
            ]
        },
        {
	        xtype: 'datefield',
	        fieldLabel: 'Birth Date',
	        name: 'date',
	        format: 'm/d/Y',
	        margin: '0 0 0 27',
	    },
        {
	        xtype: 'numberfield',
	        name: 'exp',
	        margin: '0 0 0 6',
	        fieldLabel: 'Total Experience',
	        minValue: 0,
	       	maxValue: 20,
	    },	
	    {
			xtype: 'combobox',
			fieldLabel: 'Designation',
			id: 'dsgnCombo',
            margin: '0 0 0 6',
			editable: false,
			forceSelection: true,
			displayField: 'name'
		},				                    
        {
        	xtype: 'button',
        	text: 'Search',
        	margin: '0 0 0 10',
        	width: 100,
			// height: 30,
			listeners: {
				click: function() {
					var form = this.up('form').getForm();
			        if (form.isValid()) {
			        	userStore.proxy.url = 'http://localhost:8081/users?'+form.getValues(true);
			            userStore.load();
			        } else {
                        Ext.Msg.alert('Invalid Data', 'Please correct form errors.');
                    }
				}
			}
        }
    ]
});

var addressDetails = Ext.create('Ext.container.Container', {
    layout: 'hbox',
    margin: '0 0 15 0',
    defaultType: 'textfield',
    items: [
		{
			xtype: 'combobox',
			fieldLabel: 'Country',
			id: 'countryCombo',
			editable: false,
			forceSelection: true,
			store: countries,
			displayField: 'name',
			valueField: 'code',
			listeners: {
				select: function(combo, record) {
					var country = this.up('form').down('#countryCombo');
					states.clearFilter();
					states.filter([{
			        	property: 'countyId',
			        	value: country.value
			     	}]);
				}
			}
		},
		{
			xtype: 'combobox',
			fieldLabel: 'State',
			id: 'statesCombo',
			margin: '0 0 0 6',
			editable: false,
			forceSelection: true,
			store: states,
			displayField: 'name'
		}
    ]
});

var searchForm = Ext.create('Ext.form.Panel', {
	title: 'Search Criteria',
	bodyPadding: 10,
	defaultType: 'textfield',
	region: 'center',
    items: [
    	{
        	xtype: 'fieldset',
            title: 'User Information',
            items: [userInfo1, userInfo2]
        },
        {
        	xtype: 'fieldset',
            title: 'Address Details',
            items: [addressDetails]
        }
	],
});

var grid = Ext.create('Ext.grid.Panel', {
	store: userStore,
	height: 410,
	title: 'Search Result',
	region: 'south',
    selectedIDs: [],
	columns: [
        {
            text: 'First Name',
            flex: 1,
            sortable: false,
            hideable: false,
            dataIndex: 'fName',
        },
        {
            text: 'Last Name',
            flex: 1,
            sortable: false,
            hideable: false,
            dataIndex: 'lName',
        },
        {
            text: 'Email Address',
            flex: 1,
            dataIndex: 'email',
            hidden: false,
            renderer: function(value) {
                return Ext.String.format('<a href="#" onclick="grid.showModal()">{1}</a>', value, value);
            }
        },
        {
            text: 'Phone Number',
            flex: 1,
            dataIndex: 'phone'
        },
        {
            text: 'Birth Date',
            flex: 1,
            dataIndex: 'birthDate',
        },
        {
            text: 'Test Check',
            columnHeaderCheckbox: true,
            flex: 1,
            xtype: 'checkcolumn',
            sortable: false,
            dataIndex: 'selected',
            listeners: {
                'checkchange': function(node, checked, eOpts) {
                    var selectedObj = userStore.data.items[checked].data;
                    if(selectedObj.selected) {
                        grid.selectedIDs.push(selectedObj.id);
                    }else {
                        if(grid.selectedIDs.indexOf(selectedObj.id) >=0) {
                            grid.selectedIDs.splice(grid.selectedIDs.indexOf(selectedObj.id), 1);
                        }
                    }
                },
                'checkallchange': function(node, checked, eOpts) {
                    userStore.data.items.forEach(function(ele) {
                        grid.selectedIDs.push(ele.data.id);
                    });
                }
            }
        }
    ],
    dockedItems: [{
        xtype: 'pagingtoolbar',
        store: userStore,   // same store GridPanel is using
        dock: 'bottom',
        displayInfo: true
    }],
    showModal: function() {
    	popupWindow.show();
    }
});

var popupWindow = Ext.create('Ext.window.Window', {
    title: 'Send Mail',
    height: 200,
    width: 350,
    bodyPadding: 10,
    closeAction: 'destory',
    items: [
    	{
            xtype: 'fieldcontainer',
            defaultType: 'textfield',
            items: [
        		{
                    name: 'sendTo',
                    fieldLabel: 'To',
                    width: 310
                },{
                    name: 'subject',
                    fieldLabel: 'Subject',
                    width: 310
                },{
					xtype: 'textareafield',
					width: 310,
					grow: true,
					name: 'message',
					fieldLabel: 'Message',
					anchor: '100%'
				},{
					xtype: 'button',
					name: 'cancelBtn',
					text: 'Cancel',
					listeners: {
						'click': function() {
							popupWindow.close();
						}
					}
				},{
					xtype: 'button',
					name: 'senchBtn',
					text: 'Send',
					listeners: {
						'click': function() {
							popupWindow.close();
						}
					}
				}
            ]
    	}
    ],
    listeners: {
        'show': function(w) {
            console.log("Showing window...", w);
        }
    }
});