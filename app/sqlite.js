import React, { useState } from 'react';
import { View, Text, TextInput, Button, FlatList, StyleSheet, Alert } from 'react-native';
import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabaseSync('despesas.db');
db.execSync(`
  PRAGMA journal_mode = WAL;
  CREATE TABLE IF NOT EXISTS despesas (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    descricao TEXT NOT NULL,
    valor REAL NOT NULL
  );
`);

function getDespesas() {
  return db.getAllSync('SELECT * FROM despesas');
}

function insertDespesa(descricao, valor) {
  db.runSync('INSERT INTO despesas (descricao, valor) VALUES (?, ?)', [descricao, valor]);
}

export default function App() {
  const [descricao, setDescricao] = useState("");
  const [valor, setValor] = useState("");
  const [despesas, setDespesas] = useState([]);

  function salvarDespesa() {
    const desc = descricao.trim();
    const val = parseFloat(valor);
    if (!desc || isNaN(val)) {
      Alert.alert('Preencha todos os campos corretamente!');
      return;
    }
    insertDespesa(desc, val);
    setDescricao("");
    setValor("");
    carregarDespesas();
  }

  function carregarDespesas() {
    setDespesas(getDespesas());
  }

  return (
    <View style={estilos.container}>
      <Text style={estilos.titulo}>Despesas</Text>
      <View style={estilos.card}>
        <TextInput
          value={descricao}
          onChangeText={setDescricao}
          placeholder="Descrição"
          style={estilos.campoTexto}
          placeholderTextColor="#aaa"
        />
        <TextInput
          value={valor}
          onChangeText={setValor}
          placeholder="Valor (ex: 12.50)"
          style={estilos.campoTexto}
          keyboardType="numeric"
          placeholderTextColor="#aaa"
        />
        <View style={estilos.botoes}>
          <View style={estilos.botaoWrap}>
            <Button title="Salvar" color="#4CAF50" onPress={salvarDespesa} />
          </View>
          <View style={estilos.botaoWrap}>
            <Button title="Carregar" color="#2196F3" onPress={carregarDespesas} />
          </View>
        </View>
      </View>
      <View style={estilos.listaCard}>
        <FlatList
          data={despesas}
          keyExtractor={item => String(item.id)}
          renderItem={({ item }) => (
            <View style={estilos.itemDespesa}>
              <Text style={estilos.textoItem}>{item.descricao}</Text>
              <Text style={estilos.valorItem}>R$ {item.valor.toFixed(2)}</Text>
            </View>
          )}
          ListEmptyComponent={<Text style={estilos.vazio}>Nenhuma despesa cadastrada.</Text>}
        />
      </View>
    </View>
  );
}

const estilos = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f2f6fc',
  },
  titulo: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 18,
    textAlign: 'center',
    color: '#374151',
    letterSpacing: 1,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 18,
    marginBottom: 18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 4,
  },
  campoTexto: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 10,
    paddingHorizontal: 14,
    height: 44,
    marginBottom: 10,
    backgroundColor: '#f9fafb',
    fontSize: 16,
    color: '#374151',
  },
  botoes: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  botaoWrap: {
    flex: 1,
    marginHorizontal: 4,
    borderRadius: 10,
    overflow: 'hidden',
  },
  listaCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.10,
    shadowRadius: 5,
    elevation: 2,
    flex: 1,
  },
  itemDespesa: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#f3f4f6',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 12,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 2,
    elevation: 1,
  },
  textoItem: {
    fontSize: 16,
    color: '#374151',
    fontWeight: '500',
  },
  valorItem: {
    fontSize: 16,
    color: '#10b981',
    fontWeight: 'bold',
  },
  vazio: {
    textAlign: 'center',
    color: '#888',
    marginTop: 20,
    fontSize: 16,
  },
});