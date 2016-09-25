import React from 'react';
import isFunction from 'lodash.isfunction';
import noop from 'lodash.noop';
import {shallow, mount, render} from 'enzyme';
import {expect} from 'chai';
import sinon from 'sinon';

import ReactHoverObserver from '../src/ReactHoverObserver';
import GenericSpanComponent from './support/GenericSpanComponent';

describe('ReactHoverObserver', () => {
    let reactHoverObserver;

    beforeEach(() => {
        reactHoverObserver = shallow(<ReactHoverObserver/>);
    });

    it('has the display name ReactHoverObserver', () => {
        expect(reactHoverObserver.instance().constructor.displayName).to.equal('ReactHoverObserver');
    });

    it('has correct initial state', () => {
        expect(reactHoverObserver.instance().getInitialState()).to.deep.equal({
            isHovering: false
        });
    });

    it('has correct default props', () => {
        expect(reactHoverObserver.instance().constructor.getDefaultProps()).to.deep.equal({
            hoverDelayInMs: 0,
            hoverOffDelayInMs: 0,
            onHoverChanged: noop,
            onMouseEnter: noop,
            onMouseLeave: noop,
            onMouseOver: noop,
            onMouseOut: noop,
            shouldDecorateChildren: true
        });
    });

    it('renders a single HTML div element', () => {
        expect(reactHoverObserver.type()).to.equal('div');
    });

    it('decorates child components with isHovering prop', (done) => {
        const renderedTree = getRenderedComponentTree({ onMouseEnter });
        const el = renderedTree.find('div');

        el.simulate('mouseEnter');

        function onMouseEnter({ setIsHovering }) {
            setIsHovering();

            setTimeout(() => {
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

        it('supports shouldDecorateChildren, which optionally suppresses decoration of child components when unset', () => {
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

        describe('#onMouseLeave', () => {
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

            it('receives three parameters - (event Object, setIsHovering Function, unsetIsHovering Function)', () => {
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
                        expect(childComponent.props()).to.deep.equal({ isHovering: true });
                        done();
                    }, 0);
                }
            });

            it('sets isHovering decoration to false, when observer function invokes unsetIsHovering parameter', (done) => {
                const renderedTree = getRenderedComponentTree({ [observerName]: listener });
                renderedTree.instance().setState({ isHovering: true });
                const el = renderedTree.find('div');
                const childComponent = renderedTree.find(GenericSpanComponent);
                expect(childComponent.props()).to.deep.equal({ isHovering: true });

                el.simulate(eventName);

                function listener({ unsetIsHovering }) {
                    unsetIsHovering();

                    setTimeout(() => {
                        expect(childComponent.props()).to.deep.equal({ isHovering: false });
                        done();
                    }, 0);
                }
            });
        }
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
});
