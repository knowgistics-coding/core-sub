import { User } from "firebase/auth";
import {
  addDoc,
  collection,
  collectionGroup,
  FieldValue,
  Firestore,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  Unsubscribe,
  where,
} from "firebase/firestore";
import { VisibilityTabsValue } from "../VisibilityTabs";

/**
 * ==================================================
 *   __  __     _     ____
 *  |  \/  |   / \   |  _ \
 *  | |\/| |  / _ \  | |_) |
 *  | |  | | / ___ \ |  __/
 *  |_|  |_|/_/   \_\|_|
 *
 * ==================================================
 */

export class MapCtl {}

/**
 * ==================================================
 *   ____         _         _  _
 *  |  _ \  ___  | | _   _ | |(_) _ __    ___
 *  | |_) |/ _ \ | || | | || || || '_ \  / _ \
 *  |  __/| (_) || || |_| || || || | | ||  __/
 *  |_|    \___/ |_| \__, ||_||_||_| |_| \___|
 *                   |___/
 *
 * ==================================================
 */

/**
 * ==================================================
 *   ____                _
 *  |  _ \  ___   _   _ | |_  ___
 *  | |_) |/ _ \ | | | || __|/ _ \
 *  |  _ <| (_) || |_| || |_|  __/
 *  |_| \_\\___/  \__,_| \__|\___|
 *
 * ==================================================
 */

export type RouteData = {
  cat: string;
  color: string;
  latLngs: LatLngObject[];
  title: string;
  type: "route";
};

export type RouteDataRaw = PolylineData & {
  datecreate: FieldValue;
  datemodified: FieldValue;
  visibility: VisibilityTabsValue;
  user: string;
  ref?: string;
};

export type RouteDocument = Omit<
  RouteDataRaw,
  "datecreate" | "datemodified"
> & {
  id: string;
  datecreate: Timestamp;
  datemodified: Timestamp;
};

export class Route {
  static watch(
    db: Firestore,
    user: User,
    callback: (docs: RouteDocument[]) => void
  ): Unsubscribe {
    return onSnapshot(
      query(
        collectionGroup(db, "docs"),
        where("type", "==", "route"),
        where("visibility", "==", "private"),
        orderBy("datemodified", "desc"),
      ),
      (snapshot) => {
        const docs = snapshot.docs.map(
          (doc) => ({ ...doc.data(), id: doc.id } as RouteDocument)
        );
        callback(docs);
      },
      (err) => console.log(err.message)
    );
  }
}

export type LatLngArr = [number, number];
export type LatLngObject = { lat: number; lng: number };
export type LatLng = LatLngArr | LatLngObject;
export type GeoJSON = {
  type: "LineString" | "Feature";
  coordinates: LatLngArr[];
};

export type PolylineData = {
  cat: string;
  color: string;
  latLngs: LatLngObject[];
  title: string;
  type: "route";
};

export type PolylineDataRaw = PolylineData & {
  datecreate: FieldValue;
  datemodified: FieldValue;
  visibility: VisibilityTabsValue;
  user: string;
  ref?: string;
};

export class PolylineCtl {
  private static getLat = (latLng: LatLng): number => {
    return Array.isArray(latLng) ? latLng[0] : latLng.lat;
  };
  private static getLng = (latLng: LatLng): number => {
    return Array.isArray(latLng) ? latLng[1] : latLng.lng;
  };
  private static py2_round(value: number) {
    return Math.floor(Math.abs(value) + 0.5) * (value >= 0 ? 1 : -1);
  }

  private static enc(
    current: number,
    previous: number,
    factor: number
  ): string {
    current = this.py2_round(current * factor);
    previous = this.py2_round(previous * factor);
    let coordinate = current - previous;
    coordinate <<= 1;
    if (current - previous < 0) {
      coordinate = ~coordinate;
    }
    var output = "";
    while (coordinate >= 0x20) {
      output += String.fromCharCode((0x20 | (coordinate & 0x1f)) + 63);
      coordinate >>= 5;
    }
    output += String.fromCharCode(coordinate + 63);
    return output;
  }

  static flipped(coords: LatLng[]): LatLng[] {
    return coords.reverse();
  }

  static encode(coordinates: LatLng[], precision: number = 5) {
    if (!coordinates.length) {
      return "";
    }

    const newCoords: LatLngArr[] = coordinates.map(
      (latLng): LatLngArr => [this.getLat(latLng), this.getLng(latLng)]
    );

    var factor = Math.pow(10, Number.isInteger(precision) ? precision : 5),
      output =
        this.enc(newCoords[0][0], 0, factor) +
        this.enc(newCoords[0][1], 0, factor);

    for (let i = 1; i < newCoords.length; i++) {
      const a = newCoords[i],
        b = newCoords[i - 1];
      output += this.enc(a[0], b[0], factor);
      output += this.enc(a[1], b[1], factor);
    }

    return output;
  }

  static decode(str: string, precision: number = 5): LatLngArr[] {
    let index = 0,
      lat = 0,
      lng = 0,
      coordinates: LatLngArr[] = [],
      shift = 0,
      result = 0,
      byte = null,
      latitude_change,
      longitude_change,
      factor = Math.pow(10, Number.isInteger(precision) ? precision : 5);

    while (index < str.length) {
      byte = null;
      shift = 0;
      result = 0;

      do {
        byte = str.charCodeAt(index++) - 63;
        result |= (byte & 0x1f) << shift;
        shift += 5;
      } while (byte >= 0x20);

      latitude_change = result & 1 ? ~(result >> 1) : result >> 1;

      shift = result = 0;

      do {
        byte = str.charCodeAt(index++) - 63;
        result |= (byte & 0x1f) << shift;
        shift += 5;
      } while (byte >= 0x20);

      longitude_change = result & 1 ? ~(result >> 1) : result >> 1;

      lat += latitude_change;
      lng += longitude_change;

      coordinates.push([lat / factor, lng / factor]);
    }

    return coordinates;
  }

  static fromGeoJSON(geojson: GeoJSON, precision: number = 5) {
    if (!geojson || geojson.type !== "LineString") {
      throw new Error("Input must be a GeoJSON LineString");
    }
    return this.encode(this.flipped(geojson.coordinates), precision);
  }

  static toGeoJSON(str: string, precision: number = 5) {
    const coords = this.decode(str, precision);
    return {
      type: "LineString",
      coordinates: this.flipped(coords),
    };
  }
}

/**
 * ==================================================
 *   __  __               _
 *  |  \/  |  __ _  _ __ | | __ ___  _ __
 *  | |\/| | / _` || '__|| |/ // _ \| '__|
 *  | |  | || (_| || |   |   <|  __/| |
 *  |_|  |_| \__,_||_|   |_|\_\\___||_|
 *
 * ==================================================
 */

export type MarkerAddressData = {
  administrative_area_level_1: string;
  administrative_area_level_2: string;
  country: string;
  locality: string;
  plus_code: string;
  political: string;
  postal_code: string;
  route: string;
};
export type MarkerData = {
  address?: Partial<MarkerAddressData>;
  cat: string;
  latLng: LatLngObject;
  title: string;
  type: "marker";
};

export type MarkerDataRaw = MarkerData & {
  user: string;
  datecreate: FieldValue;
  datemodified: FieldValue;
  ref?: string;
};

export type MarkerDataDocument = MarkerData & {
  id: string;
  user: string;
  datecreate: Timestamp;
  datemodified: Timestamp;
  ref?: string;
};

export class MarkerCtl {
  constructor(protected db: Firestore) {}

  watch(callback: (docs: MarkerDataDocument[]) => void): Unsubscribe {
    return onSnapshot(collectionGroup(this.db, "docs"), (snapshot) => {
      const docs = snapshot.docs.map(
        (doc) =>
          ({
            ...doc.data(),
            id: doc.id,
          } as MarkerDataDocument)
      );
      callback(docs);
    });
  }

  async add(user: User, data: MarkerData) {
    const newData: MarkerDataRaw = {
      ...data,
      datecreate: serverTimestamp(),
      datemodified: serverTimestamp(),
      user: user.uid,
    };
    return addDoc(collection(this.db, "users", user.uid, "docs"), newData);
  }
}
