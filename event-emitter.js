/**
 * A TypeScript transscription from:
 * @see https://github.com/Olical/EventEmitter/blob/master/EventEmitter.js
 * @author Arne Schubert <atd.schubert@gmail.com>
 */
var com;
(function (com) {
    var atdSchubert;
    (function (atdSchubert) {
        var eventEmitter;
        (function (eventEmitter) {
            'use strict';
            /**
             * Class for managing events.
             * Can be extended to provide event functionality in other classes.
             *
             * @class EventEmitter Manages event registering and emitting.
             */
            var EventEmitter = (function () {
                function EventEmitter() {
                }
                /**
                 * Returns the listener array for the specified event.
                 * Will initialise the event object and listener arrays if required.
                 * Will return an object if you use a regex search. The object contains keys for each matched event.
                 * So /ba[rz]/ might return an object containing bar and baz. But only if you have either defined them with
                 * defineEvent or added some listeners to them.
                 * Each property in the object response is an array of listener functions.
                 *
                 * @param {String|RegExp} evt Name of the event to return the listeners from.
                 * @return {Function[]|Object} All listener functions for the event.
                 */
                /* tslint:disable:no-any */
                EventEmitter.prototype.getListeners = function (evt) {
                    var events = this._getEvents(), response, key, evtName = typeof evt === 'string' ? evt : undefined;
                    // Return a concatenated array of all matching events if
                    // the selector is a regular expression.
                    if (evt instanceof RegExp) {
                        response = {};
                        for (key in events) {
                            if (events.hasOwnProperty(key) && evt.test(key)) {
                                response[key] = events[key];
                            }
                        }
                    }
                    else {
                        response = events[evtName] || (events[evtName] = []);
                    }
                    return response;
                };
                /**
                 * Takes a list of listener objects and flattens it into a list of listener functions.
                 *
                 * @param {Object[]} listeners Raw listener objects.
                 * @return {Function[]} Just the listener functions.
                 */
                EventEmitter.prototype.flattenListeners = function (listeners) {
                    var flatListeners = [], i;
                    for (i = 0; i < listeners.length; i += 1) {
                        flatListeners.push(listeners[i].listener);
                    }
                    return flatListeners;
                };
                /**
                 * Fetches the requested listeners via getListeners but will always return the results inside an object.
                 * This is mainly for internal use but others may find it useful.
                 *
                 * @param {String|RegExp} evt Name of the event to return the listeners from.
                 * @return {Object} All listener functions for an event in an object.
                 */
                EventEmitter.prototype.getListenersAsObject = function (evt) {
                    var listeners = this.getListeners(evt), response, evtName = typeof evt === 'string' ? evt : undefined;
                    if (listeners instanceof Array) {
                        response = {};
                        response[evtName] = listeners;
                    }
                    return response || listeners;
                };
                /**
                 * Adds a listener function to the specified event.
                 * The listener will not be added if it is a duplicate.
                 * If the listener returns true then it will be removed after it is called.
                 * If you pass a regular expression as the event name then the listener will be added to all events that match it.
                 *
                 * @param {String|RegExp} evt Name of the event to attach the listener to.
                 * @param {Function} listenerOrFn Method to be called when the event is emitted. If the function returns true then it
                 * will be removed after calling.
                 * @return {Object} Current instance of EventEmitter for chaining.
                 */
                EventEmitter.prototype.addListener = function (evt, listenerOrFn) {
                    var listeners = this.getListenersAsObject(evt), 
                    // listenerIsWrapped: boolean = typeof listenerFn === 'object',
                    listener = typeof listenerOrFn === 'object' ? listenerOrFn : { listener: listenerOrFn, once: false }, listenerFn = typeof listenerOrFn === 'function' ? listenerOrFn : listenerOrFn.listener, key;
                    for (key in listeners) {
                        if (listeners.hasOwnProperty(key) && this.indexOfListener(listeners[key], listenerFn) === -1) {
                            listeners[key].push(listener);
                        }
                    }
                    return this;
                };
                ;
                /**
                 * Alias of addListener
                 */
                EventEmitter.prototype.on = function (evt, listener) {
                    return this.addListener(evt, listener);
                };
                ;
                /**
                 * Semi-alias of addListener. It will add a listener that will be
                 * automatically removed after its first execution.
                 *
                 * @param {String|RegExp} evt Name of the event to attach the listener to.
                 * @param {Function} listener Method to be called when the event is emitted. If the function returns true then
                 * it will be removed after calling.
                 * @return {Object} Current instance of EventEmitter for chaining.
                 */
                EventEmitter.prototype.addOnceListener = function (evt, listener) {
                    return this.addListener(evt, {
                        listener: listener,
                        once: true
                    });
                };
                /**
                 * Alias of addOnceListener.
                 */
                EventEmitter.prototype.once = function (evt, listener) {
                    return this.addOnceListener(evt, listener);
                };
                /**
                 * Defines an event name. This is required if you want to use a regex to add a listener to multiple events at
                 * once. If you don't do this then how do you expect it to know what event to add to? Should it just add to
                 * every possible match for a regex? No. That is scary and bad.
                 * You need to tell it what event names should be matched by a regex.
                 *
                 * @param {String} evt Name of the event to create.
                 * @return {Object} Current instance of EventEmitter for chaining.
                 */
                EventEmitter.prototype.defineEvent = function (evt) {
                    this.getListeners(evt);
                    return this;
                };
                /**
                 * Uses defineEvent to define multiple events.
                 *
                 * @param {String[]} evts An array of event names to define.
                 * @return {Object} Current instance of EventEmitter for chaining.
                 */
                EventEmitter.prototype.defineEvents = function (evts) {
                    for (var i = 0; i < evts.length; i += 1) {
                        this.defineEvent(evts[i]);
                    }
                    return this;
                };
                /**
                 * Removes a listener function from the specified event.
                 * When passed a regular expression as the event name, it will remove the listener from all events that match it.
                 *
                 * @param {String|RegExp} evt Name of the event to remove the listener from.
                 * @param {Function} listenerOrFn Method to remove from the event.
                 * @return {Object} Current instance of EventEmitter for chaining.
                 */
                EventEmitter.prototype.removeListener = function (evt, listenerOrFn) {
                    var listeners = this.getListenersAsObject(evt), index, key, listenerFn = typeof listenerOrFn === 'function' ? listenerOrFn : listenerOrFn.listener;
                    for (key in listeners) {
                        if (listeners.hasOwnProperty(key)) {
                            index = this.indexOfListener(listeners[key], listenerFn);
                            if (index !== -1) {
                                listeners[key].splice(index, 1);
                            }
                        }
                    }
                    return this;
                };
                /**
                 * Alias of removeListener
                 */
                EventEmitter.prototype.off = function (evt, listenerOrFn) {
                    return this.removeListener(evt, listenerOrFn);
                };
                /**
                 * Adds listeners in bulk using the manipulateListeners method.
                 * If you pass an object as the second argument you can add to multiple events at once. The object should
                 * contain key value pairs of events and listeners or listener arrays. You can also pass it an event name and an
                 * array of listeners to be added.
                 * You can also pass it a regular expression to add the array of listeners to all events that match it.
                 * Yeah, this function does quite a bit. That's probably a bad thing.
                 *
                 * @param {String|Object|RegExp} evt An event name if you will pass an array of listeners next. An object if you
                 * wish to add to multiple events at once.
                 * @param {Function[]} [listeners] An optional array of listener functions to add.
                 * @return {Object} Current instance of EventEmitter for chaining.
                 */
                EventEmitter.prototype.addListeners = function (evt, listeners) {
                    // Pass through to manipulateListeners
                    return this.manipulateListeners(false, evt, listeners);
                };
                /**
                 * Removes listeners in bulk using the manipulateListeners method.
                 * If you pass an object as the second argument you can remove from multiple events at once. The object should
                 * contain key value pairs of events and listeners or listener arrays.
                 * You can also pass it an event name and an array of listeners to be removed.
                 * You can also pass it a regular expression to remove the listeners from all events that match it.
                 *
                 * @param {String|Object|RegExp} evt An event name if you will pass an array of listeners next. An object if you
                 * wish to remove from multiple events at once.
                 * @param {Function[]} [listeners] An optional array of listener functions to remove.
                 * @return {Object} Current instance of EventEmitter for chaining.
                 */
                EventEmitter.prototype.removeListeners = function (evt, listeners) {
                    // Pass through to manipulateListeners
                    return this.manipulateListeners(true, evt, listeners);
                };
                ;
                /**
                 * Edits listeners in bulk. The addListeners and removeListeners methods both use this to do their job. You
                 * should really use those instead, this is a little lower level.
                 * The first argument will determine if the listeners are removed (true) or added (false).
                 * If you pass an object as the second argument you can add/remove from multiple events at once. The object
                 * should contain key value pairs of events and listeners or listener arrays.
                 * You can also pass it an event name and an array of listeners to be added/removed.
                 * You can also pass it a regular expression to manipulate the listeners of all events that match it.
                 *
                 * @param {Boolean} remove True if you want to remove listeners, false if you want to add.
                 * @param {String|Object|RegExp} evt An event name if you will pass an array of listeners next. An object if you
                 * wish to add/remove from multiple events at once.
                 * @param {Function[]} [listeners] An optional array of listener functions to add/remove.
                 * @return {Object} Current instance of EventEmitter for chaining.
                 */
                EventEmitter.prototype.manipulateListeners = function (remove, evt, listeners) {
                    var hash, i, value, single = remove ? this.removeListener : this.addListener, multiple = remove ? this.removeListeners : this.addListeners;
                    // If evt is an object then pass each of its properties to this method
                    if (typeof evt === 'object' && !(evt instanceof RegExp)) {
                        for (hash in evt) {
                            /* tslint:disable:no-conditional-assignment */
                            if (evt.hasOwnProperty(hash) && (value = evt[hash])) {
                                /* tslint:enable:no-conditional-assignment */
                                // Pass the single listener straight through to the singular method
                                if (typeof value === 'function') {
                                    single.call(this, hash, value);
                                }
                                else {
                                    // Otherwise pass back to the multiple function
                                    multiple.call(this, hash, value);
                                }
                            }
                        }
                    }
                    else {
                        // So evt must be a string
                        // And listeners must be an array of listeners
                        // Loop over it and pass each one to the multiple method
                        i = listeners.length;
                        while (i--) {
                            single.call(this, evt, listeners[i]);
                        }
                    }
                    return this;
                };
                /**
                 * Removes all listeners from a specified event.
                 * If you do not specify an event then all listeners will be removed.
                 * That means every event will be emptied.
                 * You can also pass a regex to remove all events that match it.
                 *
                 * @param {String|RegExp} [evt] Optional name of the event to remove all listeners for. Will remove from every
                 * event if not passed.
                 * @return {Object} Current instance of EventEmitter for chaining.
                 */
                EventEmitter.prototype.removeEvent = function (evt) {
                    var type = typeof evt, events = this._getEvents(), key, evtName = typeof evt === 'string' ? evt : undefined;
                    // Remove different things depending on the state of evt
                    if (type === 'string') {
                        // Remove all listeners for the specified event
                        delete events[evtName];
                    }
                    else if (evt instanceof RegExp) {
                        // Remove all events matching the regex.
                        for (key in events) {
                            if (events.hasOwnProperty(key) && evt.test(key)) {
                                delete events[key];
                            }
                        }
                    }
                    else {
                        // Remove all listeners in all events
                        this._events = {};
                    }
                    return this;
                };
                ;
                /**
                 * Alias of removeEvent.
                 *
                 * Added to mirror the node API.
                 */
                EventEmitter.prototype.removeAllListeners = function (evt) {
                    return this.removeEvent(evt);
                };
                /**
                 * Emits an event of your choice.
                 * When emitted, every listener attached to that event will be executed.
                 * If you pass the optional argument array then those arguments will be passed to every listener upon execution.
                 * Because it uses `apply`, your array of arguments will be passed as if you wrote them out separately.
                 * So they will not arrive within the array on the other side, they will be separate.
                 * You can also pass a regular expression to emit to all events that match it.
                 *
                 * @param {String|RegExp} evt Name of the event to emit and execute listeners for.
                 * @param {Array} [args] Optional array of arguments to be passed to each listener.
                 * @return {Object} Current instance of EventEmitter for chaining.
                 */
                EventEmitter.prototype.emitEvent = function (evt, args) {
                    var listenersMap = this.getListenersAsObject(evt), listeners, listener, i, key, response;
                    for (key in listenersMap) {
                        if (listenersMap.hasOwnProperty(key)) {
                            listeners = listenersMap[key].slice(0);
                            i = listeners.length;
                            while (i--) {
                                // If the listener returns true then it shall be removed from the event
                                // The function is executed either with a basic call or an apply if there is an args array
                                listener = listeners[i];
                                if (listener.once === true) {
                                    this.removeListener(evt, listener.listener);
                                }
                                response = listener.listener.apply(this, args || []);
                                if (response === this._getOnceReturnValue()) {
                                    this.removeListener(evt, listener.listener);
                                }
                            }
                        }
                    }
                    return this;
                };
                /**
                 * Alias of emitEvent
                 */
                EventEmitter.prototype.trigger = function (evt, args) {
                    return this.emitEvent(evt, args);
                };
                /**
                 * Subtly different from emitEvent in that it will pass its arguments on to the listeners, as opposed to taking
                 * a single array of arguments to pass on.
                 * As with emitEvent, you can pass a regex in place of the event name to emit to all events that match it.
                 *
                 * @param {String|RegExp} evt Name of the event to emit and execute listeners for.
                 * @param {...*} args Optional additional arguments to be passed to each listener.
                 * @return {Object} Current instance of EventEmitter for chaining.
                 */
                EventEmitter.prototype.emit = function (evt) {
                    var args = [];
                    for (var _i = 1; _i < arguments.length; _i++) {
                        args[_i - 1] = arguments[_i];
                    }
                    return this.emitEvent(evt, args);
                };
                /**
                 * Sets the current value to check against when executing listeners. If a
                 * listeners return value matches the one set here then it will be removed
                 * after execution. This value defaults to true.
                 *
                 * @param {*} value The new value to check for when executing listeners.
                 * @return {Object} Current instance of EventEmitter for chaining.
                 */
                EventEmitter.prototype.setOnceReturnValue = function (value) {
                    this._onceReturnValue = value;
                    return this;
                };
                /**
                 * Fetches the current value to check against when executing listeners. If
                 * the listeners return value matches this one then it should be removed
                 * automatically. It will return true by default.
                 *
                 * @return {*|Boolean} The current value to check for or the default, true.
                 * @api private
                 */
                EventEmitter.prototype._getOnceReturnValue = function () {
                    if (this.hasOwnProperty('_onceReturnValue')) {
                        return this._onceReturnValue;
                    }
                    else {
                        return true;
                    }
                };
                /**
                 * Fetches the events object and creates one if required.
                 *
                 * @return {Object} The events storage object.
                 * @api private
                 */
                EventEmitter.prototype._getEvents = function () {
                    return this._events || (this._events = {});
                };
                /**
                 * Finds the index of the listener for the event in its storage array.
                 *
                 * @param {Function[]} listeners Array of listeners to search through.
                 * @param {Function} listener Method to look for.
                 * @return {Number} Index of the specified listener, -1 if not found
                 * @api private
                 */
                EventEmitter.prototype.indexOfListener = function (listeners, listener) {
                    var i = listeners.length;
                    while (i--) {
                        if (listeners[i].listener === listener) {
                            return i;
                        }
                    }
                    return -1;
                };
                return EventEmitter;
            })();
            eventEmitter.EventEmitter = EventEmitter;
        })(eventEmitter = atdSchubert.eventEmitter || (atdSchubert.eventEmitter = {}));
    })(atdSchubert = com.atdSchubert || (com.atdSchubert = {}));
})(com || (com = {}));
/// <reference path="ts/event-emitter.ts" /> 
