import * as React from 'react';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import axios from 'axios'
import TextField from '@mui/material/TextField';
import styles from '../styles/components/createCard.module.scss'
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import FilledInput from '@mui/material/FilledInput';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputAdornment from '@mui/material/InputAdornment';
import FormHelperText from '@mui/material/FormHelperText';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';





export default function BasicSelect(props) {

 
 
      

  const [selectedTicker, setselectedTicker] = React.useState('');

  //const [ tickerAr, setTickerAr ] = React.useState(['AA','AAA', 'AAAU', 'AAC', 'AAC-U', 'AAC-WS'])

  const [ tickerAr, setTickerAr ] = React.useState([{ticker : 'AA', name : 'Alcoa Corp', desc : "Alcoa Corporation is an American industrial corporation. It is the world's eighth largest producer of aluminum, with corporate headquarters in Pittsburgh, Pennsylvania. Alcoa conducts operations in 10 countries."},
  {ticker : 'AAA', name : 'AAF First Priority CLO', desc : "The Fund seeks capital preservation and income. The Fund is an actively-managed exchange-traded fund that pursues its investment objective by investing, under" },
   {ticker : 'AAAU', name : 'Goldman Sachs Physical Gold ETF', desc : "The investment seeks to provide investors with an opportunity to invest in gold through shares, and have the gold securely stored by the Custodial Sponsor; reflecting the performance of the price of gold less the expenses of the trust's operations is the secondary consideration."},
    {ticker : 'AGNC', name : 'AGNC Investment Corp', desc : "Founded in 2008, AGNC Investment Corp. (“AGNC”) is an internally-managed real estate investment trust (“REIT”)."},
     {ticker : 'AACG', name : 'ATA Creativity Global', desc : "ATA Creativity Global is an international educational services company focused on providing quality learning experiences that cultivate and enhance students' creativity."},
      {ticker : 'FB', name : 'Facebook Inc - Class A', desc : "The social network to rule it all."}])

  const [ tickerCurrentPrice, settickerCurrentPrice ] = React.useState(0)

  const [ buySell, setBuySell  ] = React.useState(null)

  const [ selectedGang, setSelectedGang] = React.useState(null)

  const [ whyTicker ,setWhyTicker ] = React.useState("")

 const [ chartAr, setChartAr] = React.useState([])

 const [  targetPrice, setTargetPrice ] = React.useState(0)

 const [ selectedTickerInfo, setSelectedTickerInfo  ] = React.useState({})
  


  const handleChange = (event) => {
    setselectedTicker(event.target.value);

    setSelectedTickerInfo({...tickerAr.filter((item) => item.ticker == event.target.value)[0]})
    
    axios({
        method: 'GET',
        url: 'https://alpha-vantage.p.rapidapi.com/query',
        params: {
        //  interval: '5min',
          function: 'TIME_SERIES_DAILY',
          symbol: event.target.value,
          datatype: 'json',
          output_size: 'compact'
        },
        headers: {
          'x-rapidapi-host': 'alpha-vantage.p.rapidapi.com',
          'x-rapidapi-key': '466b72e818mshebce3033c8afb41p18ccf5jsnbd473e47c84a'
        }
      }).then(function (response) {
          console.log(response, 'hihi')
        settickerCurrentPrice( response.data['Time Series (Daily)'][response.data['Meta Data']['3. Last Refreshed']]['4. close'])
       let myAr = []
        for (let i in response.data['Time Series (Daily)'])  {
            let myobj = {
                name : [i],
                date : [ parseInt(response.data['Time Series (Daily)'][i]['1. open'])]
            }
            myAr.push(myobj)
        }

        setChartAr([...myAr])
     
    }).catch(function (error) {
        console.error(error);
      });
  };



  const handleTargetPriceChange = (e) => {

    setTargetPrice(e.target.value)
    if (e.target.value > tickerCurrentPrice) {
        setBuySell(1)
    }
    else {
        setBuySell(2)
    }
  }



  const submitForm = () => {
   let myObj =    {
          chartAr : chartAr,
          selectedTicker : selectedTicker,
          tickerCurrentPrice : tickerCurrentPrice,
          selectedGang  : selectedGang,
          whyTicker  : whyTicker,
          tickerInfo : tickerAr[selectedTicker],
          targetPrice : targetPrice,
          selectedTickerInfo : selectedTickerInfo,
          
  } 


   if (localStorage.getItem('allData')){
    let allData =  JSON.parse(localStorage.getItem('allData'))
    console.log(allData, "all")
    myObj.cardInfo = { likes : 0, dislikes : 0, comments : [ {text : "random first Comment", likes : false } ]  }
    allData.allData.allTickers  = [...allData.allData.allTickers, myObj];
   localStorage.setItem('allData',  JSON.stringify(allData));
   props.setNewData(allData)

   }
   else {
    localStorage.setItem('allData',  JSON.stringify({allData : {allTickers : [myObj]}}));
    myObj.cardInfo = {likes : 0, dislikes : 0, comments : [ {text : "random Comment", likes : false } ]  }
    props.setNewData({allData : {allTickers : [myObj]}})
   }

   setChartAr([])
   setselectedTicker("")
   settickerCurrentPrice(0)
   setSelectedGang(null)
   setWhyTicker("")
   props.setCreateForm(false)
  
  props.setReset(!props.reset)
  }

  return (
      <div className = {styles.formContainer}>
      <div>
       <span className = {styles.buySell} >
            {
                buySell ? buySell == 1 ? <span className = {styles.buy}>Buy</span> : <span className = {styles.sell}>Sell</span> : null
            }
        </span>
    <Box sx={{ minWidth: 330, maxWidth : 500, padding : 5, display : "flex", justifyContent : "center", alignItems : "center" }}>
     
      <FormControl fullWidth>
        <Box sx={{ display: 'flex', justifyContent : "space-between" }}>
        <InputLabel id="demo-simple-select-label">Select Picker</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={selectedTicker}
          label="Choose Ticker"
          onChange={handleChange}
          sx={{ minWidth: 200, maxHeight : 50 }}
        >
        {
            tickerAr.map((item, index) => 
                <MenuItem key = {index} value={item.ticker}>{item.ticker}</MenuItem>
            )
        }

             
        
        </Select>
        
        <TextField id="standard-basic" label="Target Price" variant="standard" onChange = {handleTargetPriceChange} sx={{ paddingBottom : 5 , maxWidth : 200}}/>
      
        </Box>   
        
       
        <Box sx={{display : "flex"}}>
        <ToggleButtonGroup
      value={selectedGang}
      exclusive
      onChange={(e) => { setSelectedGang(e.target.value) }}
      aria-label="text alignment"
    >
      <ToggleButton value='HODL GANG' aria-label="left aligned">
       HODL GANG
      </ToggleButton>
      <ToggleButton value="Swinging" aria-label="right aligned">
      Swinging
      </ToggleButton>
      <ToggleButton value="Bear Gang" aria-label="centered">
      Bear Gang
      </ToggleButton>
      
    </ToggleButtonGroup> 
    <span className = {styles.tickerCurrentPrice}>Current Price : {tickerCurrentPrice}</span>
   </Box>
    <FormControl fullWidth sx={{ m: 1, paddingTop : 5 }} variant="filled">
          <InputLabel htmlFor="filled-adornment-amount">Why this ticker?</InputLabel>
          <FilledInput
            id="filled-adornment-amount"
           value={whyTicker}
            onChange={(e) => {setWhyTicker(e.target.value)}}
          //  startAdornment={<InputAdornment position="start"></InputAdornment>}
          />
        </FormControl>

        
      
      </FormControl>
    
    </Box>
    
        <LineChart
          width={500}
          height={200}
          data={chartAr}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="date" stroke="#8884d8" activeDot={{ r: 8 }} />
          
        </LineChart>
      <div className = {styles.submitContainer}> 
     <span onClick = {submitForm}><span>Submit</span></span>
     </div> 
     </div>
    </div>
  );
}