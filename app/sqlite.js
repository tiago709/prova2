import { View, Text, Button, StyleSheet, FlatList, TextInput } from "react-native";
import { useState, useEffect } from "react";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { db, initDb } from "../data/db";

initDb();

function getFilmes(){
  return db.getAllSync('SELECT * FROM filmas');
}

function insertFilmes(ano, titulo, genero) {
  db.runSync('INSERT INTO filmas (ano, titulo, genero) VALUES (?, ?, ?)', [ano, titulo, genero]);
}

function deleteFilmes(id) {
  db.runSync('DELETE FROM filmas WHERE id = ?', [id]);
}

function getFilmesById(id) {
  const [filme] = db.getAllSync('SELECT * FROM filmas WHERE id = ?', [id]);
  return filme;
}

function updateFilmes(id, ano, titulo, genero) {
  db.runSync('UPDATE filmas SET ano = ?, titulo = ?, genero = ? WHERE id = ?', [ano, titulo, genero, id]);
}

function countFilmes() {
 const [resultado] = db.getAllSync('SELECT COUNT(*) as tt FROM filmas');
 return resultado.tt;
}

export default function sqlite() {
  const [ano, setAno] = useState("");
  const [titulo, setTitulo] = useState("");
  const [genero, setGenero] = useState("");
  const [filmes, setFilmes] = useState([]);
  const [contador, setContador] = useState(0);
  const [editandoId, setEditandoId] = useState(null);

  function salvarFilme() {
    const an = parseFloat(ano.trim()); // String(ano) -> editar na hora de colocar na tela
    const ti = titulo.trim();
    const ge = genero.trim();
    if (!an || !ti || !ge) return;
    insertFilmes(an, ti, ge);
    setAno("");
    setTitulo("");
    setGenero("");
    carregarFilme();
  }

  function limparFilme() {
    setAno("");
    setTitulo("");
    setGenero("");
  }

  function carregarFilme() {
    setFilmes(getFilmes());
  }

  function excluirFilme(id) {
    deleteFilmes(id);
    carregarFilme();
  }

  function editarFilme(id) {
    const filme = getFilmesById(id);
    if (!filme) return;
    setAno (String(filme.ano));
    setTitulo(filme.titulo);
    setGenero(filme.genero);
    setEditandoId(id);
  }

  function atualizarFilme() {
    const an = ano.trim();
    const ti = titulo.trim();
    const ge = genero.trim();
    if (!an || !ti || !ge || !editandoId) return;
    updateFilmes(editandoId, an, ti, ge);
    setAno("");
    setTitulo("");
    setGenero("");
    setEditandoId(null);
    carregarFilme();
  }

  useEffect(() => {
    carregarFilme();
  }, []);

  useEffect(() => {
    const tt = countFilmes();
    setContador(tt);
  }, [filmes]);

  return (
    <SafeAreaView style={estilos.container}>
      <Text style={estilos.titulo}>FILMES</Text>
      <Text style={{ fontSize: 16, marginBottom: 10 }}> Total de filmes salvos: {contador}</Text>

      <View style={estilos.linhaEntrada}>
        <TextInput
          value={ano}
          onChangeText={setAno}
          placeholder="ANO"
          keyboardType="numeric"
          style={estilos.campoTexto}
        />
        <TextInput
          value={titulo}
          onChangeText={setTitulo}
          placeholder="TITULO"
          style={estilos.campoTexto}
        />
        <TextInput
          value={genero}
          onChangeText={setGenero}
          placeholder="GENERO"
          style={estilos.campoTexto}
        />
        <Button title="Salvar" onPress={salvarFilme} disabled={!!editandoId} /> 
        <Button title="Atualizar" onPress={atualizarFilme} disabled={!editandoId} />
        <Button title="Carregar filmes" onPress={carregarFilme} />
      </View>

      
      <Text style={estilos.titulo1}>ANO | TITULO | GENERO</Text>
      <FlatList
        data={filmes}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => (
          <View style={estilos.itemLinha}>
            <Text style={estilos.textoItem}>- {item.ano}, {item.titulo}, {item.genero}</Text>  
            <View style={estilos.acoesLinha}>
              <Button title="E" onPress={() => editarFilme(item.id)} />
              <Button title="x" color="#b91c1c" onPress={() => excluirFilme(item.id)} />
            </View>
          </View>
        )}
      />

      <View style={estilos.rodape}>
        <Button title="Voltar" onPress={() => router.back()} />
        <Button title="Início" onPress={() => router.replace("/")} />
        <Button title="Limpar" onPress={() => limparFilme()} />

      </View>
    </SafeAreaView>
  );
}

const estilos = StyleSheet.create({
  container: { 
    flex: 1,
    backgroundColor: '#f9f9f9',
    padding: 16,
  },

  titulo: { 
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: 'center',
    color: "#333",
  },

  titulo1: { 
    fontSize: 12,
    fontWeight: "bold",
    marginBottom: 16,
    color: "#333",
  },

  linhaEntrada: { 
    flexDirection: "column",
    gap: 12,
    marginBottom: 24,
  },

  campoTexto: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 44,
    backgroundColor: "#fff",
  },

  itemLinha: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#fff",
    paddingVertical: 10,
    paddingHorizontal: 12,
    marginBottom: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ddd",
  },

  textoItem: { 
    fontSize: 16, 
    color: "#333",
    flex: 1,
  },

  acoesLinha: {
    flexDirection: "row",
    gap: 6,
  },

  rodape: { 
    flexDirection: "row", 
    justifyContent: "space-between",
    marginTop: 24,
  },
});
