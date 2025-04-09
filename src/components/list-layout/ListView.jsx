/* eslint-disable no-nested-ternary */
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  Typography,
  styled,
  tableCellClasses
} from '@mui/material';
import { useEffect, useState } from 'react';
import useDataStore from '../../store/useDataStore';
import Helper from '../../utils/Helper';
import useConfigStore from '../../store/useConfigStore';
import SymbolName from './SymbolName';
import TradeLinks from '../symbol-detail/TradeLinks';
import Logo from "/image2.png";

const headCells = [
  {
    id: 'rank',
    numeric: true,
    disablePadding: true,
    label: '#',
    minWidth: 30
  },
  {
    id: 'name',
    numeric: false,
    disablePadding: true,
    label: 'Name',
    minWidth: 120
  },
  {
    id: 'price',
    numeric: true,
    disablePadding: false,
    label: 'Price'
  },
  {
    id: 'volume',
    numeric: true,
    disablePadding: false,
    label: '24h Volume'
  },
  {
    id: 'hour',
    numeric: true,
    disablePadding: false,
    label: 'Hour'
  },
  {
    id: 'day',
    numeric: true,
    disablePadding: false,
    label: 'Day'
  },
  {
    id: 'week',
    numeric: true,
    disablePadding: false,
    label: 'Week'
  },
  {
    id: 'month',
    numeric: true,
    disablePadding: false,
    label: 'Month'
  },
  {
    id: 'year',
    numeric: true,
    disablePadding: false,
    label: 'Year'
  },
  {
    id: 'links',
    numeric: false,
    disablePadding: false,
    label: 'Link',
    minWidth: '100px',
    center: true,
    preventSort: true
  }
];
const StyledHeadCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    cursor: 'pointer',
    backgroundColor: '#2A2E36',
    color: theme.palette.common.white,
    borderBottom: 0,
    padding: 5,
    transition: 'background 0.4s',
    ':has(.Mui-active)': {
      background: '#07d'
    }
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14
  },
  ':hover': {
    background: '#545454',
    '& .MuiTableSortLabel-icon': {
      opacity: 1
    }
  }
}));

const StyledSortLabel = styled(TableSortLabel)(({ theme }) => ({
  textWrap: 'nowrap',
  color: 'inherit',
  '&.Mui-active': { color: 'white' },
  '& .MuiTableSortLabel-icon': { color: 'white !important' },
  ':hover, :focus': {
    color: 'white'
  }
}));

const StyledCell = styled(TableCell)(({ theme }) => ({
  color: theme.palette.common.white,
  padding: '5px 5px',
  textWrap: 'nowrap',
  borderBottom: 0,
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14
  }
}));
const ListView = () => {
  const rows = useDataStore((state) => state.currencies);
  const  currency  = useConfigStore((state) => state.currency);
  const colorScheme = useConfigStore((state) => state.colorScheme);
  const [sort, setSort] = useState();
  const [sortDirection, setSortDirection] = useState('desc');
  const [sortedRows, setSortedRows] = useState(rows);
  const [filteredRows, setFilteredRows] = useState([]);
  const filter = useDataStore((state) => state.filter);
  const favorites = useConfigStore((state) => state.favorites);
  const blocklist = useConfigStore((state) => state.blocklist);
  const watchlists = useConfigStore((state) => state.watchlists);
  const isLoading = useDataStore((state) => state.loading);

  useEffect(() => {
    let filtered = [];
    if (filter.type === 'all') {
      filtered = rows.filter((item) => !blocklist.includes(item.id));
    } else if (filter.type === 'favorite') {
      filtered = rows.filter((item) => favorites.includes(item.id));
    } else if (filter.type === 'blocklist') {
      filtered = rows.filter((item) => blocklist.includes(item.id));
    } else if (filter.type === 'watchlist' && filter.id) {
      const wt = watchlists.find((item) => item.id === filter.id);
      filtered = rows.filter((item) => wt.symbols.includes(item.id));
    }
    setFilteredRows(filtered);
  }, [rows, favorites, filter, blocklist, watchlists]);

  useEffect(() => {
    console.log(rows)
    const sorted = [...filteredRows];
   
    if (sort) {
      if (sort === 'rank') {
        sorted.sort((a, b) => (sortDirection === 'asc' ? a.rank - b.rank : b.rank - a.rank));
      } else if (sort === 'name') {
        sorted.sort((a, b) => (sortDirection === 'asc' ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name)));
      } else if (sort === 'price') {
        sorted.sort((a, b) => (sortDirection === 'asc' ? a.price - b.price : b.price - a.price));
      } else if (sort === 'volume') {
        sorted.sort((a, b) => (sortDirection === 'asc' ? a.volume - b.volume : b.volume - a.volume));
      } else if (sort === 'hour') {
        sorted.sort((a, b) => (sortDirection === 'asc' ? a.performance.hour - b.performance.hour : b.performance.hour - a.performance.hour));
      } else if (sort === 'day') {
        sorted.sort((a, b) => (sortDirection === 'asc' ? a.performance.day - b.performance.day : b.performance.day - a.performance.day));
      } else if (sort === 'week') {
        sorted.sort((a, b) => (sortDirection === 'asc' ? a.performance.week - b.performance.week : b.performance.week - a.performance.week));
      } else if (sort === 'month') {
        sorted.sort((a, b) => (sortDirection === 'asc' ? a.performance.month - b.performance.month : b.performance.month - a.performance.month));
      } else if (sort === 'year') {
        sorted.sort((a, b) => (sortDirection === 'asc' ? a.performance.year - b.performance.year : b.performance.year - a.performance.year));
      }
    }
    setSortedRows(sorted);
  }, [sort, sortDirection,filteredRows]);

  const updateSort = (id) => {
    if (sort === id) {
      if (sortDirection === 'desc') {
        setSortDirection('asc');
      } else {
        setSortDirection('desc');
        setSort();
      }
    } else {
      setSort(id);
      setSortDirection('desc');
    }
  };

  if(filteredRows.length === 0 && filter.type !== 'all' ){
    return <Box
    sx={{
      flexGrow: 1,
      width: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'column',
    }}
  >
     <Typography variant="h6" color="white">
    {filter.type} List is empty
  </Typography>

  </Box> 
  }



  return (
   <>
   

<Box sx={{ flexGrow: 1, width: '100%', overflow:"auto" }}>
      <Paper sx={{ width: '100%', overflow: 'hidden', background: 'transparent', boxShadow: 'none' }}>
      {isLoading ? (
          <Box width={"100%"} height={"100%"} display={"flex"} justifyContent={"center"} ali>
            <img className="scale-up-center" src={Logo} alt="CRYPTO + Bubble" width={200} />
          </Box>
        ):(
          <TableContainer sx={{ maxHeight: 'calc(95vh - 70px)', marginTop: '2px', paddingBottom:"20px"}}>
          <Table stickyHeader>
            <TableHead >
              <TableRow  >
                {headCells.map((headCell) => (
                  <StyledHeadCell
                    key={headCell.id}
                    align={headCell.numeric ? 'center' : headCell.center ? 'center' : 'left'}
                    sx={{ minWidth: headCell.minWidth }}
                    onClick={() => {
                      if (headCell.preventSort) return;
                      updateSort(headCell.id);
                    }}
                    sortDirection={false}>
                    <StyledSortLabel
                      disabled={headCell.preventSort}
                      hideSortIcon={headCell.preventSort}
                      active={headCell.id === sort}
                      direction={headCell.id === sort ? sortDirection : 'desc'}
                      sx={{ flexDirection: headCell.numeric ? '' : 'row-reverse' }}>
                      {headCell.label}
                    </StyledSortLabel>
                  </StyledHeadCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {sortedRows.map((row) => {
                return (
                  <TableRow key={row.id} sx={{ transition: 'background .4s', ':hover': { background: '#ffffff14' } }}>
                    <StyledCell align="right">{row.rank}</StyledCell>
                    <StyledCell>
                      <SymbolName symbol={row} />
                    </StyledCell>
                    <StyledCell align="center">{Helper.formatPrice(row.price, currency)}</StyledCell>
                    <StyledCell align="center">{Helper.formatPrice(row.volume, currency)}</StyledCell>
                    <StyledCell align="center" >
                    <Box   display={"flex"} justifyContent={"center"} alignItems={"center"} padding={1} sx={{ background: Helper.getSecondaryColor(row.performance.year, colorScheme) }}>
                    {Helper.formatPercentage(row.performance.hour, true)}
                    </Box>
                    
                    </StyledCell>
                    <StyledCell align="right" >
                    <Box   display={"flex"} justifyContent={"center"} alignItems={"center"} padding={1} sx={{ background: Helper.getSecondaryColor(row.performance.year, colorScheme) }}>
                    {Helper.formatPercentage(row.performance.day, true)}
                    </Box>
                     
                    </StyledCell>
                    <StyledCell align="right" >
                    <Box   display={"flex"} justifyContent={"center"} alignItems={"center"} padding={1} sx={{ background: Helper.getSecondaryColor(row.performance.year, colorScheme) }}>
                    {Helper.formatPercentage(row.performance.week, true)}
                    </Box>
                    
                    </StyledCell>
                    <StyledCell align="right">
                    <Box   display={"flex"} justifyContent={"center"} alignItems={"center"} padding={1} sx={{ background: Helper.getSecondaryColor(row.performance.year, colorScheme) }}>
                    {Helper.formatPercentage(row.performance.month, true)}
                    </Box>
                     
                    </StyledCell>
                    <StyledCell align="right" >
                      <Box   display={"flex"} justifyContent={"center"} alignItems={"center"} padding={1} sx={{ background: Helper.getSecondaryColor(row.performance.year, colorScheme) }}>
                      {Helper.formatPercentage(row.performance.year, true)}

                      </Box>
                      
                    </StyledCell>
                    <StyledCell align="center">
                      <TradeLinks symbol={row} mb={0} />
                    </StyledCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>

        )}
   
      </Paper>
    </Box>
   
   </>
  );
};

export default ListView;