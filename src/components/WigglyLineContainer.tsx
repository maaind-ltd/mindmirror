import React, { useRef } from 'react';
import Colors from '../constants/colors';
import styled from 'styled-components/native';
import WigglyLine from './WigglyLine';
import {EmotionStateWithNone} from '../constants/emotionState';
import { Animated } from 'react-native';
import useWindowDimensions from 'react-native/Libraries/Utilities/useWindowDimensions';
import Easing from 'react-native/Libraries/Animated/Easing';


const WigglyLineContainer: ({baseColor: EmotionStateWithNone}) => Node = ({baseColor}) => {
	const {width, height} = useWindowDimensions();
  const progressAnimation = useRef(new Animated.Value(0)).current  // Initial value for opacity: 0

  React.useEffect(() => {
    Animated.loop(Animated.timing(
      progressAnimation,
      {
				easing: Easing.linear,
        toValue: -width*4*0.8,
        duration: 12000,
				useNativeDriver: true,
      }
    )).start();
  }, [progressAnimation]);

	return (
		<Container height={height}>
			<Animated.View style={{
				translateX: Animated.modulo(Animated.divide(progressAnimation, 4), width * 0.8)
			}}>
				<WigglyLine color={Colors[`${baseColor}Bright`]} scale={0.4} />
			</Animated.View>
			<Animated.View style={{
				translateX: Animated.modulo(Animated.divide(progressAnimation, 2), width * 0.8)
			}}>
				<WigglyLine color={Colors[`${baseColor}Bright`]} scale={0.6} />
			</Animated.View>
			<Animated.View style={{
				translateX: Animated.modulo(progressAnimation, width * 0.8)
			}}>
				<WigglyLine color={Colors[`${baseColor}Dark`]} scale={1} />
			</Animated.View>
		</Container>
	);
}

const Container = styled.View`
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
	margin-top: ${(props) => props.height / -20}px;
	height: ${(props) => props.height / 10}px;
`;

export default WigglyLineContainer;