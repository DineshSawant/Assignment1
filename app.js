// User model
Ext.define('User', {
    extend: 'Ext.data.Model',
    fields: [ 'fName', 'lName', 'email', 'phone', 'birthDate' ]
});

// User store
var userStore = Ext.create('Ext.data.Store', {
    model: 'User',
    pageSize: 3,
    proxy: {
        type: 'ajax',
        url: 'data/users.json',
        startParam: 'startIndex',
    	limitParam: 'limitIndex',
        reader: {
            type: 'json',
            root: 'users',
            totalProperty: 'total'
        }
    }
});

// Country store
var countries = Ext.create('Ext.data.Store', {
	fields: ['abbr', 'name'],
	data: [
		{"abbr":"IND", "name":"India"},
        {"abbr":"AM", "name":"America"},
        {"abbr":"FR", "name":"France"}
	]
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
		        grid
		    ]
		});
	}
});

var grid = Ext.create('Ext.grid.Panel', {
	store: userStore,
	height: 200,
	title: 'Search Result',
	region: 'south',
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
                return Ext.String.format('<a href="">{1}</a>', value, value);
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
        }
    ],
    dockedItems: [{
        xtype: 'pagingtoolbar',
        store: userStore,   // same store GridPanel is using
        dock: 'bottom',
        // displayInfo: true
    }]
});

var menuBar = Ext.create('Ext.container.Container', {
	layout: 'hbox',
	// region: 'west',
	items: [
		{
    		xtype: 'menu',
   			width: 1400,
		    layout: 'hbox',
		    floating: false,
		    items: [
				{	
					text: 'Home'
				},
				{
					text: 'About Us',
				},
				{
			        text: 'Contacts'
				},
				{
					text: 'Logout'
			    }
		    ]
		}
	]
});

var searchForm = Ext.create('Ext.form.Panel', {
	title: 'Search Criteria',
	bodyPadding: 10,
	defaultType: 'textfield',
	region: 'south',
	scrollFlags: {
		x: true,
		y: true
	},
    items: [
    	{
        	xtype: 'fieldset',
            title: 'User Information',
            items: [
            	{
                    xtype: 'fieldcontainer',
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
	                    }, 
	                    {
	                        name: 'lastName',
	                        fieldLabel: 'Last Name',
	                        margins: '0 0 0 6',
	                        emptyText: 'Last Name',
	                        allowBlank: false,
	                        height: 30,
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
                },
                {
                    xtype: 'container',
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
							fieldLabel: 'Country',
							id: 'countryCombo',
							margin: '0 0 0 6',
							editable: false,
							forceSelection: true,
							store: countries,
							displayField: 'name',
							listeners: {
								'select': function(combo, record) {
									var country = this.up('form').down('combobox');
								}
							}
						},					                    
	                    {
	                    	xtype: 'button',
	                    	text: 'Search',
	                    	margins: '0 0 0 6',
	                    	width: 100,
							// height: 30,
							listeners: {
								click: function() {
									var form = this.up('form').getForm();
							        if (form.isValid()) {
							        	userStore.proxy.url = 'data/users.json?'+form.getValues(true);
							            userStore.load();
							        } else {
				                        Ext.Msg.alert('Invalid Data', 'Please correct form errors.');
				                    }
								}
							}
	                    }
                    ]
                }
            ]
        }
	],
});