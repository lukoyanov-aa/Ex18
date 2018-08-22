    var myMapCenter;
    var myMapZoom = 9;
    var myMap;
    
$(document).ready(function() {  
        var mymap1 = document.getElementById('map'); 
        if(mymap1.dataset.mapheight !== undefined){
            if(mymap1.classList.contains("g-h_450")){
                mymap1.classList.remove("g-h_450");
            }
            mymap1.classList.add(mymap1.dataset.mapheight);
        };
        if(mymap1.dataset.mapcenterdolgota === undefined || mymap1.dataset.mapcentershirota === undefined){
            myMapCenter = [55.76, 37.64];
            ///console.log('undefiend');
        }else{
            if(isNumeric(mymap1.dataset.mapcenterdolgota) && isNumeric(mymap1.dataset.mapcentershirota)){
                myMapCenter = [mymap1.dataset.mapcenterdolgota, mymap1.dataset.mapcentershirota];
                //console.log('number');
            }else{
                myMapCenter = [55.76, 37.64];
                //console.log('no number');
                
            }
        }
        if(mymap1.dataset.mapzoom !== undefined){
            myMapZoom = mymap1.dataset.mapzoom;            
        };
        
        ymaps.ready(init);
   
});


    function init(){     
        myMap = new ymaps.Map("map", {
            center: myMapCenter,
            zoom: myMapZoom,
            controls: []
        }),
        objectManager = new ymaps.ObjectManager({
            // Чтобы метки начали кластеризоваться, выставляем опцию.
            clusterize: true,
            // ObjectManager принимает те же опции, что и кластеризатор.
            gridSize: 32,
            clusterDisableClickZoom: true
        });

    // Чтобы задать опции одиночным объектам и кластерам,
    // обратимся к дочерним коллекциям ObjectManager.
    objectManager.objects.options.set('preset', 'islands#greenDotIcon');
    objectManager.clusters.options.set('preset', 'islands#greenClusterIcons');
    myMap.geoObjects.add(objectManager);

    $.ajax({
        url: "https://yamap.webmens.ru/ruWebmens/mapBlocks/get_points_yandex.php"
    }).done(function(data) {
        objectManager.add(data);
    });
    }