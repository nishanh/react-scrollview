
/*************************************/
/*              Imports              */
/*************************************/

import React from 'react';
import styles from './ScrollView.module.scss';
import { IResizeEntry, ResizeSensor } from '@blueprintjs/core';
import { Scrollbar } from '..';

/*************************************/
/*        Types / Interfaces         */
/*************************************/

interface ISize {
    width: number;
    height: number;
}

interface IPoint {
    x: number;
    y: number;
}

interface IScrollbarVisibility {
    horizontal: boolean;
    vertical: boolean;
}

interface IProps {
    wheelDelta?: number; // affects scroll sensitivity when using the mouse-wheel. Small value = slower scroll, large value = faster scroll 
    allowWrap?: boolean; // allow white-space wrap
}

interface IState {
    viewportSize: ISize;
    scrollExtent: ISize;
    scrollVisibility: IScrollbarVisibility;
    scrollPosition: IPoint;
    isScrolling: boolean;
}

/*************************************/
/*          Class Definition         */
/*************************************/

export class ScrollView extends React.Component<IProps, IState> {
    private static _scrollBarSize: number = 8;
    public static defaultProps: IProps = { wheelDelta: 20, allowWrap: false };
    private _container:  HTMLDivElement|null = null;

    public constructor(props: IProps) {
        super(props);

        this.state = {
            viewportSize: { width: 0, height: 0 },
            scrollExtent: { width: 0, height: 0 },
            scrollVisibility: { horizontal: false, vertical: false },
            scrollPosition: { x: 0, y: 0 },
            isScrolling: false
        };

        this.onResize = this.onResize.bind(this);
        this.onScroll = this.onScroll.bind(this);
        this.onScrollWheel = this.onScrollWheel.bind(this);
        this.onScrollStart = this.onScrollStart.bind(this);
        this.onScrollEnd = this.onScrollEnd.bind(this);
        this.setContainer = this.setContainer.bind(this);
    }

    public render(): JSX.Element|null {
        try {
            React.Children.only(this.props.children);
            return (
                <ResizeSensor onResize={this.onResize}>
                    <div 
                        className={styles.container}
                        style={{whiteSpace: this.props.allowWrap ? 'normal' : 'nowrap', userSelect: this.state.isScrolling ? 'none' : 'unset'}}
                        onWheel={this.onScrollWheel}>
                        <div ref={this.setContainer} className={styles.contentArea}>
                            {this.props.children}
                        </div>
                        <Scrollbar 
                            className={styles.vertScrollbar}
                            orientation="vertical"
                            onScroll={this.onScroll}
                            onScrollStart={this.onScrollStart}
                            onScrollEnd={this.onScrollEnd}
                            scrollPos={this.state.scrollPosition.y}
                            visibility={this.state.scrollVisibility.vertical}
                            viewportSize={this.state.viewportSize.height}
                            extent={this.state.scrollExtent.height}/>
                        <Scrollbar 
                            className={styles.horzScrollbar}
                            orientation="horizontal"
                            onScroll={this.onScroll}
                            onScrollStart={this.onScrollStart}
                            onScrollEnd={this.onScrollEnd}
                            scrollPos={this.state.scrollPosition.x}
                            visibility={this.state.scrollVisibility.horizontal}
                            viewportSize={this.state.viewportSize.width}
                            extent={this.state.scrollExtent.width}/>
                    </div>
                </ResizeSensor>
            );
        }
        catch(err) {
            console.log('%cOnly one child can be specified with ScrollView. Enclose your items in a container div.', 'color: red;');
            return null;
        }
    }

    private setContainer(containerDiv: HTMLDivElement): void {
        this._container = containerDiv;
    }

    private onResize(entries: IResizeEntry[]): void {
        if (!this.setState || !entries || entries.length === 0) { return; }
        const { width, height } = entries[0].contentRect;
        this.setScrollState({width, height});
    }

    private onScrollStart(): void {
        this.setState({isScrolling: true});
    }

    private onScrollEnd(): void {
        this.setState({isScrolling: false});
    }

    private onScroll(position: number, rulerType: string): void {
        const scrollPosition: IPoint = {
            x: rulerType === 'horizontal' ? position : this.state.scrollPosition.x,
            y: rulerType === 'vertical' ? position : this.state.scrollPosition.y
        };
        this.setState(()=> ({scrollPosition}), () => {
            // Freakin microsoft...
            if (/Edge/.test(navigator.userAgent)) {
                this._container!.scrollTop = scrollPosition.y;
                this._container!.scrollLeft = scrollPosition.x;
            }
            else {
                this._container!.scroll({left: scrollPosition.x, top: scrollPosition.y});
            }
        });
    }

    private onScrollWheel(event: React.WheelEvent<HTMLDivElement>): void {
        const delta: number = event.deltaY / Math.abs(event.deltaY) * this.props.wheelDelta!;
        const scrollPosY: number = Math.min(Math.max(0, this.state.scrollPosition.y + delta), this.state.scrollExtent.height);
        this.onScroll(scrollPosY, 'vertical');
    }

    private setScrollState(panelSize: ISize): void {
        const scrollPosition: IPoint = { x: this.state.scrollPosition.x, y: this.state.scrollPosition.y };
        const viewportSize: ISize = { width: panelSize.width, height: panelSize.height};
        const itemsWrapper: HTMLDivElement = this._container!.children[0] as HTMLDivElement;

        const scrollVisibility: IScrollbarVisibility = { 
            horizontal: Math.round(itemsWrapper.scrollWidth) > Math.round(viewportSize.width), 
            vertical: Math.round(itemsWrapper.scrollHeight) > Math.round(viewportSize.height) 
        };

        if (scrollVisibility.horizontal) {
            // Reduce viewport height to exclude the presence of the horizontal scrollbar
            viewportSize.height -= ScrollView._scrollBarSize;
        }
        if (scrollVisibility.vertical) {
            // Reduce viewport width to exclude the presence of the vertical scrollbar
            viewportSize.width -= ScrollView._scrollBarSize;
        }

        // Compute the area size beyond the visible viewport
        const scrollExtent: ISize = { 
            width: Math.max(0, itemsWrapper.scrollWidth - viewportSize.width),
            height: Math.max(0, itemsWrapper.scrollHeight - viewportSize.height)
        };

        // Adjust the scroll position in response to resize changes
        if (scrollPosition.y > scrollExtent.height) {
            scrollPosition.y -= scrollPosition.y - scrollExtent.height;
        }
        if (scrollPosition.x > scrollExtent.width) {
            scrollPosition.x -= scrollPosition.x - scrollExtent.width;
        }

        this.setState({viewportSize, scrollVisibility, scrollPosition, scrollExtent});
    }
}

