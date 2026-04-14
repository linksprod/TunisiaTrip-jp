
// Type definitions for Google Maps JavaScript API
declare namespace google.maps {
  class Map {
    constructor(mapDiv: Element, opts?: MapOptions);
    fitBounds(bounds: LatLngBounds | LatLngBoundsLiteral): void;
    getBounds(): LatLngBounds;
    getCenter(): LatLng;
    getDiv(): Element;
    getHeading(): number;
    getMapTypeId(): MapTypeId;
    getProjection(): Projection;
    getStreetView(): StreetViewPanorama;
    getTilt(): number;
    getZoom(): number;
    panBy(x: number, y: number): void;
    panTo(latLng: LatLng | LatLngLiteral): void;
    panToBounds(latLngBounds: LatLngBounds | LatLngBoundsLiteral): void;
    setCenter(latlng: LatLng | LatLngLiteral): void;
    setHeading(heading: number): void;
    setMapTypeId(mapTypeId: MapTypeId | string): void;
    setOptions(options: MapOptions): void;
    setStreetView(panorama: StreetViewPanorama): void;
    setTilt(tilt: number): void;
    setZoom(zoom: number): void;
    controls: MVCArray<Node>[];
  }

  interface MapOptions {
    center?: LatLng | LatLngLiteral;
    clickableIcons?: boolean;
    disableDefaultUI?: boolean;
    disableDoubleClickZoom?: boolean;
    draggable?: boolean;
    draggableCursor?: string;
    draggingCursor?: string;
    fullscreenControl?: boolean;
    fullscreenControlOptions?: FullscreenControlOptions;
    gestureHandling?: string;
    heading?: number;
    keyboardShortcuts?: boolean;
    mapTypeControl?: boolean;
    mapTypeControlOptions?: MapTypeControlOptions;
    mapTypeId?: MapTypeId;
    maxZoom?: number;
    minZoom?: number;
    noClear?: boolean;
    panControl?: boolean;
    panControlOptions?: PanControlOptions;
    rotateControl?: boolean;
    rotateControlOptions?: RotateControlOptions;
    scaleControl?: boolean;
    scaleControlOptions?: ScaleControlOptions;
    scrollwheel?: boolean;
    streetView?: StreetViewPanorama;
    streetViewControl?: boolean;
    streetViewControlOptions?: StreetViewControlOptions;
    styles?: MapTypeStyle[];
    tilt?: number;
    zoom?: number;
    zoomControl?: boolean;
    zoomControlOptions?: ZoomControlOptions;
  }

  interface MapTypeStyle {
    elementType?: string;
    featureType?: string;
    stylers: any[];
  }

  interface FullscreenControlOptions {
    position?: ControlPosition;
  }

  interface MapTypeControlOptions {
    mapTypeIds?: (MapTypeId | string)[];
    position?: ControlPosition;
    style?: MapTypeControlStyle;
  }

  interface PanControlOptions {
    position?: ControlPosition;
  }

  interface RotateControlOptions {
    position?: ControlPosition;
  }

  interface ScaleControlOptions {
    style?: ScaleControlStyle;
  }

  interface StreetViewControlOptions {
    position?: ControlPosition;
  }

  interface ZoomControlOptions {
    position?: ControlPosition;
  }

  enum ControlPosition {
    BOTTOM_CENTER,
    BOTTOM_LEFT,
    BOTTOM_RIGHT,
    LEFT_BOTTOM,
    LEFT_CENTER,
    LEFT_TOP,
    RIGHT_BOTTOM,
    RIGHT_CENTER,
    RIGHT_TOP,
    TOP_CENTER,
    TOP_LEFT,
    TOP_RIGHT
  }

  enum MapTypeId {
    HYBRID,
    ROADMAP,
    SATELLITE,
    TERRAIN
  }

  enum MapTypeControlStyle {
    DEFAULT,
    DROPDOWN_MENU,
    HORIZONTAL_BAR
  }

  enum ScaleControlStyle {
    DEFAULT
  }

  class LatLng {
    constructor(lat: number, lng: number, noWrap?: boolean);
    equals(other: LatLng): boolean;
    lat(): number;
    lng(): number;
    toString(): string;
    toUrlValue(precision?: number): string;
    toJSON(): LatLngLiteral;
  }

  interface LatLngLiteral {
    lat: number;
    lng: number;
  }

  class LatLngBounds {
    constructor(sw?: LatLng | LatLngLiteral, ne?: LatLng | LatLngLiteral);
    contains(latLng: LatLng | LatLngLiteral): boolean;
    equals(other: LatLngBounds | LatLngBoundsLiteral): boolean;
    extend(point: LatLng | LatLngLiteral): LatLngBounds;
    getCenter(): LatLng;
    getNorthEast(): LatLng;
    getSouthWest(): LatLng;
    intersects(other: LatLngBounds | LatLngBoundsLiteral): boolean;
    isEmpty(): boolean;
    toJSON(): LatLngBoundsLiteral;
    toSpan(): LatLng;
    toString(): string;
    toUrlValue(precision?: number): string;
    union(other: LatLngBounds | LatLngBoundsLiteral): LatLngBounds;
  }

  interface LatLngBoundsLiteral {
    east: number;
    north: number;
    south: number;
    west: number;
  }

  // Modified Marker to extend MVCObject
  class Marker extends MVCObject {
    constructor(opts?: MarkerOptions);
    getAnimation(): Animation;
    getClickable(): boolean;
    getCursor(): string;
    getDraggable(): boolean;
    getIcon(): string | Icon | Symbol;
    getLabel(): MarkerLabel;
    getMap(): Map | StreetViewPanorama;
    getOpacity(): number;
    getPosition(): LatLng;
    getShape(): MarkerShape;
    getTitle(): string;
    getVisible(): boolean;
    getZIndex(): number;
    setAnimation(animation: Animation | null): void;
    setClickable(flag: boolean): void;
    setCursor(cursor: string): void;
    setDraggable(flag: boolean): void;
    setIcon(icon: string | Icon | Symbol): void;
    setLabel(label: string | MarkerLabel): void;
    setMap(map: Map | StreetViewPanorama | null): void;
    setOpacity(opacity: number): void;
    setOptions(options: MarkerOptions): void;
    setPosition(latlng: LatLng | LatLngLiteral): void;
    setShape(shape: MarkerShape): void;
    setTitle(title: string): void;
    setVisible(visible: boolean): void;
    setZIndex(zIndex: number): void;
    // Added to support attaching data to markers
    set(key: string, value: any): void;
    get(key: string): any;
    // Added to support events
    addListener(eventName: string, handler: Function): MapsEventListener;
  }

  enum Animation {
    BOUNCE,
    DROP
  }

  interface MarkerOptions {
    anchorPoint?: Point;
    animation?: Animation;
    clickable?: boolean;
    crossOnDrag?: boolean;
    cursor?: string;
    draggable?: boolean;
    icon?: string | Icon | Symbol;
    label?: string | MarkerLabel;
    map?: Map | StreetViewPanorama;
    opacity?: number;
    optimized?: boolean;
    position: LatLng | LatLngLiteral;
    shape?: MarkerShape;
    title?: string;
    visible?: boolean;
    zIndex?: number;
  }

  interface Icon {
    anchor?: Point;
    labelOrigin?: Point;
    origin?: Point;
    scaledSize?: Size;
    size?: Size;
    url?: string;
  }

  interface Symbol {
    anchor?: Point;
    fillColor?: string;
    fillOpacity?: number;
    labelOrigin?: Point;
    path: SymbolPath | string;
    rotation?: number;
    scale?: number;
    strokeColor?: string;
    strokeOpacity?: number;
    strokeWeight?: number;
  }

  enum SymbolPath {
    BACKWARD_CLOSED_ARROW,
    BACKWARD_OPEN_ARROW,
    CIRCLE,
    FORWARD_CLOSED_ARROW,
    FORWARD_OPEN_ARROW
  }

  interface MarkerLabel {
    color?: string;
    fontFamily?: string;
    fontSize?: string;
    fontWeight?: string;
    text: string;
  }

  interface MarkerShape {
    coords: number[];
    type: string;
  }

  class InfoWindow {
    constructor(opts?: InfoWindowOptions);
    close(): void;
    getContent(): string | Element;
    getPosition(): LatLng;
    getZIndex(): number;
    open(map?: Map | StreetViewPanorama, anchor?: MVCObject): void;
    setContent(content: string | Element): void;
    setOptions(options: InfoWindowOptions): void;
    setPosition(position: LatLng | LatLngLiteral): void;
    setZIndex(zIndex: number): void;
  }

  interface InfoWindowOptions {
    content?: string | Element;
    disableAutoPan?: boolean;
    maxWidth?: number;
    pixelOffset?: Size;
    position?: LatLng | LatLngLiteral;
    zIndex?: number;
  }

  class Polyline extends MVCObject {
    constructor(opts?: PolylineOptions);
    getDraggable(): boolean;
    getEditable(): boolean;
    getMap(): Map;
    getPath(): MVCArray<LatLng>;
    getVisible(): boolean;
    setDraggable(draggable: boolean): void;
    setEditable(editable: boolean): void;
    setMap(map: Map | null): void;
    setOptions(options: PolylineOptions): void;
    setPath(path: MVCArray<LatLng> | LatLng[] | LatLngLiteral[]): void;
    setVisible(visible: boolean): void;
  }

  interface PolylineOptions {
    clickable?: boolean;
    draggable?: boolean;
    editable?: boolean;
    geodesic?: boolean;
    icons?: IconSequence[];
    map?: Map;
    path?: MVCArray<LatLng> | LatLng[] | LatLngLiteral[];
    strokeColor?: string;
    strokeOpacity?: number;
    strokeWeight?: number;
    visible?: boolean;
    zIndex?: number;
  }

  interface IconSequence {
    fixedRotation?: boolean;
    icon: Symbol;
    offset?: string;
    repeat?: string;
  }

  class Point {
    constructor(x: number, y: number);
    x: number;
    y: number;
    equals(other: Point): boolean;
    toString(): string;
  }

  class Size {
    constructor(width: number, height: number, widthUnit?: string, heightUnit?: string);
    height: number;
    width: number;
    equals(other: Size): boolean;
    toString(): string;
  }

  class MVCArray<T> {
    constructor(array?: T[]);
    clear(): void;
    forEach(callback: (elem: T, i: number) => void): void;
    getArray(): T[];
    getAt(i: number): T;
    getLength(): number;
    insertAt(i: number, elem: T): void;
    pop(): T;
    push(elem: T): number;
    removeAt(i: number): T;
    setAt(i: number, elem: T): void;
  }

  class MVCObject {
    constructor();
    addListener(eventName: string, handler: (...args: any[]) => void): MapsEventListener;
    bindTo(key: string, target: MVCObject, targetKey?: string, noNotify?: boolean): void;
    get(key: string): any;
    notify(key: string): void;
    set(key: string, value: any): void;
    setValues(values: any): void;
    unbind(key: string): void;
    unbindAll(): void;
  }

  interface MapsEventListener {
    remove(): void;
  }

  namespace event {
    function addDomListener(instance: object, eventName: string, handler: Function, capture?: boolean): MapsEventListener;
    function addDomListenerOnce(instance: object, eventName: string, handler: Function, capture?: boolean): MapsEventListener;
    function addListener(instance: object, eventName: string, handler: Function): MapsEventListener;
    function addListenerOnce(instance: object, eventName: string, handler: Function): MapsEventListener;
    function clearInstanceListeners(instance: object): void;
    function clearListeners(instance: object, eventName: string): void;
    function removeListener(listener: MapsEventListener): void;
    function trigger(instance: object, eventName: string, ...args: any[]): void;
  }

  interface Projection {
    fromLatLngToPoint(latLng: LatLng, point?: Point): Point;
    fromPointToLatLng(pixel: Point, noWrap?: boolean): LatLng;
  }

  class StreetViewPanorama extends MVCObject {
    constructor(container: Element, opts?: StreetViewPanoramaOptions);
    // Additional methods and properties...
  }

  interface StreetViewPanoramaOptions {
    // Options...
  }
}
