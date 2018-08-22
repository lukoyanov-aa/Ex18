/* Routine */
(function () {
	/**
	 * Returns the class name of object.
	 * @param object {Object}
	 * @returns Class name of object
	 * @type String
	 */
	 var getClass = function (object) {
	   return Object.prototype.toString.call(object).slice(8, -1);
	 };
  
   /**
    * Returns true of obj is a collection.
    * @param obj {Object}
    * @returns True if object is a collection
    * @type {bool}
    */
	var isValidCollection = function (obj) {
		try {
			return (
				typeof obj !== "undefined" &&  // Element exists
				getClass(obj) !== "String" &&  // weed out strings for length check
				typeof obj.length !== "undefined" &&  // Is an indexed element
				!obj.tagName &&  // Element is not an HTML node
				!obj.alert &&  // Is not window
				typeof obj[0] !== "undefined"  // Has at least one element
			);
		} catch (e) {
			return false;
		}
	};
  
	/**
	 * Merges an array with an array-like object or
	 * two objects.
	 * @param arr1 {Array|Object} Array that arr2 will be merged into
	 * @param arr2 {Array|NodeList|Object} Array-like object or Object to merge into arr1
	 * @returns Merged array
	 * @type {Array|Object}
	 */
	window.array_merge = function (arr1, arr2) {
		// Variable declarations
		var arr1Class, arr2Class, i, il;

		// Save class names for arguments
		arr1Class = getClass(arr1);
		arr2Class = getClass(arr2);

		if (arr1Class === "Array" && isValidCollection(arr2)) {  // Array-like merge
			if (arr2Class === "Array") {
				arr1 = arr1.concat(arr2);
			} else {  // Collections like NodeList lack concat method
				for (i = 0, il = arr2.length; i < il; i++) {
					arr1.push(arr2[i]);
				}
			}
		} else if (arr1Class === "Object" && arr1Class === arr2Class) {  // Object merge
			for (i in arr2) {
				if (i in arr1) {
					if (getClass(arr1[i]) === getClass(arr2[i])) {  // If properties are same type
						if (typeof arr1[i] === "object") {  // And both are objects
							arr1[i] = array_merge(arr1[i], arr2[i]);  // Merge them
						} else {
							arr1[i] = arr2[i];  // Otherwise, replace current
						}
					}
				} else {
					arr1[i] = arr2[i];  // Add new property to arr1
				}
			}
		}
		return arr1;
	};
  
})();

application.prototype.addBlocks = function () {    
    BX24.callMethod(
        'landing.repo.register',         
        data,
        function(result)
            {
                if(result.error())
                    console.error(result.error());
                else
                    console.info(result.data());
            }
    );
}

application.prototype.delBlocks = function () {
    BX24.callMethod('landing.repo.unregister',
        {code: 'ru.webmens.yamap.jon'},
        function(result)
            {
                if(result.error())
                    console.error(result.error());
                else
                    console.info(result.data());
            }
    );
}

function deleteByKey (arData, keyToRemove) {
	for(key in arData){
	  if(arData.hasOwnProperty(key) && (key == keyToRemove)) {
	    delete arData[key];
	  }
	}
	
	return arData;
}

function arrayLength (arData) {
	var result = 0;
	for(key in arData) result++;
	
	return result;
}

function nullifyDate(date)
{
	date.setHours(0);
	date.setMinutes(0);
	date.setSeconds(0);
	date.setMilliseconds(0);

	return date;
};

function cloneDebug (arData) {
	var arTmp = JSON.stringify(arData);
	return JSON.parse(arTmp);
}

function isObject( mixed_var ) {
    return ( mixed_var instanceof Object );
}

function isset(aValue){
    return ((aValue !== undefined) && (aValue !== null));
}

// our application constructor
function application () {
	this.currentUser = 0;
	this.arInstallRatingUsers = new Object();
	
	// get daily date period	
	this.today = nullifyDate(new Date()),
	this.yesterday = new Date(this.today);
	this.yesterday.setDate(this.yesterday.getDate() - 1);
	
	this.today = tempus(this.today).format('%Y-%m-%d');	
	this.yesterday = tempus(this.yesterday).format('%Y-%m-%d');	
	
    this.appLoadedKeys = [];
	this.addLoadedKey('constructor');
	
	this.appUserOptions = {
		displayAvatars: true,
		images: {}
	};
	
	this.setDefaultImages();
	
	var curapp = this;
	
//	$('#choose-file-dialog').on('shown.bs.modal', function () {
//		$('#save-btn').addClass('disabled');
//		// curapp.dirFiles(0);
//		curapp.displayDir(undefined, '#file-list', '#save-btn');
//	})	
//
//	$('.rating-image').on('click', function() {
//		curapp.changeImage($(this).data('place'));
//	});
	
	this.getAppInfo();
}

/* installation methods */
application.prototype.finishInstallation = function () {
	
	// start saving
	$('#save-btn').find('i').removeClass('fa-check').addClass('fa-spinner').addClass('fa-spin');
	
	var authParams = BX24.getAuth(), 
		params = array_merge({operation: 'add_portal_auth'}, authParams),
		params = array_merge(params, {}),
		curapp = this;

	$.post(
		"application.php",
		params,
		function (data)
		{
			var answer = JSON.parse(data);
			if (answer.status == 'error') {
				console.log('error', answer.result);
				curapp.displayErrorMessage('К сожалению, произошла ошибка сохранения списка участников рейтинга. Попробуйте перезапустить приложение',
					['#error']);
			}
			else {
			
				BX24.callBind('ONAPPUNINSTALL', 'http://www.b24go.com/rating/application.php?operation=uninstall');
				BX24.installFinish();
			}
		}

	);
	
}

/* common methods */
application.prototype.getAppInfo = function() {
	this.appInfo = [];
    var arParameters = document.location.search;
    if (arParameters.length > 0) {
        arParameters = arParameters.split('&');
        for (var i = 0; i < arParameters.length; i++) {

            var aPair = arParameters[i].split('=');
            var aKey = aPair[0].replace(new RegExp("\\?", 'g'), "");

            this.appInfo[aKey] = aPair[1];
        }

        console.log('getAppInfo', this.appInfo);

    }
}

application.prototype.resizeFrame = function () {

	var currentSize = BX24.getScrollSize();
	minHeight = currentSize.scrollHeight;
	
	if (minHeight < 800) minHeight = 800;
	BX24.resizeWindow(this.FrameWidth, minHeight);

}

application.prototype.saveFrameWidth = function () {
	this.FrameWidth = document.getElementById("app").offsetWidth;
}
		
application.prototype.displayErrorMessage = function(message, arSelectors) {
	for (selector in arSelectors) {
		$(arSelectors[selector]).html(message);
		$(arSelectors[selector]).removeClass('hidden');
	}
}

application.prototype.displayCurrentUser = function(selector) {
	var currapp = this;
	
	BX24.callMethod('user.current', {}, function(result){
		currapp.currentUser = result.data().ID;
		$(selector).html(result.data().NAME + ' ' + result.data().LAST_NAME);
	});
}

application.prototype.isDataLoaded = function() {

    for (keyIndex in this.appLoadedKeys)
        if (this.appLoadedKeys[keyIndex].loaded !== true) return;

    this.processUserInterface();
}

application.prototype.loadOptions = function() {
	var strUserOptions = BX24.userOption.get('options');
	if ((strUserOptions != undefined) && (strUserOptions != '')) {
		var _appUserOptions = JSON.parse(strUserOptions);
		if ((_appUserOptions != undefined) && (isObject(_appUserOptions)))
			this.appUserOptions = _appUserOptions;
	}
	
	if (!this.appUserOptions.displayAvatars) $('#avatar-option').prop( "checked", null );
	if (!isset(this.appUserOptions.images[1])) this.setDefaultImages();
	
	for (imageIndex in this.appUserOptions.images)
		this.setRatingImage(imageIndex, this.appUserOptions.images[imageIndex]);
	
	if (BX24.isAdmin()) {
		$('#admin-options').removeClass('hidden');
		this.resizeFrame();
	}
	
	console.log('loaded options', this.appUserOptions);
}

application.prototype.saveOptions = function() {
	BX24.userOption.set('options', JSON.stringify(this.appUserOptions));
}

application.prototype.addLoadedKey = function(aKey) {
    this.appLoadedKeys[aKey] = {
        loaded: false
    };
}
		
/* application methods */
application.prototype.actionFormCoordinates = '';
application.prototype.idCoordinatesForm = '';
application.prototype.createCoordinates = function () {
	$('#dlg').dialog('open').dialog('setTitle','Создание');
        $('#fm').form('clear');
        this.actionFormCoordinates = 'save_coordinates';
        //url = 'forms/form_coordinates/save.php?appId='+appId;    
	
}
application.prototype.editCoordinates = function () {
	var row = $('#dg').datagrid('getSelected');
        if (row){
                $('#dlg').dialog('open').dialog('setTitle','Изменение');
                $('#fm').form('load',row);
                this.actionFormCoordinates = 'update_coordinates';
                this.idCoordinatesForm = {id: row.id};                
                //url = 'forms/form_coordinates/update.php?id='+row.id+'&appId='+appId;
        }    
	
}
application.prototype.saveCoordinates = function () { 
var form_data = {};
// переберём все элементы input, textarea и select формы с id="myForm "
$('#fm').find ('input, textearea, select').each(function() {
  // добавим новое свойство к объекту $data
  // имя свойства – значение атрибута name элемента
  // значение свойства – значение свойство value элемента
  form_data[this.name] = $(this).val();
});
console.log(form_data);
var authParams = BX24.getAuth() 
        params = array_merge({operation: this.actionFormCoordinates}, authParams)
        params = array_merge(params, form_data)
        params = array_merge(params, this.idCoordinatesForm)
        curapp = this;
if($('#fm').form('validate')){ 
	$.post(
		"application.php",
		params,
		function (data)
		{
                        console.log(data)
			var answer = JSON.parse(data);
			if (answer.status == 'error') {
				console.log('error', answer.result);
				curapp.displayErrorMessage('К сожалению, произошла ошибка сохранения списка участников рейтинга. Попробуйте перезапустить приложение',
					['#error']);
			}
			else {	
                                console.log('Ура получилось');
                                $('#dlg').dialog('close');		// close the dialog
                                $('#dg').datagrid('reload');	// reload the user data
			}
		}

	);
}	
}
application.prototype.loadCoordinates = function () { 
    var authParams = BX24.getAuth() 
        params = array_merge({operation: 'load_coordinates'}, authParams)

        curapp = this;                                
        $('#dg').datagrid('load', params);            
	
}
application.prototype.destroyCoordinates = function () {
	var row = $('#dg').datagrid('getSelected');
        //console.log('row')
        if (row){
            var authParams = BX24.getAuth() 
            params = array_merge({operation: 'destroy_coordinates'}, authParams)
            params = array_merge(params, {id:row.id})
            //params = array_merge(params, this.idCoordinatesForm)
            curapp = this;
                $.messager.confirm('Удаление','Вы действительно хотите удалить точку?',function(r){
                        if (r){
                            $.post(
                                "application.php",
                                params,
                                function (data)
                                {
                                        console.log(data)
                                        var answer = JSON.parse(data);
                                        if (answer.status == 'error') {
                                                console.log('error', answer.result);
                                                curapp.displayErrorMessage('К сожалению, произошла ошибка сохранения списка участников рейтинга. Попробуйте перезапустить приложение',
                                                        ['#error']);
                                        }
                                        else {	
                                                console.log('Ура получилось');
                                                //$('#dlg').dialog('close');		// close the dialog
                                                $('#dg').datagrid('reload');	// reload the user data
                                        }
                                }

                            );
                        }
                });
        }   
	
}
// create our application
app = new application();
