var map;
google.maps.event.addDomListener(window, 'load', init);

var markers = [];
var dom = {
    buttonDiv: null,
    scoreDiv: null,
    playDiv: null,
};

function init() {
    City.initCitys();
    initDomRefs();
    map = initMap(City.citys[0]);
    City.addButtons();
    addPlayDiv();

    map.controls[google.maps.ControlPosition.TOP_LEFT].push(dom.buttonDiv);
    map.controls[google.maps.ControlPosition.RIGHT_BOTTOM].push(dom.playDiv);
    map.controls[google.maps.ControlPosition.RIGHT_BOTTOM].push(dom.scoreDiv);
}

function initMap(city) {
    var mapProp = {
        center: new google.maps.LatLng(city.lat, city.lng),
        zoom:city.zoom,
        disableDefaultUI:true,
        mapTypeId:google.maps.MapTypeId.SATELLITE
    };
    return new google.maps.Map(document.getElementById("googleMap"), mapProp);
}

function initDomRefs() {
    dom.buttonDiv = document.getElementById('buttonDiv');
    dom.scoreDiv = document.getElementById('scoreDiv');
    dom.playDiv = document.getElementById('playDiv');
}

function clearButtonDiv() {
    dom.buttonDiv.innerHTML = "";
};


function addPlayDiv() {
    playDiv = document.getElementById('playDiv');
    if (playDiv == null) {
        playDiv = document.createElement('div');
        playDiv.id = 'playDiv';
    }

    if (Quiz.isPlay == false) {
        playDiv.innerHTML = "- P L A Y -";
    } else {
        playDiv.innerHTML = "EXPLORE";
    }
    playDiv.onmousedown = togglePlayExplore;
};

function togglePlayExplore() {
    Quiz.isPlay = !Quiz.isPlay;
    if (Quiz.isPlay == true) {
        Quiz.start();
        City.addButtons(Quiz.citys);
        playDiv.innerHTML = "EXPLORE";
        showScoreDiv();
    } else {
        City.addButtons();
        playDiv.innerHTML = "- P L A Y -";
        hideScoreDiv();
    };
};

function showScoreDiv() {
    scoreDiv = document.getElementById('scoreDiv');
    scoreDiv.style.display = "block";
    updateScoreDiv();
}

function hideScoreDiv() {
    scoreDiv = document.getElementById('scoreDiv');
    scoreDiv.style.display = "none";
}

function updateScoreDiv() {
    scoreDiv.innerHTML = Quiz.nCorrect + ' / ' + Quiz.nQuestions;
}

//Quiz class
var Quiz = function() {}

Quiz.city = "plz";
Quiz.citys = [];
Quiz.citysToQuiz = [];
Quiz.isPlay = false;
Quiz.nCorrect;
Quiz.nQuestions;
Quiz.attempts;

Quiz.start = function() {
    Quiz.citys = _.sample(City.citys, 10);
    Quiz.citysToQuiz = Quiz.citys.slice(0); // clone

    Quiz.nCorrect = 0;
    Quiz.nQuestions = 0;
    Quiz.quiz();
};

Quiz.quiz = function() {

    //clear markers
    for (var i = 0; i < markers.length; i++ ) {
        markers[i].setMap(null);
    }
    markers = [];

    // reset attempts
    Quiz.attempts = 0;

    if (Quiz.citysToQuiz.length) {
        var r = Math.floor(Math.random() * Quiz.citysToQuiz.length);
        Quiz.city = Quiz.citysToQuiz[r];
        console.log(Quiz.citysToQuiz, r, Quiz.city);
        Quiz.city.setCity();
        Quiz.citysToQuiz.splice(r, 1);
    } else {
        alert('You win!');
        togglePlayExplore();
    }

};

Quiz.reply = function(city) {
    if (Quiz.isPlay) {
        if (city.name == Quiz.city.name) {

            if (Quiz.attempts==0) {
                alert('good job');
                Quiz.nCorrect = parseInt(Quiz.nCorrect) + 1;
            }

            Quiz.nQuestions++;
            updateScoreDiv();
            Quiz.quiz();
        } else {
            alert('try again');
            Quiz.attempts++;
            if (Quiz.city.clues.length > 0) {
                var r = Math.floor(Math.random() * Quiz.city.clues.length);
                var clue = Quiz.city.clues[r];
                clue.display();
                clue.addInfoWindow();
            }
        }
    } else {
        city.go();
    }
};

//City class
var City = function(name, lat, lng, zoom, clues) {
    this.name = name;
    this.lat = lat;
    this.lng = lng;
    this.zoom = zoom;
    this.clues = clues;

    City.citys.push(this);
};

City.citys = [];

City.initCitys = function() {
    new City("abu_dhabi", 24.3869159,54.2797104, 10, [new Clue("persian gulf", 24.527917, 54.295437)]);
    new City("addis_ababa", 8.9634897,38.6380569, 10, [new Clue("menagesha national forest", 8.973677, 38.553493)]);
    new City("amsterdam", 52.3648426,4.8885306, 13, [new Clue("amstel river runs through it", 52.360261, 4.904065)]);
    new City("anchorage", 61.1535885,-150.3883644, 9, [new Clue("cook inlet", 61.071599, -150.188764), new Clue("knik arm", 61.313095, -149.869870)]);

    new City("baghdad", 33.3133735,44.2090518, 10, [new Clue("the tigris runs through it", 33.320777, 44.408267)]);
    new City("bangkok", 13.6518074,100.3132331, 11, [new Clue("the chao phraya river runs through it", 13.621807, 100.547045)]);
    new City("barcelona", 41.3548976,2.0787276, 12, [new Clue("parc de montjuïc", 41.362440, 2.156796)]);
    new City("beijing", 39.9390731,116.1172684, 10, [new Clue("western hills", 39.997959, 116.009456)]);
    new City("bengaluru", 12.9557109,77.4576541, 11, [new Clue("bellandur lake", 12.934432, 77.665153)]);
    new City("buenos_aires", -34.6156625,-58.5033605, 11, [new Clue("río de la plata", -34.515940, -58.256679)]);

    new City("cairo", 30.0596185,31.1884238, 10, [new Clue("the nile runs through it",30.033509, 31.222972)]);
    new City("chicago", 41.8339042,-88.0123449, 10, [new Clue("this is lake michigan", 41.853854, -87.564652)]);
    new City("copenhagen", 55.6713442,12.4907991, 12, [new Clue("kastellet star fortress", 55.6905479,12.5932131)]);

    new City("dakar", 14.7326921,-17.5282071, 11, [new Clue("westernmost point on continent of africa", 14.741048, -17.529773)]);
    new City("denver", 39.7645187,-104.995197, 11, [new Clue("confluence of south platte river and cherry creek", 39.754739, -105.008268), new Clue("cherry creek reservoir", 39.641334, -104.856761)]);
    new City("detroit", 42.3518795,-83.2392902, 10, [new Clue("lake st clair", 42.390228, -82.784998)]);
    new City("dubai", 25.074217,54.9496471, 10, [new Clue("the world islands", 25.223308, 55.162844), new Clue("palm jumeirah", 25.120000, 55.131271), new Clue("palm jebel ali", 25.008935, 54.987698)]);

    new City("houston", 29.8174782,-95.6814869, 10, [new Clue("galveston bay", 29.548237, -94.945601), new Clue("buffalo bayou", 29.739996, -95.280568), new Clue("george bush park", 29.745837, -95.680191), new Clue("bear creek pioneers park", 29.818235, -95.621027)]);

    new City("istanbul", 41.0055005,28.7319896, 10, [new Clue("bosphorus strait", 41.060763, 29.045830), new Clue("sea of marmara", 40.763069, 28.738856)]);

    new City("jakarta", -5.9587025,106.460428, 10, [new Clue("java sea", -5.678620, 106.899389)]);
    new City("juneau", 58.3492244,-135.1334346, 9, [new Clue("gastineau channel", 58.292975, -134.411622), new Clue("douglas island", 58.282016, -134.518032)]);

    new City("kigali", -1.9546259,30.034506, 12, [new Clue("kg 1 roundabout", -1.955103, 30.086080)]);
    new City("kinshasa", -4.516245,15.3321184, 10, [new Clue("pool malebo", -4.323553, 15.430094), new Clue("congo river", -4.352657, 15.183844)]);

    new City("lima", -12.065323,-77.1056237, 11, [new Clue("san lorenzo island", -12.084786, -77.224744)]);
    new City("london", 51.5287352,-0.3817819, 10, [new Clue("river thames runs through it", 51.484034, -0.136524)]);
    new City("longyearbyen", 78.2388864,15.4408333, 11, [new Clue("adventfjorden", 78.239228, 15.639778)]);
    new City("los_angeles", 34.0089404,-118.5929342, 10, [new Clue("port of long beach", 33.754292, -118.244223), new Clue("palos verdes", 33.760062, -118.388208), new Clue("santa monica mountains", 34.098447, -118.533994), new Clue("san gabriel mountains", 34.208462, -117.961557), new Clue("inglewood oil field", 34.006932, -118.377612)]);

    new City("malabo", 3.7535273,8.7069703, 12, [new Clue("gulf of guinea", 3.813859, 8.764851)]);
    new City("mexico_city", 19.406343, -99.120213, 10, [new Clue("volcán iztaccihuatl", 19.178274, -98.642704), new Clue("volcán popocatépetl", 19.023525, -98.623296), new Clue("nabor carrillo lake", 19.466218, -98.969857)]);
    new City("miami", 25.7824618,-80.3011208, 12, [new Clue("dodge island", 25.772497, -80.167421), new Clue("fisher island", 25.761364, -80.141040), new Clue("biscayne bay", 25.721485, -80.199806)]);
    new City("montreal", 45.5038152,-73.8176023, 11, [new Clue("st lawrence river", 45.543315, -73.523734), new Clue("île des souers", 45.460157, -73.548861), new Clue("lac saint-louis", 45.378447, -73.820092)]);
    new City("moscow", 55.7232335,37.3125267, 10, [new Clue("the moskva river runs though it", 55.763864, 37.502053)]);
    new City("mumbai", 19.0825223,72.7411166, 11, [new Clue("mahim bay", 19.032714, 72.827795), new Clue("vihar lake", 19.152546, 72.909651), new Clue("powai lake", 19.127077, 72.904259)]);

    new City("new_orleans",29.8721735,-90.3031695, 10, [new Clue("lake pontchartrain", 30.141303, -90.091567), new Clue("mississippi river runs through it", 29.834840, -89.992987)]);
    new City("new_york", 40.7034947,-74.2598711, 10, [new Clue("verrazano-narrows bridge", 40.606281, -74.045483), new Clue("rikers island", 40.791141, -73.882894), new Clue("hudson river", 40.866715, -73.942643), new Clue("governors island", 40.688613, -74.019531), new Clue("central park", 40.777569, -73.969568), new Clue("roosevelt island", 40.762024, -73.949814)]);

    new City("oslo", 59.8939529,10.6450342, 11, [new Clue("hovedøya", 59.894874, 10.728958), new Clue("lindøya", 59.890751, 10.712221), new Clue("maridalsvannet", 59.983709, 10.777456), new Clue("bygdøy", 59.906403, 10.679703)]);
    new City("ouagadougou", 12.3586508,-1.6068842, 10, [new Clue("barrage de ziga", 12.506155, -1.079763)]);

    new City("paris", 48.8589507,2.2775169, 11, [new Clue("the seine runs through it", 48.859060, 2.334511), new Clue("bois de vincennes", 48.827445, 2.436236), new Clue("bois de boulogne", 48.862213, 2.249306), new Clue("île saint-louis", 48.851654, 2.357053), new Clue("île de la cité", 48.854879, 2.347072), new Clue("île aux cygnes", 48.853047, 2.283927), new Clue("confluence of the seine and the marne", 48.816547, 2.409643)]);
    new City("portland_or", 45.5425913,-122.7245068, 11, [new Clue("ross island", 45.486257, -122.658222), new Clue("confluence of columbia river and willamette river", 45.654426, -122.760899), new Clue("mt tabor park", 45.511933, -122.594157), new Clue("ladd's addition", 45.508550, -122.649439), new Clue("willamette river runs through it", 45.549621, -122.697029)]);

    new City("quito", -0.1862504,-78.5706262, 10, [new Clue("volcán cayambe", -0.0321244,-78.0731683)]);
    new City("rome", 41.9102415,12.3959127, 11, [new Clue("the tiber runs through it", 41.916214, 12.470511)]);

    new City("san_francisco", 37.757815,-122.5076404, 12, [new Clue("golden gate park", 37.768789, -122.483506), new Clue("treasure island", 37.824618, -122.372993), new Clue("the presidio", 37.797173, -122.466560), new Clue("lake merced", 37.719266, -122.494638), new Clue("san bruno mountain", 37.687226, -122.436153), new Clue("yerba buena island", 37.810314, -122.366489), new Clue("alcatraz island", 37.826728, -122.423015)]);
    new City("san_diego", 32.7604664,-117.3004056, 11, [new Clue("point loma", 32.676107, -117.242501)]);
    new City("santiago_chile", -33.4532908,-70.7142131, 13, [new Clue("san cristóbal hill", -33.420311, -70.631075), new Clue("club hípico de santiago", -33.462347, -70.668262), new Clue("movistar arena", -33.462704, -70.661809)]);
    new City("são_paulo", -23.5751509,-46.8922823, 10, [new Clue("represa billings", -23.791769, -46.615379), new Clue("represa guarapiranga", -23.724436, -46.731686), new Clue("parque do estado", -23.654208, -46.625056)]);
    new City("seattle", 47.6147628,-122.4759888, 11, [new Clue("lake union", 47.635429, -122.334589), new Clue("elliott bay", 47.600443, -122.3577276), new Clue("harbor island", 47.581023, -122.351381), new Clue("lake washington", 47.608332, -122.257040), new Clue("green lake", 47.677278, -122.338851), new Clue("puget sound", 47.683298, -122.460507), new Clue("discovery park", 47.662354, -122.419161), new Clue("seward park", 47.558273, -122.251963)]);
    new City("seoul", 37.5295835,126.7698989, 10, [new Clue("han river runs through it", 37.558870, 126.878763)]);
    new City("shanghai", 31.2343084,120.9862752, 10, [new Clue("yangtze river", 31.900528, 120.844607)]);
    new City("shenzhen", 22.6564095,113.9287805, 11, [new Clue("mirs bay", 22.566961, 114.336559)]);
    new City("stockholm", 59.326242,18.00, 12, [new Clue("gamla stan", 59.325240, 18.071455), new Clue("djurgården", 59.326794, 18.117050), new Clue("södermalm", 59.312556, 18.064729)]);
    new City("sydney", -33.8360446,150.712393, 10, [new Clue("port jackson", -33.854515, 151.234857), new Clue("botany bay", -33.986818, 151.183916)]);


    new City("tokyo", 35.6735408,139.570302, 11, [new Clue("arakawa river", 35.694367, 139.856509), new Clue("chiyoda", 35.686504, 139.752732)]);
    new City("tunis", 36.7949999,10.0732372, 11, [new Clue("la goulette", 36.818916, 10.301968)]);

    new City("vancouver_bc", 49.2780209,-123.1916531, 12, [new Clue("stanley park", 49.304820, -123.147416), new Clue("false creek", 49.269164, -123.123084), new Clue("granville island", 49.270721, -123.134443)]);


};

City.addButtons = function(citys) {
    citys = citys || City.citys;
    clearButtonDiv();
    citys.forEach((c) => { c.addButton() });
};

City.prototype.addButton = function() {
    this.button = document.createElement('a');
    this.button.id = this.name.concat("_button");
    this.button.className = "city-button";
    this.button.innerHTML = this.name;

    var city = this;
    this.button.onclick = function() { Quiz.reply(city); };

    dom.buttonDiv.appendChild(this.button);
};

City.prototype.setCity = function() {
    map.setCenter(new google.maps.LatLng(this.lat, this.lng));
    map.setZoom(this.zoom);
};

City.prototype.go = function() {
    this.setCity();
    this.displayClues();
    map.setCenter(new google.maps.LatLng(this.lat, this.lng));
};

City.prototype.displayClues = function() {
    for (var i=0; i<this.clues.length; i++) {
        var clue = this.clues[i];
        clue.display();
        clue.addInfoWindowListener();
    }
};


//Clue class
var Clue = function(txt, lat, lng) {
    this.txt = txt;
    this.lat = lat;
    this.lng = lng;
};

Clue.prototype.display = function() {
    this.marker=new google.maps.Marker({
        position:new google.maps.LatLng(this.lat,this.lng),
        animation:google.maps.Animation.DROP
    });

    this.marker.setMap(map);
    markers.push(this.marker);

    this.infoWindow = new google.maps.InfoWindow({
        content:this.txt
    });

    if (Quiz.isPlay) {
        map.setCenter(new google.maps.LatLng(Quiz.city.lat,Quiz.city.lng));
    }
};

Clue.prototype.addInfoWindow = function() {
    this.infoWindow.open(map,this.marker);
};

Clue.prototype.addInfoWindowListener = function() {
    var clue = this;
    google.maps.event.addListener(clue.marker, 'click', function() {
        clue.infoWindow.open(map,clue.marker);
    });
};
