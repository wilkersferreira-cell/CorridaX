import React, {
  useCallback,
  useState,
} from 'react';

import {
  Alert,
  FlatList,
  Pressable,
  RefreshControl,
  StyleSheet,
  View,
} from 'react-native';

import {
  MaterialIcons,
} from '@expo/vector-icons';

import {
  Text,
} from 'react-native-paper';

import {
  useFocusEffect,
  useNavigation,
} from '@react-navigation/native';

import {
  SafeAreaView,
} from 'react-native-safe-area-context';

import {
  clearFavorites,
  FavoriteItem,
  getFavorites,
  removeFavorite,
} from '../services/favoritesStorage';

import {
  COLORS,
  RADIUS,
  SPACING,
  TYPOGRAPHY,
} from '../theme';

export default function FavoritesScreen() {
  const navigation =
    useNavigation<any>();

  const [
    favorites,
    setFavorites,
  ] =
    useState<FavoriteItem[]>(
      [],
    );

  const [
    loading,
    setLoading,
  ] =
    useState(false);

  const loadFavorites =
    useCallback(
      async () => {
        setLoading(true);

        try {
          const items =
            await getFavorites();

          setFavorites(
            items,
          );
        } finally {
          setLoading(false);
        }
      },
      [],
    );

  useFocusEffect(
    useCallback(() => {
      void loadFavorites();
    }, [loadFavorites]),
  );

  function handleRemove(
    item: FavoriteItem,
  ) {
    Alert.alert(
      'Remover favorito',
      `Deseja remover "${item.name}" dos seus favoritos?`,
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },

        {
          text: 'Remover',
          style: 'destructive',

          onPress: async () => {
            try {
              await removeFavorite(
                item.id,
              );

              setFavorites(
                (current) =>
                  current.filter(
                    (favorite) =>
                      favorite.id !==
                      item.id,
                  ),
              );
            } catch {
              Alert.alert(
                'Favoritos',
                'Não foi possível remover este favorito.',
              );
            }
          },
        },
      ],
    );
  }

  function handleClear() {
    if (
      favorites.length === 0
    ) {
      return;
    }

    Alert.alert(
      'Limpar favoritos',
      'Deseja remover todos os seus destinos favoritos?',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },

        {
          text: 'Limpar',
          style: 'destructive',

          onPress: async () => {
            try {
              await clearFavorites();

              setFavorites(
                [],
              );
            } catch {
              Alert.alert(
                'Favoritos',
                'Não foi possível limpar seus favoritos.',
              );
            }
          },
        },
      ],
    );
  }

  function renderItem({
    item,
  }: {
    item: FavoriteItem;
  }) {
    return (
      <View
        style={
          styles.favoriteCard
        }
      >
        <Pressable
          onPress={() =>
            navigation.navigate(
              'Home',
              {
                favoriteDestination:
                  item,
              },
            )
          }
          style={({
            pressed,
          }) => [
            styles.favoriteOpenArea,

            pressed &&
              styles.pressed,
          ]}
        >
          <View
            style={
              styles.favoriteIcon
            }
          >
            <MaterialIcons
              name="favorite"
              size={23}
              color={
                COLORS.primaryLight
              }
            />
          </View>

          <View
            style={
              styles.favoriteContent
            }
          >
            <Text
              style={
                styles.favoriteName
              }
              numberOfLines={1}
            >
              {item.name}
            </Text>

            <Text
              style={
                styles.favoriteAddress
              }
              numberOfLines={2}
            >
              {item.address}
            </Text>
          </View>
        </Pressable>

        <Pressable
          onPress={() =>
            handleRemove(
              item,
            )
          }
          hitSlop={10}
          style={({
            pressed,
          }) => [
            styles.removeButton,

            pressed &&
              styles.pressed,
          ]}
        >
          <MaterialIcons
            name="delete-outline"
            size={21}
            color={
              COLORS.textMuted
            }
          />
        </Pressable>
      </View>
    );
  }

  return (
    <SafeAreaView
      style={
        styles.safeArea
      }
      edges={['top']}
    >
      <View
        style={
          styles.container
        }
      >
        <View
          style={
            styles.header
          }
        >
          <View>
            <Text
              style={
                styles.title
              }
            >
              Favoritos
            </Text>

            <Text
              style={
                styles.subtitle
              }
            >
              Seus destinos salvos
            </Text>
          </View>

          {favorites.length >
            0 && (
            <Pressable
              onPress={
                handleClear
              }
              hitSlop={10}
              style={({
                pressed,
              }) => [
                styles.clearButton,

                pressed &&
                  styles.pressed,
              ]}
            >
              <MaterialIcons
                name="delete-sweep"
                size={21}
                color={
                  COLORS.textSecondary
                }
              />
            </Pressable>
          )}
        </View>

        <FlatList
          data={
            favorites
          }
          keyExtractor={(
            item,
          ) => item.id}
          renderItem={
            renderItem
          }
          showsVerticalScrollIndicator={
            false
          }
          contentContainerStyle={[
            styles.listContent,

            favorites.length ===
              0 &&
              styles.emptyListContent,
          ]}
          refreshControl={
            <RefreshControl
              refreshing={
                loading
              }
              onRefresh={
                loadFavorites
              }
              tintColor={
                COLORS.primaryLight
              }
            />
          }
          ListEmptyComponent={
            <View
              style={
                styles.emptyState
              }
            >
              <View
                style={
                  styles.emptyIcon
                }
              >
                <MaterialIcons
                  name="favorite-border"
                  size={34}
                  color={
                    COLORS.primaryLight
                  }
                />
              </View>

              <Text
                style={
                  styles.emptyTitle
                }
              >
                Nenhum favorito ainda
              </Text>

              <Text
                style={
                  styles.emptyDescription
                }
              >
                Na tela inicial, selecione um destino e toque em “Salvar nos favoritos”.
              </Text>
            </View>
          }
        />
      </View>
    </SafeAreaView>
  );
}

const styles =
  StyleSheet.create({
    safeArea: {
      flex: 1,

      backgroundColor:
        COLORS.background,
    },

    container: {
      flex: 1,

      paddingHorizontal:
        SPACING.lg,
    },

    header: {
      minHeight: 82,

      flexDirection: 'row',

      alignItems: 'center',

      justifyContent:
        'space-between',

      paddingTop: 10,

      paddingBottom: 12,
    },

    title: {
      color:
        COLORS.text,

      fontSize: 27,

      lineHeight: 32,

      fontWeight:
        TYPOGRAPHY.weight.extraBold,

      letterSpacing: -0.7,
    },

    subtitle: {
      marginTop: 2,

      color:
        COLORS.textSecondary,

      fontSize: 13,

      lineHeight: 18,
    },

    clearButton: {
      width: 42,

      height: 42,

      alignItems: 'center',

      justifyContent:
        'center',

      borderRadius:
        RADIUS.lg,

      backgroundColor:
        COLORS.surface,

      borderWidth: 1,

      borderColor:
        COLORS.borderSoft,
    },

    listContent: {
      paddingBottom: 24,
    },

    favoriteCard: {
      minHeight: 82,

      flexDirection: 'row',

      alignItems: 'center',

      marginBottom: 11,

      paddingHorizontal: 14,

      paddingVertical: 13,

      borderWidth: 1,

      borderColor:
        COLORS.borderSoft,

      borderRadius:
        RADIUS.lg,

      backgroundColor:
        COLORS.surface,
    },

    favoriteOpenArea: {
      flex: 1,

      flexDirection: 'row',

      alignItems: 'center',
    },

    favoriteIcon: {
      width: 44,

      height: 44,

      alignItems: 'center',

      justifyContent:
        'center',

      borderRadius:
        RADIUS.round,

      backgroundColor:
        COLORS.primarySoft,
    },

    favoriteContent: {
      flex: 1,

      marginLeft: 12,

      marginRight: 8,
    },

    favoriteName: {
      color:
        COLORS.text,

      fontSize: 14.5,

      lineHeight: 20,

      fontWeight:
        TYPOGRAPHY.weight.bold,
    },

    favoriteAddress: {
      marginTop: 3,

      color:
        COLORS.textSecondary,

      fontSize: 11.5,

      lineHeight: 16,
    },

    removeButton: {
      width: 38,

      height: 38,

      alignItems: 'center',

      justifyContent:
        'center',

      borderRadius:
        RADIUS.round,
    },

    pressed: {
      opacity: 0.65,
    },

    emptyListContent: {
      flexGrow: 1,
    },

    emptyState: {
      flex: 1,

      alignItems: 'center',

      justifyContent:
        'center',

      paddingHorizontal: 32,

      paddingBottom: 80,
    },

    emptyIcon: {
      width: 70,

      height: 70,

      alignItems: 'center',

      justifyContent:
        'center',

      marginBottom: 18,

      borderRadius: 35,

      backgroundColor:
        COLORS.primarySoft,
    },

    emptyTitle: {
      color:
        COLORS.text,

      fontSize: 18,

      fontWeight:
        TYPOGRAPHY.weight.bold,

      textAlign: 'center',
    },

    emptyDescription: {
      maxWidth: 290,

      marginTop: 7,

      color:
        COLORS.textSecondary,

      fontSize: 13,

      lineHeight: 19,

      textAlign: 'center',
    },
  });