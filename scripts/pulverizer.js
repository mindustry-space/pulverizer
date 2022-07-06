function getContentClasses() {
  if (Version.build >= 136) {
    // enum contains classes
    return ContentType.all.map((v) =>
      v.contentClass ? v.contentClass.name : null
    );
  }

  return [
    "mindustry.type.Item",
    "mindustry.world.Block",
    "mindustry.entities.bullet.BulletType",
    "mindustry.type.Liquid",
    "mindustry.type.StatusEffect",
    "mindustry.type.UnitType",
    "mindustry.type.Weather",
    "mindustry.type.SectorPreset",
    "mindustry.type.Planet",
    "mindustry.type.TeamEntry",
  ];
}

const contentClasses = getContentClasses();

function crush(any, doNotRecurseFurther) {
  switch (typeof any) {
    case "function":
      return;

    case "object":
      if (any === null) return null;

      if (typeof any["getClass"] === "function")
        return crushClass(any, doNotRecurseFurther);

      return crushObject(any, doNotRecurseFurther);

    case "undefined":
      return;

    default:
      return any;
  }
}

function crushClass(obj, doNotRecurseFurther) {
  let actualType = obj.getClass();
  let type = actualType;
  let isContentClass = false;
  while (true) {
    if (contentClasses.includes(type.name)) {
      isContentClass = true;
    }

    if (doNotRecurseFurther && isContentClass) {
      return obj.id;
    }

    if (type.name.startsWith("[L") && type.name.endsWith(";")) {
      // [LT; == T[]
      // typeof obj == "object"
      let result = [];
      for (let i = 0; i < obj.length; i++) {
        let v = crush(obj[i], doNotRecurseFurther);
        if (v !== undefined) {
          result.push(v);
        }
      }
      return result;
    }

    switch (type.name) {
      case "arc.graphics.g2d.TextureAtlas$AtlasRegion":
        return obj.name;

      case "arc.struct.Seq": {
        // typeof obj == "object"
        let result = [];
        for (let i = 0; i < obj.size; i++) {
          let v = crush(obj.get(i), doNotRecurseFurther);
          if (v !== undefined) {
            result.push(v);
          }
        }
        return result;
      }

      case "java.lang.Class":
        return;

      case "mindustry.content.TechTree$TechNode":
        // TODO
        return;

      default: {
        type = type.getSuperclass();
        if (type === null) {
          // print(actualType.name + "-> object");
          if (isContentClass) return crushObject(obj, true);
          return crushObject(obj, doNotRecurseFurther);
        }
      }
    }
  }
}

function crushObject(obj, doNotRecurseFurther) {
  let result = {};
  for (let k in obj) {
    // print("." + k);
    let v = crush(obj[k], doNotRecurseFurther);
    if (v !== undefined) {
      result[k] = v;
    }
  }
  // print("<-");
  return result;
}

module.exports = {
  crush: crush,
  crushClass: crushClass,
  crushObject: crushObject,
};
