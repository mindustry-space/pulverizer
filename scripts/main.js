const pulverizer = require("pulverizer");

function main() {
  let file = java.io.File(Version.combined().replace(/\s/g, "-"));
  file.mkdir();

  const displayName = "Pulverizer";
  const information = "Crushing content to " + file.getAbsolutePath() + ".";
  print(information);

  const callback = () => {
    const content = Vars.content.getContentMap();
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
    // if (Object.keys(ContentType).includes("team")) {
    //   skip.push(ContentType.team); // in development
    // }

    for (let i = 0; i < ContentType.all.length; i++) {
      if (skip.includes(i)) continue;

      let type = ContentType.all[i].toString();
      print("Crushing ContentType." + type + "...");
      let writer = java.io.FileWriter(
        file.getAbsolutePath() + "/" + type + ".json"
      );
      writer.write(JSON.stringify(pulverizer.crush(content[i])));
      writer.close();
    }

    Core.app.exit();
  };

  if (Vars.headless) {
    callback();
  } else {
    const dialog = new BaseDialog(displayName);
    dialog.cont.add(information);
    dialog.show();
    new Timer.schedule(callback, 1);
  }
}

Events.on(ClientLoadEvent, main);
