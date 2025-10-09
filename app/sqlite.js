import { View, Text, Button, StyleSheet, FlatList, TextInput } from "react-native";
import { useState, useEffect } from "react";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { db, initDb } from "../data/db";

initDb();

function getTreinos(){
  return db.getAllSync('SELECT * FROM treinos');
}

function insertTreinos(duracaoMin, atividade, categoria) {
  db.runSync('INSERT INTO treinos (duracaoMin, atividade, categoria) VALUES (?, ?, ?)', [duracaoMin, atividade, categoria]);
}

function deleteTreinos(id) {
  db.runSync('DELETE FROM treinos WHERE id = ?', [id]);
}

function getTreinosById(id) {
  const [treino] = db.getAllSync('SELECT * FROM treinos WHERE id = ?', [id]);
  return treino;
}

function updateTreinos(id, duracaoMin, atividade, categoria) {
  db.runSync('UPDATE treinos SET atividade = ?, duracaoMin = ?, categoria = ? WHERE id = ?', [atividade, duracaoMin, categoria, id]);
}

function countTreinos() {
 const [resultado] = db.getAllSync('SELECT COUNT(*) as tt FROM treinos');
 return resultado.tt;
}

export default function sqlite() {
  const [duracaoMin, setDuracaoMin] = useState("");
  const [atividade, setAtividade] = useState("");
  const [categoria, setCategoria] = useState("");
  const [treinos, setTreinos] = useState([]);
  const [contador, setContador] = useState(0);
  const [editandoId, setEditandoId] = useState(null);

  function salvarTreino() {
    const dur = parseFloat(duracaoMin.trim()); // String(duracaoMin) -> editar na hora de colocar na tela
    const at = atividade.trim();
    const cat = categoria.trim();
    if (!dur || !at || !cat) return;
    insertTreinos(dur, at, cat);
    setDuracaoMin("");
    setAtividade("");
    setCategoria("");
    carregarTreino();
  }

  function limparTreino() {
    setDuracaoMin("");
    setAtividade("");
    setCategoria("");
  }

  function carregarTreino() {
    setTreinos(getTreinos());
  }

  function excluirTreino(id) {
    deleteTreinos(id);
    carregarTreino();
  }

  function editarTreino(id) {
    const treino = getTreinosById(id);
    if (!treino) return;
    setDuracaoMin (String(treino.duracaoMin));
    setAtividade(treino.atividade);
    setCategoria(treino.categoria);
    setEditandoId(id);
  }

  function atualizarTreino() {
    const dur = duracaoMin.trim();
    const at = atividade.trim();
    const cat = categoria.trim();
    if (!dur || !at || !cat || !editandoId) return;
    updateTreinos(editandoId, dur, at, cat);
    setDuracaoMin("");
    setAtividade("");
    setCategoria("");
    setEditandoId(null);
    carregarTreino();
  }

  useEffect(() => {
    carregarTreino();
  }, []);

  useEffect(() => {
    const tt = countTreinos();
    setContador(tt);
  }, [treinos]);

  return (
    <SafeAreaView style={estilos.container}>
      <Text style={estilos.titulo}>Treinos</Text>
      <Text style={{ fontSize: 16, marginBottom: 10 }}> Total de treinos: {contador}</Text>

      <View style={estilos.linhaEntrada}>
        <TextInput
          value={duracaoMin}
          onChangeText={setDuracaoMin}
          placeholder="DURACAO"
          keyboardType="numeric"
          style={estilos.campoTexto}
        />
        <TextInput
          value={atividade}
          onChangeText={setAtividade}
          placeholder="ATIVIDADE"
          style={estilos.campoTexto}
        />
        <TextInput
          value={categoria}
          onChangeText={setCategoria}
          placeholder="CATEGORIA"
          style={estilos.campoTexto}
        />
        <Button title="Salvar" onPress={salvarTreino} disabled={!!editandoId} /> 
        <Button title="Atualizar" onPress={atualizarTreino} disabled={!editandoId} />
        <Button title="Carregar treinos" onPress={carregarTreino} />
      </View>

      
      <Text style={estilos.titulo1}>DURAÇÃO | ATIVIDADE | CATEGORIA</Text>
      <FlatList
        data={treinos}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => (
          <View style={estilos.itemLinha}>
            <Text style={estilos.textoItem}>- {item.duracaoMin}, {item.atividade}, {item.categoria}</Text>  
            <View style={estilos.acoesLinha}>
              <Button title="E" onPress={() => editarTreino(item.id)} />
              <Button title="x" color="#b91c1c" onPress={() => excluirTreino(item.id)} />
            </View>
          </View>
        )}
      />

      <View style={estilos.rodape}>
        <Button title="Voltar" onPress={() => router.back()} />
        <Button title="Início" onPress={() => router.replace("/")} />
        <Button title="Limpar" onPress={() => limparTreino()} />

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
