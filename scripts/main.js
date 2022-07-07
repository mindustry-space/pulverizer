require("supported");
const pulverizer = require("pulverizer");

const displayName = "Pulverizer";
const file = java.io.File(Version.combined().replace(/\s/g, "-"));
const path = file.getAbsolutePath();
const information = "Crushing content to " + path + ".";
const skip = [
  ContentType.mech_UNUSED,
  ContentType.effect_UNUSED,
  ContentType.sector, // TODO
  ContentType.loadout_UNUSED,
  ContentType.typeid_UNUSED,
  ContentType.error,
  ContentType.planet, // TODO
  ContentType.ammo_UNUSED,
].map((v) => v.ordinal());

function run() {
  const content = Vars.content.getContentMap();
  file.mkdir();

  let writer = java.io.FileWriter(path + "/version.json");
  writer.write(JSON.stringify(pulverizer.crushObject(Version)));
  writer.close();

  for (let i = 0; i < ContentType.all.length; i++) {
    if (skip.includes(i)) continue;

    let type = ContentType.all[i].toString();
    print("Crushing ContentType." + type + "...");
    let writer = java.io.FileWriter(path + "/" + type + ".json");
    writer.write(JSON.stringify(pulverizer.crush(content[i])));
    writer.close();
  }

  Core.app.exit();
}

function main() {
  print(information);
  const dialog = new BaseDialog(displayName);
  dialog.cont.add(information);
  dialog.show();

  new Timer.schedule(run, 1);
}

Events.on(ClientLoadEvent, main);
