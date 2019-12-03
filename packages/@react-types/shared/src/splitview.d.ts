import {
  Dispatch,
  KeyboardEvent,
  MouseEvent,
  MouseEventHandler,
  MutableRefObject,
  ReactElement,
  SetStateAction
} from 'react';
import {DOMProps} from './dom';

export interface SplitViewStatelyProps {
  allowsCollapsing?: boolean,
  onResize?: (primarySize: number) => void,
  onResizeEnd?: (primarySize: number) => void,
  primarySize?: number,
  defaultPrimarySize?: number,
}

export interface SplitViewHandleState {
  offset: number,
  dragging: boolean,
  hovered: boolean
  setOffset: (value: number) => void,
  setDragging: (value: boolean) => void,
  setHover: (value: boolean) => void,
  increment: () => void,
  decrement: () => void,
  incrementToMax: () => void,
  decrementToMin: () => void,
  collapseToggle: () => void
}

export interface SplitViewContainerState {
  minPos: number,
  maxPos: number,
  setMinPos: Dispatch<SetStateAction<number>>,
  setMaxPos: Dispatch<SetStateAction<number>>
}

export interface SplitViewState {
  handleState: SplitViewHandleState,
  containerState: SplitViewContainerState
}

export interface SplitViewAriaProps {
  id?: string,
  onMouseDown?: MouseEventHandler,
  allowsResizing?: boolean,
  orientation?: 'horizontal' | 'vertical',
  primaryPane?: 0 | 1,
  primaryMinSize?: number,
  primaryMaxSize?: number,
  secondaryMinSize?: number,
  secondaryMaxSize?: number,
  'aria-label'?: string,
  'aria-labelledby'?: string,
  containerRef?: MutableRefObject<HTMLDivElement>
}

export interface SplitViewContainerProps extends DOMProps {
  ref?: MutableRefObject<HTMLDivElement>
}

export interface SplitViewHandleProps extends DOMProps {
  onMouseDown?: (event: MouseEvent<HTMLElement>) => void,
  onMouseEnter?: (event: MouseEvent<HTMLElement>) => void,
  onMouseOut?: (event: MouseEvent<HTMLElement>) => void,
  onKeyDown?: (event: KeyboardEvent<HTMLElement>) => void,
  ref?: MutableRefObject<HTMLDivElement>
}

export interface AriaSplitViewProps {
  containerProps: SplitViewContainerProps,
  handleProps: SplitViewHandleProps,
  primaryPaneProps: DOMProps
}

export interface SplitViewProps extends DOMProps {
  children: [ReactElement, ReactElement],
  orientation?: 'horizontal' | 'vertical',
  allowsResizing?: boolean,
  allowsCollapsing?: boolean,
  onResize?: (primarySize: number) => void,
  onResizeEnd?: (primarySize: number) => void,
  primaryPane?: 0 | 1,
  primarySize?: number,
  defaultPrimarySize?: number,
  primaryMinSize?: number,
  primaryMaxSize?: number,
  secondaryMinSize?: number,
  secondaryMaxSize?: number
}
