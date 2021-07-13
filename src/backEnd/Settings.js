let fs = require("fs");
let path = require("path");

let settingsPath = path.join(__dirname, "../../settings.json");

class Settings {
    constructor() {
        let obj = this.getSettings();
        this.name = obj.name;
        this.location = obj.location;
        console.log("finished constructing the object")
    }
    getSettings(){
        let obj = JSON.parse(fs.readFileSync(settingsPath, 'utf8'));
        return obj
    }
    changeSettings(obj){
        fs.writeFileSync(settingsPath, JSON.stringify({
            "name": obj.name,
            "location": obj.location
        }));
        this.name = obj.name;
        this.location = obj.location;
        console.log("done writing to the file from the setting class");
    }
    isSettingsSet() {
        let obj = JSON.parse(fs.readFileSync(settingsPath, 'utf8'));
        if(obj.name == null || obj.location == null){
            return false;
        }else{
            return true;
        }
    }
}

module.exports = new Settings();