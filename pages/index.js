import react, {useEffect, useState} from 'react'
import axios from 'axios';
import styles from '../styles/pages/homepage.module.scss'
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import CreateCardForm from '../Components/createCardForm'
import Avatar from '@mui/material/Avatar';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import dynamic from "next/dynamic";
import Chip from '@mui/material/Chip';

const Picker = dynamic(
  () => {
    return import('emoji-picker-react');
  },
  { ssr: false }
);




export default function index() {



    const [ createForm ,setCreateForm ] = useState(false)

    const [ newData, setNewData ]  = useState({allData : {allTickers : []}})

    const [ reset ,setReset ]  = useState(false)

    const [ haveLiked, setHaveLiked ] = useState(false)

    const [ haveDisLiked, setHaveDisLiked ] = useState(false)

    const [ selectedCard, setSelectedCard ] = useState(-1)

    const [ commendLiked, setCommendLiked ] = useState(false)

    const [ emoFlag,setEmoFlag] = useState(false)

    const [chosenEmoji, setChosenEmoji] = useState(null);

    const [ comment, setComment ] = useState("")

    
 
useEffect(() => {
  if (localStorage.getItem('allData')){ 
  let allData =  JSON.parse(localStorage.getItem('allData'))
  setNewData({...allData})
  console.log(allData.allData.allTickers, "al ofit")
  }

}, [])



useEffect(() => {
console.log(newData, "NEWdAATA")
}, [newData])





const onEmojiClick = (event, emojiObject) => {
  console.log(emojiObject, "EMOJIOBJECT")
  setChosenEmoji(emojiObject.emoji);
  setComment(comment+emojiObject.emoji)
  setEmoFlag(false)
};

const likeDislikeACard = (likedIndex, likeFlag) => {
  

  let tryAr =  newData.allData.allTickers

 if (likeFlag){
  if (!haveLiked) {
    tryAr = tryAr.map((item, index) => {
      if (index == likedIndex) {
        return {
          ...item, cardInfo : { ...item.cardInfo, likes : item.cardInfo.likes+1, dislikes : haveDisLiked ? item.cardInfo.dislikes-1 : item.cardInfo.dislikes }
        }
      }
      else {
        return item
      }
    })
  }
  else {
    tryAr = tryAr.map((item, index) => {
      if (index == likedIndex) {
        return {
          ...item, cardInfo : { ...item.cardInfo, likes : item.cardInfo.likes-1}
        }
      }
      else {
        return item
      }
    })

  }
  setHaveLiked(!haveLiked);
  setHaveDisLiked(false);
}
else {
  if (!haveDisLiked) {
    tryAr = tryAr.map((item, index) => {
      if (index == likedIndex) {
        return {
          ...item, cardInfo : { ...item.cardInfo, dislikes : item.cardInfo.dislikes+1, likes : haveLiked ? item.cardInfo.likes-1 : item.cardInfo.likes }
        }
      }
      else {
        return item
      }
    })
  }
  else {
    tryAr = tryAr.map((item, index) => {
      if (index == likedIndex) {
        return {
          ...item, cardInfo : { ...item.cardInfo, dislikes : item.cardInfo.dislikes-1}
        }
      }
      else {
        return item
      }
    })

  }
  setHaveDisLiked(!haveDisLiked);
  setHaveLiked(false);
}

setNewData({...newData, allData : {allTickers : [...tryAr]}})

}


const addComment = (givenIndex) => {
  let tryAr =  newData.allData.allTickers

  tryAr = tryAr.map((item, index) => {
    if (index == givenIndex) {
      return {
        ...item, cardInfo : { ...item.cardInfo, comments : [...item.cardInfo.comments, {text : comment , likes : false }]}
      }
    }
    else {
      return item
    }
  })
  setNewData({...newData, allData : {allTickers : [...tryAr]}})
  setComment("")
}

const commentLikeDisliked =  (givenIndex, commentIndex) => {
  let tryAr =  newData.allData.allTickers

  tryAr = tryAr.map((item, index) => {
    if (index == givenIndex) {
      return {
        ...item, cardInfo : { ...item.cardInfo, comments : [...item.cardInfo.comments.map((item, commIndex)=> {
          if (commentIndex == commIndex) {
            return {
              ...item, likes : !item.likes
            }
          }
          else {
            return item
          }
          }) ]}
      }
    }
    else {
      return item
    }
  })
  setNewData({...newData, allData : {allTickers : [...tryAr]}})
}



    return (
        <div className = {styles.container}>
        {
            createForm ? 
            <CreateCardForm
            setCreateForm = {setCreateForm}
            setNewData =  {setNewData}
            reset = { reset }
            setReset = {setReset}
            />
             : 
        
        <div className = {`${styles.cardContainer}  ${selectedCard != -1 ? styles.selectedCards : null }`}>
        {
          newData.allData.allTickers.length > 0 ?
          newData.allData.allTickers.map((item, index) => 
          <div className = {styles.cardParent}>
            <div className = {`${styles.card} ${selectedCard == index ? styles.selected : null }`} onClick = {() => setSelectedCard(index)}>
            <div className = {styles.innerCard}>
            <Stack direction="row" spacing={2}>
          <Avatar alt="Remy Sharp" src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRydnOlZQYVRlkPi5S-CtSfCorfEDlZV9wDNqBY8IQ7D5VRtM9uCRr3-GIKLd3xilSALRw&usqp=CAU" />
          <div>
            <div className = {styles.john}>John Doe</div>
            <div className = {styles.time}>2 hours ago</div>
          </div>
          <span className = {styles.rating}>
          4.1
          </span>
          <span className = {styles.star}>
          <img src= "./assets/star.png" height = "25px" width ="25px"/>
          </span>
        
         </Stack>
         <div className = {styles.compName}>
           <div style = {{maxWidth : "150px"}}>{item.selectedTickerInfo.name}</div>
           <div className = {styles.buyTarget}>
            <div className = {styles.buy}> Buy <span>{item.tickerCurrentPrice}</span></div>
            <div className = {styles.target}>Target <span>{item.targetPrice}</span></div>
           </div>
         </div>
         <div className = {styles.whyTicker}>
        {item.whyTicker}
         </div>

         <div className = {styles.likeDislike}>
          <div>
          
          {
            !haveLiked ? 
          
           <img src = "./assets/like.png" height = "25px" width ="25px" onClick={ () => {likeDislikeACard(index, true)}}/>
           : 
           <img src = "./assets/likeFill.png" height = "25px" width ="25px" onClick={() => {likeDislikeACard(index, true)}} />
          }
          
           <span className = {styles.number}>{item.cardInfo.likes ? item.cardInfo.likes : 0}</span>
           </div>
           <div>
        {
           !haveDisLiked ?
        

           <img src = "./assets/dislike.png" height = "25px" width ="25px" onClick={() => {likeDislikeACard(index, false)}}/>
           :
           <img src = "./assets/dislikeFill.png" height = "25px" width ="25px" onClick={() => {likeDislikeACard(index, false)}} />
        }
           <span className = {styles.number}>{item.cardInfo.dislikes ? item.cardInfo.dislikes : 0}</span>
           </div>
          
         </div>
         {
          selectedCard == index ?
         
         <Chip label={item.selectedGang} color="primary" variant="outlined"/>
         : null }
         <div className ={ styles.compInfo}>
          <div >
          About This Company
          </div>
          <div className= {styles.compInfoText}>
         {item.selectedTickerInfo.desc}
          </div>
         </div>
         </div>
       {

       selectedCard == index ?
       <>
        <Box sx={{ display: 'flex', paddingLeft : 2 }}>
         <Avatar sx={{ marginRight : 3}}  alt="Remy Sharp" src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRydnOlZQYVRlkPi5S-CtSfCorfEDlZV9wDNqBY8IQ7D5VRtM9uCRr3-GIKLd3xilSALRw&usqp=CAU" />
         <TextField value = {comment} id="standard-basic" label="Add comment..." variant="standard"  sx={{ maxWidth : 200}} onChange = {(e) => setComment(e.target.value)}/>
         <span onClick = {() => setEmoFlag(true)}><img src = "./assets/surprised.png" height = "20px" width ="20px"/></span>

<div className = {styles.submitContainer}> 
<span onClick = {() => {addComment(index)}}><span>Post</span></span>
</div> 
       {
         emoFlag ? 
       
        <div className = {styles.emoPicker}>
         <Picker onEmojiClick={onEmojiClick}/>
         </div>
         : null }
         </Box>
       

         {
          item.cardInfo.comments.map((commentItem, commentindex) => 
         
         <Box sx={{ display: 'flex', paddingTop : 3, paddingBottom : 3, paddingLeft : 2 }}>
         <Avatar sx={{ marginRight : 3}}  alt="Remy Sharp" src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRydnOlZQYVRlkPi5S-CtSfCorfEDlZV9wDNqBY8IQ7D5VRtM9uCRr3-GIKLd3xilSALRw&usqp=CAU" />
         <div style = {{paddingRight : "40px"}}>
        
         <div>Prakhar Parashar</div>
         <span style ={{fontWeight : "400"}}>{commentItem.text}</span>
         </div>
         
           <div onClick = {() => commentLikeDisliked(index, commentindex)}>
           {
           commentItem ? !commentItem.likes ? <img src = "./assets/heart.png" width="25px" height = "25px"/> : <img src = "./assets/heart Fill.png"  width="25px" height = "25px"/>
           
           : null}
           </div>
         
         
         </Box>)}
         </> : null
       }
          </div>
            </div>
            
          )
          : null
        }

        <div className = {styles.cardParent}>
            <div className = {`${styles.card} ${selectedCard == -2 ? styles.selected : null }`} onClick = {() => setSelectedCard(-2)}>
            <div className = {styles.innerCard}>
            <Stack direction="row" spacing={2}>
          <Avatar alt="Remy Sharp" src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRydnOlZQYVRlkPi5S-CtSfCorfEDlZV9wDNqBY8IQ7D5VRtM9uCRr3-GIKLd3xilSALRw&usqp=CAU" />
          <div>
            <div className = {styles.john}>John Doe</div>
            <div className = {styles.time}>2 hours ago</div>
          </div>
          <span className = {styles.rating}>
          4.1
          </span>
          <span className = {styles.star}>
          <img src= "./assets/star.png" height = "25px" width ="25px"/>
          </span>
         </Stack>
         <div className = {styles.compName}>
           <div>{"Facebook"}</div>
           <div className = {styles.buyTarget}>
            <div className = {styles.buy}> Buy <span>234</span></div>
            <div className = {styles.target}>Target <span>112</span></div>
           </div>
         </div>
         <div className = {styles.whyTicker}>
         Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s,
         </div>

         <div className = {styles.likeDislike}>
          <div>
          
          {
            !haveLiked ? 
          
           <img src = "./assets/like.png" height = "25px" width ="25px" onClick={() => {setHaveLiked(!haveLiked); setHaveDisLiked(false);}}/>
           : 
           <img src = "./assets/likeFill.png" height = "25px" width ="25px" onClick={() => {setHaveLiked(!haveLiked); setHaveDisLiked(false);}} />
          }
          
           <span className = {styles.number}>4</span>
           </div>
           <div>
        {
           !haveDisLiked ?
        

           <img src = "./assets/dislike.png" height = "25px" width ="25px" onClick={() => {setHaveDisLiked(!haveDisLiked); setHaveLiked(false)}}/>
           :
           <img src = "./assets/dislikeFill.png" height = "25px" width ="25px" onClick={() => {setHaveDisLiked(!haveDisLiked); setHaveLiked(false)}} />
        }
           <span className = {styles.number}>7</span>
           </div>
         </div>

         <div className ={ styles.compInfo}>
          <div >
          About This Company
          </div>
          <div className= {styles.compInfoText}>
          Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s,
          </div>
         </div>
         </div>
       {

       selectedCard == -2 ?
       <>
        <Box sx={{ display: 'flex', paddingLeft : 2 }}>
         <Avatar sx={{ marginRight : 3}}  alt="Remy Sharp" src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRydnOlZQYVRlkPi5S-CtSfCorfEDlZV9wDNqBY8IQ7D5VRtM9uCRr3-GIKLd3xilSALRw&usqp=CAU" />
         <TextField value = {comment} id="standard-basic" label="Add comment..." variant="standard"  sx={{ maxWidth : 200}} onChange = {(e) => setComment(e.target.value)}/>
         <span onClick = {() => setEmoFlag(true)}><img src = "./assets/surprised.png" height = "20px" width ="20px"/></span>

         <div className = {styles.submitContainer}> 
     <span><span>Post</span></span>
     </div> 
       {
         emoFlag ? 
       
        <div className = {styles.emoPicker}>
         <Picker onEmojiClick={onEmojiClick}/>
         </div>
         : null }
         </Box>

         <Box sx={{ display: 'flex', paddingTop : 3, paddingBottom : 3, paddingLeft : 2 }}>
         <Avatar sx={{ marginRight : 3}}  alt="Remy Sharp" src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRydnOlZQYVRlkPi5S-CtSfCorfEDlZV9wDNqBY8IQ7D5VRtM9uCRr3-GIKLd3xilSALRw&usqp=CAU" />
         <div style = {{paddingRight : "40px"}}>
         <div>Prakhar Parashar</div>
         <span style ={{fontWeight : "400", paddingBottom : "100px"}}>Lorem ipsum kind of comment</span>
         </div>
         
           <div onClick = {() => {commentLikeDisliked(index)}}>
           {
           !commendLiked ? <img src = "./assets/heart.png" width="25px" height = "25px"/> : <img src = "./assets/heart Fill.png"  width="25px" height = "25px"/>
           }
           </div>
           
         
         </Box>
         </> : null
       }
          </div>
            </div>

            <div className = {styles.cardParent}>
            <div className = {`${styles.card} ${selectedCard == -3 ? styles.selected : null }`} onClick = {() => setSelectedCard(-3)}>
            <div className = {styles.innerCard}>
            <Stack direction="row" spacing={2}>
          <Avatar alt="Remy Sharp" src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRydnOlZQYVRlkPi5S-CtSfCorfEDlZV9wDNqBY8IQ7D5VRtM9uCRr3-GIKLd3xilSALRw&usqp=CAU" />
          <div>
            <div className = {styles.john}>John Doe</div>
            <div className = {styles.time}>2 hours ago</div>
          </div>
          <span className = {styles.rating}>
          4.1
          </span>
          <span className = {styles.star}>
          <img src= "./assets/star.png" height = "25px" width ="25px"/>
          </span>
         </Stack>
         <div className = {styles.compName}>
           <div>{"Facebook"}</div>
           <div className = {styles.buyTarget}>
            <div className = {styles.buy}> Buy <span>234</span></div>
            <div className = {styles.target}>Target <span>114</span></div>
           </div>
         </div>
         <div className = {styles.whyTicker}>
         Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s,
         </div>

         <div className = {styles.likeDislike}>
          <div>
          
          {
            !haveLiked ? 
          
           <img src = "./assets/like.png" height = "25px" width ="25px" onClick={() => {setHaveLiked(!haveLiked); setHaveDisLiked(false);}}/>
           : 
           <img src = "./assets/likeFill.png" height = "25px" width ="25px" onClick={() => {setHaveLiked(!haveLiked); setHaveDisLiked(false);}} />
          }
          
           <span className = {styles.number}>4</span>
           </div>
           <div>
        {
           !haveDisLiked ?
        

           <img src = "./assets/dislike.png" height = "25px" width ="25px" onClick={() => {setHaveDisLiked(!haveDisLiked); setHaveLiked(false)}}/>
           :
           <img src = "./assets/dislikeFill.png" height = "25px" width ="25px" onClick={() => {setHaveDisLiked(!haveDisLiked); setHaveLiked(false)}} />
        }
           <span className = {styles.number}>7</span>
           </div>
         </div>

         <div className ={ styles.compInfo}>
          <div >
          About This Company
          </div>
          <div className= {styles.compInfoText}>
          Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s,
          </div>
         </div>
         </div>
       {

       selectedCard == -3 ?
       <>
        <Box sx={{ display: 'flex' }}>
         <Avatar sx={{ marginRight : 3}}  alt="Remy Sharp" src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRydnOlZQYVRlkPi5S-CtSfCorfEDlZV9wDNqBY8IQ7D5VRtM9uCRr3-GIKLd3xilSALRw&usqp=CAU" />
         <TextField value = {comment} id="standard-basic" label="Add comment..." variant="standard"  sx={{ maxWidth : 200}} onChange = {(e) => setComment(e.target.value)}/>
         <span onClick = {() => setEmoFlag(true)}>Open</span>
       {
         emoFlag ? 
       
        <div className = {styles.emoPicker}>
         <Picker onEmojiClick={onEmojiClick}/>
         </div>
         : null }
         </Box>

         <Box sx={{ display: 'flex', paddingTop : 3 }}>
         <Avatar sx={{ marginRight : 3}}  alt="Remy Sharp" src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRydnOlZQYVRlkPi5S-CtSfCorfEDlZV9wDNqBY8IQ7D5VRtM9uCRr3-GIKLd3xilSALRw&usqp=CAU" />
         <div style = {{paddingRight : "40px"}}>
         
         <div>Prakhar Parashar</div>
         <span>Lorem ipsum kind of comment</span>
         </div>
         
           <div onClick = {() => setCommendLiked(!commendLiked)}>
           {
           !commendLiked ? <img src = "./assets/heart.png" width="25px" height = "25px"/> : <img src = "./assets/heart Fill.png"  width="25px" height = "25px"/>
           }
           </div>
          
         
         </Box>
         </> : null
       }
          </div>
            </div>
        </div>
        }
        <div className = {styles.addIcon} onClick = {() => setCreateForm(true)}>
        <img src="https://img.icons8.com/fluency/48/000000/add.png"/>
        </div>
        </div>
    )
}