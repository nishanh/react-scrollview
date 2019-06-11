
/*************************************/
/*              Imports              */
/*************************************/

import React from 'react';
import styles from './App.module.scss';
import { ScrollView } from '..';
import { Tree, ITreeNode } from '@blueprintjs/core';

/*************************************/
/*         Types / Interfaces        */
/*************************************/

interface IState {
  treeNodes: ITreeNode[];
}

/*************************************/
/*        Component Definition       */
/*************************************/

export class App extends React.Component<any, IState> {
  public state: IState = { treeNodes: [rootNode] };

  public render(): JSX.Element {
    return (
      <div className={styles.App}>
        <div className={styles.primaryPanel}>
          <div className={styles.topSubPanel}>
            <ScrollView>
             <Tree 
               contents={this.state.treeNodes}
               onNodeCollapse={this.handleNodeCollapse}
               onNodeExpand={this.handleNodeExpand}/>
            </ScrollView>
          </div>
          <div className={styles.bottomSubPanel}>
            <ScrollView allowWrap>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. 
                Sed auctor posuere mi id egestas. Class aptent taciti sociosqu ad litora 
                torquent per conubia nostra, per inceptos himenaeos. Cras nec vestibulum nisi. 
                Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; 
                Morbi ultrices at tortor eu ultrices. Nullam ut tellus blandit, ultricies 
                purus eu, laoreet nibh. Fusce id dignissim urna. Nulla ut est nec ex elementum ullamcorper. 
                Morbi eget lacinia nisi, non tempor erat. In lacinia ante est, sed feugiat justo euismod vel.               
            </ScrollView>
          </div>
        </div>
        <div className={styles.primaryPanel}>
          <ScrollView wheelDelta={5}> 
            <img src="./assets/aliens.png" alt="Aliens!"/>
          </ScrollView>
        </div>
      </div>
    );  
  }

  private handleNodeCollapse = (nodeData: ITreeNode): void => {
    nodeData.isExpanded = false;
    nodeData.icon = 'folder-close';
    this.setState(this.state);
  }

  private handleNodeExpand = (nodeData: ITreeNode): void => {
    nodeData.isExpanded = true;
    nodeData.icon = 'folder-open';
    this.setState(this.state);
  }
}

/*************************************/
/*            Sample Data            */
/*************************************/

const rootNode: ITreeNode = {
  id: 1,
  label: 'Root',
  icon: 'folder-open',
  isExpanded: true,
  childNodes: [
    { id: 2, label: 'Item 1', icon: 'document'},
    { id: 3, label: 'Item 2', icon: 'document'},
    { id: 4, label: 'Item 3', icon: 'folder-close', childNodes: [
      {id: 41, label: 'Sub Item 1', icon: 'document'},
      {id: 42, label: 'Sub Item 2', icon: 'document'},
      {id: 43, label: 'Sub Item 3', icon: 'document'},
      {id: 44, label: 'Sub Item 4', icon: 'document'},
      {id: 45, label: 'Sub Item 5', icon: 'document'},
      {id: 46, label: 'Sub Item 6', icon: 'document'},
      {id: 47, label: 'Sub Item 7', icon: 'document'},
      {id: 48, label: 'Sub Item 8', icon: 'document'},
      {id: 49, label: 'Sub Item 8', icon: 'document'},
      {id: 50, label: 'Sub Item 10', icon: 'document'},
    ]},
    { id: 5, label: 'Item 4', icon: 'document'},
    { id: 6, label: 'Item 5', icon: 'document'},
    { id: 7, label: 'Item 6', icon: 'document'},
    { id: 8, label: 'Item 7', icon: 'document'},
    { id: 9, label: 'Item 8', icon: 'document'},
    { id: 10, label: 'Item 9', icon: 'document'},
    { id: 11, label: 'Item 10', icon: 'document'},
  ]
};
