
/*************************************/
/*              Imports              */
/*************************************/

import React from 'react';
import styles from './App.module.scss';
import { ScrollView } from '..';

/*************************************/
/*        Component Definition       */
/*************************************/

export const App: React.FC = () => {
  return (
    <div className={styles.App}>
      <div className={styles.primaryPanel}>
        <div className={styles.topSubPanel}>
          <ScrollView>
            <div>
              <div>Item 1</div>
              <div>Item 2</div>
              <div>Item 3</div>
              <div>Item 4</div>
              <div>Long Item 123456789012345678901234567890</div>
              <div>Item 5</div>
              <div>Item 6</div>
              <div>Item 7</div>
              <div>Item 8</div>
              <div>Item 9</div>
              <div>
                <input type="checkbox"/>
                Test
              </div>
              <div>Item 10</div>
              <div>Item 11</div>
            </div>
          </ScrollView>
        </div>
        <div className={styles.bottomSubPanel}>
          <ScrollView allowWrap>
            <div>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. 
              Sed auctor posuere mi id egestas. Class aptent taciti sociosqu ad litora 
              torquent per conubia nostra, per inceptos himenaeos. Cras nec vestibulum nisi. 
              Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; 
              Morbi ultrices at tortor eu ultrices. Nullam ut tellus blandit, ultricies 
              purus eu, laoreet nibh. Fusce id dignissim urna. Nulla ut est nec ex elementum ullamcorper. 
              Morbi eget lacinia nisi, non tempor erat. In lacinia ante est, sed feugiat justo euismod vel.               
            </div>
          </ScrollView>
        </div>

      </div>
      <div className={styles.primaryPanel}>
        <ScrollView wheelDelta={5}> 
          <div>
            <img src="./assets/aliens.png" alt="Aliens!"/>
          </div>
        </ScrollView>
      </div>
    </div>
  );
};
