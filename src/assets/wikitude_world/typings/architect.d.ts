// Type definitions for Wikitude 4.1.0
// Project: http://www.wikitude.com
// Definitions by: Maurizio Cecatto
// Version: 1.0

declare module AR {

    /**
     * ActionArea is a superclass for other classes and must not be directly instantiated by the developer.
     */
    class ActionArea extends ARchitectObject {

        /**
         * Flag to enable/disable the ActionArea.
         */
        enabled: boolean;

        /**
         * Checks if a certain location is within this ActionArea.
         */
        isInArea(geoLocation: GeoLocation): boolean;

        /**
         * The trigger is executed when the user enters the ActionArea.
         */
        onEnter: () => void;

        /**
         * The trigger is executed when the user leaves the ActionArea.
         */
        onExit: () => void;
    }

    /**
     * An ActionRange defines a circle around a certain Location. Events are fired as soon as the user enters or leaves this circle.
     */
    class ActionRange extends ActionArea {

        constructor(location: Location, radius: number, options?: any);

        /**
         * The Location object which defines the center of the ActionRange.
         */
        location: Location;

        /**
         * The radius of the ActionRange, in SDUs.
         */
        radius: number;
    }

    /**
     * AnimatedImageDrawable allows to create animated images using sprite sheets.
     */
    class AnimatedImageDrawable extends ImageDrawable {

    }

    /**
     * It is an abstract class that must not be instantiated directly.
     */
    class Animation extends ARchitectObject {

        /**
         * Checks if the Animation is currently running.
         */
        isRunning(): boolean;

        /**
         * Pauses the Animation.
         */
        pause(): void;

        /**
         * Resumes the Animation.
         */
        resume(): void;

        /**
         * Immediately starts the Animation.
         */
        start(loopTimes?: number): void;

        /**
         * Immediately stops the Animation. 
         */
        stop(): void;

        /**
         * The trigger will fire when the Animation finishes.
         */
        onFinish: () => void;

        /**
         * The trigger will fire right before the Animation starts.
         */
        onStart: () => void;
    } 

    /**
     * An AnimationGroup allows to run a group of Animations sequentially or in parallel.
     */
    class AnimationGroup extends Animation {

        constructor(type: string, animations: Animation[], options?: any);
    }

    /**
     * ARchitectObject is the base class for each object created through the ARchitect. 
     * An ARchitectObject is a superclass for other classes and must not be directly instantiated by the developer.
     */
    class ARchitectObject {

        /**
         * Indicates if the object has already been destroyed.
         */
        destroyed: boolean;

        /**
         * Destroys the object.
         */
        destroy(): void;
    }

    /**
     * An ARObject is an abstract class which must not be instantiated directly. It provides basic methods and properties required for the objects rendered in the AR scene.
     */
    class ARObject extends ARchitectObject {

        /**
         * A boolean flag to enable or disable the ARObject.
         */
        enabled: boolean;

        /**
         * Drawables of different ARObjects might overlap. In this case, renderingOrder defines the rendering order of the Drawables of the ARObject.
         */
        renderingOrder: number;

        drawables: drawables;

        /**
         * Returns the current visibility state of the ARObject. An ARObject is defined visible when at least one of the ARObject's locations (geolocations or visual tracker) is projected onto a screen coordinate which is currently visible on the screen.
         */
        isVisible(): boolean;

        /**
         * Will be executed when any of the ARObject's Drawables have been clicked.
         */
        onClick: () => void;

        /**
         * The trigger will fire when the ARObject's visibility has changed from invisible to visible.
         */
        onEnterFieldOfVision: (targetName: string) => void;

        /**
         * Will be executed when the ARObject's visibility has changed from visible to invisible.
         */
        onExitFieldOfVision: (targetName: string) => void;
    }

    /**
     * BaseTracker is a supercalss for other classes and must not be directly instantiated by the developer.
     */
    class BaseTracker extends ARchitectObject {

        /**
         * The current activity state of the Tracker.
         */
        enabled: boolean;

        /**
         * Use this option to specify the physical height of a image target that is included in the .wtc file.
         */
        physicalTargetImageHeights: any;

        /**
         * The URI pointing to the referenced target collection. 
         */
        src: string;

        /**
         * Returns a boolean value indicating if the tracker has already been successfully loaded.
         */
        isLoaded(): boolean;

        /**
         * The trigger fires when the Tracker has been disabled by the system.
         */
        onDisabled: () => void;

        /**
         * The trigger fires when the Tracker's target collection could not be loaded. 
         */
        onError: () => void;

        /**
         * The trigger fires when the Tracker's target collection was successfully loaded. 
         */
        onLoaded: () => void;
    }

    /**
     * BoundingRectangle must not be directly instantiated by the developer.
     */
    class BoundingRectangle {

        /**
         * Returns the height of the Drawable2D, in SDUs.
         */
        getHeight(): number;

        /**
         * Returns the width of the Drawable2D, in SDUs.
         */
        getWidth(): number;
    }

    /**
     * A Circle drawable represents an ARObject as a plain circle.
     */
    class Circle extends Drawable2D {

        constructor(radius: number, options?: any);

        /**
         * The radius of the Circle, in SDUs. 
         */
        radius: number;

        /**
         * The Style object describing the style of the Circle.
         */
        style: Style;
    }

    /**
     * A Tracker represents a Target Collection which is created with the Target Management Tool.
     */
    class ClientTracker extends BaseTracker {

        constructor(src: string, options?: any);
    }

    /**
     * A Tracker represents a Target Collection which is created with the Target Management Tool.
     */
    class CloudTracker extends BaseTracker {

        constructor(token: string, targetCollectionId: string, options?: any);

        /**
         * The target collection id identifying a specific image target collection. 
         */
        targetCollectionID: string; 

        /**
         * The token identifying the user account where the target collection belongs to.
         */
        token: string;

        /**
         * Starts a single recognition process.
         */
        recognize(onRecognizedCallback: (recognized: boolean, recognitionData: any) => void, onErrorCallback?: (code: number, errorObject: any) => void): void;

        /**
         * Starts a continuous recognition session. 
         */
        startContinuousRecognition(interval: number, onRecognizedCallback: (recognized: boolean, recognitionData: any) => void, onErrorCallback?: (code: number, errorObject: any) => void, onInterruptionCallback?: (suggestedInterval: number) => void): void;

        /**
         * Stops an active continuous recognition session.
         */
        stopContinuousRecognition(): void;

        /**
         * The function that is called when a single recognition request failed. 
         */
        onRecognitionError: () => void;

        /**
         * The function that is called when a recognition request finished. 
         */
        onRecognized: () => void;
    }

    /**
     * A static class containing constant values.
     */
    module CONST {

        /**
         * The property holds various animation group types as string properties.
         */
        enum ANIMATION_GROUP_TYPE {
            PARALLEL,
            SEQUENTIAL
        }

        /**
         * Possible autofocus modes for the camera.
         */
        enum CAMERA_FOCUS_MODE {
            ONCE,
            CONTINUOUS
        }

        /**
         * Possible positions of the camera on the device.
         */
        enum CAMERA_POSITION {
            FRONT,
            BACK
        }

        /**
         * The different click behaviors available
         */
        enum CLICK_BEHAVIOR {
            CLICK,
            TOUCH_UP,
            TOUCH_DOWN
        }

        /**
         * The property holds various easing curve types as string properties.
         */
        enum EASING_CURVE_TYPE {
            LINEAR,
            EASE_IN_QUAD,
            EASE_OUT_QUAD,
            EASE_IN_OUT_QUAD,
            EASE_OUT_IN_QUAD,
            EASE_IN_CUBIC,
            EASE_OUT_CUBIC,
            EASE_IN_OUT_CUBIC,
            EASE_OUT_IN_CUBIC,
            EASE_IN_QUAT,
            EASE_OUT_QUAT,
            EASE_IN_OUT_QUAT,
            EASE_OUT_IN_QUAT,
            EASE_IN_QUINT,
            EASE_OUT_QUINT,
            EASE_IN_OUT_QUINT,
            EASE_OUT_IN_QUINT,
            EASE_IN_ELASTIC,
            EASE_OUT_ELASTIC,
            EASE_IN_OUT_ELASTIC,
            EASE_OUT_IN_ELASTIC,
            EASE_IN_BACK,
            EASE_OUT_BACK,
            EASE_IN_OUT_BACK,
            EASE_OUT_IN_BACK,
            EASE_IN_SINE,
            EASE_OUT_SINE,
            EASE_IN_OUT_SINE,
            EASE_OUT_IN_SINE,
            EASE_IN_EXPO,
            EASE_OUT_EXPO,
            EASE_IN_OUT_EXPO,
            EASE_OUT_IN_EXPO,
            EASE_IN_CIRC,
            EASE_OUT_CIRC,
            EASE_IN_OUT_CIRC,
            EASE_OUT_IN_CIRC,
            EASE_IN_BOUNCE,
            EASE_OUT_BOUNCE,
            EASE_IN_OUT_BOUNCE,
            EASE_OUT_IN_BOUNCE,
            EASE_IN_CURVE,
            EASE_OUT_CURVE
        }

        /**
         * The property holds various font styles as string properties.
         */
        enum FONT_STYLE {
            NORMAL,
            BOLD,
            ITALIC
        }

        /**
         * The property holds various horizontal anchors as int properties.
         */
        enum HORIZONTAL_ANCHOR {
            LEFT,
            CENTER,
            RIGHT
        }

        /**
         * The level of accuracy of a location reported back from the system. 
         */
        enum LOCATION_ACCURACY {
            HIGH,
            MEDIUM,
            LOW
        }

        /**
         * The property holds various states as int properties.
         */
        enum STATE {
            INITIALIZED,
            LOADING,
            LOADED,
            PLAYING,
            ERROR
        }

        /**
         * The value indicating that the altitude is unknown or cannot be fetched.
         */
        var UNKNOWN_ALTITUDE: number;

        /**
         * The property holds various vertical anchors as int properties.
         */
        enum VERTICAL_ANCHOR {
            TOP,
            MIDDLE,
            BOTTOM
        }
    }

    /**
     * The Singleton instance of the class will automatically be created on World startup and can be accessed via AR.context.
     */
    class context {

        /**
         * clickBehavior controls what should be considered a click.
         */
        static clickBehavior: string;

        static scene: {

            /**
             * The maximum distance at which objects are visible in the scene, in meters. 
             */
            cullingDistance: number;

            /**
             * The amount of scaling that is applied to all drawables in the scene. 
             */
            globalScale: number;

            /**
             * The distance, in meters, at which objects will keep their size on the screen even when the user moves further away.
             */
            maxScalingDistance: number;

            /**
             * The distance, in meters, at which objects will start to appear smaller on the screen when the user moves further away.
             */
            minScalingDistance: number;

            /**
             * The amount of scaling that is applied between minScalingDistance and maxScalingDistance. 
             */
            scalingFactor: number;
        }

        /**
         * Returns the Wikitude SDK version number. 
         */
        static versionNumber: string;
        static destroyAll():void;
        static onLocationChanged(lat:number, lon:number, alt:number, acc:number):void;
        static onScreenClick():void;
    }

    /**
     * A Drawable is the base class for any graphical representation of a GeoObject.
     */
    class Drawable extends ARchitectObject {

        /**
         * Flag to enable/disable the Drawable.
         */
        enabled: boolean;

        /**
         * Flag to enable/disable mirroring for this Drawable.
         */
        mirrored: boolean;

        rotate: {

            /**
             * Defines a rotation of the Drawable around the y-axis, specified in degrees.
             */
            heading: number;

            /**
             * Defines a rotation of the Drawable around the z-axis, specified in degrees.
             */
            roll: number;

            /**
             * Defines a rotation of the Drawable around the x-axis, specified in degrees.
             */
            tilt: number;
        }

        /**
         * When the Drawable is clicked, the system will trigger Drawable.onClick(ARObject).
         */
        onClick: (arObject: ARObject) => void;
    }

    /**
     * Drawable2D is a superclass for other classes and must not be directly instantiated by the developer.
     */
    class Drawable2D extends Drawable {

        /**
         * The horizontal anchor defines which pixel (in a horizontal pixel row) of the Drawable2D will be placed right at the screen position of the GeoObject represented by the Drawable2D.
         */
        horizontalAnchor: AR.CONST.HORIZONTAL_ANCHOR;

        /**
         * The horizontal offset to the calculated position of the Drawable2D, in SDUs.
         */
        offsetX: number;

        /**
         * The vertical offset to the calculated position of the Drawable2D, in SDUs. 
         */
        offsetY: number;

        /**
         * A value within the interval from 0.0 to 1.0 defining the opacity of the entire Drawable2D. 
         */
        opacity: number;

        /**
         * Defines the rotation of the Drawable, in degrees, with the rotation axis perpendicular to the screen plain.
         */
        rotation: number;

        /**
         * The scale factor for the Drawable2D. 
         */
        scale: number;

        /**
         * The vertical anchor defines which pixel (in a vertical pixel column) of the Drawable2D will be placed right at the screen position of the GeoObject represented by the Drawable2D.
         */
        verticalAnchor: AR.CONST.VERTICAL_ANCHOR;

        /**
         * If multiple Drawable2Ds are assigned to a certain GeoObject, the zOrder defines the drawing order of these Drawables. 
         */
        zOrder: number;

        /**
         * Returns the BoundingRectangle for this Drawable2D. 
         */
        getBoundingRectangle(): BoundingRectangle;
    }

    /**
     * Every instance of GeoLocation represents a location in the earth's three-dimensional space. 
     */
    class GeoLocation extends Location {

        constructor(latitude: number, longitude: number, altitude?: number);

        /**
         * The altitude of the location, in meters. 
         */
        altitude: number;

        /**
         * The latitude of the location, in decimal degrees.
         */
        latitude: number;

        /**
         * The longitude of the location, in decimal degrees.
         */
        longitude: number;

        /**
         * Returns the shortest distance ("as the crow flies") to the Location passed as an argument, ignoring any altitude property.
         */
        distanceTo(location: Location): number;

        /**
         * Returns the shortest distance ("as the crow flies") to the current location of the user, ignoring any altitude property.
         */
        distanceToUser(): number;
    }

    /**
     * A GeoObject represents a virtual object bound to specific locations in the earth's 3-dimensional space. 
     */
    class GeoObject extends ARObject {

        constructor(location: Location, options?: any);
        constructor(locations: Location[], options?: any);

        drawables: drawablesGeo;

        /**
         * The array of Locations of the GeoObject.
         */
        locations: Location[];
    }

    /**
     * The Singleton instance of the class will automatically be created on World startup and can be accessed via AR.hardware.
     */
    class hardware {

        static camera: {

            /**
             * Controls if the camera is active or not.
             */
            enabled: boolean;

            /**
             * Queries the capabilities of the device camera, returns informations about min and max zoom levels, supported camera positions, and focus modes.
             */
            features: any;

            /**
             * Turns the device flashlight on or off.
             */
            flashlight: boolean;

            /**
             * true if the device has a flashlight, false otherwise. 
             */
            flashlightAvailable: boolean;

            /**
             * Sets the autofocus mode of the camera.
             */
            focusMode: AR.CONST.CAMERA_FOCUS_MODE;

            /**
             * Sets the active camera position.
             */
            position: AR.CONST.CAMERA_POSITION;

            /**
             * Sets the zoom level of the camera. 
             */
            zoom: number;
        };

        static sensors: {
            
            /**
             * Controls if the sensors are active or not.
             */
            enabled: boolean;
        };
    }

    /**
     * A HTML-described representation of an ARObject as a plain circle.
     */
    class HtmlDrawable extends Drawable2D {

        constructor(content: any, width: number, options?: any);

        /**
         * The property controls if changes to the document.location property of the HTML document wrapped inside the HtmlDrawable will actually be visible.
         */
        allowDocumentLocationChanges: boolean;

        /**
         * The background color of the HtmlDrawable in case the background of the HTML body is set to transparent. 
         */
        backgroundColor: string;

        /**
         * The property controls if clicks on HtmlDrawables will also be forwarded to the HTML content inside the HtmlDrawable. 
         */
        clickThroughEnabled: boolean;

        /**
         * Plain HTML string that will be used to represent the drawable. 
         */
        html: string;

        /**
         * A URI pointing to HTML content that will be used to render the drawable.
         */
        uri: string;

        /**
         * The height of the viewport the HTML texture will be rendered on, in pixels. 
         */
        viewportHeight: number;

        /**
         * The width of the viewport the HTML texture will be rendered on, in pixels.
         */
        viewportWidth: number;

        /**
         * The width of the HTML drawable, in SDUs.
         */
        width: number;

        /**
         * Evaluates the passed javascript string in the context of the given HtmlDrawable.
         */
        evalJavaScript(js: string): void;

        /**
         * The trigger fires when the HtmlDrawable's document.location changes.
         */
        onDocumentLocationChanged: (uri: string) => void;

        /**
         * The trigger fires when the HtmlDrawable's content could not be loaded.
         */
        onError: () => void;

        /**
         * The trigger fires when the HtmlDrawable's content was successfully loaded.
         */
        onLoaded: () => void;
    }

    /**
     * ImageDrawable encapsulates an image to be used as visual representation of an ARObject. 
     */
    class ImageDrawable extends Drawable2D {

        constructor(imageResource: ImageResource, height: number, options?: any);

        /**
         * The ImageDrawable's height in SDUs. 
         */
        height: number;

        /**
         * The imageResource representing the ImageDrawable.
         */
        imageResource: ImageResource;
    }

    /**
     * mageRessource encapsulates an image file.
     */
    class ImageResource extends ARchitectObject {

        constructor(uri: string, options?: any);

        /**
         * Returns the height of the original image, in pixels. 
         */
        getHeight(): number;

        /**
         * Returns the uri to the ImageResource.
         */
        getUri(): string;

        /**
         * Returns the width of the original image, in pixels.
         */
        getWidth(): number;

        /**
         * Allows checking if the ImageResource has already been loaded successfully.
         */
        isLoaded(): boolean;

        /**
         * The trigger will fire when the Image file could not be loaded.
         */
        onError: () => void;

        /**
         * The trigger will fire when the Image file was loaded.
         */
        onLoaded: (width: number, height: number) => void;
    }

    /**
     * A Label drawable represents an ARObject as text.
     */
    class Label extends Drawable2D {

        constructor(text: string, height: number, options?: any);

        /**
         * The height of the Label, in SDUs.
         */
        height: number;

        /**
         * The Style to be passed.
         */
        style: Style;

        /**
         * The text of the label.
         */
        text: string;
    }

    /**
     * Location is an abstract class which describes a general location of a POI in the augmented scene.
     */
    class Location extends ARchitectObject {

        /**
         * Returns the shortest distance ("as the crow flies") to the Location passed as an argument, ignoring any altitude property.
         */
        distanceTo(location: Location): number;

        /**
         * Returns the shortest distance ("as the crow flies") to the current location of the user, ignoring any altitude property.
         */
        distanceToUser(): number;
    }

    /**
     * The Singleton instance of the logger class will automatically be created on World startup and can be accessed via AR.logger.
     */
    class logger {

        /**
         * Calling this function enables the debug console. 
         */
        static activateDebugMode(): void;

        /**
         * Will log a debug message on the console.
         */
        static debug(message: string): void;

        /**
         * Will log an error message to the console.
         */
        static error(message: string): void;

        /**
         * Will log an info message on the console.
         */
        static info(message: string): void;

        /**
         * Will log a warning message to the console.
         */
        static warning(message: string): void;
    }

    /**
     * A Model drawable represents an ARObject as a 3D Model.
     */
    class Model extends Drawable {

        constructor(uri: string, options?: any);

        scale: {

            /**
             * The scale in x-direction.
             */
            x: number;

            /**
             * The scale in y-direction.
             */
            y: number;

            /**
             * The scale in z-direction.
             */
            z: number;
        };

        translate: {

            /**
             * The horizontal offset to the calculated position of the Model, in SDUs.
             */
            x: number;

            /**
             * The vertical offset to the calculated position of the Model, in SDUs. 
             */
            y: number;

            /**
             * The depth-offset to the calculated position of the Model, in SDUs. 
             */
            z: number;
        };

        /**
         * The uri pointing to the model file. 
         */
        uri: string;

        /**
         * Allows checking if the Model has already been loaded successfully.
         */
        isLoaded(): boolean;

        /**
         * The trigger will fire when the Model file cannot be loaded.
         */
        onError: () => void;

        /**
         * The trigger will fire when the Model file is successfully loaded.
         */
        onLoaded: () => void;
    }

    /**
     * ModelAnimations allow the control of animations defined in a Model. 
     */
    class ModelAnimation extends Animation {

        constructor(model: Model, animationId: string, options?: any, duration?: number);
    }

    /**
     * Property Animations allow constant changes to a numeric value/property of an object.
     */
    class PropertyAnimation extends Animation {

        constructor(target: ARchitectObject, property: string, start: number, end: number, duration: number, easingCurve?: any, options?: any);
    }

    /**
     * The Singleton instance of the class will automatically be created on World startup and can be accessed via AR.radar.
     */
    class radar {

        /**
         * Specifies the background of the radar.
         */
        static background: ImageResource;

        /**
         * Specifies the horizontal position of the center of the actual radar area.
         */
        static centerX: number;

        /**
         * Specifies the vertical position of the center of the actual radar area. 
         */
        static centerY: number;

        /**
         * the DOM-element that contains the radar.
         */
        static container: HTMLElement;

        /**
         * enabled set to true enables the radar in the view, setting it to false disables it entirely.
         */
        static enabled: boolean;

        /**
         * Specifies the maximum distance in meters that is covered in the radar. 
         */
        static maxDistance: number;

        static northIndicator: {

            /**
             * Specifies the ImageResource used to indicate true north in the radar. 
             */
            image: ImageResource;

            /**
             * Specifies the radius of the north indicator. 
             */
            radius: number;
        };

        /**
         * Specifies the radius of the actual radar area. 
         */
        static radius: number;

        /**
         * Whenever the position of the DOM element containing the radar has changed, this method must be called. 
         */
        static notifyUpdateRadarPosition(): void;
    }

    /**
     * A relative location describes a location that is relative to either another Location, or the location of the user.
     */
    class RelativeLocation extends Location {

        constructor(location: Location, northing: number, easting: number, altitudeDelta?: number);

        /**
         * Specifies the number of meters the relative location is higher (positive) or lower (negative) than the referenced location.
         */
        altitudeDelta: number;

        /**
         * Specifies the number of meters the relative location is further east than the referenced location. 
         */
        easting: number;

        /**
         * The location which is used as the reference point. 
         */
        location: Location;

        /**
         * Specifies the number of meters the relative location is further north than the referenced location. 
         */
        northing: number;
    }

    /**
     * An instance of this class represents a sound file, specified by a URI.
     */
    class Sound extends ARchitectObject {

        constructor(uri: string, options?: any);

        /**
         * The state the Sound object is currently in. 
         */
        state: AR.CONST.STATE;

        /**
         * Initiate the loading process of the sound file. 
         */
        load(): void;

        /**
         * Pauses playing this sound file. 
         */
        pause(): void;

        /**
         * Plays the sound file.
         */
        play(loopTimes?: number): void;

        /**
         * Allows a paused sound file to resume playing from the time the file was paused. 
         */
        resume(): void;

        /**
         * Stops playing this sound file. 
         */
        stop(): void;

        /**
         * The trigger will fire when the Sound file changed its state to ERROR.
         */
        onError: () => void;

        /**
         * The trigger will fire when the Sound file changed its state from PLAYING to either LOADED or INITIALIZED.
         */
        onFinishedPlaying: () => void;

        /**
         * The trigger will fire when the Sound file changed its state from LOADING to LOADED.
         */
        onLoaded: () => void;
    }

    /**
     * Style options allow the customization of the appearance of various Drawables.
     */
    interface Style {

        /**
         * The background color of the Drawable.
         */
        backgroundColor: string;

        /**
         * The fill color of the Drawable. 
         */
        fillColor: string;

        /**
         * The font style of the text. 
         */
        fontStyle: AR.CONST.FONT_STYLE;

        /**
         * The fill color of the outline bounding the Drawable. 
         */
        outlineColor: string;

        /**
         * Defines the thickness of an outline which is printed from the boundary of the Drawable towards the inside.
         */
        outlineSize: number;

        /**
         * The text color.
         */
        textColor: string;
    }

    /**
     * A Trackable2DObject represents a virtual object bound to a specific target in a target collection. 
     */
    class Trackable2DObject extends ARObject {

        constructor(tracker: ClientTracker, targetName: string, options?: any);

        /**
         * The aspect ratio of the target, defined as width/height. 
         */
        aspectRatio: number;

        distanceToTarget: {

            /**
             * Function which is called when the distance between user and target changes. 
             */
            changed: (distance: number) => void;

            /**
             * Distance threshold (in millimeter) needed to trigger the change event.
             */
            changedThreshold: number;
        };

        snapToScreen: {

            /**
             * If set to true, all cam drawables will be rendered in a div, specified by the snapToScreen.snapContainer element. 
             */
            enabled: boolean;

            /**
             * The time that should pass by from when the onEnterFieldOfVision function was called and the attached drawables should snap to screen. 
             */
            enableDelayed: number;

            /**
             * If set to true, the associated cam drawables will snap to the screen when the onExitFieldOfVision trigger fires. 
             */
            enableOnExitFieldOfVision: boolean;

            /**
             * the DOM element that contains all cam drawables, associated with this Trackable2DObject if snap to screen is enabled. 
             */
            snapContainer: HTMLElement;

            /**
             * A function that should be called when a delayed snap to screen was interrupted because of the onExitFieldOfVision event.
             */
            onDelayedSnapInterruption: (interruptionTimestamp: number) => void;

            /**
             * A function that should be called when the underlaying ARObject snapped to the screen.
             */
            onSnappedToScreen: (element: HTMLElement) => void;
        };

        /**
         * The name of the referenced target inside the target collection.
         */
        targetName: string;

        /**
         * The Tracker which contains the target referenced by this Trackable2DObject. 
         */
        tracker: ClientTracker;
    }

    /**
     * VideoDrawable encapsulates a video to be used as visual representation of an ARObject. 
     */
    class VideoDrawable extends Drawable2D {

        constructor(uri: string, height: number, options?: any);

        /**
         * The VideoDrawable's height in SDUs. 
         */
        height: number;

        /**
         * Returns the URI the VideoDrawable is pointing to
         */
        getUri(): string;

        /**
         * Returns whether the VideoDrawable has the transparent flag set.
         */
        isTransparent(): boolean;

        /**
         * Pauses playing this video. 
         */
        pause(): void;

        /**
         * Plays the video.
         */
        play(loopTimes: number): void;

        /**
         * Allows a paused video to resume playing from the time the file was paused.
         */
        resume(): void;

        /**
         * Stops playing this video. 
         */
        stop(): void;

        /**
         * The trigger will fire when the Video file cannot be loaded or played.
         */
        onError: (msg: string) => void;

        /**
         * The trigger will fire just after the Video file finished playing.
         */
        onFinishedPlaying: () => void;

        /**
         * The trigger will fire when the Video file was loaded.
         */
        onLoaded: () => void;

        /**
         * The trigger will fire just before the Video file starts playing.
         */
        onPlaybackStarted: () => void;
    }

    interface drawables {
        /**
         * The Drawables which will be used to represent the ARObject in the camera view. 
         */
        cam: Drawable[];

        /**
         * Adds Drawables to the ARObject in the camera.
         */
        addCamDrawable(drawable: Drawable, position?: number): void;

        /**
         * Removes Drawables from the ARObject in the cam.
         */
        removeCamDrawable(drawable: Drawable): void;
        removeCamDrawable(drawables: Drawable[]): void;
        removeCamDrawable(position: number): void;

        removeIndicatorDrawable(drawable:Drawable): void;
        removeIndicatorDrawable(drawables:Drawable[]): void;
        removeIndicatorDrawable(position:number): void;

        removeRadarDrawable(drawable: Drawable): void;
        removeRadarDrawable(drawables: Drawable[]): void;
        removeRadarDrawable(position: number): void;        
    }

    interface drawablesGeo extends drawables {

        /**
         * The Drawable2Ds which will be used to indicate the direction where the GeoObject is located, in case the GeoObject is currently not visible on the screen.
         */
        indicator: Drawable2D; 

        /**
         * The Drawable2Ds which will be used to represent the ARObject in the radar.
         */
        radar: Drawable2D;
    }
} 