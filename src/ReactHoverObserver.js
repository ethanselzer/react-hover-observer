import React, {Children, cloneElement, PropTypes} from 'react';
import assign from 'object-assign';
import omit from 'object.omit';

import noop from './utils/noop';

export default React.createClass({

    displayName: 'ReactHoverObserver',

    timerIds: [],

    getDefaultProps() {
        return {
            hoverDelayInMs: 0,
            hoverOffDelayInMs: 0,
            onHoverChanged: noop,
            onMouseEnter: noop,
            onMouseLeave: noop,
            onMouseOver: noop,
            onMouseOut: noop,
            shouldDecorateChildren: true
        };
    },

    propTypes: {
        className: PropTypes.string,
        hoverDelayInMs: PropTypes.number,
        hoverOffDelayInMs: PropTypes.number,
        onHoverChanged: PropTypes.func,
        onMouseEnter: PropTypes.func,
        onMouseLeave: PropTypes.func,
        onMouseOver: PropTypes.func,
        onMouseOut: PropTypes.func,
        shouldDecorateChildren: PropTypes.bool
    },

    getInitialState() {
        return {
            isHovering: false
        };
    },

    onMouseEnter(e) {
        this.props.onMouseEnter({
            e,
            setIsHovering: this.setIsHovering,
            unsetIsHovering: this.unsetIsHovering
        });
    },

    onMouseLeave(e) {
        this.props.onMouseLeave({
            e,
            setIsHovering: this.setIsHovering,
            unsetIsHovering: this.unsetIsHovering
        });
    },

    onMouseOver(e) {
        this.props.onMouseOver({
            e,
            setIsHovering: this.setIsHovering,
            unsetIsHovering: this.unsetIsHovering
        });
    },

    onMouseOut(e) {
        this.props.onMouseOut({
            e,
            setIsHovering: this.setIsHovering,
            unsetIsHovering: this.unsetIsHovering
        });
    },

    componentWillUnmount() {
        this.clearTimers();
    },

    setIsHovering() {
        this.clearTimers();

        const hoverScheduleId = setTimeout(() => {
            const newState = { isHovering: true };
            this.setState(newState, () => {
                this.props.onHoverChanged(newState)
            });
        }, this.props.hoverDelayInMs);

        this.timerIds.push(hoverScheduleId);
    },

    unsetIsHovering() {
        this.clearTimers();

        const hoverOffScheduleId = setTimeout(() => {
            const newState = { isHovering: false };
            this.setState(newState, () => {
                this.props.onHoverChanged(newState);
            });
        }, this.props.hoverOffDelayInMs);

        this.timerIds.push(hoverOffScheduleId);
    },

    clearTimers() {
        const ids = this.timerIds;
        while (ids.length) {
            window.clearTimeout(ids.pop());
        }
    },

    isReactComponent(reactElement) {
        return typeof reactElement.type === 'function';
    },

    shouldDecorateChild(child) {
        return this.isReactComponent(child) && this.props.shouldDecorateChildren;
    },

    decorateChild(child, props) {
        return cloneElement(child, props);
    },

    renderChildrenWithProps(children, props) {
        return Children.map(children, (child) => {
            return this.shouldDecorateChild(child) ? this.decorateChild(child, props) : child;
        });
    },

    render() {
        const { children, className } = this.props;
        const childProps = assign(
            {},
            { isHovering: this.state.isHovering },
            omit(this.props, [
                'children',
                'className',
                'hoverDelayInMs',
                'hoverOffDelayInMs',
                'onHoverChanged',
                'onMouseEnter',
                'onMouseLeave',
                'onMouseOver',
                'onMouseOut',
                'shouldDecorateChildren'
            ])
        );

        return (
            <div { ...{
                className,
                onMouseEnter: this.onMouseEnter,
                onMouseLeave: this.onMouseLeave,
                onMouseOver: this.onMouseOver,
                onMouseOut: this.onMouseOut
            }}>
                { this.renderChildrenWithProps(children, childProps) }
            </div>
        );
    }
});
