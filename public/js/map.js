    
const map = new mapboxgl.Map({
  accessToken: mapToken,
  container: "map", // container ID
  center: listingCoordinates, // starting position [lng, lat]. Note that lat must be set between -90 and 90
  zoom: 10, // starting zoom
});

const marker1 = new mapboxgl.Marker({color : "red"})
        .setLngLat(listingCoordinates)
        .setPopup(new mapboxgl.Popup({offset: 10, maxWidth: "none"}).setHTML(`
    <div class="map-pop-block">

        <img 
            src="${mapPopImage}" 
            class="map-pop-image"
            alt="Listing image"
        >

        <div class="map-pop-info">
            <p class="map-pop-title">${mapPopTitle}</p>

            <p class="map-pop-location">
                <i class="fa-solid fa-location-dot"></i> ${mapPopLocation}
            </p>

            <p class="map-pop-desc">
                Exact location provided after booking.
            </p>
        </div>
 
    </div>
`))
        .addTo(map);
