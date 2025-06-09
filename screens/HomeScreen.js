import React, { useState } from "react";
import { View, FlatList, StyleSheet, Text } from "react-native";
import { Card, Title, Button, Paragraph, Searchbar } from "react-native-paper";
import axios from "axios";

const HomeScreen = ({ navigation }) => {
  const [characters, setCharacters] = useState([]);
  const [filteredCharacters, setFilteredCharacters] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchCharacters = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        "https://api.attackontitanapi.com/characters"
      );
      setCharacters(response.data.results);
      setFilteredCharacters(response.data.results); // inicializa a lista filtrada com todos
    } catch (error) {
      console.error("Erro ao buscar personagens:", error);
    }
    setLoading(false);
  };

  const onChangeSearch = (query) => {
    setSearchQuery(query);
    if (query.trim() === "") {
      setFilteredCharacters(characters);
    } else {
      const filtered = characters.filter((char) =>
        char.name.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredCharacters(filtered);
    }
  };

  return (
    <View style={styles.container}>
      <Button
        mode="contained"
        onPress={fetchCharacters}
        style={styles.button}
        loading={loading}
        disabled={loading}
      >
        Buscar Personagens
      </Button>

      {characters.length > 0 && (
        <Searchbar
          placeholder="Buscar por nome"
          onChangeText={onChangeSearch}
          value={searchQuery}
          style={styles.searchbar}
          autoCapitalize="none"
          autoCorrect={false}
        />
      )}

      {filteredCharacters.length === 0 && !loading && (
        <Text style={styles.emptyText}>Nenhum personagem encontrado.</Text>
      )}

      <FlatList
        data={filteredCharacters}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <Card style={styles.card}>
            <Card.Cover source={{ uri: item.img }} style={{ height: 200 }} />
            <Card.Content>
              <Title>{item.name}</Title>
              <Paragraph>Idade: {item.age}</Paragraph>
              <Paragraph>Gênero: {item.gender}</Paragraph>
              <Paragraph>Status: {item.status}</Paragraph>
            </Card.Content>
            <Card.Actions>
              <Button
                onPress={() =>
                  navigation.navigate("Details", { characterId: item.id })
                }
              >
                Ver Detalhes
              </Button>
            </Card.Actions>
          </Card>
        )}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  button: {
    marginBottom: 10,
  },
  searchbar: {
    marginBottom: 10,
  },
  card: {
    marginBottom: 15,
    backgroundColor: "#049DBF",
  },
  emptyText: {
    textAlign: "center",
    marginTop: 20,
    color: "black",
    fontSize: 16,
  },
});

export default HomeScreen;
