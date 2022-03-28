import React, {useEffect} from 'react';
import {StatusBar, Pressable, View, SafeAreaView, StyleSheet} from 'react-native';
import Colors from '../constants/colors';
import styled from 'styled-components/native';

export interface FullPageContainerProps {
    backgroundColor: string;
    children: JSX.Element | JSX.Element[];
}

export const FullPageContainer: (props: FullPageContainerProps) => JSX.Element = (props) => {
return (
<OuterView>
    <StyledStatusBar color={props.backgroundColor}>
        <SafeAreaView>
            <StatusBar translucent backgroundColor={props.backgroundColor} barStyle="dark-content" />
        </SafeAreaView>
    </StyledStatusBar>
    <ContentView>{props.children}</ContentView>
</OuterView>);
}
const OuterView = styled.View`
  flex: 1;
`;

const STATUSBAR_HEIGHT = StatusBar.currentHeight || 24;

const StyledStatusBar = styled.View`
  height: ${STATUSBAR_HEIGHT}px;
  background-color: ${props => props.color};
`;

const ContentView = styled.View`
  flex: 1;
`;
