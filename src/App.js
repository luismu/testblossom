import React, { useEffect, useState } from "react";
import { useQuery } from "@apollo/client";
import { GET_CHARACTERS } from "./queries";

import Grid from '@mui/material/Grid';
import Divider from '@mui/material/Divider';
import { ProfilePicture } from "./components/profilePicture";
import "./App.css";

function App() {
  const [allCharacters, setAllCharacters] = useState([]);
  const [starredCharacters, setStarredCharacters] = useState([]);
  const [selectedCharacter, setSelectedCharacter] = useState(null);
  const [speciesFilter, setSpeciesFilter] = useState("all");
  const [listFilter, setListFilter] = useState("all");
  const [filteredCharacters, setFilteredCharacters] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const { loading, error, data } = useQuery(GET_CHARACTERS);

  useEffect(() => {
    if (data) {
      setAllCharacters(data.characters.results);
      setFilteredCharacters(data.characters.results);
    }
  }, [data]);

  useEffect(() => {
    // filter the characters according to the search term
    const filtered = allCharacters.filter(character =>
      character.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredCharacters(filtered);
  }, [allCharacters, searchTerm]);

  const handleToggleStarred = (characterId) => {
    const characterIndex = starredCharacters.findIndex(
      (character) => character.id === characterId
    );
    if (characterIndex === -1) {
      const characterToAdd = allCharacters.find(
        (character) => character.id === characterId
      );
      setStarredCharacters([...starredCharacters, characterToAdd]);
      setFilteredCharacters(filteredCharacters.filter((c) => c.id !== characterId));
    } else {
      const newStarredCharacters = [...starredCharacters];
      newStarredCharacters.splice(characterIndex, 1);
      setStarredCharacters(newStarredCharacters);
      if (selectedCharacter && selectedCharacter.id === characterId) {
        setSelectedCharacter(null);
      }
    }
  };

  const handleCharacterSelect = (character) => {
    setSelectedCharacter(character);
  };

  const handleSoftDelete = (characterId) => {
    const newCharacters = allCharacters.filter(
      (character) => character.id !== characterId
    );
    setAllCharacters(newCharacters);
  };

  const isStarred = (id) => {
    return starredCharacters.findIndex((character) => character.id === id) !== -1;
  };

  const handleSearch = (event) => {
    const searchTerm = event.target.value.toLowerCase();
    const filteredList = allCharacters.filter(
      (character) =>
        character.name.toLowerCase().includes(searchTerm) ||
        character.species.toLowerCase().includes(searchTerm)
    );
    setFilteredCharacters(filteredList);
  };

  return (
    <div>

      <Grid container  direction="row"  justifyContent="space-evenly">
      <Grid item md={3}>
        <h1>Rick and Morty</h1>

        <div>
          <label htmlFor="search">Search:</label>
          <input type="text" id="search" onChange={handleSearch} />
        </div>

        <div>
          <label htmlFor="species-filter">Species:</label>
          <select
            id="species-filter"
            value={speciesFilter}
            onChange={(e) => setSpeciesFilter(e.target.value)}
          >
            <option value="all">All</option>
            <option value="human">Human</option>
            <option value="alien">Alien</option>
          </select>
        </div>
        <div>
          <label htmlFor="list-filter">List:</label>
          <select
            id="list-filter"
            value={listFilter}
            onChange={(e) => setListFilter(e.target.value)}
          >
            <option value="all">All</option>
            <option value="starred">Starred</option>
          </select>
        </div>

        <h2>Starred Characters ({starredCharacters.length})</h2>
        {starredCharacters.map((character) => (
          <Grid className={selectedCharacter?.id === character.id ? 'selected-item' : ''} 
          container
          direction="row"
          justifyContent="space-evenly"
          alignItems="center" key={character.id} onClick={() => handleCharacterSelect(character)}>
            <Divider></Divider>
            <ProfilePicture onClick={() => handleCharacterSelect(character)} img={character.image} width={35} heigth={35}/>
            <Grid direction={'column'}>
              <h3>{character.name.length > 13 ? `${character.name.substring(0, 13)}...` : character.name}</h3>
              <p>{character.species}</p>
            </Grid>
            <span onClick={() => handleToggleStarred(character.id)}>
              {allCharacters.findIndex((c) => c.id === character.id) === -1
                ? "♡"
                : "💚"}
            </span>
          </Grid>
        ))}

        <h2>All Characters ({filteredCharacters.length})</h2>
        

        {filteredCharacters.map((character) => (
          
          <Grid className={selectedCharacter?.id === character.id ? 'selected-item' : ''} container
          direction="row"
          justifyContent="space-evenly"
          alignItems="center" key={character.id} onClick={() => handleCharacterSelect(character)}>
            <Divider></Divider>
            <div onClick={() => handleCharacterSelect(character)}>
              <ProfilePicture img={character.image} width={35} heigth={35}/>
            </div>
            <Grid direction={'column'}>
              <h3>{character.name.length > 13 ? `${character.name.substring(0, 13)}...` : character.name}</h3>
              <p>{character.species}</p>
            </Grid>
            
            
            <span onClick={() => handleToggleStarred(character.id)}>
              {isStarred(character.id) ? "💚" : "♡"}
            </span>
            <span onClick={() => handleSoftDelete(character.id)}> x </span>
            
          </Grid>
        ))}

      </Grid>


      <Grid item md={9}>
          {selectedCharacter && (
          <Grid >
            <ProfilePicture width={75} heigth={75} img={selectedCharacter.image}></ProfilePicture>
            <h2>{selectedCharacter.name}</h2>
            <Divider></Divider>
            <h3>Status</h3>
            <p>{selectedCharacter.status}</p>
            <Divider></Divider>
            <h3>Species</h3>
            <p>{selectedCharacter.species}</p>
            <Divider></Divider>
            <h3>Gender</h3>
            <p>{selectedCharacter.gender}</p>
          </Grid>
        )}
      </Grid>
      </Grid>
    </div>
  );
}

export default App;
