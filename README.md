# pulverizer

Pulverizer is a Mindustry mod that scrapes data from the game's content into JSON files.

Output data is available in [the sand repository](https://github.com/mindustry-space/sand).

## Installation

Pulverizer can be installed using the game's built-in mod browser.

You can also install it manually by [downloading this repository](https://github.com/mindustry-space/pulverizer/archive/refs/heads/main.zip) and saving it to your mods folder.

```sh
curl -L https://github.com/mindustry-space/pulverizer/archive/refs/heads/main.zip > ~/.local/share/Mindustry/mods/pulverizer.zip
```

## Usage

With the mod installed, Pulverizer will automatically run at launch. It will write to a folder matching the client's version in the current working directory. On completion, this folder is shown in a dialog and printed in the game's logs. Inside you will find multiple JSON files consisting of the data that Pulverizer was able to find. Each JSON file contains one specific content type, with the exception of `version.json` containing data on the game's version.

### Configuration

Pulverizer can be configured through environment variables.

#### `PULVERIZER_EXIT`

If `PULVERIZER_EXIT` is set, Pulverizer will tell the client to exit once crushing is complete.

#### `PULVERIZER_PATH`

Pulverizer will output to a folder matching the client's version in the current working directory by default. This path can be changed by setting this variable.

#### `PULVERIZER_SKIP`

If `PULVERIZER_SKIP` is set, Pulverizer will not run.

#### `PULVERIZER_SKIP_X`

This variable allows you to skip crushing specific content types. To skip a content type, set `PULVERIZER_SKIP_X` where x is the type's ordinal in [the game's ContentType enum](https://github.com/anuken/mindustry/blob/master/core/src/mindustry/ctype/ContentType.java). As `ContentType.item` is the first possible value in the enum, it's ordinal is 0. Therefore, set `PULVERIZER_SKIP_0` to skip crushing items. As `ContentType.block` is the second item, all blocks can be skipped by setting `PULVERIZER_SKIP_1`.

Pulverizer will automatically skip [some content types](https://github.com/mindustry-space/pulverizer/blob/main/scripts/main.js#L5).

### Headless

Pulverizer needs a desktop client to run. However, it can still run on a headless machine by using [a virtual X server](https://man.archlinux.org/man/xvfb-run.1.en). The game can be closed automatically by pulverizer by setting [`PULVERIZER_EXIT`](#pulverizer_exit).

## License

[GPL-3.0](LICENSE)
