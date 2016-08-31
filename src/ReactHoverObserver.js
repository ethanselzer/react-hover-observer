import React, {Children, cloneElement, PropTypes} from 'react';
import assign from 'lodash.assign';
import noop from 'lodash.noop';
import omit from 'lodash.omit';

export default React.createClass({

    displayName: 'ReactHoverObserver',

    getDefaultProps() {
        return {
            hoverDelayInMs: 0,
            hoverOffDelayInMs: 0,
            onMouseEnter: noop,
            onMouseLeave: noop,
            onMouseOver: noop,
            onMouseOut: noop
        };
    },

    propTypes: {
        className: PropTypes.string,
        hoverDelayInMs: PropTypes.number,
        hoverOffDelayInMs: PropTypes.number,
        onMouseEnter: PropTypes.func,
        onMouseLeave: PropTypes.func,
        onMouseOver: PropTypes.func,
        onMouseOut: PropTypes.func
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

    setIsHovering() {
        clearTimeout(this.hoverOffScheduleId);

        this.hoverScheduleId = setTimeout(() => {
            this.setState({
                isHovering: true
            });
        }, this.props.hoverDelayInMs);
    },

    unsetIsHovering() {
        clearTimeout(this.hoverScheduleId);

        this.hoverOffScheduleId = setTimeout(() => {
            this.setState({
                isHovering: false
            });
        }, this.props.hoverOffDelayInMs);
    },

    renderChildrenWithProps(children, props) {
        return Children.map(children, (child) => {
            return cloneElement(child, props);
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
                'onMouseEnter',
                'onMouseLeave',
                'onMouseOver',
                'onMouseOut'
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
