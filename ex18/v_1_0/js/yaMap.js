var myMap, myPlacemark, coords;	

        function init () {

		//Определяем начальные параметры карты
            myMap = new ymaps.Map('YMapsID', {
                    center: [45.0523, 38.9839], 
                    zoom: 12, 
					behaviors: ['default', 'scrollZoom']
                });	
			
			//Определяем элемент управления поиск по карте	
			var SearchControl = new ymaps.control.SearchControl({noPlacemark:true});	

			//Добавляем элементы управления на карту
			 myMap.controls
				.add(SearchControl)                
                .add('zoomControl')                
                .add('typeSelector')                 
                .add('mapTools');
				
			coords = [56.326944, 44.0075];
			
			//Определяем метку и добавляем ее на карту				
			myPlacemark = new ymaps.Placemark([56.326944, 44.0075],{}, {preset: "twirl#redIcon", draggable: true});	
			
			myMap.geoObjects.add(myPlacemark);			
	
			//Отслеживаем событие перемещения метки
			myPlacemark.events.add("dragend", function (e) {			
			coords = this.geometry.getCoordinates();
			savecoordinats();
			}, myPlacemark);

			//Отслеживаем событие щелчка по карте
			myMap.events.add('click', function (e) {        
            coords = e.get('coordPosition');
			savecoordinats();
			});	
	
	//Отслеживаем событие выбора результата поиска
	SearchControl.events.add("resultselect", function (e) {
		coords = SearchControl.getResultsArray()[0].geometry.getCoordinates();
		savecoordinats();
	});
	
	//Ослеживаем событие изменения области просмотра карты - масштаб и центр карты
	myMap.events.add('boundschange', function (event) {
    if (event.get('newZoom') != event.get('oldZoom')) {		
        savecoordinats();
    }
	  if (event.get('newCenter') != event.get('oldCenter')) {		
        savecoordinats();
    }
	
	});
			
    }
	
	//Функция для передачи полученных значений в форму
	function savecoordinats (){	
	var new_coords = [coords[0].toFixed(4), coords[1].toFixed(4)];	
	myPlacemark.getOverlay().getData().geometry.setCoordinates(new_coords);
	document.getElementById("latlongmet").value = new_coords;
	document.getElementById("mapzoom").value = myMap.getZoom();
	var center = myMap.getCenter();
	var new_center = [center[0].toFixed(4), center[1].toFixed(4)];	
	document.getElementById("latlongcenter").value = new_center;	
	}