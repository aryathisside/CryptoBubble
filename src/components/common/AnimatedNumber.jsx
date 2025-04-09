import { useEffect, useRef, useState } from 'react';
import Tween from '../../utils/Tween';
import Helper from '../../utils/Helper';
import useConfigStore from '../../store/useConfigStore';

const NumberComponent = ({ value }) => {
  const colorScheme = useConfigStore((state) => state.colorScheme);
  const [previousValue, setPreviousValue] = useState(value);
  const [currentValue, setCurrentValue] = useState(value);
  const [colorStyle, setColorStyle] = useState('');
  const animatorRef = useRef(new Tween(value, 500));
  const animationFrameIdRef = useRef(null);

  const updateAnimation = () => {
    if (animatorRef.current.isDone()) {
      setCurrentValue(value);
      setColorStyle('');
      animationFrameIdRef.current = null;
    } else {
      setCurrentValue(animatorRef.current.get());
      animationFrameIdRef.current = requestAnimationFrame(updateAnimation);
    }
  };

  useEffect(() => {
    const previous = previousValue;
    const current = value;
    if (previous !== current) {
      setPreviousValue(current);
      animatorRef.current.set(current);
      const difference = current - previous;
      const color = Helper.getPrimaryColor(difference, colorScheme);
      setColorStyle(color ? `${color}` : '');
      animationFrameIdRef.current = requestAnimationFrame(updateAnimation);
    }

    return () => {
      if (animationFrameIdRef.current !== null) {
        cancelAnimationFrame(animationFrameIdRef.current);
        animationFrameIdRef.current = null;
      }
    };
  }, [value]);

  const formatValue = () => {
    
    return Helper.formatPrice(currentValue, { code: 'usd' });
  };

  return <span style={{ color: colorStyle }}>{formatValue()}</span>;
};

export default NumberComponent;
