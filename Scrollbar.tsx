
/*************************************/
/*              Imports              */
/*************************************/

import React from 'react';
import styles from './Scrollbar.module.scss';

/*************************************/
/*        Types / Interfaces         */
/*************************************/

interface IProps {
    orientation: 'vertical' | 'horizontal';
    viewportSize: number; 
    extent: number; 
    scrollPos: number;
    visibility: boolean;
    onScroll: ScrollChangedEvent;
    className?: string;
    style?: object;
}

type ScrollChangedEvent = (position: number, scrollType: string) => void;

/*************************************/
/*          Class Definition         */
/*************************************/

export class Scrollbar extends React.PureComponent<IProps> {
    private _maxTranslate: number = 0;
    private _knobElement: HTMLDivElement|null = null;
    private _dragStart: number = 0;
    private _isScrolling: boolean = false;
    private _scrollPerPixel: number = 0;
    private _scrollbarTranslation: number = 0;

    constructor(props: IProps) {
        super(props);

        this.pageScroll = this.pageScroll.bind(this);
        this.beginScroll = this.beginScroll.bind(this);
        this.lineScroll = this.lineScroll.bind(this);
        this.endScroll = this.endScroll.bind(this);
    }

    public render(): JSX.Element {
        const { viewportSize, extent, scrollPos, visibility } = this.props;
        const scrollWindow: number = viewportSize + extent;
        let knobSize: number = Math.max(10, viewportSize / scrollWindow * viewportSize);
        knobSize = isNaN(knobSize) ? 0 : knobSize;
        this._maxTranslate = viewportSize - knobSize;
        this._scrollPerPixel = extent / this._maxTranslate;
        this._scrollbarTranslation = this._scrollPerPixel > 0 ? scrollPos / this._scrollPerPixel : 0;

        const scrollTransform = this.isVertical ? `translateY(${this._scrollbarTranslation}px)` : `translateX(${this._scrollbarTranslation}px)`;
        const scrollBodyClass = this.isVertical ? `${styles.vertScrollBarBody} ${this.props.className}` : `${styles.horzScrollBarBody} ${this.props.className}`;
        const scrollKnobClass = this.isVertical ? styles.vertScrollBarKnob : styles.horzScrollBarKnob;
        const scrollKnobStyle = this.isVertical ? { height: knobSize, transform: scrollTransform } : { width: knobSize, transform: scrollTransform };
        
        return (
            <div
                onMouseDown={this.pageScroll}
                style={{...this.props.style, display: visibility ? 'flex' : 'none'}}
                className={scrollBodyClass}>
                <div
                    onPointerDown={this.beginScroll}
                    onPointerMove={this.lineScroll}
                    onPointerUp={this.endScroll}
                    ref={(div) => {this._knobElement = div;}}
                    style={scrollKnobStyle}
                    className={scrollKnobClass}/>
            </div>
        );        
    }

    private get isVertical(): boolean {
        return this.props.orientation === 'vertical';
    }

    private beginScroll(event: React.PointerEvent<HTMLDivElement>): void {
        this._knobElement!.setPointerCapture(event.pointerId);
        this._dragStart = this.isVertical ? event.clientY : event.clientX;
        this._isScrolling = true;
    }

    private endScroll(event: React.PointerEvent<HTMLDivElement>): void {
        this._knobElement!.releasePointerCapture(event.pointerId);
        this._isScrolling = false;
    }

    private lineScroll(event: React.PointerEvent<HTMLDivElement>): void {
        if (this._isScrolling) {
            const dragPos: number = this.isVertical ? event.clientY : event.clientX;
            const scrollTranslate: number = Math.max(0, Math.min(this._maxTranslate, this._scrollbarTranslation + (dragPos - this._dragStart)));
            this._dragStart = dragPos;

            // Don't fire anymore events if at scroll limits
            if ((scrollTranslate === 0 && this._scrollbarTranslation === 0) ||
                (scrollTranslate === this._maxTranslate && this._scrollbarTranslation === this._maxTranslate)) { 
                    return; 
            }
            this.props.onScroll(scrollTranslate * this._scrollPerPixel, this.props.orientation);
        }
    }

    private pageScroll(event: React.MouseEvent<HTMLDivElement>): void {
        if (this._isScrolling) { return; }

        const clickPos: number = this.isVertical ? event.clientY - event.currentTarget.offsetTop : event.clientX - event.currentTarget.offsetLeft;
        const largeChange: number = this.props.viewportSize / 10;
        const scrollAmount: number = clickPos < this._scrollbarTranslation ? -largeChange : largeChange; 
        const scrollTranslate: number = Math.max(0, Math.min(this._maxTranslate, this._scrollbarTranslation + scrollAmount));
        this.props.onScroll(scrollTranslate * this._scrollPerPixel, this.props.orientation);
    }
}