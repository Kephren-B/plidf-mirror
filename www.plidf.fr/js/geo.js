(function(){
		var options = {
			enableHighAccuracy: false,
			timeout: 50000,
			maximumAge: 0
		} 
		function success(param){
			document.getElementById('closest-station-div').style.display='block';
			var p = {};
			p.timestamp = param.timestamp;
			p.coords = {};
			
			p.coords.latitude = param.coords.latitude;
			p.coords.longitude = param.coords.longitude;
			p.coords.accuracy = param.coords.accuracy;
			p.coords.speed = param.coords.speed;
			p.coords.altitude = param.coords.altitude;
			p.coords.altitudeAccuracy = param.coords.altitudeAccuracy;
			p.coords.heading = param.coords.heading;
			
			var xhr = new XMLHttpRequest();
			xhr.open('POST','/ajax.php?ac=geo&a=closestStation');
			xhr.onload = function(){
				try{
					var ans = JSON.parse(this.responseText);
					if(ans.stations){
						document.getElementById('closest-tbody').innerHTML = ans.stations;
					}
					console.log(this.responseText);
				} catch(e){
					
				}
			}
			var fd = new FormData();
			fd.append('p',btoa(JSON.stringify(p)));
			xhr.send(fd);
		}
		function geofail(report){
			console.log('Geolocalisation failed');
			if(report){
				console.log(report);
			}
		}
     navigator.geolocation.
	  getCurrentPosition(success,geofail,options);
})();
