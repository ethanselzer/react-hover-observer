import React, {Children, cloneElement} from 'react';
import PropTypes from 'prop-types';
import assign from 'object-assign';
import omit from 'object.omit';

import noop from './utils/noop';

export default class extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            isHovering: false
        };

        this.onMouseEnter = this.onMouseEnter.bind(this);
        this.onMouseLeave = this.onMouseLeave.bind(this);
        this.onMouseOver = this.onMouseOver.bind(this);
        this.onMouseOut = this.onMouseOut.bind(this);
        this.setIsHovering = this.setIsHovering.bind(this);
        this.unsetIsHovering = this.unsetIsHovering.bind(this);
        this.componentWillUnmount = this.componentWillUnmount.bind(this);

        this.timerIds = [];
    }
    static displayName = 'ReactHoverObserver';

    static defaultProps = {
        hoverDelayInMs: 0,
        hoverOffDelayInMs: 0,
        onHoverChanged: noop,
        onMouseEnter: noop,
        onMouseLeave: noop,
        onMouseOver: noop,
        onMouseOut: noop,
        shouldDecorateChildren: true
    };

    static propTypes = {
        className: PropTypes.string,
        hoverDelayInMs: PropTypes.number,
        hoverOffDelayInMs: PropTypes.number,
        onHoverChanged: PropTypes.func,
        onMouseEnter: PropTypes.func,
        onMouseLeave: PropTypes.func,
        onMouseOver: PropTypes.func,
        onMouseOut: PropTypes.func,
        shouldDecorateChildren: PropTypes.bool
    };

    onMouseEnter(e) {
        this.props.onMouseEnter({
            e,
            setIsHovering: this.setIsHovering,
            unsetIsHovering: this.unsetIsHovering
        });
    }

    onMouseLeave(e) {
        this.props.onMouseLeave({
            e,
            setIsHovering: this.setIsHovering,
            unsetIsHovering: this.unsetIsHovering
        });
    }

    onMouseOver(e) {
        this.props.onMouseOver({
            e,
            setIsHovering: this.setIsHovering,
            unsetIsHovering: this.unsetIsHovering
        });
    }

    onMouseOut(e) {
        this.props.onMouseOut({
            e,
            setIsHovering: this.setIsHovering,
            unsetIsHovering: this.unsetIsHovering
        });
    }

    componentWillUnmount() {
        this.clearTimers();
    }

    setIsHovering() {
        this.clearTimers();

        const hoverScheduleId = setTimeout(() => {
            const newState = { isHovering: true };
            this.setState(newState, () => {
                this.props.onHoverChanged(newState)
            });
        }, this.props.hoverDelayInMs);

        this.timerIds.push(hoverScheduleId);
    }

    unsetIsHovering() {
        this.clearTimers();

        const hoverOffScheduleId = setTimeout(() => {
            const newState = { isHovering: false };
            this.setState(newState, () => {
                this.props.onHoverChanged(newState);
            });
        }, this.props.hoverOffDelayInMs);

        this.timerIds.push(hoverOffScheduleId);
    }

    clearTimers() {
        const ids = this.timerIds;
        while (ids.length) {
            window.clearTimeout(ids.pop());
        }
    }

    isReactComponent(reactElement) {
        return typeof reactElement.type === 'function';
    }

    shouldDecorateChild(child) {
        return this.isReactComponent(child) && this.props.shouldDecorateChildren;
    }

    decorateChild(child, props) {
        return cloneElement(child, props);
    }

    renderChildrenWithProps(children, props) {
        return Children.map(children, (child) => {
            return this.shouldDecorateChild(child) ? this.decorateChild(child, props) : child;
        });
    }

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
};
