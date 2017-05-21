# react-hover-observer

A React component that notifies its children of hover interactions.

Optionally observe mouseenter, mouseleave, mouseover, and mouseout events.

Supports delayed hover and hover-off, which can help reduce unintentional triggering.

## Status

[![CircleCI](https://img.shields.io/circleci/project/github/ethanselzer/react-hover-observer.svg)](https://circleci.com/gh/ethanselzer/react-hover-observer)
[![Coverage Status](https://coveralls.io/repos/github/ethanselzer/react-hover-observer/badge.svg?branch=master)](https://coveralls.io/github/ethanselzer/react-hover-observer?branch=master)
[![npm](https://img.shields.io/npm/v/react-hover-observer.svg)](https://www.npmjs.com/package/react-hover-observer)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](https://opensource.org/licenses/MIT)

## Demo
Experiment with this editable [example on CodePen](https://codepen.io/ethanselzer/pen/XRyJgq).

## Related Project
For mouse or touch position monitoring, please consider [react-cursor-position](https://github.com/ethanselzer/react-cursor-position). It has a similar interface to this project, and can be used in combination with it.

## Installation

```sh
npm install --save react-hover-observer
```

## Usage

```JSX
import ReactHoverObserver from 'react-hover-observer';

export default () => (
    <ReactHoverObserver>
        <YourChildComponent />
    </ReactHoverObserver>
);
```

Each child component of ReactHoverObserver receives a Boolean prop named `isHovering`.

react-hover-observer wraps its children in a div, which is the boundary for triggering hover events.

### Props API

`className` : String [optional] - A CSS class to be applied to the div rendered by react-hover-observer.

`hoverDelayInMs` : Number [optional] - Milliseconds to delay hover trigger. Defaults to zero.

`hoverOffDelayInMs` : Number [optional] - Milliseconds to delay hover-off trigger. Defaults to zero.

`onHoverChanged`: Function [optional] - Called with named argument `isHovering` when isHovering is set or unset.

`shouldDecorateChildren` : Boolean [optional] - Defaults to true. Optionally suppress decoration of child components by setting this prop false.

`onMouseEnter` : Function [optional] - Defaults to set isHovering.

`onMouseLeave` : Function [optional] - Defaults to unsetting isHovering.

`onMouseOver` : Function [optional]

`onMouseOut` : Function [optional]

Each of the previous four observer functions receives a prameter of type Object with the following properties:

* `e` : Object - The browser event object (React synthetic event).

* `setIsHovering` : Function - Call this function to set `isHovering` to true.

* `unsetIsHovering` : Function - Call this function to set `isHovering` to false.

See [this example](https://codepen.io/ethanselzer/pen/KmrywY) for more detail and explanation.

### onMouseEnter/onMouseLeave versus onMouseOver/onMouseOut

`onMouseEnter` and `onMouseLeave` *are not* triggered by hover events bubbling up from child elements.

`onMouseOver` and `onMouseOut` *are* triggered by hover events bubbling up from child elements.

The behavior is determined by mouse event Web standards.
See the [docs at MDN](https://developer.mozilla.org/en-US/docs/Web/Events/mouseenter) for more.

## Support

Please [open an issue](https://github.com/ethanselzer/react-hover-observer/issues).

## Development

```ssh
git clone https://github.com/ethanselzer/react-hover-observer.git
cd react-hover-observer
yarn
```
See available commands:
```ssh
npm run
```

## Contributing

Please contribute using [Github Flow](https://guides.github.com/introduction/flow/). Create a branch,
add commits, and [open a pull request](https://github.com/ethanselzer/react-hover-observer/compare/).

## License

MIT
