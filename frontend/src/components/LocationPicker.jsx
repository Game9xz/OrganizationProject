import { useEffect } from "react";

export default function LocationPicker({ setLocation }) {

    useEffect(() => {
        const map = new window.longdo.Map({
            placeholder: document.getElementById("map"),
            zoom: 15
        });

        map.Event.bind("click", function () {

            const loc = map.location();

            map.Overlays.clear();
            map.Overlays.add(new window.longdo.Marker(loc));

            // แปลงพิกัดเป็นชื่อสถานที่
            window.longdo.Services.address(loc, function (result) {

                const locationData = {
                    lat: loc.lat,
                    lon: loc.lon,
                    address: result
                };

                setLocation(locationData);
            });

        });

    }, []);

    return (
        <div
            id="map"
            style={{ width: "100vw", height: "100vh" }}
        ></div>
    );
}