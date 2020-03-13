import React, {useState, useEffect} from 'react';
import logo from './logo.svg';
import './App.css';

const classTypes = [
  'Barbarian', 'Wizard', 'Crusader', 'Monk', 'DemonHunter', 'WitchDoctor', 'Necromancer'
]

const sortItemTypes = (a, b) => a.id > b.id ? 1 : -1

const App = () => {
  const [selectedItemTypes, setSelectedItemTypes] = useState(['Axe2H'])
  const [itemTypes, setItemTypes] = useState([])
  const [items, setItems] = useState([])
  const [selectedItemId, setSelectedItemId] = useState('Unique_Axe_2H_001_x1')
  const [selectedItemFull, setSelectedItemFull] = useState(null)

  const selectedItem = items.find(i => i.id === selectedItemId)
  console.log({selectedItemTypes})
  console.log({selectedItem})
  console.log({selectedItemFull})
  
  useEffect(() => {
    (async () => {
      const itemTypesResponse = await fetch('https://us.api.blizzard.com/d3/data/item-type?locale=en_US&access_token=US87Gk5HjmnwJz2TzFbq5AlVhS1ADB8c1l').then(a => a.json())
      const itemTypesWithItems = await Promise.all(itemTypesResponse.map(async itemType => {
        const itemsResponse = await fetch(`https://us.api.blizzard.com/d3/data/item-type/${itemType.id.toLowerCase()}?locale=en_US&access_token=US87Gk5HjmnwJz2TzFbq5AlVhS1ADB8c1l`)
          .then(a => a.json())
        return {...itemType,
          selected: false,
          items: itemsResponse
        }
      }))
      setItemTypes(itemTypesWithItems.filter(itemType => {
        console.log(itemType)
        return itemType.items.code !== 'NOTFOUND'
      }).sort(sortItemTypes))

      const fullItem = await fetch('https://us.api.blizzard.com/d3/data/item/butchers-carver-Unique_Axe_2H_001_x1?locale=en_US&access_token=US87Gk5HjmnwJz2TzFbq5AlVhS1ADB8c1l')
        .then(a => a.json())

      setSelectedItemFull(fullItem)
    })()
  }, [])
  console.log(itemTypes)

  useEffect(() => {
    setItems(
      itemTypes.filter(itemType => {
        return selectedItemTypes.includes(itemType.id)
      }).reduce((items, itemType) => {
        console.log(itemType)
        return [...items,
          ...itemType.items.reduce((items, item) => {
            return [...items, item]
          }, [])
        ]
      }, [])
    )
  }, [itemTypes, selectedItemTypes])
  console.log({items})

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
      </header>
      <div style={{width: '33%', display: 'inline-block', verticalAlign: 'top'}}>
        <div>
          Item types 
          <input type='radio' checked={selectedItemTypes} />
        </div>
        {selectedItemTypes && <div style={{display: 'inline-grid', gridTemplateColumns: 'repeat(6, 1fr)', gridGap: 10}}>
          {itemTypes.map(itemType => {
            return <div 
              style={{
                
              }}
              className={`box itemType ${selectedItemTypes.includes(itemType.id) ? 'selected' : 'notSelected'}`}
              key={itemType.id}
              onClick={() => {
                console.log(itemTypes)
                setSelectedItemTypes(selectedItemTypes.includes(itemType.id) ? selectedItemTypes.filter(a => a !== itemType.id) : [...selectedItemTypes, itemType.id])
              }}
            >
              <div style={{color: 'white', height: 20}}>
                {itemType.name}
              </div>
              <img src={`http://media.blizzard.com/d3/icons/items/large/${itemType.items[0].icon}.png`} style={{maxWidth: '100%', maxHeight: '100%'}} />
            </div>
          })}
        </div>}
      </div>
      <div style={{width: '33%', display: 'inline-block', verticalAlign: 'top'}}>
        <div>Items</div>
        <div style={{display: 'inline-grid', gridTemplateColumns: 'repeat(6, 1fr)', gridGap: 10}}>
          {items.map(item => {
              return <div
              className={`box itemType ${selectedItemId === item.id ? 'selected' : 'notSelected'}`}
                key={item.id}
                onClick={async () => {
                  setSelectedItemId(item.id)
                  
                  const fullItem = await fetch(`https://us.api.blizzard.com/d3/data/${item.path}?locale=en_US&access_token=US87Gk5HjmnwJz2TzFbq5AlVhS1ADB8c1l`)
                    .then(a => a.json())

                  setSelectedItemFull(fullItem)
                }}
            >
              <div style={{color: 'white', height: 20}}>
                {item.name}
              </div>
              <img src={`http://media.blizzard.com/d3/icons/items/large/${item.icon}.png`} style={{maxWidth: '100%', maxHeight: '100%'}} />
            </div>
            })
          }
        </div>
      </div>
      <div style={{verticalAlign: 'top', width: '33%', display: 'inline-block'}}>
        <div>Selected item</div>
        {selectedItem && <div style={{backgroundColor: '#16161d', borderRadius: 10, color: 'white'}}>
          <div style={{display: 'inline-block', width: '50%', verticalAlign: 'top'}}>
            {selectedItemFull && <div>
              <div>
                <div style={{display: 'inline-block', width: '50%', textAlign: 'right', verticalAign: 'top'}}>
                  <div style={{padding: 5}}>name</div>
                  <div style={{padding: 5}}>damage</div>
                  <div style={{padding: 5}}>dps</div>
                </div>
                <div style={{display: 'inline-block', width: '50%', textAlign: 'left', verticalAign: 'top'}}>
                  <div style={{padding: 5}}>{selectedItemFull.name}</div>
                  <div style={{padding: 5}}>{selectedItemFull.damage && selectedItemFull.damage.split(' ')[0]}</div>
                  <div style={{padding: 5}}>{selectedItemFull.dps}</div>
                </div>
                <div style={{padding: 5}}>Attributes</div>
                {selectedItemFull.randomAffixes && selectedItemFull.randomAffixes.map(randomAffix => {
                  return <div>
                    {randomAffix.oneOf.map(something => {
                      return <div dangerouslySetInnerHTML={{__html: something.textHtml}} />
                    })}
                  </div>
                  // return <div dangerouslySetInnerHTML={{__html: selectedItemFull.damageHtml}} />
                  // <div style={{display: 'inline-block', width: '50%', textAlign: 'left', verticalAign: 'top'}}>

                  // </div>
                  // <div style={{display: 'inline-block', width: '50%', textAlign: 'left', verticalAign: 'top'}}>
  
                  // </div>
                })}
                
                {/* <div dangerouslySetInnerHTML={{__html: selectedItemFull.damageHtml}} /> */}
              </div>
            </div>}
          </div>
          <div style={{display: 'inline-block', width: '50%', verticalAlign: 'top'}}>
            <img src={`http://media.blizzard.com/d3/icons/items/large/${selectedItem.icon}.png`} style={{width: '50%', height: '50%'}} />
          </div>
        </div>}
      </div>
    </div>
  );
}

export default App;
