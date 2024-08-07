/* eslint-disable prettier/prettier */
import { useEffect, useRef, useState } from 'react';
import './style.css';
import BubbleManager from '../utils/BubbleManager';
import useDataStore from '../store/useDataStore';
import useConfigStore from '../store/useConfigStore';
const BubbleCanvas = () => {
  const [canvasManager, setCanvasManager] = useState();
  const currencies = useDataStore((state) => state.currencies);
  const config = useConfigStore((state) => state.configuration);
  const canvasContainerRef = useRef();
  useEffect(() => {
    if (canvasContainerRef.current) {
      const cM = new BubbleManager(canvasContainerRef.current);
      setCanvasManager(cM);

      // const properties = {
      //   id: '1706517258919',
      //   name: '',
      //   color: 'performance',
      //   content: 'performance',
      //   size: 'performance',
      //   period: selectedPeriod
      // };

      cM.setProperties(config);
      // Push the currencies to the canvas manager
      setTimeout(() => {
        cM.pushCurrencies(currencies);
      }, 1000);
      cM.wakeUp();
      cM.start();
    }
  }, [canvasContainerRef]);
  useEffect(() => {
    if (canvasManager) {
      canvasManager.setProperties(config);
    }
  }, [config]);

  useEffect(() => {
    if (canvasManager) {
      canvasManager.pushCurrencies(currencies);
    }
  }, [currencies]);
  return <>
  <canvas id="canvas" ref={canvasContainerRef} />
  </>;
};

export default BubbleCanvas;
