import React, { useEffect, useState } from 'react';
import Web3 from 'web3'
import './App.css';
import MemoryToken from '../abis/MemoryToken.json'
import brain from '../brain.png'
import blank from '../blank.png'
import White from '../white.png'
const CARD_ARRAY = [
  {
    name: 'fries',
    img: '/images/fries.png'
  },
  {
    name: 'cheeseburger',
    img: '/images/cheeseburger.png'
  },
  {
    name: 'ice-cream',
    img: '/images/ice-cream.png'
  },
  {
    name: 'pizza',
    img: '/images/pizza.png'
  },
  {
    name: 'milkshake',
    img: '/images/milkshake.png'
  },
  {
    name: 'hotdog',
    img: '/images/hotdog.png'
  },
  {
    name: 'fries',
    img: '/images/fries.png'
  },
  {
    name: 'cheeseburger',
    img: '/images/cheeseburger.png'
  },
  {
    name: 'ice-cream',
    img: '/images/ice-cream.png'
  },
  {
    name: 'pizza',
    img: '/images/pizza.png'
  },
  {
    name: 'milkshake',
    img: '/images/milkshake.png'
  },
  {
    name: 'hotdog',
    img: '/images/hotdog.png'
  }
]


const App = () => {
const [account, setAccount] = useState('0x0');
const [token, setToken ] = useState(null);
const [totalSupply, setTotalSupply ] = useState(0);
const [tokenURIs, setTokenURIs] = useState([]);
const [cardArray, setCardArray] = useState([]);
const [cardsChosen, setCardsChosen] = useState([]);
const [cardsChosenId, setCardsChosenId] = useState([]);
const [cardsWon, setCardsWon] = useState([]);
const [alreadyChosen, setAlreadyChosen] = useState(0);

useEffect(() => {
  loadWeb3()
  loadBlockchainData()
  setCardArray(CARD_ARRAY.sort(()=> 0.5 - Math.random()))
 
}, [])

useEffect(() => {
  if (alreadyChosen === 1) {

    setTimeout(checkForMatch, 100)

  }
}, [alreadyChosen])

async function loadWeb3(){
  if(window.ethereum){
    window.web3 = new Web3(window.ethereum)
    await window.ethereum.enable()
  }
  else if(window.web3){
    window.web3 = new Web3(window.web3.currentProvider)
  }
  else{
    window.alert('Non-Ethereum browser detected. You should consider tying Metamask!')
  }
}


async function loadBlockchainData(){
  const web3 = window.web3
  const accounts = await web3.eth.getAccounts()
//this.setState({ account: accounts[0] })
setAccount( accounts[0]);
//Load smart contracts 
const networkId = await web3.eth.net.getId()
console.log(networkId);
const networkData = MemoryToken.networks[networkId]
if(networkData){
  const abi = MemoryToken.abi
  const address = networkData.address
  const token = new web3.eth.Contract(abi, address)
  // this.setState( { token })
  setToken(token)
  const totalSupply = await token.methods.totalSupply().call()
  // this.setState({ totalSupply })
  setTotalSupply(totalSupply)
  //Load Tokens
  let nftItems = [];
  let balanceOf = await token.methods.balanceOf(accounts[0]).call()
    for(let i = 0; i < balanceOf; i++){
      let id = await token.methods.tokenOfOwnerByIndex(accounts[0], i).call()
      let tokenURI = await token.methods.tokenURI(id).call()
    //   this.setState({
    //     tokenURIs: [...this.state.tokenURIs, tokenURI]
    //   })
    nftItems.push(tokenURI)
    setTokenURIs(nftItems)
    }
} else {
  alert('Smart contract not deployed to detected network.')
}
}
const chooseImage = (cardId) => {
  cardId = cardId.toString()
  if(cardsWon.includes(cardId)){
    return White
  }else if(cardsChosenId.includes(cardId)){
    return CARD_ARRAY[cardId].img
  }else{
    return blank
  }
  // return window.location.origin = '/images/blank.png'
}

const flipCard = async(cardId) => {
  setAlreadyChosen(cardsChosen.length);

  // this.setState({
  //   cardsChosen : [...this.state.cardsChosen, this.state.cardArray[cardId].name],
  //   cardsChosenId : [...this.state.cardsChosenId, cardId]
  // })
  let cardChoosed = [...cardsChosen];
  cardChoosed.push(cardArray[cardId].name)
  setCardsChosen(cardChoosed);
  let cardChosedIds = [...cardsChosenId];
    cardChosedIds.push(cardId);
  setCardsChosenId(cardChosedIds)
 
}
const checkForMatch = async() => {
  const optionOneId =  cardsChosenId[0]
  const optionTwoId =  cardsChosenId[1]
  const cardimg =    CARD_ARRAY[optionOneId].img.toString();
  if(optionOneId == optionTwoId){
    alert('You have clicked the same image!')
  } else if (cardsChosen[0] === cardsChosen[1]){
  alert('You found a match')
  token.methods.mint(
    account,
    cardimg
  )
  .send({ from: account })
  .on('transactionHash', (hash) => {
    setCardsWon([...cardsWon, optionOneId, optionTwoId])
    setTokenURIs ([...tokenURIs, CARD_ARRAY[optionOneId].img])
  })
  } else {
    alert('Sorry, try again')
  }
  setCardsChosen([]);
  setCardsChosenId([])
 
  if(cardsWon.length === CARD_ARRAY.length){
    alert('Congo, You found them all!')
  }
  }

  return (
    <div>
      <nav className="navbar navbar-dark fixed-top bg-dark flex-md-nowrap p-0 shadow">
        <a
          className="navbar-brand col-sm-3 col-md-2 mr-0"
          href="http://www.dappuniversity.com/bootcamp"
          target="_blank"
          rel="noopener noreferrer"
        >
        <img src={brain} width="30" height="30" className="d-inline-block align-top" alt="" />
        &nbsp; Memory Tokens
        </a>
        <ul className="navbar-nav px-3">
          <li className="nav-item text-nowrap d-none d-sm-none d-sm-block">
            <small className="text-muted"><span id="account">{account}</span></small>
          </li>
        </ul>
      </nav>
      <div className="container-fluid mt-5">
        <div className="row">
          <main role="main" className="col-lg-12 d-flex text-center">
            <div className="content mr-auto ml-auto">
              <h1 className="d-4">Start matching now!</h1>

              <div className="grid mb-4" >
{ cardArray.map((card, key)=>{
return(
 <img 
   key={key}
   src={chooseImage(key)}
   data-id = {key}
   onClick={(event) =>{
     let cardId = event.target.getAttribute('data-id')
     if(!cardsWon.includes(cardId.toString())){
       flipCard(cardId)
     }
   }}
 />
)
})}

              </div>

              <div>

<h5>Token Collected: <span id = "result">&nbsp;{tokenURIs.length}</span></h5>
                <div className="grid mb-4" >
{ tokenURIs.map((tokenURI, key)=>{
return(
  <img key={key}
    src={tokenURI}
  />
)
})}

                </div>

              </div>

            </div>

          </main>
        </div>
      </div>
    </div>
  );
}

export default App
