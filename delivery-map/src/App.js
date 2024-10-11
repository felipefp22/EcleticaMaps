import React, { useEffect } from 'react';
import './App.css';

function App() {
  return (
    <div className="App">

      <div className='barraSuperior'>
        <imput type='text' placeholder='Digite o seu endereço'> </imput>
        <button >Salvar Meu Local</button>
        <button >ATUALIZAR</button>
      </div>

      <div className='mapa'>
      </div>

      <div className='barraPedidos'>
      </div>
    </div>
  );
}

export default App;