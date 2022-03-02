import React from 'react';
import {TextStyle, TouchableOpacity, Image} from 'react-native';
import Svg, {Path} from 'react-native-svg';
import styled from 'styled-components/native';
import Colors from '../constants/colors';
import {capAt0to100} from '../helpers/accessoryFunctions';

function polarToCartesian(
  centerX: number,
  centerY: number,
  radius: number,
  angleInDegrees: number,
): {x: number; y: number} {
  const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180.0;

  return {
    x: centerX + radius * Math.cos(angleInRadians),
    y: centerY + radius * Math.sin(angleInRadians),
  };
}

function squareEndedArcPath(
  centre: number,
  startDegrees: number,
  endDegrees: number,
  innerRadius: number,
  outerRadius: number,
): string {
  const start = [
    polarToCartesian(centre, centre, outerRadius, endDegrees),
    polarToCartesian(centre, centre, innerRadius, endDegrees),
  ];
  const end = [
    polarToCartesian(centre, centre, outerRadius, startDegrees),
    polarToCartesian(centre, centre, innerRadius, startDegrees),
  ];

  const largeArcFlag = endDegrees - startDegrees <= 180 ? 0 : 1;

  return (
    `M ${start[0].x} ${start[0].y} ` +
    `A ${outerRadius} ${outerRadius} 0 ${largeArcFlag} 0 ${end[0].x} ${end[0].y} ` +
    `L ${end[1].x} ${end[1].y} ` +
    `A ${innerRadius} ${innerRadius} 0 ${largeArcFlag} 1 ${start[1].x} ${start[1].y} ` +
    `L ${start[0].x} ${start[0].y}`
  );
}

function squareEndedArcPathRemainder(
  centre: number,
  startDegrees: number,
  endDegrees: number,
  innerRadius: number,
  outerRadius: number,
): string {
  const start = [
    polarToCartesian(centre, centre, outerRadius, endDegrees),
    polarToCartesian(centre, centre, innerRadius, endDegrees),
  ];
  const end = [
    polarToCartesian(centre, centre, outerRadius, startDegrees),
    polarToCartesian(centre, centre, innerRadius, startDegrees),
  ];

  const largeArcFlag = endDegrees - startDegrees <= 180 ? 1 : 0;

  return (
    `M ${end[0].x} ${end[0].y} ` +
    `A ${outerRadius} ${outerRadius} 0 ${largeArcFlag} 0 ${start[0].x} ${start[0].y} ` +
    `L ${start[1].x} ${start[1].y} ` +
    `A ${innerRadius} ${innerRadius} 0 ${largeArcFlag} 1 ${end[1].x} ${end[1].y} ` +
    `L ${end[0].x} ${end[0].y}`
  );
}

export interface CircleGraphProps {
  onPress?: () => void;
  filledColour?: string;
  remainderColour?: string;
  value: number;
  showRemainder?: boolean;
  size?: number;
  strokeWidth?: number;
}

export default function CircleGraph(props: CircleGraphProps): JSX.Element {
  const {
    onPress,
    filledColour = Colors.LightGreyAccent,
    remainderColour = '#d22929',
    value,
    showRemainder = true,
    size = 64,
    strokeWidth = 3,
  } = props;

  type ArcPath = {path: string; colour: string};

  /// Memoize the two circle paths.
  const circlePath = React.useMemo<ArcPath[]>(() => {
    const centre = size / 2;
    const outerRadius = size / 2;
    const innerRadius = size / 2 - strokeWidth;
    const scaledValue = Math.max(Math.min((value / 100) * 360, 359.9), 0.1);

    return [
      {
        path: squareEndedArcPath(
          centre,
          0,
          scaledValue,
          innerRadius,
          outerRadius,
        ),
        colour: filledColour,
      },
      ...(showRemainder
        ? [
            {
              path: squareEndedArcPathRemainder(
                centre,
                0,
                scaledValue,
                innerRadius,
                outerRadius,
              ),
              colour: remainderColour,
            },
          ]
        : []),
    ];
  }, [size, filledColour, strokeWidth, value, showRemainder, remainderColour]);

  const pathElements = [...circlePath];

  return (
    <TouchableOpacity disabled={!onPress} onPress={onPress}>
      <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {pathElements.map((arcPath, index) => (
          <Path
            key={index}
            stroke="none"
            fill={arcPath.colour}
            d={arcPath.path}
            strokeLinecap="square"
          />
        ))}
      </Svg>
    </TouchableOpacity>
  );
}
