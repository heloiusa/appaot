import React, { useState, useCallback } from 'react';
import { View, FlatList, StyleSheet, Alert } from 'react-native';
import { Card, Title, Paragraph, Button } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';

const FavoriteItem = ({ item, removeFavorite, navigateToDetails }) => {
  return (
    <Card style={styles.card}>
      <Card.Cover source={{ uri: item.img }} />
      <Card.Content>
        <Title>{item.name}</Title>
        <Paragraph>Idade: {item.age || 'Desconhecida'}</Paragraph>
        <Paragraph>Gênero: {item.gender || 'Desconhecido'}</Paragraph>
      </Card.Content>
      <Card.Actions>
        <Button mode="text" onPress={() => navigateToDetails(item.id)}>
          Ver Detalhes
        </Button>
        <Button
          mode="outlined"
          onPress={() =>
            Alert.alert(
              'Confirmação',
              'Deseja realmente remover este personagem dos favoritos?',
              [
                { text: 'Cancelar', style: 'cancel' },
                { text: 'Remover', style: 'destructive', onPress: () => removeFavorite(item.id) },
              ]
            )
          }
        >
          Remover dos Favoritos
        </Button>
      </Card.Actions>
    </Card>
  );
};

const FavoritesScreen = ({ navigation }) => {
  const [favorites, setFavorites] = useState([]);

  useFocusEffect(
    useCallback(() => {
      const loadFavorites = async () => {
        try {
          const storedFavorites = await AsyncStorage.getItem('favorites');
          if (storedFavorites) {
            const parsed = JSON.parse(storedFavorites);
            // filtra só itens com id válido
            const validFavorites = parsed.filter(item => item && item.id !== undefined && item.id !== null);
            setFavorites(validFavorites);
          } else {
            setFavorites([]);
          }
        } catch (error) {
          console.error('Erro ao carregar favoritos:', error);
        }
      };
      loadFavorites();
    }, [])
  );

  const removeFavorite = async (characterId) => {
    try {
      const updatedFavorites = favorites.filter((char) => char.id !== characterId);
      setFavorites(updatedFavorites);
      await AsyncStorage.setItem('favorites', JSON.stringify(updatedFavorites));
      Alert.alert('Removido', 'Personagem removido dos favoritos!');
    } catch (error) {
      console.error('Erro ao remover favorito:', error);
      Alert.alert('Erro', 'Não foi possível remover o personagem dos favoritos.');
    }
  };

  const navigateToDetails = (characterId) => {
    navigation.navigate('Details', { characterId });
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={favorites}
        keyExtractor={(item, index) => 
          // chave segura: tenta id.toString(), se não existir usa index
          item.id ? item.id.toString() : index.toString()
        }
        renderItem={({ item }) => (
          <FavoriteItem
            item={item}
            removeFavorite={removeFavorite}
            navigateToDetails={navigateToDetails}
          />
        )}
        initialNumToRender={5}
        getItemLayout={(data, index) => ({ length: 320, offset: 320 * index, index })} 
        windowSize={10}
        maxToRenderPerBatch={5}
        ListEmptyComponent={
          <Paragraph style={styles.emptyText}>
            Você não tem personagens favoritos ainda.
          </Paragraph>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  card: {
    marginBottom: 15,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    color: 'gray',
  },
});

export default FavoritesScreen;
