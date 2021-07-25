let fs = require("fs");
let path = require("path");

let settingsPath = path.join(__dirname, "../../settings.json");

Settings = {
    name: "",
    location: "",
    init: () => {
        let obj = Settings.getSettings();
        Settings.name = obj.name;
        Settings.location = obj.location;
        console.log("finished constructing the object")
    },
    getSettings: () => {
        let obj = JSON.parse(fs.readFileSync(settingsPath, 'utf8'));
        return obj
    },
    changeSettings: (obj) => {
        fs.writeFileSync(settingsPath, JSON.stringify({
            "name": obj.name,
            "location": obj.location
        }));
        Settings.name = obj.name;
        Settings.location = obj.location;
        console.log("done writing to the file from the setting class");
    },
    isSettingsSet: () => {
        let obj = JSON.parse(fs.readFileSync(settingsPath, 'utf8'));
        if(obj.name == null || obj.location == null){
            return false;
        }else{
            return true;
        }
    }
}

module.exports = Settings;