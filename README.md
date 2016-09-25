# react-hover-observer

A React component that notifies its children of hover interactions.

Optionally observe mouseenter, mouseleave, mouseover, and mouseout events.

Supports delaying hover and hover-off, which can help reduce unintentional triggering.

## Installation

```sh
npm install --save react-hover-observer
```

## Usage

Intended as a primitive for composing features that require notification of
hover events.

```JSX
import ReactHoverObserver from 'react-hover-observer';

export default () => (
    <ReactHoverObserver {{...
        onMouseEnter: ({ setIsHovering }) => setIsHovering(),
        onMouseLeave: ({ unsetIsHovering }) => unsetIsHovering()
    }}>
        Add your components here!
    </ReactHoverObserver>
);
```

Each child component receives a Boolean prop named `isHovering`.

react-hover-observer wraps its children in a div, which is the boundary
for triggering hover events.

### Props API

`className` : String [optional] - A CSS class to be applied to the div rendered by react-hover-observer.

`hoverDelayInMs` : Number [optional] - Milliseconds to delay hover trigger. Defaults to zero.

`hoverOffDelayInMs` : Number [optional] - Milliseconds to delay hover-off trigger. Defaults to zero.

`onHoverChanged`: Function [optional] - Called with named argument `isHovering` when isHovering is set or unset.

`shouldDecorateChildren` : Boolean [optional] - Defaults to true. Optionally suppress decoration of child components by
setting this prop false.

One or more of the following observer functions is required. There is not a default setting.

`onMouseEnter` : Function

`onMouseLeave` : Function

`onMouseOver` : Function

`onMouseOut` : Function

Each observer function receives three named parameters: `({ event, setIsHovering, unsetIsHovering })`.

* `event` : Object - The browser event object (React synthetic event).

* `setIsHovering` : Function - Call this function to set the state of `isHovering` to true.

* `unsetIsHovering` : Function - Call this function to set the state of `isHovering` to false.

### onMouseEnter/onMouseLeave versus onMouseOver/onMouseOut

`onMouseEnter` and `onMouseLeave` *are not* triggered by hover events bubbling up from child elements.

`onMouseOver` and `onMouseOut` *are* triggered by hover events bubbling up from child elements.

The behavior is determined by browser implementation of `mouseenter`/`mouseleave` and `mouseover`/`mouseout`.
See the [docs at MDN](https://developer.mozilla.org/en-US/docs/Web/Events/mouseenter) for more.

## Support

Please [open an issue](https://github.com/ethanselzer/react-cursor-position/issues).

## Development

```ssh
git clone https://github.com/ethanselzer/react-cursor-position.git
cd react-cursor-position
npm install
```
See available commands:
```ssh
npm run
```

## Contributing

Please contribute using [Github Flow](https://guides.github.com/introduction/flow/). Create a branch,
add commits, and [open a pull request](https://github.com/ethanselzer/react-cursor-position/compare/).

## License

MIT
