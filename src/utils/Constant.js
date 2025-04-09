const PERIODS = [
  {
    label: '1 min',
    value: 'min1'
  },
  {
    label: '5 min',
    value: 'min5'
  },
  {
    label: '15 min',
    value: 'min15'
  },
  {
    label: 'Hour',
    value: 'hour'
  },
  {
    label: 'Day',
    value: 'day'
  },
  {
    label: 'Week',
    value: 'week'
  },
  {
    label: 'Month',
    value: 'month'
  },
  {
    label: 'Year',
    value: 'year'
  }
];

const SIZE = [
  {
    label: 'Performance',
    value: 'performance'
  },
  {
    label: '24h Volume',
    value: 'volume'
  },
];

const CONTENT = [
  {
    label: 'Performance',
    value: 'performance'
  },
  {
    label: '24h Volume',
    value: 'volume'
  },

  {
    label: 'Price',
    value: 'price'
  },
  {
    label: 'Rank',
    value: 'rank'
  },
  {
    label: 'Name',
    value: 'name'
  }
];

const COLOR = [
  {
    label: 'Performance',
    value: 'performance'
  },
  {
    label: 'Neutral',
    value: 'neutral'
  }
];

const DEFAULT_CONFIGS = [
  {
    id: '1',
    name: '',
    color: 'performance',
    content: 'performance',
    size: 'performance',
    period: 'hour'
  },
  {
    id: '2',
    name: '',
    color: 'performance',
    content: 'performance',
    size: 'performance',
    period: 'day'
  },
  {
    id: '3',
    name: '',
    color: 'performance',
    content: 'performance',
    size: 'performance',
    period: 'week'
  },
  {
    id: '4',
    name: '',
    color: 'performance',
    content: 'performance',
    size: 'performance',
    period: 'month'
  },
  {
    id: '5',
    name: '',
    color: 'performance',
    content: 'performance',
    size: 'performance',
    period: 'year'
  },
  {
    id: '6',
    name: '',
    color: 'performance',
    content: 'performance',
    size: 'performance',
    period: 'day'
  }
];

const Constant = {
  DEFAULT_CONFIGS,
  PERIODS,
  SIZE,
  COLOR,
  CONTENT,
  findPeriodLabel: (period) => {
    return PERIODS.find((val) => val.value === period).label;
  },
  findLabel: (key, list) => {
    return list.find((val) => val.value === key).label;
  },
  renderLabel: (config) => {
    const val1 = ((s) => {
      switch (s.size) {
        case 'performance':
          return Constant.findPeriodLabel(s.period);
        default:
          return Constant.findLabel(s.size, Constant.SIZE);
      }
    })(config);

    const val2 = ((s) => {
      
      switch (s.content) {
        case 'performance':
          return Constant.findPeriodLabel(s.period);
        default:
          return Constant.findLabel(s.content, Constant.CONTENT);
      }
    })(config);

    return val1 === val2 ? val1 : `${val1} & ${val2}`;
  }
};

export default Constant;
