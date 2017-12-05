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
   
   @ShowHideCriteria
   -----------------
   Placed before any item (Except a Query Item), allows adding of an extra set of criteria for the following item,
   Criteria on this and the following Item are combined using a AND ('&&')
   
   @ShowHideORCriteria
   -----------------
   Placed before any item (Except a Query Item), allows adding of an extra set of criteria for the following item
   Criteria on this and the following Item are combined using a OR ('||')

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
*/
app.events.subscribe('sessionStorageReady',transformRO());
app.events.subscribe('sessionStorageReady',transformRO);

function transformRO() {   
    app.events.unsubscribe('drawerCreated',transformRO);
    app.lib.mask.apply();
    $("p:contains('@ConfirmFields')").parent().parent().each(function () {
      confirmFields($(this))
    });
    $("p:contains('@Placeholder')").parent().parent().each(function() {
        makePlaceholder("@Placeholder", $(this))
    });
    $("p:contains('@ShowHideORCriteria')").parent().parent().each(function() {
        addShowHideCriteria("@ShowHideORCriteria", $(this))
    });
    $("p:contains('@ShowHideCriteria')").parent().parent().each(function() {
        addShowHideCriteria("@ShowHideCriteria", $(this))
    });
    $("p:contains('@ShowHideOR')").parent().parent().each(function() {
        makeShowHideOR("@ShowHideOR", $(this))
    });
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
    $("p:contains('@DatePicker')").parent().parent().each(function() {
		customDatePicker("@DatePicker", $(this))
        });
    if (!($("div.custom-item-daterange").length)) {
        $("p:contains('@DateRange')").parent().parent().each(function() {
            createDateRange("@DateRange", $(this))
        });
    }
    $("p:contains('@AddClass')").parent().parent().each(function() {
        addCssClass("@AddClass", $(this))
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
}

function parseOptions(controlName, control) {
    var properties = "{}";
    var regExp = /({[^}]+})/;
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
	if (typeof injector != 'undefined') {
		$injector.invoke(function($compile){
			$compile(el)($scope)
		});
	}
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
	ngShow = ngShow + ngShowHide + ngShowCriteria;
	return "(" + ngShow + ")";
}

//modify boolean criteria to take into account if booleans are null, false or true without needing to check/uncheck them if additional criteria added
function modBoolCriteria(criteria) {
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
	return criteria;
}

// add additional Show/Hide Criteria to non querty prompts
function addShowHideCriteria(tag, tagElement, ngshowhide) {
    // set either "AND" for the tag @ShowHideCriteria or "OR" for the tag @ShowHideCriteriaOR
	if (tag == "@ShowHideORCriteria") {
		ngshowhide = "||";
	} else {
		ngshowhide = "&&";
	}
	tagElementNext = tagElement.next('div')
    var ngshow1 = tagElement.attr("ng-show");
    var ngshow2 = tagElementNext.attr("ng-show");
    tagElement.hide();
	
	// combine preset Show/Hide Criteria
	var ngshow = "";
	if (typeof ngshow1 != 'undefined') {
		if (ngshow1.indexOf('compareString') < 0) {
			ngshow1 = modBoolCriteria(ngshow1);
		}
		ngshow = createNgShow(ngshow, ngshow1, ngshowhide);
	}
	if (typeof ngshow2 != 'undefined') {
		if (ngshow2.indexOf('compareString') < 0) {
			ngshow2 = modBoolCriteria(ngshow2);
		}
		ngshow = createNgShow(ngshow, ngshow2, ngshowhide);
	}

	// replace Show/Hide Criteria on item
	tagElementNext.attr("ng-show", ngshow);
	
	if (ngshow != "") {
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
    queryResults.hide();
    var groupElements = tagElement.add(userInput);
    groupElements = groupElements.add(queryResults);
    groupElements.wrapAll("<div class='row'><div class='col-md-12 col-xs-12'></div></div>");

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
	if (typeof ngshow1 != 'undefined') { ngshow = createNgShow(ngshow, ngshow1, ngshowhide); }
	if (typeof ngshow2 != 'undefined') { ngshow = createNgShow(ngshow, ngshow2, ngshowhide); }
	if (typeof ngshow3 != 'undefined') { ngshow = createNgShow(ngshow, ngshow3, ngshowhide); }

    // Add the HTML template for the AutoComplete control, along with Combined Show/Hide Criteria if set
	if (ngshow != "") {
		ngshow = "(" + ngshow + ")";
		var recompEle = queryResults.after('<div class="row custom-item-picker ng-hide" ng-show="' + ngshow + '" onhide style="margin-bottom:15px;"><div class="col-md-6 col-xs-12">' + controlLabel + '<input id="ac' + targetId + '" style="width: 100%;" /></div></div>');
		// recompile AngularElement if Required and able to
		recompAngularElement(recompEle);
    } else {
		queryResults.after('<div class="row custom-item-picker" style="margin-bottom:15px;"><div class="col-md-6 col-xs-12">' + controlLabel + '<input id="ac' + targetId + '" style="width: 100%;" /></div></div>');
    }

    // Monitor input attribute to display custom error msg
    // TODO: Does not re-show error, after first success and then removing value from field
    var obs = new MutationObserver (function(mutations) {      
		var invalidState = queryResults.find('div[data-control-type="checkboxGridByCriteriaOld"]').find('input#' + targetId).attr("aria-invalid");
		if(typeof invalidState != 'undefined' && $('span#ac' + targetId + '_errorMsg').length < 1) {
			$('input#ac' + targetId).parent().before('<span class="k-widget k-tooltip k-invalid-msg field-validation-error" id="ac' + targetId + '_errorMsg" role="alert"><span class="k-icon k-warning"></span> This is a required field.</span>');
		} else if(typeof invalidState == 'undefined' && $('span#ac' + targetId + '_errorMsg').length > 0) {
        $('span#ac' + targetId + '_errorMsg').remove();
      }
    });
    obs.observe(document.querySelectorAll('div[data-control-type="checkboxGridByCriteriaOld"] input[id="' + targetId + '"]')[0], {attributes: true, attributeFilter: ['aria-invalid'], childList: false, characterData: false, subtree:false});

	
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
                "BaseId": user.BaseId
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
                    return preprocessData(data);
                },
                data: "Data"
            }
        }),
        select: function(e) {
            var item = this.dataItem(e.item.index());
            $("input[id='" + targetId + "']").each(function(i, el) {
                $(el).val(item.BaseId);
                $(el).change();
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
    queryResults.hide();
    var groupElements = tagElement.add(userInput);
    groupElements = groupElements.add(queryResults);
    groupElements.wrapAll("<div class='row'><div class='col-md-12 col-xs-12'></div></div>");

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
	if (typeof ngshow1 != 'undefined') { ngshow = createNgShow(ngshow, ngshow1, ngshowhide); }
	if (typeof ngshow2 != 'undefined') { ngshow = createNgShow(ngshow, ngshow2, ngshowhide); }
	if (typeof ngshow3 != 'undefined') { ngshow = createNgShow(ngshow, ngshow3, ngshowhide); }

    // Add the HTML template for the @MultiSelect control, along with Combined Show/Hide Criteria if set
	if (ngshow != "") {
		ngshow = "(" + ngshow + ")";
		var recompEle = queryResults.after('<div class="row custom-item-multipicker ng-hide" ng-show="' + ngshow + '" onhide style="margin-bottom:15px;"><div class="col-md-6 col-xs-12">' + controlLabel + '<select id="ms' + targetId + '" style="width: 100%;" /></div></div>');
		// recompile AngularElement if Required and able to
		recompAngularElement(recompEle);
    } else {
		queryResults.after('<div class="row custom-item-multipicker" style="margin-bottom:15px;"><div class="col-md-6 col-xs-12">' + controlLabel + '<select id="ms' + targetId + '" style="width: 100%;" /></div></div>');
    }
	
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
                "BaseId": user.BaseId
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
				field: arrColumnNames[0],
				dir: "asc"
			},
            schema: {
                parse: function(data) {
                    return preprocessData(data);
                },
                data: "Data"
            }
        }),
        change: function(e) {
            var selectedItems = this.value().join(",");
            $("input[id='" + targetId + "']").each(function(i, el) {
                $(el).val(selectedItems);
                $(el).change();
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