import React from 'react';
import styled from 'styled-components/native';
import {useStackNavigation} from '../../store/combinedStore';
import ItemListEntry from '../../components/ItemListEntry';
import Colors from '../../constants/colors';
import Screens from '../../constants/screens';
import EmotionState from '../../constants/emotionState';
import {openSpotifyPlaylistForMood} from '../../helpers/spotifyHelpers';
import {FreeFloatingText} from '../../components/FreeFloatingText';

const ProfileScreen: () => JSX.Element = () => {
  const navigator = useStackNavigation();

  return (
    <ArticleList>
      <FreeFloatingText verticalMargin={true}>
        The Spotify playlists are your local copies of three public master
        playlist.
      </FreeFloatingText>
      <FreeFloatingText verticalMargin={true}>
        Feel free to modify the playlists to match your preferences and needs.
        Popular changes will even make it back into the master playlists.
      </FreeFloatingText>
      <ItemListEntry
        hasChivron={true}
        color={Colors.Primary}
        title="Mellow Playlist"
        onPress={() => openSpotifyPlaylistForMood(EmotionState.Mellow)}
      />
      <ItemListEntry
        hasChivron={true}
        color={Colors.Primary}
        title="Flow Playlist"
        onPress={() => openSpotifyPlaylistForMood(EmotionState.Flow)}
      />
      <ItemListEntry
        hasChivron={true}
        color={Colors.Primary}
        title="GoGoGo Playlist"
        onPress={() => openSpotifyPlaylistForMood(EmotionState.GoGoGo)}
      />
    </ArticleList>
  );
};

const ArticleList = styled.View`
  flex-grow: 1;
`;

export default ProfileScreen;
