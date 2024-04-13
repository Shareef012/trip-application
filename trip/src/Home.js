// Home.js
import React,{useState,useEffect} from 'react';
import './Home.css';


export let items = [
  {
    id : "1",
    name:"Dubai",
    src : "https://imgs.search.brave.com/8OGD92YhDL-hkaxyQ2p_dzw-2Y2khClT3BVqbsUZr3c/rs:fit:500:0:0/g:ce/aHR0cHM6Ly9tZWRp/YS5nZXR0eWltYWdl/cy5jb20vaWQvMTgz/MzQyODI0L3Bob3Rv/L3N0eWxpemVkLWFl/cmlhbC12aWV3LW9m/LWR1YmFpLWNpdHku/anBnP3M9NjEyeDYx/MiZ3PTAmaz0yMCZj/PW91dFpPVDlET0Y2/bFJocDlTNnBYWS1G/SFZ0MV85eVczZTRU/b0UyLVMxTjA9",
    
  },
  {
    id : "2",
    name : "Paris",
    src : "https://imgs.search.brave.com/CqodOlAmWIM21AWydiuJMsn7ZRcmJGT664Yz7XPpevw/rs:fit:500:0:0/g:ce/aHR0cHM6Ly9tZWRp/YS5pc3RvY2twaG90/by5jb20vaWQvOTI0/ODk0MzI0L3Bob3Rv/L2VpZmZlbC10b3dl/ci1pbi1wYXJpcy1m/cmFuY2UuanBnP3M9/NjEyeDYxMiZ3PTAm/az0yMCZjPS1KdHZG/S2VGUXF5NGd4aUNh/VFFYQmxobE1LWHdz/blV1UHE4aVVILWRx/T289"
  },
  {
    id : "3",
    name : "Canada",
    src : "https://imgs.search.brave.com/cUgND5kKGn3PDzApBpImOmLKzSMtcEBOpM4a19ZzSSY/rs:fit:500:0:0/g:ce/aHR0cHM6Ly93d3cu/dHJpcHNhdnZ5LmNv/bS90aG1iL3lDSG1J/RGJYTVJyUHpCb2tZ/ZHljUDBiTHpnRT0v/MTUwMHgwL2ZpbHRl/cnM6bm9fdXBzY2Fs/ZSgpOm1heF9ieXRl/cygxNTAwMDApOnN0/cmlwX2ljYygpL0dl/dHR5SW1hZ2VzLTg1/Mjk4NTY5MC01OWRl/NmQ3NzY4NWZiZTAw/MTBjYjZkZGMuanBn"
  },
  {
    id : "4",
    name : "America",
    src : "https://imgs.search.brave.com/EHkE2tylh9Gzwt8z0CiW3YOFJbbeNrvFhyBzpkbHBvI/rs:fit:500:0:0/g:ce/aHR0cHM6Ly91cGxv/YWQud2lraW1lZGlh/Lm9yZy93aWtpcGVk/aWEvY29tbW9ucy80/LzRkL1BoaWxseV9z/a3lsaW5lLmpwZw"
  },
  {
    id : "5",
    name : "Singapore",
    src : "https://imgs.search.brave.com/7Qi-qKrDoNQDLGASv7Q7N6yD5ibTw-xeSRk58TzaDaU/rs:fit:500:0:0/g:ce/aHR0cHM6Ly9tZWRp/YS5nZXR0eWltYWdl/cy5jb20vaWQvMTU1/Mjg0MjI4L3Bob3Rv/L2NlbnRyYWwtYnVz/aW5lc3MtZGlzdHJp/Y3Qtc2luZ2Fwb3Jl/LWNpdHkuanBnP3M9/NjEyeDYxMiZ3PTAm/az0yMCZjPVZJUU5r/b1preG1IR2prZ2dO/NlJTc0plOElieG9I/bDhKelNoTldremlB/RUk9"
  },
  {
    id : "6",
    name : "Malayasia",
    src : "https://imgs.search.brave.com/shnxTccJ_GoVzxB1gbyZRBJsn-35lj1XcPJooarG1-4/rs:fit:500:0:0/g:ce/aHR0cHM6Ly9jZG4u/cGl4YWJheS5jb20v/cGhvdG8vMjAxNi8w/My8yNy8xNy8wOS9r/dWFsYS1sdW1wdXIt/MTI4MzE0MF82NDAu/anBn"
  },
  {
    id : "7",
    name : "Greenland",
    src : "https://imgs.search.brave.com/xrVaOaO-mUgEVd4KPUFc2k_Ak0OVUvyFk97ng1xZp88/rs:fit:860:0:0/g:ce/aHR0cHM6Ly9pMi53/cC5jb20vcGhvdG9z/LnNtdWdtdWcuY29t/L0V1cm9wZS9HcmVl/bmxhbmQvTnV1ay1G/am9yZHMvaS1aclMz/cTJmLzAvOTgwZjFk/NzYvWEwvSU1HXzAy/NTQtWEwuanBn"
  },
  {
    id : "8",
    name : "Maldives",
    src : "https://imgcld.yatra.com/ytimages/image/upload/t_seo_Magnum_w_373_h_248_c_fill_g_auto_q_auto:good_f_jpg/v1396178599/International%20Holidays/Maldives/Maldives/shutterstock_76399303.jpg"
  },
  {
    id : "9",
    name : "India",
    src : "https://imgs.search.brave.com/3IElwqFqB6Lxg6slOiRXzBfT59zDy_yN-qSilWXz-FI/rs:fit:500:0:0/g:ce/aHR0cHM6Ly93d3cu/cGxhbmV0d2FyZS5j/b20vd3BpbWFnZXMv/MjAyMC8wMS9pbmRp/YS1pbi1waWN0dXJl/cy1iZWF1dGlmdWwt/cGxhY2VzLXRvLXBo/b3RvZ3JhcGgtZ2F0/ZXdheS1vZi1pbmRp/YS1tdW1iYWkuanBn"
  }

]

const Home = () => {
  const [searchText, setSearchText] = useState('');
  const [filteredItems, setFilteredItems] = useState(items);


 

  const handleSearch = (e) => {
    const text = e.target.value;
    setSearchText(text);

    const filteredArray = items.filter((item) =>
      item.name.toLowerCase().includes(text.toLowerCase())
    );
    setFilteredItems(filteredArray);
  };

  
  return (
    <div className="home">
      <form action="" method="">
        <input
          type="text"
          id="search-bar"
          placeholder="Search the place..."
          value={searchText}
          onChange={handleSearch}
          className='search-bar'
        />
        
      </form>

      <div className="cards">
        {filteredItems.map((item) => (
          <div className="card" key={item.name}>
            <img src={item.src} alt={item.name} />
            <p>{item.name}</p>
          </div>
        ))}
      </div>

      
    </div>
  );
};

export default Home;
