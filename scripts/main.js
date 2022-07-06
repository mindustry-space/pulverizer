const pulverizer = require("pulverizer");

function main() {
  let file = java.io.File(Version.combined().replace(/\s/g, "-") + ".json");

  const displayName = "Pulverizer";
  const information = "Crushing content to " + file.getAbsolutePath() + ".";
  print(information);

  const callback = () => {
    let writer = java.io.FileWriter(file.getAbsolutePath());
    writer.write(JSON.stringify(pulverizer.crush(Vars.content.items())));
    writer.close();

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
