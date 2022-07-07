/*
  tested on:
  - desktop jar + x86_64-linux + x
  - desktop jar + x86_64-linux + xvfb
*/

if (Vars.headless)
  throw "Pulverizer does not support headless clients. If you are trying to run this on a headless machine, try using the desktop client with a virtual X server - https://man.archlinux.org/man/xvfb-run.1.en";
