
function getFilm(name) {
    switch(name) {

        case "none":
            return [
                ["none"],
                ["TXT", "IMG", "../default.png", false, "Please edit maps.js to add menu's.", "Arial", 20, "white", "#1f1f1f", true, 300, 50, 92, 300, 9999, 9999, 9999, 9999, 9999]
            ];

        default:
            return [
                ["default"],
                ["TXT", "IMG", "../default.png", false, "No disc - click disc button to select one", "Arial", 20, "red", "#1f1f1f", true, 300, 50, 92, 300, 9999, 9999, 9999, 9999, 9999]
            ]
    }
}