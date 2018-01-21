import React from 'react';
import isFunction from 'lodash.isfunction';
import {shallow, mount, render} from 'enzyme';
import {expect} from 'chai';
import sinon from 'sinon';

import ReactHoverObserver from '../src/ReactHoverObserver';
import GenericSpanComponent from './support/GenericSpanComponent';
import noop from '../src/utils/noop';


describe('ReactHoverObserver', () => {
    let reactHoverObserver = shallow(<ReactHoverObserver />);

    beforeEach(() => {
        reactHoverObserver = shallow(<ReactHoverObserver/>);
    });

    it('has the display name ReactHoverObserver', () => {
        expect(reactHoverObserver.instance().constructor.displayName).to.equal('ReactHoverObserver');
    });

    it('has correct initial state', () => {
        expect(reactHoverObserver.state()).to.deep.equal({
            isHovering: false
        });
    });

    it('has correct default props', () => {
        const {
            constructor: {
                defaultProps
            }
        } = reactHoverObserver.instance();
        const onMouseEnterSpy = sinon.spy();
        const onMouseLeaveSpy = sinon.spy();

        defaultProps.onMouseEnter({ setIsHovering: onMouseEnterSpy });
        defaultProps.onMouseLeave({ unsetIsHovering: onMouseLeaveSpy });

        expect(defaultProps.hoverDelayInMs).to.equal(0);
        expect(defaultProps.hoverOffDelayInMs).to.equal(0);
        expect(defaultProps.onHoverChanged).to.equal(noop);
        expect(onMouseEnterSpy.calledOnce).to.be.true;
        expect(onMouseLeaveSpy.calledOnce).to.be.true;
        expect(defaultProps.onMouseOver).to.equal(noop);
        expect(defaultProps.onMouseOut).to.equal(noop);
        expect(defaultProps.shouldDecorateChildren).to.be.true;
    });

    it('renders a single HTML div element', () => {
        expect(reactHoverObserver.type()).to.equal('div');
    });

    it('decorates child components with isHovering prop', (done) =>  {
        const renderedTree = getRenderedComponentTree({ onMouseEnter });
        const el = renderedTree.find('div');

        el.simulate('mouseEnter');

        function onMouseEnter({ setIsHovering }) {
            setIsHovering();

            setTimeout(() => {
                renderedTree.update();
                const childComponent = renderedTree.find(GenericSpanComponent);
                expect(childComponent.props()).to.deep.equal({ isHovering: true });
                done();
            }, 0);
        }
    });

    it('does not decorate child DOM nodes with isHovering prop', (done) => {
        const renderedTree = getRenderedComponentTree({ onMouseEnter });
        const el = renderedTree.find('div');

        el.simulate('mouseEnter');

        function onMouseEnter({ setIsHovering }) {
            setIsHovering();
            setTimeout(() => {
                expect(renderedTree.find('hr').props()).to.be.empty
                done();
            }, 0);
        }
    });

    it('supports child component that renders null', () => {
        function mountNullChild() {
            mount(
                <ReactHoverObserver>
                    {false}
                </ReactHoverObserver>
            );
        }

        expect(mountNullChild).to.not.throw();
    });

    it('supports function as child component', (done) =>  {
        const renderedTree = getFunctionAsChildRenderedComponentTree({ onMouseEnter });
        const el = renderedTree.find('div');

        el.simulate('mouseEnter');

        function onMouseEnter({ setIsHovering }) {
            setIsHovering();

            setTimeout(() => {
                renderedTree.update();
                const childComponent = renderedTree.find(GenericSpanComponent);
                expect(childComponent.props()).to.deep.equal({ isHovering: true });
                done();
            }, 0);
        }
    });

    describe('Props API', () => {
        it('supports className', () => {
            const tree = getRenderedComponentTree({ className: 'foo' });

            expect(tree.find('div').hasClass('foo')).to.equal(true);
        });

        it('supports hoverDelayInMs', () => {
            const tree = getRenderedComponentTree({ hoverDelayInMs: 100 });

            expect(tree.props().hoverDelayInMs).to.equal(100);
        });

        it('supports hoverOffDelayInMs', () => {
            const tree = getRenderedComponentTree({ hoverOffDelayInMs: 200 });

            expect(tree.props().hoverOffDelayInMs).to.equal(200);
        });

        describe('support for onHoverChanged', () => {
            it('calls onHoverChanged when hovering', (done) => {
                const tree = getRenderedComponentTree({
                    onHoverChanged,
                    onMouseEnter: ({ setIsHovering }) => setIsHovering()
                });
                const el = tree.find('div');

                el.simulate('mouseEnter');

                function onHoverChanged({ isHovering }) {
                    expect(isHovering).to.be.true;
                    done();
                }
            });

            it('calls onHoverChanged when hovering off', (done) => {
                const tree = getRenderedComponentTree({
                    onHoverChanged,
                    onMouseEnter: ({ unsetIsHovering }) => unsetIsHovering()
                });
                const el = tree.find('div');

                el.simulate('mouseEnter');

                function onHoverChanged({ isHovering }) {
                    expect(isHovering).to.be.false;
                    done();
                }
            });
        });

        it('supports shouldDecorateChildren', () => {
            const tree = getRenderedComponentTree({ shouldDecorateChildren: false });
            const childComponent = tree.find(GenericSpanComponent);
            const el = tree.find('div');

            el.simulate('mouseEnter');

            expect(childComponent.props()).to.be.empty;
        });

        describe('#onMouseEnter', () => {
            verify('mouseEnter', 'onMouseEnter');
        });

        describe('#onMouseLeave', () => {
            verify('mouseLeave', 'onMouseLeave');
        });

        describe('#onMouseOver', () => {
            verify('mouseOver', 'onMouseOver');
        });

        describe('#onMouseOut', () => {
            verify('mouseOut', 'onMouseOut');
        });

        function verify(eventName, observerName) {
            it(`observes ${eventName} events`, () => {
                const spy = sinon.spy();
                const renderedTree = getRenderedComponentTree({ [observerName]: spy });
                const el = renderedTree.find('div');

                el.simulate(eventName);

                expect(spy.calledOnce).to.equal(true);
            });

            it('receives three parameters - (e Object, setIsHovering Function, unsetIsHovering Function)', () => {
                const spy = sinon.spy();
                const renderedTree = getRenderedComponentTree({ [observerName]: spy });
                const el = renderedTree.find('div');

                el.simulate(eventName);

                const listenerArguments = spy.getCall(0).args[0];
                expect(listenerArguments.e.constructor.name).to.equal('SyntheticEvent');
                expect(isFunction(listenerArguments.setIsHovering)).to.equal(true);
                expect(isFunction(listenerArguments.unsetIsHovering)).to.equal(true);
            });

            it('sets isHovering decoration to true, when observer function invokes setIsHovering parameter', (done) => {
                const renderedTree = getRenderedComponentTree({ [observerName]: listener });
                const childComponent = renderedTree.find(GenericSpanComponent);
                const el = renderedTree.find('div');
                expect(childComponent.props()).to.deep.equal({ isHovering: false });

                el.simulate(eventName);

                function listener({ setIsHovering }) {
                    setIsHovering();

                    setTimeout(() => {
                        renderedTree.update();
                        const childComponent = renderedTree.find(GenericSpanComponent);
                        expect(childComponent.props()).to.deep.equal({ isHovering: true });
                        done();
                    }, 0);
                }
            });

            it('sets isHovering decoration to false, when observer function invokes unsetIsHovering parameter', (done) => {
                const renderedTree = getRenderedComponentTree({ [observerName]: listener });
                renderedTree.instance().setState({ isHovering: true });
                renderedTree.update();
                const el = renderedTree.find('div');
                const childComponent = renderedTree.find(GenericSpanComponent);
                expect(childComponent.props()).to.deep.equal({ isHovering: true });

                el.simulate(eventName);

                function listener({ unsetIsHovering }) {
                    unsetIsHovering();

                    setTimeout(() => {
                        renderedTree.update();
                        const childComponent = renderedTree.find(GenericSpanComponent);
                        expect(childComponent.props()).to.deep.equal({ isHovering: false });
                        done();
                    }, 0);
                }
            });
        }
    });

    describe('Hoverintent', () => {
        beforeEach(function() {
            this.clock = sinon.useFakeTimers();
        });

        afterEach(function() {
            this.clock.restore();
        });

        it('delays setting isHovering', function() {
            reactHoverObserver.setProps({ hoverDelayInMs: 1000 });
            const el = reactHoverObserver.find('div');

            el.simulate('mouseEnter');
            this.clock.tick(500);
            expect(reactHoverObserver.state('isHovering')).to.be.false;
            this.clock.tick(1001);
            expect(reactHoverObserver.state('isHovering')).to.be.true;
        });

        it('delays unsetting isHovering', function () {
            reactHoverObserver.setProps({ hoverDelayInMs: 0, hoverOffDelayInMs: 1000 });
            const el = reactHoverObserver.find('div');

            el.simulate('mouseEnter');
            this.clock.tick();
            expect(reactHoverObserver.state('isHovering')).to.be.true;
            el.simulate('mouseLeave');
            this.clock.tick(500);
            expect(reactHoverObserver.state('isHovering')).to.be.true;
            this.clock.tick(1001);
            expect(reactHoverObserver.state('isHovering')).to.be.false;
        });

    });

    describe('Cleanup on Teardown', () => {
        it('calls clearTimers in componentWillUnmount', () => {
            const hoverObserver = reactHoverObserver.instance();
            sinon.spy(hoverObserver, 'clearTimers');

            hoverObserver.componentWillUnmount();

            expect(hoverObserver.clearTimers.calledOnce).to.be.true;
            hoverObserver.clearTimers.restore();
        });

        it('calls clearTimeout in clearTimers', () => {
            const hoverObserver = reactHoverObserver.instance();
            sinon.spy(global, 'clearTimeout')
            hoverObserver.timerIds.push(1);

            hoverObserver.clearTimers();

            expect(global.clearTimeout.calledWith(1)).to.be.true;
            global.clearTimeout.restore();
        });

        it('drains timer id queue', () => {
            const hoverObserver = reactHoverObserver.instance();
            hoverObserver.timerIds.push(1, 2);

            hoverObserver.clearTimers();

            expect(hoverObserver.timerIds.length).to.equal(0);
        });
    });

    function getRenderedComponentTree(props) {
        const tree = (
            <ReactHoverObserver { ...props }>
                <GenericSpanComponent />
                <hr />
            </ReactHoverObserver>
        );

        return mount(tree);
    }

    function getFunctionAsChildRenderedComponentTree(props) {
        const tree = (
            <ReactHoverObserver { ...props }>
                {(props) => (<GenericSpanComponent {...props} />)}
            </ReactHoverObserver>
        );

        return mount(tree);
    }
});
