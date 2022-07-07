require("supported");
const config = require("config");
const pulverizer = require("pulverizer");

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

let dialog;

function run() {
  const content = Vars.content.getContentMap();
  const file = java.io.File(config.path);
  file.mkdir();
  const path = file.getAbsolutePath();

  let writer = java.io.FileWriter(path + "/version.json");
  writer.write(JSON.stringify(pulverizer.crushObject(Version)));
  writer.close();

  for (let i = 0; i < ContentType.all.length; i++) {
    let type = ContentType.all[i].toString();

    if (skip.includes(i)) continue;
    let env = "PULVERIZER_SKIP_" + i;
    if (OS.env(env) !== null) {
      print(env + " is set. Skipping ContentType." + type + "...");
      continue;
    }

    print("Crushing ContentType." + type + "...");
    let writer = java.io.FileWriter(path + "/" + type + ".json");
    writer.write(JSON.stringify(pulverizer.crush(content[i])));
    writer.close();
  }

  dialog.hide();
  print("Crushed to " + path + "!");
  if (config.exit !== null) {
    print("PULVERIZER_EXIT is set, exiting...");
    Core.app.exit();
  }

  const doneDialog = new BaseDialog("Pulverizer");
  doneDialog.addCloseButton();
  doneDialog.cont.add("Crushed!\n\n" + path);
  doneDialog.show();
}

function main() {
  const t = "Crushing...";
  print(t);
  dialog = new BaseDialog("Pulverizer");
  dialog.cont.add(t);
  dialog.show();

  new Timer.schedule(run, 1);
}

if (config.skip === null) {
  Events.on(ClientLoadEvent, main);
} else {
  print("PULVERIZER_SKIP is set, skipping...");
}
