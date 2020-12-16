/* Request Offering Form Customization Toolbox
   Custom Form Controls for the Cireson Portal
   Author: John Doyle - Cireson; Konstantin Slavin-Bo
   Date: June 2nd, 2017
   
   The toolbox contains a number of controls which can be added to Request Offerings in the SCSM Service Catalog.
   The controls are added by adding Display-Only tags to the Request Offering.
   
   The controls included in this release are:
   @AutoComplete: Converts a text input and a linked query result into an autocomplete text input.
   @MultiSelect: Converts a text input and a linked query result into a multi select control.
   @DateRange: Converts two date inputs so that the date selected in the first is the minimum date which can be selected in the second.
   @Placeholder: Uses the provided string or the title of the following text control as a placeholder in that control.
   @AddClass: Adds a specified CSS class to the following control.
   @TopNode: Allows an Enum Prompt to be filtered by a child value and only show children of the specified value
   
   Additional properties are added by adding a JSON string to the tag.
   e.g. to specify the minimum length for the autocomplete control, the tag is defined in the RO as @AutoComplete {"minLength":2}
   
   @AutoComplete
   -------------
   This script converts a query results prompt into an autocomplete prompt.
   
   To add this control to a form, you need to add three prompts to the Request Offering.
   First add a display only prompt with the label @AutoComplete. This control serves as a marker 
   to indicate that the picker should be added to the form. Next, add an optional text field. The 
   label on this field will serve as the hint added beneath the AutoComplete control. Finally, add
   the query results prompt. The label on this prompt will be used as the label for the AutoComplete
   control.
   Configure the query result and add a criterion which specifies that a property of the item class 
   must contain the value of the optional prompt. Select the columns you which to appear in the output.
   The AutoComplete control will concatenate these output fields together like "Field1 - Field2 - Field3".
   Finally specify how the item will be related to the work item.
   
   If the custom code detects the presence of the marker on the form. It will hide the existing text and 
   grid prompts and replace them with the autocomplete control.
   
   Additional Properties:
     minLength
	 If specified, the minLength is used to determine how many characters must be added before the control
	 queries the database for matching results.
	 
   @MultiSelect
   ------------
   The multiselect control is used to handle the data where you want to allow multiple selections to be made.
   This uses the tag @MultiSelect in the request offering. It is setup like the @AutoComplete control.
   
   @ShowHideOR
   ------------
   Updates the default behaviour when combining Show/Hide Criteria on @AutoCompletes's and @MultiSelect's
   from using "AND" between the Criteria, to using "OR" between the Criteria
   
   @Placeholder
   ------------
   Optional property: text
   
   @AddClass
   ---------
   Required property: cssClass
   
   @ShowHideCriteria / @ShowHideCriteria2
   --------------------------------------
   Placed before any item (Except a Query Item), allows adding of an extra set of criteria for the following item,
   Criteria on this and the following Item are combined using a AND ('&&')

   There are 2 Passes for these options, the first pass through only processes the @ShowHideCriteria and @ShowHideCriteriaOR
   while the 2nd pass through processes the @ShowHideCriteria2 and @ShowHideCriteriaOR2
   
   @ShowHideCriteriaOR / @ShowHideCriteriaOR2
   ------------------------------------------
   Placed before any item (Except a Query Item), allows adding of an extra set of criteria for the following item
   Criteria on this and the following Item are combined using a OR ('||')
   
   There are 2 Passes for these options, the first pass through only processes the @ShowHideCriteria and @ShowHideCriteriaOR
   while the 2nd pass through processes the @ShowHideCriteria2 and @ShowHideCriteriaOR2

   @ToUpperCase and @ToLowerCase
   ------------
   Used before a text prompt, these force the text input to upper or lower case respectively.

   @Layout
   -------
   This command allows you to specify a HTML template which is applied to the the controls following the tag. The controls are identified by a token in the format tbxCtrl-n, where n is an integer. Angle brackets in the template should be encoded.
   Sample:
   @Layout {"template":"&lt;div class='col-md-6 col-xs-12 tbxCtrl-1'&gt;&lt;/div&gt;&lt;div class='col-md-2 col-xs-4 tbxCtrl-2' style='margin-top:30px;'&gt;&lt;/div&gt;&lt;div class='col-md-2 col-xs-4 tbxCtrl-3' style='margin-top:30px;'&gt;&lt;/div&gt;&lt;div class='col-md-2 col-xs-4 tbxCtrl-4' style='margin-top:30px;'&gt;&lt;/div&gt;"}   

   @DatePicker
   -----------
   This replaces the out of the box date/time control on Request Offering forms. The default behaviour is identical to the out of the box control, except that the time interval defaults to 15 minutes.
   Placed before a Date prompt, the control exposes these properties.
      DateOnly: [true|false (default)] The date time picker is replaced with a date picker. The control displays the date only. If the UTC option is false or not specified, the form will send back the date with no time.
      UTC: [true|false (default)] The selected date and time is sent back to the server in UTC. This is ideal in situations where you want to schedule something based on the value, or where you wish to store the value in a datetime field on the database.
      Interval: [integer] This value specifies the interval between values in the popup list in minutes.
      Start: ["month"|"year"|"decade"|"century"] Specifies the start view of the calendar. For example, when requesting a birth date, it would make sense to open the control with the century as the first view.

   @AddDataMergeProperty
   -----------
	@AddDataMergeProperty is used to set either a get data from or add data to option to a @MultiSelect and/or @AutoComplete
	this is then used to get data about related class items to any item(s) selected from one or more selections,
	and add these as extra items one or more @AutoComplete and/or @MultiSelect.
	The 2 Properties that should be used for this are "GetData" then a Unique Name, and "AddData" with a Unique Name or 'ALL'

	for example, if you wished to have a autocomplete or multiselect for computers, and then another which lists business services,
	but you also wanted to add any software that is installed on the selected PC's to the list of business services, you could do
	this by doing the following :
	1. Create a TypeProjection that gets software items related to computers (installed software), and find the ProjectionType GUID
	2. Add a @AutoComplete or @MultiSelect for computers to the ARO
	3. before the @AutoComplete or @MultiSelect add the following
		@AddDataMergeProperty {"Name":"Software","GUID":"90bc5c2b-c7b9-71f3-a4d8-3acaa565f9ab"}
			Note: The Name should be individual to the data retrieved from this selection, as you can retrieve data from multiple
				selections
			Note2: The GUID entered should be the GUID of the TypeProjection to use
	4. Add another @AutoComplete or @MultiSelect control, that can retrieve whichever class you wish to have and add the extra
		items to, 
				NOTE: this can also be an enmpty class if you wish to create the entire list from related items in other @AutoComplete
				and/or @MultiSelect fields
	5. before the @AutoComplete or @MultiSelect that you wish to add the data to add the following
		@AddDataMergeProperty {"AddData":"Software"}
			NOTE: The name entered for the AddData is the name that was used to retrieve data, this is used so that there can
				be multiple retrievals and additions per page.
			NOTE2: there is a reserved name called "ALL" if this is used on the AddData then all items retrieved will be added,
				not just a specific named item.
	  
   @QueryList
   ----------
   This tag replaces the data source of a Simple List prompt with a Dashboard query. This allows you to build a list from any data source which could be used as a source for the dashboards.
   The following properties are available:
		QueryId: (Required) This is the guid of the query saved on the Dashboard Query Settings page in the portal. The simplest way to find this value is to query the DataSource table in the ServiceManagement database.
		Sort: The name of the field used to sort the data. The data will be sorted in ascending order based on the value in this field.
		Default: The name of the field which contains a default flag. If one of the rows has a 1 in this field, that row will be used as the default. If this is not set, the code will look for a field called Default in the source.
		Item: The field containing the content displayed to the user. If not specified the first field in the source data will be used.
		Value: The field containing the value which will be submitted to the server.
		ItemTemplate: A template which is applied to the elements in the dropdown list. Note: if you need to include # symbols in the template which are not limiters for the data substitutions then they must be escaped with a double backslash \\
		ValueTemplate: A template which is applied to the selected item. This is simply for display on the form. It is not saved as the input value.

	@TopNode
	-----------
	This tag allows you to have an enum prompt start at a subvalue as opposed to the top level enum.
	The following property is available:
		FilterId: The Id of the Child Enum that the picker should start from. Exaple for the DisplayOnly prompt above the Enum Prompt: @TopNode {"FilterId": "8d57a980-9cdf-44e2-ec8a-c70e241d345b"}

	@SingleLineEntry
	----------------
	Prevents the entry of a CR on a text area this entry is placed before
	
	@AddInformation
	---------------
	Adds either information to the page beside the next field, or adds a ? icon next to the field,
	when adding the ? icon, and it is hovered over, the information will then be displayed
	Examples :
		Icon Mode :
			@AddInformation {"icon":"&lt;p&gt;Text or formating here&lt;br&gt;even multiple lines&lt;/p&gt"}
		Information Mode :
			@AddInformation {"info":"&lt;p&gt;Text or formating here&lt;br&gt;even multiple lines&lt;/p&gt"}
			
			
	@CharCount
	----------
	Adds option for displaying the Minimum characters required and/or maximum characters remaining below a text area (input)
	
	By default the follow will occur:
		1 - if there is  a minimum length, then it counts down while more characters are required, and displays this below the field
		2 - if there is  a maximum length, and there is no minimum length, or the minimum length has already been reached,
			it counts down while more characters are available, and displays this below the field
			
	Available Options :
		showMin : true/false (default : true)
			enables or disables showing the minimum characters still required
		showMax : true/false (default : true)
			enables or disables showing the remaining characters available
		showMinMax : true/false (default : false)
			Shows both the remaining required AND remaining available character counts
		minText : The text to use in place of the default "Minimum Extra Characters Required"
		maxText : The text to use in place of the default "Maximum Characters Remaining"

	Examples :
		To show both Min and Max counts at the same time, and use different text
			@CharCount{"showMinMax":"true","showMin":"false","showMax":"false","minText":"MINIMUM REMAINING","maxText":"MAX REMAINING"}
		To show  Minimum only , which no longer displays after the count is reached (default only needs to be over ridden)
			@CharCount{"showMax":"false"}
			
	NOTE : If there is no minlength or maxlength defined on the field, then it will not show even if the options are added from this entry
	
	@PreventSelectSelf
	------------------
	
	When added before a query picker (directly before the query picker, not before the @AutoComplete/@MultiSelect) this will
	remove any returned entries that match with session.user.Id. thus preventing the current user from selecting themselves
	from the list, useful for selecting approvers etc to they canot select themselves to approve.

	
	
	Events available to be subscribed to:
	-------------------------------------
	A number of events have been added, so that you can use these in other scripts to ensure your scripts do not start too early/late
	
	To subscripbe to these events in your scripts use "app.events.subscribe('EventName',FunctionToCall)
	
	The following events are available:
	
	ROToolBoxStart : activates as the toobox starts it's processing
	ROToolBoxSHCStart : activates just before it starts to process the Show/Hide Criteria options
	ROToolBoxSHCDone : activates just after it finishes processing the Show/Hide Criteria options
	ROToolBoxACMSStart : activates just before starting to process any @AutoComplete and @MultiSelect options
	ROToolBoxACMSDone : activates just after finishing all #AutoComplete and @MultiSelect processing
	ROToolBoxDone : activates once all toolbox actions have completed and the page has been completely rendered

*/
app.events.subscribe('drawerCreated ',transformRO());
app.events.subscribe('drawerCreated ',transformRO);

var DataMergeResults = [];

function transformRO() {   
    app.events.unsubscribe('drawerCreated ',transformRO);
    app.lib.mask.apply();
	app.events.publish('ROToolboxStart');

    $("p:contains('@PreventSelectSelf')").parent().parent().each(function() {
        AddPreventSelectSelfProperty("@PreventSelectSelf", $(this))
    });
	// Process Data Merge Properties
    $("p:contains('@AddDataMergeProperty')").parent().parent().each(function() {
        AddDataMergeProperty("@AddDataMergeProperty", $(this))
    });
	$("p:contains('@CharCount')").parent().parent().each(function() {
        charCountDisplay("@CharCount", $(this))
    });
	$("p:contains('@SingleLineEntry')").parent().parent().each(function() {
        forceSingleLineEntry("@SingleLineEntry", $(this))
    });	
    $("p:contains('@ConfirmFields')").parent().parent().each(function () {
      confirmFields($(this))
    });
    $("p:contains('@Placeholder')").parent().parent().each(function() {
        makePlaceholder("@Placeholder", $(this))
    });
    $("p:contains('@AddInformation')").parent().parent().each(function() {
        addInformation("@AddInformation", $(this))
    });
	app.events.publish('ROToolboxSHCStart');
	//@ShowHideCriteria Options need to be run through twice, so we call the same function twice
    $("p:contains('@ShowHideCriteria')").each(function() {
        addShowHideCriteria($(this).text(), $(this).parent().parent(), 'pass1')
    });
	// 2nd pass through of the @ShowHideCriteria Options - THIS IS REQUIRED A 2ND TIME
    $("p:contains('@ShowHideCriteria')").each(function() {
		addShowHideCriteria($(this).text(), $(this).parent().parent(), 'pass2')
    });
    $("p:contains('@ShowHideOR')").parent().parent().each(function() {
        makeShowHideOR("@ShowHideOR", $(this))
    });
	app.events.publish('ROToolboxSHCDone');
	app.events.publish('ROToolboxACMSStart');
    if (!($("div.custom-item-picker").length)) {
        $("p:contains('@AutoComplete')").parent().parent().each(function() {
            createAutoComplete("@AutoComplete", $(this))
        });
    }
    if (!($("div.custom-item-multipicker").length)) {
        $("p:contains('@MultiSelect')").parent().parent().each(function() {
            createMultiSelect("@MultiSelect", $(this))
        });
    }
	app.events.publish('ROToolboxACMSDone');
    $("p:contains('@DatePicker')").parent().parent().each(function() {
		customDatePicker("@DatePicker", $(this))
        });
    if (!($("div.custom-item-daterange").length)) {
        $("p:contains('@DateRange')").parent().parent().each(function() {
            createDateRange("@DateRange", $(this))
        });
    }
    $("p:contains('@QueryList')").parent().parent().each(function() {
		buildQueryList("@QueryList", $(this))
	});

	$("p:contains('@TopNode')").parent().parent().each(function() {
		buildTopNode("@TopNode", $(this));
	});

    $("p:contains('@AddClass')").parent().parent().each(function() {
        addCssClass("@AddClass", $(this))
    });
    $("p:contains('@addAttr')").parent().parent().each(function() {
        addAttrValue("@addAttr", $(this))
    });
    $("p:contains('@ToUpperCase')").parent().parent().each(function() {
        upperCaseInput("@ToUpperCase", $(this))
    });
    $("p:contains('@ToLowerCase')").parent().parent().each(function() {
        lowerCaseInput("@ToLowerCase", $(this))
    });
    $("p:contains('@Layout')").parent().parent().each(function() {
        applyLayoutTemplate("@Layout", $(this))
    });
    app.lib.mask.remove();
	app.events.publish('ROToolboxDone');
}

function parseOptions(controlName, control) {
    var properties = "{}";
    var rex = controlName + "(.*)";
    var regExp = new RegExp(rex);
    var matches = regExp.exec(control.text());
    if (matches && matches[1])
        properties = matches[1];
    return JSON.parse(properties);
}

// recompile AngularElement if Required and able to
function recompAngularElement(recompEle) {
	// Get Angular element
	var el = angular.element(recompEle);
	$scope = el.scope();
	$injector = el.injector();
	// if it exists, recompile so that ngshow attribute modification work
	if (typeof $injector != 'undefined') {
		$injector.invoke(function($compile){
			$compile(el)($scope);
				$scope.$digest();
		});
	}
}

function addInformation(tag, tagElement) {
    var userDefined = parseOptions(tag, tagElement);
	if (!userDefined.info && !userDefined.icon) {
		tagElement.remove();
		return;
	}
    var target = tagElement.next();
	var IDNum = (Math.floor(Math.random() * 999999999999) + 1);
	var divStart = '<div>';
	var divStartText = '<div id="IconHoverText' + IDNum + '">';
	var divEnd = '</div>';
	if (!userDefined.info) {
		var iconHover = $(target).append(divStart + '<i class="fa fa-question-circle AROHoverIcon" id="IconHoverArea' + IDNum + '"></i>' + divEnd);
		$(target).addClass('inline-spacing');
		$('#IconHoverArea' + IDNum).mouseenter(function(){$(this).after(divStartText + userDefined.icon + divEnd)});
		$('#IconHoverArea' + IDNum).mouseleave(function(){$('#IconHoverText' + IDNum).remove()});
	} else {
		$(target).append(divStart + userDefined.info + divEnd);
	}
	tagElement.remove();
}

// Set up options for the min / max character display
function charCountDisplay(tag, tagElement) {
    var target = tagElement.next();
	var minText = "Minimum Extra Characters Required";
	var maxText = "Maximum Characters Remaining";
	var showMin = 'true';
	var showMax = 'true';
	var showMinMax = 'false';
    var userDefined = parseOptions(tag, tagElement);
	if (typeof userDefined.minText != 'undefined') { minText = userDefined.minText;};
	if (typeof userDefined.maxText != 'undefined') { maxText = userDefined.maxText;};
	if (typeof userDefined.showMin != 'undefined') { showMin = userDefined.showMin;};	
	if (typeof userDefined.showMax != 'undefined') { showMax = userDefined.showMax;};
	if (typeof userDefined.showMinMax != 'undefined') { showMinMax = userDefined.showMinMax;};	

	var targetTA = $(target).find('textarea');
	var charMin = $(targetTA).parent().find('input').attr('minlength');
	if (typeof charMin == 'undefined') { charMin = 0; }
	var charMax = $(targetTA).parent().find('input').attr('maxlength');
	if (typeof charMax == 'undefined') { charMax = 0; }
	
	$(targetTA).on('paste',(function(e) { var tgtele = $(this); setTimeout( function() { MinMaxChars(tgtele,charMin,charMax, minText,maxText,showMin,showMax,showMinMax); },100) } ));
	$(targetTA).on('keyup',(function(e) { MinMaxChars($(this),charMin,charMax, minText,maxText,showMin,showMax,showMinMax); } ));
	tagElement.remove();
}

// Add the Minimum / Maximum requiored text to the page
function MinMaxChars(tgtele,charMin,charMax, minText,maxText,showMin,showMax,showMinMax) {
	$(tgtele).parent().find('span.charCount').remove()
	var currentLength = $(tgtele).val().length
	var minRemainingCharacters = charMin - currentLength
	var remainingCharacters = charMax - currentLength
	if (showMinMax == 'true' && charMax > 0) {
		if (minRemainingCharacters < 0) { minRemainingCharacters = 0 }
		$(tgtele).parent().append('<span class="charCount">' + minText + ' : ' + minRemainingCharacters + ' - ' + maxText + ' : ' + remainingCharacters + '</span>')
	} else if (showMin == 'true' && minRemainingCharacters > 0) {
		$(tgtele).parent().append('<span class="charCount">' + minText + ' : ' + minRemainingCharacters + '</span>')
	} else if (showMax == 'true' && charMax > 0) {
		$(tgtele).parent().append('<span class="charCount">' + maxText + ' : ' + remainingCharacters + '</span>')
	}
}

// Prevent CR on textarea's where specified
function forceSingleLineEntry(tag, tagElement) {
    var target = tagElement.next();
	$(target).keydown(function(event){if(event.which == 13 ){event.preventDefault();}}).keyup(function(event){if(event.which == 13 ){event.preventDefault();}});
	tagElement.remove();
}


function applyLayoutTemplate (tag, tagElement) {
    var userDefined = parseOptions(tag, tagElement);
	if (!userDefined.template) {
		tagElement.remove();
		return;
	}
	tagElement.html(userDefined.template);
	var ctrlRe = /tbxCtrl-\d+/g;
	var ctrlArray = userDefined.template.match(ctrlRe);
	var templatedControls = tagElement.nextAll().slice(0,ctrlArray.length);
	templatedControls.each(function(index) {
		$(this).find("div.col-md-4").removeClass("col-md-4");
		$(this).find("div.col-md-6").removeClass("col-md-6");
		var newParent = tagElement.find("."+ctrlArray[index]);
		$(this).detach().appendTo(newParent);
	});
};

function buildQueryList(tag, tagElement) {
	tagElement.hide();
	var userDefined = parseOptions(tag, tagElement);
	if (!userDefined.QueryId) {
		tagElement.remove();
		return;
	}
	var ddListRow = tagElement.next();
	tagElement.remove();
	var dataSource = new kendo.data.DataSource({
		transport: {
			read: {
				url: "/api/v3/Dashboard/GetDashboardDataById/?queryId="+userDefined.QueryId+"&v="+(new Date().getTime()),
				dataType: "json",
				contentType: 'application/json; charset=utf-8'
			}
		},
		sort: (userDefined.Sort) ? {field:userDefined.Sort, dir:"asc"} : {}
	});
	var ddListElement = ddListRow.find("input[data-control='inlineComboBox']");
	var ddList = ddListElement.data("kendoDropDownList");

	function isDefault(sourceData) {
		var Default = (userDefined.Default) ? userDefined.Default : "Default";
		return sourceData[Default] == 1;
	}

	dataSource.fetch(function(){
		var data = this.data();
		var keys = Object.keys(data[0]);
		
		var itemField = (userDefined.Item) ? userDefined.Item : (userDefined.Value) ? userDefined.Value :keys[2];
		var valueField = (userDefined.Value) ? userDefined.Value : itemField;

		ddList.setOptions({ dataTextField: itemField, dataValueField: valueField });
		if (userDefined.ItemTemplate) {
			ddList.setOptions({template: userDefined.ItemTemplate});
		}
		if (userDefined.ValueTemplate) {
			ddList.setOptions({valueTemplate: userDefined.ValueTemplate});
		}
		var defaultValue = null;
		var hiddenInput = null;
		var valueTargetId = null;
		if (userDefined.Default || (typeof data[0]["Default"] != "undefined")) {
			 defaultValue = data.find(isDefault)[valueField];
			 valueTargetId = ddListElement.attr("data-control-valuetargetid");
			 hiddenInput = $("#"+valueTargetId);
			 var ngModel = hiddenInput.attr("ng-model");
			 hiddenInput.attr("ng-init", ngModel+"='"+ defaultValue +"'");
			 hiddenInput.attr("data-default-value",defaultValue);
		}
		ddList.setDataSource(dataSource);
        if (defaultValue) {
        	ddList.value(defaultValue);
        	hiddenInput.val(defaultValue);
        }
		var inputElem = ddListRow.find(".k-input");
		if (inputElem.length > 0) {
			var input = $(inputElem)[0];
			var inputDefaultHolder = $(input).closest("div").find("input").last();
			var defaultValue = $(inputDefaultHolder).attr('data-default-value') || null;
			(input.nodeName.toLowerCase() == "span") ? $(input).html(defaultValue) : $(input).val(defaultValue);
		}
	});
};

function buildTopNode(tag, tagElement) {
	tagElement.hide();
	var userDefined = parseOptions(tag, tagElement);
	var elData = tagElement.next().find('[data-control="dropDownTree"]').data();
	var picker = elData['kendoExtDropDownTreeViewV2'];
	var originalId = picker.options.treeView.dataSource.options.transport.read.url.split('parentId=')[1];
	picker.options.treeView.dataSource.options.transport.read.url = picker.options.treeView.dataSource.options.transport.read.url.replace(originalId, userDefined.FilterId);
	elData['handler']._dropdown.dataSource.transport.options.read.url = elData['handler']._dropdown.dataSource.transport.options.read.url.replace(originalId, userDefined.FilterId);
	picker.options.treeView.dataSource.read();
};

function customDatePicker(tag, tagElement) {
	tagElement.hide();
	var dateElement = tagElement.next().find("input[value='DateTime']");
	if (dateElement.length == 0) {
		tagElement.remove();
		return;
	}
	var formGroup = dateElement.parent().find(".form-group");
	var inputElement = formGroup.find("input[data-control='dateTimePicker']"); 
	function replaceControl() {
		if (!(inputElement.attr("data-control-applied"))) {
			window.setTimeout(replaceControl,50);
		} else {
			var originalDatetimepicker = formGroup.find(".k-datetimepicker");
			inputElement.data("kendoDateTimePicker").destroy();
			inputElement.detach().prependTo(formGroup);
			originalDatetimepicker.remove();
			var userInput = parseOptions(tag, tagElement);
			userInput.hasTimePicker = (userInput.DateOnly) ? false : true;
			userInput.UTC = (userInput.UTC) ? true : false;
			userInput.Start = (userInput.Start) ? userInput.Start : null;
			userInput.Interval = (userInput.Interval > 0) ? (userInput.Interval) : 15;
			tbxDatePicker(inputElement,userInput);
			var dateControl = formGroup.closest(".row.question-container");
			dateControl.find("span.k-input").removeClass("k-input");
			tagElement.remove();
		}
	}
	replaceControl();
}

function upperCaseInput(tag, tagElement) {
  tagElement.hide();

  var uppercaseTextBox = tagElement.next().find('textarea');
  uppercaseTextBox.attr("style","text-transform:uppercase");

  uppercaseTextBox.blur(function() {
    this.value = this.value.toUpperCase();
  });
  tagElement.remove();
}

function lowerCaseInput(tag, tagElement) {
  tagElement.hide();

  var uppercaseTextBox = tagElement.next().find('textarea');
  uppercaseTextBox.attr("style","text-transform:lowercase");

  uppercaseTextBox.blur(function() {
    this.value = this.value.toLowerCase();
  });
  tagElement.remove();
}

// makeShowHide and createNgShow functions by Jeff Lang
// Sept. 19, 2017

// add additional attribute "ngshowhide" to input for query results prompt
// when set this changes the default action for combining multiple
// Show/Hide Criteria from "AND" to "OR"
function makeShowHideOR(tag, tagElement) {
    tagElement.hide();
    var userInput = tagElement.next();
    var queryResults = userInput.next();
    var targetEle = queryResults.find('div[data-control="checkboxGridByCriteriaOld"]');
    $(targetEle).attr("ngshowhide", "or");
    tagElement.remove();
}

// combine Show/Hide criteria for @AutoComplete and @MultiSelect Controls
function createNgShow(ngShow, ngShowCriteria, ngShowHide) {
	if (ngShow == "") return ngShowCriteria;
	if (ngShowCriteria == "") return ngShow;
	return "( " + ngShow + ' ' + ngShowHide + ' ' + ngShowCriteria + " )";
}

//modify boolean criteria to take into account if booleans are null, false or true without needing to check/uncheck them if additional criteria added
function modBoolCriteria(criteria) {
	if (criteria.indexOf('compareString') > -1 ) {
		return criteria;
	}
	if ( criteria.indexOf('null') > -1) {
		var criteriastart = criteria.lastIndexOf('(');
		var criteriaend = ( criteria.length - criteriastart - 1);
		if (criteria.substr((criteriastart - 1), 1) == "!") {
			if (criteria.indexOf('false') > -1) {
				criteria = criteria.substr(criteriastart, criteriaend);
				criteria = criteria.replace('false', 'true');
			} else {
				criteria = '!' + criteria.substr(criteriastart, criteriaend);
			}
		} else {
			if (criteria.indexOf('false') > -1) {
				criteria = '!' + criteria.substr(criteriastart, criteriaend);
				criteria = criteria.replace('false', 'true');
			} else {
				criteria = criteria.substr(criteriastart, criteriaend);
			}
		}
	}
	return criteria;
}

// add additional Show/Hide Criteria to non querty prompts
function addShowHideCriteria(tag, tagElement, SHCPassNum) {
	//return if pass not the correct one
	if ( (tag.indexOf('2') < 0 && SHCPassNum == 'pass2') || (tag.indexOf('2') > -1 && SHCPassNum == 'pass1') ) {
		return
	}
    // set either "AND" for the tag @ShowHideCriteria/2 or "OR" for the tag @ShowHideCriteriaOR/2
	var ngshowhide = '';
	var ngshow1 = '';
	var ngshow2 = '';
	if (tag.indexOf("@ShowHideCriteriaOR") != -1) {
		ngshowhide = "||";
	} else {
		ngshowhide = "&&";
	}
    var ngshow1 = tagElement.attr("ng-show");
	// find next element to apply criteria to for each pass through
	tagElementNext = tagElement.next();
	var ngshow2 = tagElementNext.attr("ng-show");
	var RO_Toolbox_ShowHideDone = tagElementNext.attr("RO_Toolbox_ShowHideDone");

	// combine preset Show/Hide Criteria
	var ngshow = "";
	if (typeof ngshow1 != 'undefined') {
			ngshow1 = modBoolCriteria(ngshow1);
		ngshow = createNgShow(ngshow, ngshow1, ngshowhide);
	}
	if (typeof ngshow2 != 'undefined') {
			ngshow2 = modBoolCriteria(ngshow2);
		ngshow = createNgShow(ngshow, ngshow2, ngshowhide);
	}

	// replace Show/Hide Criteria on item
	tagElementNext.attr("ng-show", ngshow);
	tagElementNext.attr("RO_Toolbox_ShowHideDone", 'Updated' + SHCPassNum);
	
	// remove show hide tag div
	tagElement.remove();

	if (ngshow != "" && $(tagElementNext).text().indexOf('@ShowHideCriteria') != 0) {
		// recompile AngularElement if Required and able to
		recompAngularElement(tagElementNext);
	}
}

// confirmFields function by Konstantin Slavin-Borovskij
// Sept. 19, 2017

function confirmFields(tagElement) {
  tagElement.hide();

  var referencePrompt = tagElement.next().find('textarea');
  var controlPrompt = tagElement.next().next().find('textarea');

  referencePrompt.blur(function() {
    var validationValue = referencePrompt.val();
    controlPrompt.attr("data-validate-value", validationValue);
  });
}

// makePlaceholder function by Konstantin Slavin-Bo
// June 1, 2017

function makePlaceholder(tag, tagElement) {
    tagElement.hide();
    var userDefined = parseOptions(tag, tagElement);

    // Get question div
    var question = tagElement.next();
    var placeholder = "";
    if (!userDefined.text) {
        placeholder = question.find('label.control-label').text().replace(/\n/g, ' ');
        // Hide title on question
        question.find('label.control-label').hide();
        // The text is losing the space before Required, so we need to insert it
        placeholder = placeholder.replace('(', ' (');
    } else {
        placeholder = userDefined.text;
    }

    var textPrompt = question.find('textarea');
    // Add placeholder attribute to textarea
    textPrompt.attr('placeholder', placeholder);
    tagElement.remove();
}

function addCssClass(tag, tagElement) {
    var userDefined = parseOptions(tag, tagElement);
	if (!userDefined.cssClass) {
		tagElement.remove();
		return;
	}
    var target = tagElement.next();
    target.addClass(userDefined.cssClass);
    tagElement.remove();
}

function addAttrValue(tag, tagElement) {
    var userDefined = parseOptions(tag, tagElement);
	if (!userDefined.Name || !userDefined.Value) {
		tagElement.remove();
		return;
	}
    var target = tagElement.next();
    target.attr(userDefined.Name, userDefined.Value);
    tagElement.remove();
}

function AddDataMergeProperty(tag, tagElement) {
    var userDefined = parseOptions(tag, tagElement);
	if (!userDefined.AddData && (!userDefined.Name || !userDefined.GUID)) {
		tagElement.remove();
		return;
	}
    var target = tagElement.next();
	if (typeof userDefined.AddData != 'undefined') {
		target.attr('ROToolBoxAddData', userDefined.AddData);
	} else {
		target.attr('ROToolBoxGetDataName', userDefined.Name);
		target.attr('ROToolBoxGetDataGUID', userDefined.GUID);
	};
    tagElement.remove();
}

function AddPreventSelectSelfProperty(tag, tagElement) {
	tagElement.next().attr('PreventSelfSelect', true);
    tagElement.remove();
}

function createDateRange(tag, tagElement) {
    var userDefined = parseOptions(tag, tagElement);
    var startDate = tagElement.next();
    var endDate = startDate.next();
    function startChange() {
        var startDate = startDatePicker.value()
          , endDate = endDatePicker.value();

        if (startDate) {
            startDate = new Date(startDate);
            startDate.setDate(startDate.getDate());
            endDatePicker.min(startDate);
        } else if (endDate) {
            startDatePicker.max(new Date(endDate));
        } else {
            endDate = new Date();
            startDatePicker.max(endDate);
            endDatePicker.min(endDate);
        }
    }

    function endChange() {
        var endDate = endDatePicker.value()
          , startDate = startDatePicker.value();

        if (endDate) {
            endDate = new Date(endDate);
            endDate.setDate(endDate.getDate());
            startDatePicker.max(endDate);
        } else if (startDate) {
            endDatePicker.min(new Date(startDate));
        } else {
            endDate = new Date();
            startDatePicker.max(endDate);
            endDatePicker.min(endDate);
        }
    }

    var startDatePicker = startDate.find('input[data-control="dateTimePicker"]').data("kendoDateTimePicker");
    if (_.isUndefined(startDatePicker)) {
    	startDatePicker = startDate.find('input[data-control="dateTimePicker"]').data("kendoDatePicker");
    }
    startDatePicker.bind("change", startChange);
    var endDatePicker = endDate.find('input[data-control="dateTimePicker"]').data("kendoDateTimePicker");
    if (_.isUndefined(endDatePicker)) {
    	endDatePicker = endDate.find('input[data-control="dateTimePicker"]').data("kendoDatePicker");
    }
    endDatePicker.bind("change", endChange);
    startDatePicker.max(endDatePicker.value());
    endDatePicker.min(startDatePicker.value());
    tagElement.remove();
}

function createAutoComplete(tag, tagElement) {
    var userDefined = parseOptions(tag, tagElement);
    // Hide the out of the box controls
    tagElement.hide();
    var userInput = tagElement.next();
    userInput.hide();
    var queryResults = userInput.next();
    var groupElements = tagElement.add(userInput);
    groupElements = groupElements.add(queryResults);
    groupElements.wrapAll("<div class='row'><div class='col-md-6 col-xs-12'></div></div>");

    // Get the definitions of the controls for the grid picker. We will use these to populate the auto complete control.
    var targetEle = queryResults.find('div[data-control="checkboxGridByCriteriaOld"]');
    var targetId = targetEle.attr("data-control-valuetargetid");
    var valuefield = targetEle.attr("data-control-valuefield");
    var criteriaid = targetEle.attr("data-control-criteriaid");
    var columnsid = targetEle.attr("data-control-columnsid");
    var dependencyTargetIds = targetEle.attr("data-control-dependencies");
    var classorprojectionid = targetEle.attr("data-control-classorprojectionid");
    var isprojection = targetEle.attr("data-control-isprojection");
    var controlLabel = queryResults.find('label.control-label').prop('outerHTML');
    var controlHint = userInput.find('label.control-label').text();
    var multiselect = targetEle.attr("data-control-ismultiselect");
	// set vars for preset Show/Hide Criteria
	var ngshowhide = targetEle.attr("ngshowhide");
    var ngshow1 = targetEle.parent().parent().parent().parent().parent().attr("ng-show");
    var ngshow2 = targetEle.parent().parent().parent().parent().parent().prev().attr("ng-show");
    var ngshow3 = targetEle.parent().parent().parent().parent().parent().prev().prev().attr("ng-show");
	
    // The criteria used to query SCSM for matching items
    var originalCriteria = $('#' + criteriaid).val();
    var criteria = originalCriteria;
    var getCriteriaValue = function(value) {
        if (!value)
            value = "";
        var xmlCriteria = jQuery.parseXML(originalCriteria);
        var xmlExpressionNode = $(xmlCriteria).find("ValueExpressionRight");

        $.each(xmlExpressionNode, function(i, item) {
            // set token value
            if (value == "") {
                $(item).find("Token").remove()
            } else {
                $(item).find("Token").replaceWith(value);
            }
        });

        return (new XMLSerializer()).serializeToString(xmlCriteria);
    }

    // Get the columns which have been selected for display. These will be used to retrieve data from the server and will be displayed in the dropdown.
    var columns = $('#' + columnsid).val();
    // "title(((:)))name(((;)))title(((:)))name"; 
    var arrColumnNames = [];
    var columnTitles = [];

    $.each(columns.split("(((;)))"), function(i, item) {
        arrColumnNames.push(item.split("(((:)))")[1]);
        columnTitles.push({
            field: item.split("(((:)))")[1],
            title: item.split("(((:)))")[0]
        });
    });
    var columnNames = arrColumnNames.join(',');

    // The URL used to get data from the server.
    var url = "/Search/GetObjectsByCriteria";

    //Get the properties defined by the user
    var minLength = (typeof userDefined.minLength == 'undefined') ? 3 : parseInt(userDefined.minLength);

    // Show/Hide controls by Jeff Lang
    // set either "AND" or "OR" for multiple Show/Hide Criteria
	if (ngshowhide == "or") {
		ngshowhide = "||";
	} else {
		ngshowhide = "&&";
	}
	
	// combine preset Show/Hide Criteria
	var ngshow = "";
	if (typeof ngshow1 != 'undefined') {
			ngshow1 = modBoolCriteria(ngshow1);
		ngshow = createNgShow(ngshow, ngshow1, ngshowhide);
	}
	if (typeof ngshow2 != 'undefined') {
			ngshow2 = modBoolCriteria(ngshow2);
		ngshow = createNgShow(ngshow, ngshow2, ngshowhide);
	}
	if (typeof ngshow3 != 'undefined') {
			ngshow3 = modBoolCriteria(ngshow3);
		ngshow = createNgShow(ngshow, ngshow3, ngshowhide);
	}
	
		targetDiv = $(tagElement).next().next();
		$(targetDiv).wrapInner("<div class='oldquery' style='Display: none' />");
    // Add the HTML template for the AutoComplete control, along with Combined Show/Hide Criteria if set, also ngsr attribute if needed to add/remove required
	if (ngshow != "") {
		ngshow = "(" + ngshow + ")";
		$(targetDiv).prepend('<div class="col-md-6 col-xs-12">' + controlLabel + '<div class="form-group"><input id="ac' + targetId + '" style="width: 100%;" /></div>');
		$(targetDiv).parent().removeClass('question-container');
		$(targetDiv).parent().addClass('custom-item-picker');
		$(targetDiv).attr('ngsid', "ng" + targetId);
		$(targetDiv).attr('ng-show', ngshow);
		// recompile AngularElement if Required and able to
		recompAngularElement(targetDiv);
		var cbGBC = $('div[data-control-type="checkboxGridByCriteria"] input[id="' + targetId + '"]');
		if ( typeof $(cbGBC).attr('required') != 'undefined' ) {
			$(cbGBC).attr('ngsr', 'true');
		}
		var cbGBCO = $('div[data-control-type="checkboxGridByCriteriaOld"] input[id="' + targetId + '"]');
		if ( typeof $(cbGBCO).attr('required') != 'undefined' ) {
			$(cbGBCO).attr('ngsr', 'true');
		}
    } else {
		$(targetDiv).prepend('<div class="col-md-6 col-xs-12">' + controlLabel + '<div class="form-group"><input id="ac' + targetId + '" style="width: 100%;" /></div></div>');
		$(targetDiv).parent().removeClass('question-container');
		$(targetDiv).parent().addClass('custom-item-picker');
    }

	// Add Data Merge Attributes to Autocomplete, so that they can be processed on typing and selection changes
	var MSID = '#ac' + targetId;
	if (typeof tagElement.attr('ROToolBoxGetDataName') != 'undefined') { $(MSID).attr('ROToolBoxGetDataName',tagElement.attr('ROToolBoxgetDataName')); };
	if (typeof tagElement.attr('ROToolBoxGetDataGUID') != 'undefined') { $(MSID).attr('ROToolBoxGetDataGUID',tagElement.attr('ROToolBoxgetDataGUID')); };
	if (typeof tagElement.attr('ROToolBoxAddData') != 'undefined') { $(MSID).attr('ROToolBoxAddData',tagElement.attr('ROToolBoxAddData')); };
	
    // Monitor input attribute to display custom error msg
    // TODO: Does not re-show error, after first success and then removing value from field
    var obs = new MutationObserver (function(mutations) {      
		var invalidState = queryResults.find('div[data-control-type="checkboxGridByCriteriaOld"]').find('input#' + targetId).attr("aria-invalid");
		if(typeof invalidState != 'undefined' && $('span#ac' + targetId + '_errorMsg').length < 1) {
		if (!$('input#ac' + targetId).parent().parent().parent().hasClass("ng-hide")) {
			$('input#ac' + targetId).parent().before('<span class="k-widget k-tooltip k-invalid-msg field-validation-error" id="ac' + targetId + '_errorMsg" role="alert"><span class="k-icon k-warning"></span> This is a required field.</span>');
		}
		} else if(typeof invalidState == 'undefined' && $('span#ac' + targetId + '_errorMsg').length > 0) {
        $('span#ac' + targetId + '_errorMsg').remove();
      }
    });
    obs.observe(document.querySelectorAll('div[data-control-type="checkboxGridByCriteriaOld"] input[id="' + targetId + '"]')[0], {attributes: true, attributeFilter: ['aria-invalid'], childList: false, characterData: false, subtree:false});

	// set attributes then observe for changes to show/hide class to set/remove required when displayed or hidden
	if (ngshow != "") {
		var hiddenState = $('div[ngsid="ng' + targetId + '"]');
		if($(hiddenState).hasClass('ng-hide') == true) {
			var cbGBC = $('div[data-control-type="checkboxGridByCriteria"] input[id="' + targetId + '"]');
			var cbGBCO = $('div[data-control-type="checkboxGridByCriteriaOld"] input[id="' + targetId + '"]');
			if ( $(cbGBC).attr('ngsr') == 'true' ) {
				$(cbGBC).removeAttr('required');
			}
			if ( $(cbGBCO).attr('ngsr') == 'true' ) {
				$(cbGBCO).removeAttr('required');
			}
		} else {
			var unhiddenState = queryResults.find('div.row.custom-item-picker[ngsid="ng' + targetId + '"]');
			if(typeof hiddenState != 'undefined') {
				var cbGBC = $('div[data-control-type="checkboxGridByCriteria"] input[id="' + targetId + '"]');
				var cbGBCO = $('div[data-control-type="checkboxGridByCriteriaOld"] input[id="' + targetId + '"]');
				if ( $(cbGBC).attr('ngsr') == 'true') {
					$(cbGBC).attr('required','true');
				}
				if ( $(cbGBCO).attr('ngsr') == 'true') {
					$(cbGBCO).attr('required','true');
				}
			}
		}
		var obs2 = new MutationObserver (function(mutations) {      
			var hiddenState = $('div[ngsid="ng' + targetId + '"]');
			if($(hiddenState).hasClass('ng-hide') == true) {
				var cbGBC = $('div[data-control-type="checkboxGridByCriteria"] input[id="' + targetId + '"]');
				var cbGBCO = $('div[data-control-type="checkboxGridByCriteriaOld"] input[id="' + targetId + '"]');
				if ( $(cbGBC).attr('ngsr') == 'true' ) {
					$(cbGBC).removeAttr('required');
				}
				if ( $(cbGBCO).attr('ngsr') == 'true' ) {
					$(cbGBCO).removeAttr('required');
				}
			} else {
				var unhiddenState = queryResults.find('div.row.custom-item-picker[ngsid="ng' + targetId + '"]');
				if(typeof hiddenState != 'undefined') {
					var cbGBC = $('div[data-control-type="checkboxGridByCriteria"] input[id="' + targetId + '"]');
					var cbGBCO = $('div[data-control-type="checkboxGridByCriteriaOld"] input[id="' + targetId + '"]');
					if ( $(cbGBC).attr('ngsr') == 'true') {
						$(cbGBC).attr('required','true');
					}
					if ( $(cbGBCO).attr('ngsr') == 'true') {
						$(cbGBCO).attr('required','true');
					}
				}
			}
		});
		obs2.observe(document.querySelectorAll('div.row.question-container[ngsid="ng' + targetId + '"]')[0], {attributes: true, attributeFilter: ['class'], childList: false, characterData: false, subtree:false});
	}
	
    // Process the data returned from the server and may the display columns into one string.
    function preprocessData(json) {
        json.Data = $.map(json.Data, function(user, i) {
            var append = "";
            $.each(arrColumnNames, function(key, value) {
                if (key == 0) {
                    append += user[value];
                } else {
                    append += " - " + user[value];
                }
            });
            return {
                "DisplayName": append,
				"BaseId": user.BaseId,
				"Id": user.Id,
   				"ClassTypeId": user.ClassTypeId
            };
        });
        return json;
    }

    //create AutoComplete UI component.
    $("#ac" + targetId).kendoAutoComplete({
        minLength: minLength,
        autoBind: false,
        dataTextField: "DisplayName",
        highlightFirst: true,
        suggest: false,
        placeholder: controlHint,
        filtering: function(e) {
            var filter = e.filter;
            if ((!filter.value) && (minLength > 0)) {
                e.preventDefault();
            }
        },
        dataSource: new kendo.data.DataSource({
            type: "aspnetmvc-ajax",
            serverFiltering: true,
            ignoreCase: true,
            transport: {
                read: {
                    url: url,
                    type: "POST",
                    data: function(options) {
                        var searchValue = options.filter.filters[0].value;
                        options.filter.filters = [];
                        return {
                            id: classorprojectionid,
                            isProjection: isprojection,
                            columnNames: columnNames,
                            criteria: getCriteriaValue(searchValue)
                        }
                    }
                }
            },
			sort: {
				field: arrColumnNames[0],
				dir: "asc"
			},
            schema: {
                parse: function(data) {
 					//set to a variable instead of just returning so that we can process the DataMerge functions
					var jd = preprocessData(data);
					//Add any DataMerge items to the data source
					$("#ac" + targetId).each(function() {
						ROTBGetAddData = $(this).attr('ROToolBoxAddData');
						if (typeof ROTBGetAddData != 'undefined') {
							if (DataMergeResults.length > 0) {
								var mdms = $("#ac" + targetId).data('kendoAutoComplete');
								for (var i = 0; i < DataMergeResults.length; i++) {
									if ( ROTBGetAddData == 'All' || DataMergeResults[i].Name == ROTBGetAddData ) {
										for (var y = 0; y < DataMergeResults[i].Data.length; y++) {
											if (DataMergeResults[i].Data[y].DisplayName.toLowerCase().indexOf(mdms.value().toLowerCase()) > -1) {
												jd.Data.push({DisplayName: DataMergeResults[i].Data[y].DisplayName, BaseId: DataMergeResults[i].Data[y].BaseId});
											}
										}
									}
								}
							}
						}
						ROTBPreventSelfSelect = $(this).parent().parent().parent().parent().attr('PreventSelfSelect');
						if (typeof ROTBPreventSelfSelect != 'undefined') {
							if (jd.Data.length > 0) {
								for ( i = jd.Data.length - 1; i > -1; i-- ) {
									if ( jd.Data[i].BaseId == session.user.Id ) {
										jd.Data.splice( i, 1 );
									}
								}
							}
						}
					});
					return jd;
               },
                data: "Data"
            }
		}),
		select: function(e){
			//underlines text in picker to show that an item was selected
			e.sender.element[0].style.textDecoration = "underline";
		},
        change: function(e) {
            var newData = [];
			if (multiselect === 'True') {
				this.dataItems().forEach(function (val, index, arr) {
					if (_.isUndefined(val.BaseId)) {
						val.BaseId = !_.isUndefined(val.Id) ? val.Id : null;
					}
					newData.push(val);
				});

			} else {
				var dataItem = this.dataItem();

				//clear underline on change 
				(document.getElementById("ac"+targetId)).style.textDecoration = ""

				//if clicking out of the autocomplete and there is only one item in the filtered list set it to the selected item and underline it
				if(dataItem == undefined && this.dataSource._view.length == 1){
					dataItem = this.dataSource._view[0];
					(document.getElementById("ac"+targetId)).style.textDecoration = "underline"
					this.value(this.dataSource._view[0].DisplayName);
				}
				if(!_.isUndefined(dataItem)){
					if (_.isUndefined(dataItem.BaseId)) { 
							dataItem.BaseId = !_.isUndefined(dataItem.Id) ? dataItem.Id : null;
					}
				}else{
					//clear input value if data isn't found
					this.value("");
				}	
				
				newData.pop();
				newData.push(dataItem);
			}

			var selectedItems = newData;
			var selectedItemIds = _.pluck(selectedItems, "BaseId");
			$("input[id='" + targetId + "']").each(function (i, el) {
				$(el).val(selectedItemIds.join(','));
				$(el).change();
			});

			var newDataJSON = [];
			newDataJSON = selectedItems;
			$('#Json' + targetId).val(JSON.stringify(newDataJSON));
			//Process DataMerge functions to get data related to selected items and add to list to be added to other multiselect/autocomplete controls
            $("#ac" + targetId).each(function() {
				ROTBGetDataName = $(this).attr('ROToolBoxGetDataName');
				if( typeof ROTBGetDataName != 'undefined') {
					// remove all current named data
					if (DataMergeResults.length > 0 ) {
						for (var x = (DataMergeResults.length - 1); x >= 0; x--) {
							if (DataMergeResults[x].Name == ROTBGetDataName) { DataMergeResults.splice(x, 1); }
						}
					}
					// Add New named Data
					var KMSselecteditems = $(this).data("kendoAutoComplete").dataItems();
					if ( KMSselecteditems.length > 0 ) {
						ROTBGetDataGUID = $(this).attr('ROToolBoxGetDataGUID')
						for (var x = 0; x < KMSselecteditems.length; x++) {
							ROTBGetDataFilter = KMSselecteditems[x].DisplayName;
							$.ajax({
								url: "/api/V3/Projection/GetProjectionByCriteria",
								data: JSON.stringify({
									"Id": ROTBGetDataGUID,
									"Criteria": { "Base": { "Expression": { "And": { "Expression": [{ "SimpleExpression": {
										"ValueExpressionLeft": {"Property": "$Context/Property[Type='55270a70-ac47-c853-c617-236b0cff9b4c']/DisplayName$"},
										"Operator": "Equal",
										"ValueExpressionRight": {"Value": ROTBGetDataFilter}
									} }] } } } }
								}),
								type: "Post",
								contentType: "application/json; charset=utf-8",
								dataType: "json",
								success: function (data) {
									$.each(data[0], function(key, value) {
										if (typeof(value) == 'object') {
											if (typeof(value) != 'undefined' && value != null && key != 'AssetStatus' && key != 'ObjectStatus' && key != 'NameRelationship') {
												var ROTBReturnedData = [];
												if(typeof(value.length) == 'undefined' ) {
														ROTBReturnedData.push({DisplayName: value.DisplayName, BaseId: value.BaseId});
												} else if (value.length > 0) {
													for(y = 0; y < value.length; y++) {
														ROTBReturnedData.push({DisplayName: value[y].DisplayName, BaseId: value[y].BaseId});
													}
												}
												DataMergeResults.push({Name: ROTBGetDataName, Data: ROTBReturnedData});
											}
										}
									});
								}
							});
						}
					}
				}
			});
        }
    });
}

function createMultiSelect(tag, tagElement) {
    var userDefined = parseOptions(tag, tagElement);
    // Hide the out of the box controls
    tagElement.hide();
    var userInput = tagElement.next();
    userInput.hide();
    var queryResults = userInput.next();
    var groupElements = tagElement.add(userInput);
    groupElements = groupElements.add(queryResults);
    groupElements.wrapAll("<div class='row'><div class='col-md-12 col-xs-12'></div></div>");

    // Get the definitions of the controls for the grid picker. We will use these to populate the multiselect control.
    var targetEle = queryResults.find('div[data-control="checkboxGridByCriteriaOld"]');
    var targetId = targetEle.attr("data-control-valuetargetid");
    var valuefield = targetEle.attr("data-control-valuefield");
    var criteriaid = targetEle.attr("data-control-criteriaid");
    var columnsid = targetEle.attr("data-control-columnsid");
    var dependencyTargetIds = targetEle.attr("data-control-dependencies");
    var classorprojectionid = targetEle.attr("data-control-classorprojectionid");
    var isprojection = targetEle.attr("data-control-isprojection");
    var controlLabel = queryResults.find('label.control-label').prop('outerHTML');
    var controlHint = userInput.find('label.control-label').text();
    var multiselect = targetEle.attr("data-control-ismultiselect");
    if (_.isUndefined(multiselect) || _.isNull(multiselect)) {
        //default to false if data-control-ismultiselect is undefined
        multiselect = false;
    }
    var maxSelectedItems = (multiselect) ? null : 1;
	// set vars for preset Show/Hide Criteria
	var ngshowhide = targetEle.attr("ngshowhide");
    var ngshow1 = targetEle.parent().parent().parent().parent().parent().attr("ng-show");
    var ngshow2 = targetEle.parent().parent().parent().parent().parent().prev().attr("ng-show");
    var ngshow3 = targetEle.parent().parent().parent().parent().parent().prev().prev().attr("ng-show");
	
    // The criteria used to query SCSM for matching items
    var originalCriteria = $('#' + criteriaid).val();
    var criteria = originalCriteria;
    var getCriteriaValue = function(value) {
        if (!value)
            value = "";
        var xmlCriteria = jQuery.parseXML(originalCriteria);
        var xmlExpressionNode = $(xmlCriteria).find("ValueExpressionRight");

        $.each(xmlExpressionNode, function(i, item) {
            // set token value
            if (value == "") {
                $(item).find("Token").remove()
            } else {
                $(item).find("Token").replaceWith(value);
            }
        });

        return (new XMLSerializer()).serializeToString(xmlCriteria);
    }

    // Get the columns which have been selected for display. These will be used to retrieve data from the server and will be displayed in the dropdown.
    var columns = $('#' + columnsid).val();
    // "title(((:)))name(((;)))title(((:)))name"; 
    var arrColumnNames = [];
    var columnTitles = [];

    $.each(columns.split("(((;)))"), function(i, item) {
        arrColumnNames.push(item.split("(((:)))")[1]);
        columnTitles.push({
            field: item.split("(((:)))")[1],
            title: item.split("(((:)))")[0]
        });
    });
    var columnNames = arrColumnNames.join(',');

    // The URL used to get data from the server.
    var url = "/Search/GetObjectsByCriteria";

    //Get the properties defined by the user
    var minLength = (typeof userDefined.minLength == 'undefined') ? 3 : parseInt(userDefined.minLength);

    // Show/Hide controls by Jeff Lang
	// set either "AND" or "OR" for multiple Show/Hide Criteria
	if (ngshowhide == "or") {
		ngshowhide = "||";
	} else {
		ngshowhide = "&&";
	}
	
	// combine preset Show/Hide Criteria
	var ngshow = "";
	if (typeof ngshow1 != 'undefined') {
			ngshow1 = modBoolCriteria(ngshow1);
		ngshow = createNgShow(ngshow, ngshow1, ngshowhide);
	}
	if (typeof ngshow2 != 'undefined') {
			ngshow2 = modBoolCriteria(ngshow2);
		ngshow = createNgShow(ngshow, ngshow2, ngshowhide);
	}
	if (typeof ngshow3 != 'undefined') {
			ngshow3 = modBoolCriteria(ngshow3);
		ngshow = createNgShow(ngshow, ngshow3, ngshowhide);
	}
	
	targetDiv = $(tagElement).next().next();
	$(targetDiv).wrapInner("<div class='oldquery' style='Display: none' />");    // Add the HTML template for the @MultiSelect control, along with Combined Show/Hide Criteria if set
	if (ngshow != "") {
		ngshow = "(" + ngshow + ")";
		$(targetDiv).prepend('<div class="col-md-6 col-xs-12">' + controlLabel + '<select id="ms' + targetId + '" style="width: 100%;" /></div>');
		$(targetDiv).parent().removeClass('question-container');
		$(targetDiv).parent().addClass('custom-item-multipicker');
		$(targetDiv).attr('ngsid', "ng" + targetId);
		$(targetDiv).attr('ng-show', ngshow);
		// recompile AngularElement if Required and able to
		recompAngularElement(targetDiv);
		var cbGBC = $('div[data-control-type="checkboxGridByCriteria"] input[id="' + targetId + '"]');
		if ( typeof $(cbGBC).attr('required') != 'undefined' ) {
			$(cbGBC).attr('ngsr', 'true');
		}
		var cbGBCO = $('div[data-control-type="checkboxGridByCriteriaOld"] input[id="' + targetId + '"]');
		if ( typeof $(cbGBCO).attr('required') != 'undefined' ) {
			$(cbGBCO).attr('ngsr', 'true');
		}
    } else {
 		$(targetDiv).prepend('<div class="col-md-6 col-xs-12">' + controlLabel + '<select id="ms' + targetId + '" style="width: 100%;" /></div>');
		$(targetDiv).parent().removeClass('question-container');
		$(targetDiv).parent().addClass('custom-item-multipicker');
   }
	
	// Add Data Merge Attributes to Multiselect, so that they can be processed on typing and selection changes
	var MSID = '#ms' + targetId;
	if (typeof tagElement.attr('ROToolBoxGetDataName') != 'undefined') { $(MSID).attr('ROToolBoxGetDataName',tagElement.attr('ROToolBoxgetDataName')); };
	if (typeof tagElement.attr('ROToolBoxGetDataGUID') != 'undefined') { $(MSID).attr('ROToolBoxGetDataGUID',tagElement.attr('ROToolBoxgetDataGUID')); };
	if (typeof tagElement.attr('ROToolBoxAddData') != 'undefined') { $(MSID).attr('ROToolBoxAddData',tagElement.attr('ROToolBoxAddData')); };
	
    // Monitor input attribute to display custom error msg
    var obs = new MutationObserver (function(mutations) {      
		var invalidState = queryResults.find('div[data-control-type="checkboxGridByCriteriaOld"]').find('input#' + targetId).attr("aria-invalid");
		if(typeof invalidState != 'undefined' && $('span#ms' + targetId + '_errorMsg').length < 1) {
			$('ul#ms' + targetId + '_taglist').parent().parent().before('<span class="k-widget k-tooltip k-invalid-msg field-validation-error" id="ms' + targetId + '_errorMsg" role="alert"><span class="k-icon k-warning"></span> This is a required field.</span>');
		} else if(typeof invalidState == 'undefined' && $('span#ms' + targetId + '_errorMsg').length > 0) {
			$('span#ms' + targetId + '_errorMsg').remove();
		}
    });
    obs.observe(document.querySelectorAll('div[data-control-type="checkboxGridByCriteriaOld"] input[id="' + targetId + '"]')[0], {attributes: true, attributeFilter: ['aria-invalid'], childList: false, characterData: false, subtree:false});

	// set attributes then observe for changes to show/hide class to set/remove required when displayed or hidden
	if (ngshow != "") {
		var hiddenState = $('div[ngsid="ng' + targetId + '"]');
		if($(hiddenState).hasClass('ng-hide') == true) {
			var cbGBC = $('div[data-control-type="checkboxGridByCriteria"] select[id="' + targetId + '"]');
			var cbGBCO = $('div[data-control-type="checkboxGridByCriteriaOld"] select[id="' + targetId + '"]');
			if ( $(cbGBC).attr('ngsr') == 'true' ) {
				$(cbGBC).removeAttr('required');
			}
			if ( $(cbGBCO).attr('ngsr') == 'true' ) {
				$(cbGBCO).removeAttr('required');
			}
		} else {
			var unhiddenState = queryResults.find('div.row.custom-item-multipicker[ngsid="ng' + targetId + '"]');
			if(typeof hiddenState != 'undefined') {
				var cbGBC = $('div[data-control-type="checkboxGridByCriteria"] select[id="' + targetId + '"]');
				var cbGBCO = $('div[data-control-type="checkboxGridByCriteriaOld"] select[id="' + targetId + '"]');
				if ( $(cbGBC).attr('ngsr') == 'true') {
					$(cbGBC).attr('required','true');
				}
				if ( $(cbGBCO).attr('ngsr') == 'true') {
					$(cbGBCO).attr('required','true');
				}
			}
		}
		var obs2 = new MutationObserver (function(mutations) {      
			var hiddenState = $('div[ngsid="ng' + targetId + '"]');
			if($(hiddenState).hasClass('ng-hide') == true) {
				var cbGBC = $('div[data-control-type="checkboxGridByCriteria"] select[id="' + targetId + '"]');
				var cbGBCO = $('div[data-control-type="checkboxGridByCriteriaOld"] select[id="' + targetId + '"]');
				if ( $(cbGBC).attr('ngsr') == 'true' ) {
					$(cbGBC).removeAttr('required');
				}
				if ( $(cbGBCO).attr('ngsr') == 'true' ) {
					$(cbGBCO).removeAttr('required');
				}
			} else {
				var unhiddenState = queryResults.find('div.row.custom-item-multipicker[ngsid="ng' + targetId + '"]');
				if(typeof hiddenState != 'undefined') {
					var cbGBC = $('div[data-control-type="checkboxGridByCriteria"] select[id="' + targetId + '"]');
					var cbGBCO = $('div[data-control-type="checkboxGridByCriteriaOld"] select[id="' + targetId + '"]');
					if ( $(cbGBC).attr('ngsr') == 'true') {
						$(cbGBC).attr('required','true');
					}
					if ( $(cbGBCO).attr('ngsr') == 'true') {
						$(cbGBCO).attr('required','true');
					}
				}
			}
		});
		obs2.observe(document.querySelectorAll('div.row.question-container[ngsid="ng' + targetId + '"]')[0], {attributes: true, attributeFilter: ['class'], childList: false, characterData: false, subtree:false});
	}
    // Process the data returned from the server and map the display columns into one string.
    function preprocessData(json) {
        json.Data = $.map(json.Data, function(user, i) {
            var append = "";
            $.each(arrColumnNames, function(key, value) {
                if (key == 0) {
                    append += user[value];
                } else {
                    append += " - " + user[value];
                }
            });
            return {
                "DisplayName": append,
                "BaseId": user.BaseId,
				"Id": user.Id,
				"ClassTypeId": user.ClassTypeId
            };
        });
        return json;
    }

    //create MultiSelect UI component.
    $("#ms" + targetId).kendoMultiSelect({
        minLength: minLength,
        enforceMinLength: true,
        maxSelectedItems: maxSelectedItems,
        autoBind: false,
        dataTextField: "DisplayName",
        dataValueField: "BaseId",
        highlightFirst: true,
        placeholder: controlHint,
        filtering: function(e) {
            var filter = e.filter;
			if ( typeof filter != 'undefined') {
				if ((!filter.value) && (minLength > 0)) {
					e.preventDefault();
				}
			}
        },
        dataSource: new kendo.data.DataSource({
            type: "aspnetmvc-ajax",
            serverFiltering: true,
            ignoreCase: true,
            transport: {
                read: {
                    url: url,
                    type: "POST",
                    data: function() {
                        var ms = $("#ms" + targetId).data('kendoMultiSelect');
                        ms.dataSource.transport.options.read.data.arguments["0"].filter = [];
                        return {
                            id: classorprojectionid,
                            isProjection: isprojection,
                            columnNames: columnNames,
                            criteria: getCriteriaValue(ms.input.val())
                        }
                    }
                }
            },
			sort: {
				field: "DisplayName",
				dir: "asc"
			},
            schema: {
                parse: function(data) {
					//set to a variable instead of just returning so that we can process the DataMerge functions
					var jd = preprocessData(data);
					//Add any DataMerge items to the data source
					$("#ms" + targetId).each(function() {
						ROTBGetAddData = $(this).attr('ROToolBoxAddData');
						if (typeof ROTBGetAddData != 'undefined') {
							if (DataMergeResults.length > 0) {
								var mdms = $("#ms" + targetId).data('kendoMultiSelect');
								for (var i = 0; i < DataMergeResults.length; i++) {
									if ( ROTBGetAddData == 'All' || DataMergeResults[i].Name == ROTBGetAddData ) {
										for (var y = 0; y < DataMergeResults[i].Data.length; y++) {
											if (DataMergeResults[i].Data[y].DisplayName.toLowerCase().indexOf(mdms.input.val().toLowerCase()) > -1) {
												jd.Data.push({DisplayName: DataMergeResults[i].Data[y].DisplayName, BaseId: DataMergeResults[i].Data[y].BaseId});
											}
										}
									}
								}
							}
						}
						ROTBPreventSelfSelect = $(this).attr('PreventSelfSelect');
						if (typeof ROTBPreventSelfSelect != 'undefined') {
							if (jd.Data.length > 0) {
								for ( i = jd.Data.length - 1; i > -1; i-- ) {
									if ( jd.Data[i].BaseId == session.user.Id ) {
										jd.Data.splice( i, 1 );
									}
								}
							}
						}
					});
					return jd;
                },
                data: "Data"
            }
        }),
        change: function(e) {
			var newData = [];
			if (multiselect === 'True') {
				this.dataItems().forEach(function (val, index, arr) {
					if (_.isUndefined(val.BaseId)) {
						val.BaseId = !_.isUndefined(val.Id) ? val.Id : null;
					}
					newData.push(val);
				});

			} else {
				var dataItem = this.dataItem();

				if (_.isUndefined(dataItem.BaseId)) {
					dataItem.BaseId = !_.isUndefined(dataItem.Id) ? dataItem.Id : null;
				}

				newData.pop();
				newData.push(dataItem);
			}

			var selectedItems = newData;
			var selectedItemIds = _.pluck(selectedItems, "BaseId");
			$("input[id='" + targetId + "']").each(function (i, el) {
				$(el).val(selectedItemIds.join(','));
				$(el).change();
			});

			var newDataJSON = [];
			newDataJSON = selectedItems;
			$('#Json' + targetId).val(JSON.stringify(newDataJSON));
			//Process DataMerge functions to get data related to selected items and add to list to be added to other multiselect/autocomplete controls
            $("#ms" + targetId).each(function() {
				ROTBGetDataName = $(this).attr('ROToolBoxGetDataName');
				if( typeof ROTBGetDataName != 'undefined') {
					// remove all current named data
					if (DataMergeResults.length > 0 ) {
						for (var x = (DataMergeResults.length - 1); x >= 0; x--) {
							if (DataMergeResults[x].Name == ROTBGetDataName) { DataMergeResults.splice(x, 1); }
						}
					}
					// Add New named Data
					var KMSselecteditems = $(this).data("kendoMultiSelect").dataItems();
					if ( KMSselecteditems.length > 0 ) {
						ROTBGetDataGUID = $(this).attr('ROToolBoxGetDataGUID')
						for (var x = 0; x < KMSselecteditems.length; x++) {
							ROTBGetDataFilter = KMSselecteditems[x].DisplayName;
							$.ajax({
								url: "/api/V3/Projection/GetProjectionByCriteria",
								data: JSON.stringify({
									"Id": ROTBGetDataGUID,
									"Criteria": { "Base": { "Expression": { "And": { "Expression": [{ "SimpleExpression": {
										"ValueExpressionLeft": {"Property": "$Context/Property[Type='55270a70-ac47-c853-c617-236b0cff9b4c']/DisplayName$"},
										"Operator": "Equal",
										"ValueExpressionRight": {"Value": ROTBGetDataFilter}
									} }] } } } }
								}),
								type: "Post",
								contentType: "application/json; charset=utf-8",
								dataType: "json",
								success: function (data) {
									$.each(data[0], function(key, value) {
										if (typeof(value) == 'object') {
											if (typeof(value) != 'undefined' && value != null && key != 'AssetStatus' && key != 'ObjectStatus' && key != 'NameRelationship') {
												var ROTBReturnedData = [];
												if(typeof(value.length) == 'undefined' ) {
														ROTBReturnedData.push({DisplayName: value.DisplayName, BaseId: value.BaseId});
												} else if (value.length > 0) {
													for(y = 0; y < value.length; y++) {
														ROTBReturnedData.push({DisplayName: value[y].DisplayName, BaseId: value[y].BaseId});
													}
												}
												DataMergeResults.push({Name: ROTBGetDataName, Data: ROTBReturnedData});
											}
										}
									});
								}
							});
						}
					}
				}
			});
		}
    });
}

//DateTime Control for the Request Offering Toolbox
function tbxDatePicker  (targetEle, settings) {
	var settings = settings;
	settings.targetValId = targetEle.attr('data-control-valueTargetId');
	settings.targetNameId = targetEle.attr('data-control-nameTargetId');
	// get attrs
	var fromFilter = targetEle.attr("data-control-from");
	var toFilter = targetEle.attr("data-control-to");
	// relative overrides fromFilter and toFilter for now
	var fromRelative = targetEle.attr("data-control-from-relative"); // "days:-5" "days: +5"
	var toRelative = targetEle.attr("data-control-to-relative"); // 
	var setDateByRelative = function (startDate, daysOffset) {
		var date = new Date(startDate);
		var str = "{" + daysOffset + "}";
		try {
			var daysValue = JSON.parse(JSON.stringify(eval("(" + str + ")"))).days;
			date.setDate(date.getDate() + parseInt(daysValue));
		} catch (e) {
			date.setDate(date.getDate() + parseInt(daysOffset));
		}
	  
		return date;
	}
	if (fromRelative) {
		var currentDate = new Date();
		currentDate.setHours(0, 0, 0, 0);

		fromRelative = setDateByRelative(currentDate, fromRelative);
	}
	if (toRelative) {
		toRelative = setDateByRelative(fromRelative, toRelative);
	}

	var clearFilter = function () {
		picker.min(new Date(1900, 0, 1));
		picker.max(new Date(2099, 11, 31));
	}
	
	var saveValue = function (val) {
		targetEle.parents(".form-group").removeClass("has-error");
		if (settings.targetValId) {
			if (!val) {
				$('#' + settings.targetValId).val("");
			} else {
				if (settings.UTC) {
					$('#' + settings.targetValId).val(val.toISOString());
				}
				else {
					settings.hasTimePicker
					? $('#' + settings.targetValId).val(kendo.toString(val, "g"))
					: $('#' + settings.targetValId).val(kendo.toString(val, "d"));
				}
			}
			$('#' + settings.targetValId).change();
		} 
	}
	var getValue = function (target) {
		return ($('#' + target).val()) ? kendo.toString(new Date($('#' + target).val()), (settings.hasTimePicker)?'g':'d') : null;
	}

	var onOpen = function () {
		//set date culture format
		picker.options.format = (settings.hasTimePicker) ? kendo.culture().calendar.patterns.g : kendo.culture().calendar.patterns.d;
		if (fromRelative) {
			picker.min(fromRelative);
		} else {
			if (fromFilter) {
				if (!getValue(fromFilter)) {
					clearFilter();
				} else {
					picker.min(getValue(fromFilter));
				}
			}
		}

		if (toRelative) {
			picker.max(toRelative);
		} else {
			if (toFilter) {
				if (!getValue(toFilter)) {
					clearFilter();
				} else {
					picker.max(getValue(toFilter));
				}
			}
		}
	}

	//get the preferred datetime culture
	var preferredCulture = $("meta[name='accept-language']").attr("content");

	var pickerProperties = {
		//explicitly default picker's culture to user's preferred datetime code/culture 
		culture: kendo.culture(preferredCulture),
		change: function () {
			var value = this.value();
			if (value != null) {
				targetEle.parents(".form-group").removeClass("has-error");
				saveValue(value);
			} else {
				targetEle.parents(".form-group").addClass("has-error");
			}
		},
		open: onOpen
	};

	if (settings.hasTimePicker) {
		$.extend(true, pickerProperties, { interval: settings.Interval, start: settings.Start });
		var picker = targetEle.kendoDateTimePicker(pickerProperties).data("kendoDateTimePicker");
	} else {
		$.extend(true, pickerProperties, { start: settings.Start });
		var picker = targetEle.kendoDatePicker(pickerProperties).data("kendoDatePicker");
	}
	picker.value(getValue(settings.targetValId));

	//since we are allowing users to type in date we need validation
	targetEle.on('blur', function (e) {

		//fixes issue with time showing up when it is just a date picker, not a dateTIME picker.
		e.stopImmediatePropagation();

		if (this.value != '') {
			//var date = new Date(this.value);
			var date = kendo.parseDate(this.value); //used kendo's parseDate to take into account date's format/localization

			if (_.isNull(date)) { $(this).val(""); }

			if (date != 'Invalid Date') {
				$(this).parents(".form-group").removeClass('has-error');
				saveValue(date);
			} else {
				$(this).parents(".form-group").addClass('has-error');
			}
		} else {
			$("input#" + targetEle.attr("data-control-valuetargetid")).val("");
			saveValue(null);
			$(this).parents(".form-group").removeClass('has-error');
		}
	});
}
