const { useState, useEffect } = React;

function App() {
    const [personagens, setPersonagens] = useState([]);
    const [busca, setBusca] = useState("");
    const [modo, setModo] = useState("grid");
    const [carregando, setCarregando] = useState(false);
    const [modoBusca, setModoBusca] = useState(false);

    const carregarPersonagensIniciais = () => {
        setCarregando(true);
        fetch("https://rickandmortyapi.com/api/character")
            .then(res => res.json())
            .then(dados => setPersonagens(dados.results || []))
            .finally(() => setCarregando(false));
    };

    const buscarPersonagens = () => {
        if (!busca) return;
        setCarregando(true);
        setModoBusca(true);
        setTimeout(() => {
            fetch(`https://rickandmortyapi.com/api/character/?name=${busca}`)
                .then(res => res.json())
                .then(dados => setPersonagens(dados.results || []))
                .finally(() => setCarregando(false));
        }, 1000);
    };

    const voltarInicio = () => {
        setBusca("");
        setModoBusca(false);
        carregarPersonagensIniciais();
    };

    const lidarEnter = (evento) => {
        if (evento.key === "Enter") buscarPersonagens();
    };

    const abrirPesquisa = (nome) => {
        window.open(`https://www.google.com/search?q=personagem rick e morty ${nome}`, "_blank");
    };

    const alternarView = () => setModo(modo === "grid" ? "lista" : "grid");

    const renderizarTopo = () => (
        <div className="topo-container">
            <a href="https://rickandmortyapi.com/" target="_blank" className="logo">
                <img src="./rick-morty_img_010.png" alt="Logo Rick & Morty" />
            </a>
            <div className="controles">
                <input
                    type="text"
                    placeholder="Pesquisar personagem..."
                    value={busca}
                    onChange={e => setBusca(e.target.value)}
                    onKeyDown={lidarEnter}
                />
                <button onClick={buscarPersonagens}>Buscar</button>
                <button onClick={alternarView}>{modo === "grid" ? "Ver em Lista" : "Ver em Grid"}</button>
                {modoBusca && <button style={{background: '#475569', color: '#fff'}} onClick={voltarInicio}>Limpar</button>}
            </div>
        </div>
    );

    const renderizarLoading = () => <div className="loading">CARREGANDO PORTAL...</div>;

    const renderizarGrid = () => (
        <div className="grid">
            {personagens.map(p => (
                <div className="card" key={p.id}>
                    <img src={p.image} onClick={() => abrirPesquisa(p.name)} alt={p.name} />
                    <div>{p.name}</div>
                </div>
            ))}
        </div>
    );

    const renderizarLista = () => (
        <div className="lista">
            {personagens.map(p => (
                <div className="item-lista" key={p.id}>
                    <img src={p.image} onClick={() => abrirPesquisa(p.name)} alt={p.name} />
                    <div>
                        <div className="nome">{p.name}</div>
                        <div className="planeta">Origem: {p.origin?.name || "Desconhecido"}</div>
                    </div>
                </div>
            ))}
        </div>
    );

    const renderizarConteudo = () => carregando ? renderizarLoading() : (modo === "grid" ? renderizarGrid() : renderizarLista());

    useEffect(() => {
        carregarPersonagensIniciais();
    }, []);

    return (
        <div>
            {renderizarTopo()}
            {renderizarConteudo()}
        </div>
    );
}

ReactDOM.createRoot(document.getElementById("app")).render(<App />);