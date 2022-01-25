import React from 'react';
import Colors from '../constants/colors';
import styled from 'styled-components/native';
import { useWindowDimensions } from 'react-native';
import Svg, {Path} from 'react-native-svg';

const WigglyLine: ({color: string, scale: number}) => JSX.Element = ({color, scale}) => {
	const {width, height} = useWindowDimensions();
	const w = width;
	const h = height / 10;
	const sh = h  * scale;
	const ym = sh * 0.5;
	const path = `M0,${ym} ` + 
		`C${w * 0.1},0 ${w * 0.3},0 ${w * 0.4},${ym} ` +
		`S${w * 0.7},${sh} ${w * 0.8},${ym} ` +
		`S${w * 1.1},0 ${w * 1.2},${ym} ` +
		`S${w * 1.5},${sh} ${w * 1.6},${ym} ` + 
		`S${w * 1.9},0 ${w * 2},${ym}`;
	return (
		<LineContainer width={width * 2} height={sh} marginTop={(h * (1 - scale)) / 4}>
			<Svg height={sh} width={width * 2}>
				<Path
					d={path}
					stroke={color}
					strokeWidth={2}
				/>
			</Svg>
		</LineContainer>
  );
};

const LineContainer = styled.View`
	position: absolute;
	top: ${(props) => props.marginTop}px;
	left: -${(props) => props.width*0.4}px;
	width: ${(props) => props.width}px;
	height: ${(props) => props.height}px;
`;

export default WigglyLine;