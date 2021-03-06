function crush(any, doNotRecurseFurther) {
  switch (typeof any) {
    case "function":
      return;

    case "object":
      if (any === null) return null;

      if (typeof any.getClass === "function")
        return crushClass(any, doNotRecurseFurther);

      return crushObject(any, doNotRecurseFurther);

    case "undefined":
      return;

    default:
      return any;
  }
}

function crushArray(arr, doNotRecurseFurther) {
  // typeof arr == "object"
  let result = [];
  for (let i = 0; i < arr.length; i++) {
    let v = crush(arr[i], doNotRecurseFurther);
    if (v !== undefined) {
      result.push(v);
    }
  }
  return result;
}

function crushClass(obj, doNotRecurseFurther) {
  let actualType = obj.getClass();
  let type = actualType;
  let isContentClass = false;
  while (true) {
    if (type.name === "mindustry.ctype.Content") {
      isContentClass = true;
    }

    if (doNotRecurseFurther && isContentClass) {
      return obj.id;
    }

    if (type.name.startsWith("[L") && type.name.endsWith(";")) {
      // [LT; == T[]
      return crushArray(obj, doNotRecurseFurther);
    }

    switch (type.name) {
      case "[Z":
        // boolean[]
        return crushArray(obj, doNotRecurseFurther);

      case "arc.audio.Sound": {
        let v = obj.toString().replace("SoloudSound: ", "");
        if (v === "null") return null;
        return v;
      }

      case "arc.graphics.g2d.TextureAtlas$AtlasRegion":
        return obj.name;

      case "arc.graphics.g2d.TextureRegion":
        return;

      case "arc.struct.Bits": {
        let result = [];
        for (let i = 0; i < obj.length(); i++) {
          result.push(obj.get(i));
        }
        return result;
      }

      case "arc.struct.EnumSet": {
        if (obj.array !== undefined) {
          // > v135
          return crush(obj.array, doNotRecurseFurther);
        } else {
          // <= v135
          let result = [];
          obj.forEach((v) => result.push(v.toString()));
          return result;
        }
      }

      case "arc.struct.ObjectFloatMap": {
        let result = {};
        obj.each({
          get: (e) =>
            (result[crush(e.key, true)] = crush(e.value, doNotRecurseFurther)),
        });
        return result;
      }

      case "arc.struct.ObjectMap": {
        let result = {};
        obj.each({
          get: (k, v) =>
            (result[crush(k, true)] = crush(v, doNotRecurseFurther)),
        });
        return result;
      }

      case "arc.struct.ObjectSet":
        return crush(obj.iterator().toSeq(), doNotRecurseFurther);

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

      case "java.lang.Enum":
        return obj.toString();

      case "mindustry.content.TechTree$TechNode":
        // TODO
        return;

      case "mindustry.world.blocks.Attributes":
        let result = {};
        for (let attribute of Attribute.all) {
          result[attribute.toString()] = obj.get(attribute);
        }
        return result;

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
