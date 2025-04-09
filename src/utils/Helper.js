/* eslint-disable prettier/prettier */
const defaultColor = {
  red: 127,
  green: 127,
  blue: 127
};

class Helper {
  static clamp(value, min, max) {
    // eslint-disable-next-line no-nested-ternary
    if (value < min) return min;
    if (value > max) return max;
    return value;
  }

  static getRandomForce() {
    return Math.random() * 2 - 1;
  }

  static formatPercentage(val, hideSign) {
    let value = val;
    if (value === null) {
      return '-';
    }

    value *= 0.01;
    const absoluteValue = Math.abs(value);

    // If the absolute value is very small, set it to a small positive or negative value
    if (absoluteValue < 0.0005) {
      value = 0.001 * Math.sign(value);
    }

    const formattingOptions = {
      style: 'percent',
      signDisplay: hideSign ? 'never' : 'exceptZero',
      maximumFractionDigits: absoluteValue >= 1 ? 0 : 1
    };

    return value.toLocaleString(undefined, formattingOptions).replace(/\u00a0/, '');
  }

  static calculateColor(colorOffset, color, maxColorOffset) {
    if (colorOffset === 0 || maxColorOffset === 0) return defaultColor;

    const ratio = Math.abs(colorOffset) / maxColorOffset;
    const intensity = Helper.clamp(Math.min(1, Math.max(0.2, ratio)), 0, 1);
    const lowerBound = Math.floor(127 * (1 - intensity));
    const upperBound = Math.floor(155 + 100 * intensity);

    if (colorOffset > 0) {
      if (color === 'yellow-blue') {
        return {
          red: lowerBound,
          green: lowerBound + 70,
          blue: upperBound
        };
      }
      return {
        red: lowerBound,
        green: upperBound,
        blue: lowerBound
      };
    }
    if (color === 'yellow-blue') {
      return {
        red: upperBound,
        green: upperBound,
        blue: lowerBound
      };
    }
    return {
      red: upperBound,
      green: lowerBound,
      blue: lowerBound
    };
  }

  static calculateSize(e) {
    return e ** 0.8;
  }

  static isValidRankDiffPeriod(period) {
    return period !== 'min1' && period !== 'min5' && period !== 'min15';
  }

  static calculateRadius(currency, sizeFactor, period) {
    switch (sizeFactor) {
      case 'marketcap':
        return Helper.calculateSize(currency.marketcap);
      case 'volume':
        return Helper.calculateSize(currency.volume);
      case 'performance': {
        const performanceValue = Math.abs(currency.performance[period] || 0);
        // return calculateSize(Math.min(1000, performanceValue));
        return Helper.calculateSize(Helper.clamp(performanceValue, 0.01, 1000));
      }
      case 'rank-diff':
        return Helper.isValidRankDiffPeriod(period) ? Helper.calculateSize(Math.abs(currency.rankDiffs[period])) : 1;
      default:
        return 1;
    }
  }

  static calculateColorValue(currency, colorFactor, period) {
    switch (colorFactor) {
      case 'neutral':
        return 0;
      case 'performance':
        return Helper.clamp(currency.performance[period], -20, 20);
      case 'rank-diff':
        return 0;
      default:
        return 0;
    }
  }

  static generateContent(currency, contentTemplate, period, baseCurrency) {
    switch (contentTemplate) {
      case 'name':
        return currency.name;
      case 'rank':
        return currency.rank;
      case 'performance':
        return Helper.formatPercentage(currency.performance[period]);
      case 'volume':
        return Helper.formatPrice(currency.volume, baseCurrency);
      case 'volumeWeekly':
        return Helper.formatPrice(currency.volumeWeekly, baseCurrency);
      case 'price':
        return Helper.formatPrice(currency.price, baseCurrency);
      default:
        return '';
    }
  }

  // Function to get the color based on the value and color scheme
  static getPrimaryColor(value, colorScheme) {
    if (value) {
      if (value > 0) {
        // Positive value color
        return colorScheme === 'yellow-blue' ? '#4af' : '#3f3';
      }
      // Negative value color
      return colorScheme === 'yellow-blue' ? '#fb1' : '#f66';
    }
    return '';
  }

  // Function to get a different color based on the value and color scheme
  static getSecondaryColor(value, colorScheme) {
    if (value) {
      if (value > 0) {
        // Positive value alternate color
        return colorScheme === 'yellow-blue' ? '#16d' : '#282';
      }
      // Negative value alternate color
      return colorScheme === 'yellow-blue' ? '#c81' : '#a33';
    }
    return '';
  }

  static calculateConfigurationWeight(config, data) {
    const { color, period, size } = config;
    let weightedSum = 0;
    let weightTotal = 0;

    // eslint-disable-next-line no-undef, no-restricted-syntax
    for (const item of data) {
      // Assuming Ai() returns a list of items/entities
      const dataValue = Helper.calculateColorValue(item, color, period);
      const scaledValue = Helper.calculateRadius(item, size, period);

      if (scaledValue > 0) {
        const sqrtValue = Math.sqrt(scaledValue);
        weightedSum += Math.sign(dataValue) * sqrtValue;
        weightTotal += sqrtValue;
      }
    }

    return weightTotal > 0 ? weightedSum / weightTotal : 0;
  }

  static formatPrice(value, currency) {
   if(value!==null){
    let amount = value;
    if (amount < 0) {
      amount = 0;
    }
  
    let fractionDigits = amount === 0 ? 2 : 3 - Math.ceil(Math.log10(amount));
    if (fractionDigits < 0) {
      fractionDigits = 0;
    }
    if (fractionDigits > 10) {
      fractionDigits = 10;
    }
    if (fractionDigits === 1) {
      fractionDigits = 2;
    }
    if (amount > 1e6) {
      fractionDigits = 2;
    }
    if (!Number.isFinite(fractionDigits)) {
      fractionDigits = 0;
    }

    // Create the formatting options
    const formatOptions = {
      style: 'currency',
      currency: currency.code,
      currencyDisplay: 'narrowSymbol',
      minimumFractionDigits: fractionDigits,
      maximumFractionDigits: fractionDigits
    };

    if (amount > 1e6) {
      formatOptions.notation = 'compact';
    }
    try {
      return amount.toLocaleString(undefined, formatOptions);
    } catch {
      formatOptions.currencyDisplay = 'symbol';
      return amount.toLocaleString(undefined, formatOptions);
    }
  }
   }
   static handleResize(callback) {
    const resizeHandler = () => {
      const isMobileOrTablet =
        /iPhone|iPad|iPod|Android/i.test(navigator.userAgent) || window.innerWidth <= 1224;
      callback(isMobileOrTablet);
    };
  
    resizeHandler(); // Trigger the check immediately on load
    window.addEventListener("resize", resizeHandler);
  
    return () => {
      window.removeEventListener("resize", resizeHandler);
    };
  }

  static isTablet(callback) {
    const tabletHandler = () => {
      const isTabletDevice =
        /iPad|Android/i.test(navigator.userAgent) && window.innerWidth > 767 && window.innerWidth <= 1224;
      callback(isTabletDevice);
    };
  
    tabletHandler(); // Trigger the check immediately on load
    window.addEventListener("resize", tabletHandler);
  
    return () => {
      window.removeEventListener("resize", tabletHandler);
    };
  }
  
  


}

export default Helper;