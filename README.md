## Overview

Since GUI designers always want to change everything and because browser native scrollbars are a PITA to restyle, I developed this React component that implements its own scrollbars and scroll behavior.

## Usage

This is implemented as a React application written in Typescript. Extract the parts you need into your own application or GUI library. Size changes to the ScrollView are detected using the [BlueprintJS ResizeSensor](https://blueprintjs.com/docs/#core/components/resize-sensor). You can replace this with the [resize-observer-polyfill](https://github.com/que-etc/resize-observer-polyfill), if you so desire.

The ScrollView component can only accept one child and that child must be a div element. Put all your content into that container div.

Run 'yarn install' and then 'yarn start' to see the example app in action. Resize the browser window to affect the visibilty and behavior of the scrollbars.

