function crush(any) {
  switch (typeof any) {
    case "function":
      return undefined;

    case "object":
      if (any === null) return null;

      if (typeof any["getClass"] === "function") return crushClass(any);

      return crushObject(any);

    case "undefined":
      return undefined;

    default:
      return any;
  }
}

function crushClass(obj) {
  let actualType = obj.getClass();
  let type = actualType;
  while (true) {
    switch (type.name) {
      case "arc.struct.Seq": {
        // convert "object" into array

        let result = [];
        for (let i = 0; i < obj.size; i++) {
          let v = crush(obj.get(i));
          if (v !== undefined) {
            result.push(v);
          }
        }
        return result;
      }

      case "java.lang.Class":
        return undefined;

      case "mindustry.content.TechTree$TechNode":
        // TODO
        return undefined;

      default: {
        type = type.getSuperclass();
        if (type === null) {
          // print(actualType.name + " -> object");
          return crushObject(obj);
        }
      }
    }
  }
}

function crushObject(obj) {
  let result = {};
  for (let k in obj) {
    // print("." + k);
    let v = crush(obj[k]);
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
